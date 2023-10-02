from otree.api import *
import io
import os
import re
import base64
import requests
from PIL import Image
dataUrlPattern = re.compile('data:image/(png|jpeg);base64,(.*)$')
import time

doc = """
Your app description
"""

class C(BaseConstants):
    NAME_IN_URL = 'main_2_task'
    PLAYERS_PER_GROUP = None
    NUM_ROUNDS = 100
    WORKINGTIME = 1200
        # final: 1200
    TIMER_TEXT = "Time left:"
    # Load the dictionary:
    file = open("dictionary.txt", "r")
    MYDICT = []
    for x in file.readlines():
        MYDICT.append(x.replace("\n", "").lower())
    file.close()
    MYDICT = [word.replace(" ", "") for word in MYDICT]


def get_timeout_seconds1(player: BasePlayer):
    participant = player.participant
    return participant.expiry - time.time()

def is_displayed1(player: BasePlayer):
    # returns true only if there is no time left
    return get_timeout_seconds1(player) > 0


class Subsession(BaseSubsession):
    pass


class Group(BaseGroup):
    pass


class Player(BasePlayer):
    positions = models.LongStringField(blank=True)
    positions_var = models.LongStringField(blank=True)
    currentpage = models.StringField(initial='welcome')
    word = models.StringField(blank=True)
    workingtime = models.StringField(initial='')
    imageurl = models.LongStringField(blank=True)
    lastround = models.IntegerField(initial=0)
    bonus_image=models.StringField(label="Please indicate the illustrated <b>word</b> of your selected illustration:")
    no_images = models.IntegerField()
    reloaded = models.IntegerField()

    a1 = models.IntegerField(
        choices=[
            [1, 'Submit as many innovative illustrations as possible'],
            [2, 'Illustrate provided words in an identifiable way'],
            [3, 'Identify words based on others’ illustrations'],
            [4, 'Submit one illustration that is as innovative as possible'],
        ],
        verbose_name='What is your <b>goal</b> in this task?',
        widget=widgets.RadioSelect,
    )

    a2 = models.IntegerField(
        choices=[
            [1, '...illustrate words that are illustrated by a relatively large fraction of other workers in this task'],
            [2, '...are original and can be identified by a relatively large fraction of individuals'],
            [3, '...are identifiable but not original'],
            [4, '...are among the top 10% most colorful illustrations'],
        ],
        verbose_name='<b>Innovative</b> illustrations ...',
        widget=widgets.RadioSelect,
    )

    a3 = models.IntegerField(
        choices=[
            [1, '...at least 10% of other workers from this task illustrated the same word'],
            [2, '...a large fraction of individuals identify the illustrated word based on the illustration only'],
            [3, '...the illustrated word is not in a standard American English dictionary'],
            [4, '...the illustrated word is not among a random selection of 100 illustrations by other workers from this task'],
        ],
        verbose_name='The illustrated word is <b>original</b> if...',
        widget=widgets.RadioSelect,
    )

    a4 = models.IntegerField(
        choices=[
            [1, 'The fraction of workers in this task who illustrated the same word'],
            [2, 'The fraction of individuals who identify the illustrated word based on the illustration only'],
            [3, 'The fraction of individuals who find the illustration aesthetic'],
            [4, 'The fraction of individuals who did not like the illustrated word'],
        ],
        verbose_name='What determines how <b>identifiable</b> an illustration is?',
        widget=widgets.RadioSelect,
    )

    a5_fix = models.IntegerField(
        choices=[
            [1, '10 Tokens for each submitted, innovative illustration'],
            [2, '10 Tokens for each submitted illustration'],
            [3, '10 Tokens'],
            [4, 'There is no payment for the following task'],
        ],
        verbose_name='Your <b>payment</b> in the following task is',
        widget=widgets.RadioSelect,
    )

    a5_pr = models.IntegerField(
        choices=[
            [1, '10 Tokens'],
            [2, '10 Token for each submitted innovative illustration'],
            [3, '10 Tokens for each submitted illustrations'],
            [4, 'There is no payment for the following task'],
        ],
        verbose_name='Your <b>payment</b> in the following task is',
        widget=widgets.RadioSelect,
    )

    a5_inno = models.IntegerField(
        choices=[
            [1, '10 Tokens'],
            [2, '10 Tokens for each submitted illustration'],
            [3, '10 Tokens for each submitted innovative illustration'],
            [4, 'There is no payment for the following task'],
        ],
        verbose_name='Your <b>payment</b> in the following task is',
        widget=widgets.RadioSelect,
    )

    rule = models.IntegerField(
        choices=[
            [1, 'Rule 1'],
            [2, 'Rule 2'],
        ],
        verbose_name='Please choose:',
        widget=widgets.RadioSelect
    )

    num_failed_attempts = models.IntegerField(initial=0)
    failed_too_many = models.BooleanField(initial=False)



class Instructions(Page):
    form_model = 'player'
    def is_displayed(player: Player):
        return player.round_number == 1

    def vars_for_template(player: Player):
        treat = player.participant.treat
        return dict(treat=treat)

class Rules(Page):
    form_model = 'player'

    def is_displayed(player: Player):
        return player.round_number == 1

