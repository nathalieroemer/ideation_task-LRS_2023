from otree.api import *
import pandas as pd
import numpy as np

doc = """
Your app description
"""


class C(BaseConstants):
    NAME_IN_URL = 'rater'
    PLAYERS_PER_GROUP = None

    # Load the dictionary:
    file = open("dictionary.txt", "r")
    MYDICT = []
    for x in file.readlines():
        MYDICT.append(x.replace("\n", "").lower())
    file.close()
    MYDICT = [word.replace(" ", "") for word in MYDICT]

    # Load the data
    DATA = pd.read_csv("example_rater_upload.csv", delimiter=",", encoding="latin1")
    DF = pd.DataFrame(DATA, columns=['photoid', 'word','position_var'])
    DF.index = DF['photoid'].tolist()
    PHOTOIDS = DF['photoid'].to_list()

    ## read in a list of Prolific IDs to prevent retakes
    DATA_IDS = pd.read_csv("ids.csv", delimiter=",", encoding="latin1")
    DF_IDS = pd.DataFrame(DATA_IDS, columns=['ids'])
    prev_ids = DF_IDS['ids'].to_list()

    # The number of illustrations that shall be displayed:
    NUM_ROUNDS = 50
    RATE_PER_PIC = 10

    # And second, for each correctly identified illustration:
    PAY_BONUS = cu(0.10)
    # This is the maximal bonus payment, i.e. if all guesses are right:
    PAY_BONUS_MAX = PAY_BONUS * NUM_ROUNDS



class Subsession(BaseSubsession):
    pass


class Group(BaseGroup):
    pass


class Player(BasePlayer):
    workerid = models.StringField()
    word_guess = models.StringField(blank=True)
    word = models.StringField()
    photoid = models.IntegerField()
    position_var = models.StringField()
    word_correct = models.IntegerField()
    consent1 = models.IntegerField(initial=0)
    consent2 = models.IntegerField(initial=0)
    consent3 = models.IntegerField(initial=0)


def creating_session(subsession: Subsession):
    subsession.session.ids = []
    subsession.session.ids.extend(C.prev_ids)
    ## generate a list with numbers of how often the picture should be shown
    subsession.session.rater_pict_quotas = [C.RATE_PER_PIC for i in range(0, len(C.PHOTOIDS))]
    #print(subsession.session.rater_pict_quotas, "this is the rater_pict_quptas")
    subsession.session.dict_for_quotas = {}
    ## we create a dict assigning each photoid this number so e.g. photoid 26 needs to be shown to 5 people
    for key in C.PHOTOIDS:
        subsession.session.dict_for_quotas[key] = C.RATE_PER_PIC
    #print(subsession.session.dict_for_quotas, "this is the dict")


class Welcome(Page):
    form_model = 'player'
    form_fields = [
        'workerid'
    ]

    def is_displayed(player: Player):
        return player.round_number == 1

    def before_next_page(player: Player, timeout_happened):
        if player.workerid in player.session.ids:
            player.participant.participated_before = 1
        else:
            player.participant.participated_before = 0
            ## we update the list of Prolific IDs to prevent retakes
            player.session.ids.append(player.workerid)


class Consent(Page):
    form_model = 'player'
    form_fields = [
        'consent1',
        'consent2',
        'consent3'
    ]

    def is_displayed(player: Player):
        return player.round_number == 1 and player.participant.participated_before == 0

class Instructions(Page):
    form_model = 'player'

    def is_displayed(player: Player):
        return player.round_number == 1 and player.participant.participated_before == 0

    # Assign the respective words and image data (for all rounds) using weights:
    def before_next_page(player: Player, timeout_happened):
        weights_sum = sum(list(player.subsession.session.dict_for_quotas.values()))
        weights = [list(player.subsession.session.dict_for_quotas.values())[i] / weights_sum for i in
                   range(len(player.subsession.session.rater_pict_quotas))]
        #print('Weights: ', weights)
        remaining_pics = sum(i > 0 for i in weights)
        #print(remaining_pics, "these are the remaining pics")
        random_ids = np.random.choice(C.PHOTOIDS, size=C.NUM_ROUNDS, replace=False, p=weights)
        player.participant.photoid_list = random_ids.tolist()

class Task(Page):
    form_model = 'player'
    form_fields = ['word_guess']

    def is_displayed(player: Player):
        return player.participant.participated_before == 0

    @staticmethod
    def is_displayed(player: Player):
        player.photoid = player.participant.photoid_list[player.round_number - 1]
        j = C.PHOTOIDS.index(player.photoid)
        player.word = C.DF.word.to_list()[j]
        player.position_var = C.DF.position_var.to_list()[j]
        return True

    @staticmethod
    def js_vars(player):
        # use this dict to show the images and then store whether it was pic1 pic2 or ..
        return dict(position_var=player.position_var,
                    word=player.word,
                    dictionary=C.MYDICT)

    def before_next_page(player: Player, timeout_happened):
        if player.field_maybe_none('word_guess') is not None:
            if player.word_guess.lower() == player.word.lower():
                player.payoff = C.PAY_BONUS
                player.word_correct = 1
            else:
                player.payoff = 0
                player.word_correct = 0
        else:
            player.payoff = 0
            player.word_correct = 0
        ## update the dictionary
        if player.round_number == C.NUM_ROUNDS:
            for i in player.participant.photoid_list:
                if player.subsession.session.dict_for_quotas[i] > 0:
                    player.subsession.session.dict_for_quotas[i] -= 1

class End(Page):
    def is_displayed(player: Player):
        return player.round_number == C.NUM_ROUNDS

page_sequence = [Welcome, Consent, Instructions, Task, End]
