from otree.api import *


doc = """
Your app description
"""


class C(BaseConstants):
    NAME_IN_URL = 'main_3_survey'
    PLAYERS_PER_GROUP = None
    NUM_ROUNDS = 1


class Subsession(BaseSubsession):
    pass


class Group(BaseGroup):
    pass

def make_7pointlikert(label):
    return models.IntegerField(
        choices=[1, 2, 3, 4, 5, 6, 7],
        label=label,
        widget=widgets.RadioSelect,
        #blank=True,
    )

def make_field4(label):
    return models.IntegerField(
        choices=[[0, ''], [1, ''], [2, ''], [3, ''], [4, '']],
        label=label,
        widget=widgets.RadioSelectHorizontal,
        blank=False,
    )

class Player(BasePlayer):
    risk = make_7pointlikert("")
    enjoy = make_7pointlikert("")
    creative = make_7pointlikert("")
    competitive = make_7pointlikert("")
    interest = make_7pointlikert("")
    difficult = make_7pointlikert("")
    female = models.IntegerField(
        choices=[
            [0, "Male"],
            [1, "Female"]
        ],
        widget=widgets.RadioSelectHorizontal,
        label="",
    )
    colorblind = models.IntegerField(
        choices=[
            [0, "No"],
            [1, "Yes"]
        ],
        widget=widgets.RadioSelectHorizontal,
        label="",
        blank=True
    )

    ## Ribs questions
    ribs1 = make_field4('I have ideas for arranging or rearranging the furniture at home.')
    ribs2 = make_field4('I have ideas for making my work easier.')
    ribs3 = make_field4('I think of a new, better, or funny name for something that already has a name.')
    ribs4 = make_field4('I have ideas about what I will be doing in the future.')
    ribs5 = make_field4('I consider alternative careers (or career changes).')
    ribs6 = make_field4('I have trouble sleeping at night, so many ideas keep showing themselves keep me awake.')
    ribs7 = make_field4('I make plans (e.g., going to a particular restaurant or movie), but something messes it up - yet it is easy for me to find something to do instead.')
    ribs8 = make_field4('I have ideas about a good plot for a movie or TV show.')
    ribs9 = make_field4('I have ideas about a new invention.')
    ribs10 = make_field4('I have ideas for stories or poems.')
    ribs11 = make_field4('I have ideas about a new route between home and school (or work).')
    ribs12 = make_field4('I have ideas for a new business or product.')
    ribs13 = make_field4('I see a cloud, shadow, or similar ambiguous figure and have several ideas about what the shape or figure could be.')
    ribs14 = make_field4('I have ideas about what I will be doing 10 years from now.')
    ribs15 = make_field4('I have trouble staying with one topic when writing letters or mails because I think of so many things to say.')
    ribs16 = make_field4('I often see people and think about alternative interpretations of their behavior.')
    ribs17 = make_field4('When reading books or stories I have ideas of better endings.')
    ribs18 = make_field4('When reading the newspaper or a letter that someone wrote, I often have ideas for better wording.')
    ribs19 = make_field4('I hear songs and think of different or better lyrics.')

class Survey(Page):
    form_model = 'player'
    form_fields = ['risk',
                   'enjoy',
                   'creative',
                   'competitive',
                   'interest',
                   'difficult',
                   'female',
                   'colorblind',
                   ]
    def is_displayed(player: Player):
        return player.participant.passed == 1 and player.participant.participated_before == 0

class Ribs(Page):
    form_model = 'player'
    form_fields = [
        'ribs1',
        'ribs2',
        'ribs3',
        'ribs4',
        'ribs5',
        'ribs6',
        'ribs7',
        'ribs8',
        'ribs9',
        'ribs10',
        'ribs11',
        'ribs12',
        'ribs13',
        'ribs14',
        'ribs15',
        'ribs16',
        'ribs17',
        'ribs18',
        'ribs19'
                   ]

    def is_displayed(player: Player):
        return player.participant.passed == 1 and player.participant.participated_before == 0

class Feedback(Page):
    form_model = 'player'
    form_fields = ['feedback']

    def is_displayed(player: Player):
        return player.participant.passed == 1

class End(Page):
    pass


page_sequence = [Survey, Ribs, End]