class Attention(Page):
    form_model = 'player'
    def is_displayed(player: Player):
        return player.round_number == 1

    @staticmethod
    def get_form_fields(player):
        if player.participant.treat == 1:
            return ['a1', 'a2', 'a3', 'a4', 'a5_fix']
        if player.participant.treat == 2:
            return ['a1', 'a2', 'a3', 'a4', 'a5_pr']
        if player.participant.treat == 3:
            return ['a1', 'a2', 'a3', 'a4', 'a5_inno']

    @staticmethod
    def error_message(player, values):
        if player.participant.treat == 1:
            solutions = dict(a1=1, a2=2, a3=4, a4=2,a5_fix=3)
        if player.participant.treat ==2:
            solutions = dict(a1=1, a2=2, a3=4, a4=2, a5_pr=3)
        if player.participant.treat == 3:
            solutions = dict(a1=1, a2=2, a3=4, a4=2, a5_inno=3)

        errors = {name: 'You did not answer this question correctly. Please try again. If you answer incorrectly, you cannot take part in this study.' for name in solutions if values[name] != solutions[name]}
        if errors:
            player.num_failed_attempts += 1
            if player.num_failed_attempts >= 2:
                player.failed_too_many = True
            else:
                return errors

    def before_next_page(player: Player, timeout_happened):
        if player.failed_too_many:
            player.participant.passed = 0
        else:
            player.participant.passed = 1
            participant = player.participant
            participant.expiry = time.time() + C.WORKINGTIME
            participant.allwords = []
            participant.clicked_last = []
            player.participant.images = []
            player.reloaded = 0

    @staticmethod
    def app_after_this_page(player, upcoming_apps):
        if player.failed_too_many:
            return "main_3_survey"


class Task(Page):
    form_model = 'player'
    form_fields = [
        'word',
        'imageurl',
        'positions_var'
    ]

    is_displayed = is_displayed1
    get_timeout_seconds = get_timeout_seconds1
    timer_text = C.TIMER_TEXT

    @staticmethod
    def live_method(player, data):
        if 'click' in data:
        ## save frequency of clicks
            get_timeout_seconds = get_timeout_seconds1(player)
            save_sec = int(get_timeout_seconds)
            player.participant.clicked_last.append(save_sec)
        ## save the elements position to recreate illustration
        if 'elements_pos' in data:
            player.positions_var = data['elements_pos']
        ## save if worker did already reload once
        if 'reload' in data:
            player.reloaded = 1

    @staticmethod
    def js_vars(player: Player):
        get_timeout_seconds = get_timeout_seconds1(player)
        time_worked = C.WORKINGTIME - get_timeout_seconds
        try:
            reloaded = player.field_maybe_none('reloaded')
        except TypeError:
            player.reloaded = 0

        return dict(
            word=player.field_maybe_none('word'),
            dictionary=C.MYDICT,
            words_before = player.participant.allwords,
            round = player.round_number,
            time_left = get_timeout_seconds,
            time_worked = time_worked,
            reloaded=reloaded
        )

    def before_next_page(player, timeout_happened):
        if timeout_happened:
            player.lastround = 1
            player.word = ""
            player.imageurl = ""
        else:
            ## save illustration as image
            image_data = dataUrlPattern.match(player.imageurl).group(2)
            i = base64.b64decode(image_data)
            im = Image.open(io.BytesIO(i))
            base_dir = os.path.dirname(os.path.abspath(__file__))
            your_media_root = os.path.join(base_dir, 'static/main_2_task')
            file_name = player.participant.code + "task" + str(player.round_number)
            path_to_file = os.path.join(your_media_root, f'{file_name}.png')
            im.save(path_to_file)
            player.imageurl =""
            ## save list of illustrated words to prevent illustrating the same word again
            player.participant.allwords.append(player.word.lower())
            player.participant.images.append(f'{file_name}.png')
            if player.round_number == C.NUM_ROUNDS:
                player.no_images = 0
                player.lastround = 1

        if not player.participant.allwords:
            player.no_images=1
        else:
            player.no_images=0

class SelectImage(Page):
    form_model = 'player'
    form_fields = ['bonus_image']

    def vars_for_template(player: Player):
        word1 = player.in_round(1).word
        return dict(word1=word1)

    def is_displayed(player: Player):
        return player.lastround == 1 and player.no_images == 0

    @staticmethod
    def js_vars(player):
        image_list = player.participant.images
        images = len(image_list)
        words = player.participant.allwords

        def add_suffix(data, num):
            data_dict = eval(data)
            new_data = {}
            for key, value in data_dict.items():
                new_key = f"{key}_im{num}"
                new_data[new_key] = value
            return new_data

        all_positions = []

        ## aggregate information of all images to display them on the page
        for i in range(1, images + 1):
            positions = add_suffix(player.in_round(i).positions_var, i)
            all_positions.append(positions)

        # use this dict to show the images and then store whether it was pic1 pic2 or ..
        return dict(images=images,
                    all_positions=all_positions,
                    words=words)

class Compete(Page):
    form_model = 'player'
    form_fields = ['rule']

    def is_displayed(player: Player):
        return player.lastround == 1 and player.no_images == 0

page_sequence = [Instructions, Rules, Attention, Task, SelectImage, Compete]
