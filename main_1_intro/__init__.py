from otree.api import *
import io
import os
import re
import base64
import requests
from PIL import Image
dataUrlPattern = re.compile('data:image/(png|jpeg);base64,(.*)$')
import pandas as pd

doc = """
Your app description
"""


class C(BaseConstants):
    NAME_IN_URL = 'main_1_intro'
    PLAYERS_PER_GROUP = None
    NUM_ROUNDS = 1
    ## read in list of Prolific Ids to prevent retakes
    DATA = pd.read_csv("ids.csv", delimiter=",", encoding="latin1")
    DF = pd.DataFrame(DATA, columns=['ids'])
    prev_ids = DF['ids'].to_list()

def creating_session(subsession):
    import itertools
    treatments = itertools.cycle([1,2,3])
    subsession.session.ids = []
    subsession.session.ids.extend(C.prev_ids)
    for player in subsession.get_players():
        player.treat = next(treatments)
        player.participant.treat = player.treat

class Subsession(BaseSubsession):
    pass


class Group(BaseGroup):
    pass


class Player(BasePlayer):
    workerid = models.StringField()
    consent1 = models.IntegerField(initial=0)
    consent2 = models.IntegerField(initial=0)
    consent3 = models.IntegerField(initial=0)

    # TryTech:
    imageurl_trytech = models.LongStringField()
    positions_var = models.LongStringField(blank=True)
    treat=models.IntegerField()
    reloaded=models.IntegerField(initial=0)



# PAGES
class Welcome(Page):
    form_model = 'player'
    form_fields = [
        'workerid'
    ]

    def vars_for_template(player: Player):
        if player.treat==1:
            conversion=1.00
        if player.treat==2:
            conversion=0.10
        if player.treat==3:
            conversion=1.0
        return dict(conversion=conversion)


    def before_next_page(player: Player, timeout_happened):
        if player.workerid in player.session.ids:
            player.participant.participated_before = 1
            player.participant.passed = 0
        else:
            player.participant.participated_before = 0
            ## we update the list of Prolific IDs to prevent retakes
            player.session.ids.append(player.workerid)

    @staticmethod
    def app_after_this_page(player, upcoming_apps):
        if player.participant.participated_before == 1:
            return 'main_3_survey'


class Consent(Page):
    form_model = 'player'
    form_fields = [
        'consent1',
        'consent2',
        'consent3'
    ]

class TechInfo(Page):
    pass

class TryTech(Page):
    form_model = 'player'
    form_fields = [
        'imageurl_trytech'
    ]

    @staticmethod
    def live_method(player, data):
        if 'elements_pos' in data:
            player.positions_var = data['elements_pos']
        if 'reload' in data:
            player.reloaded = 1

    @staticmethod
    def js_vars(player: Player):
        try:
            reloaded = player.field_maybe_none('reloaded')
        except TypeError:
            player.reloaded = 0
        return dict(
            reloaded=reloaded
        )

    def before_next_page(player, timeout_happened):
        import os
        data2 = dataUrlPattern.match(player.imageurl_trytech).group(2)
        i = base64.b64decode(data2)
        im = Image.open(io.BytesIO(i))
        base_dir = os.path.dirname(os.path.abspath(__file__))
        your_media_root = os.path.join(base_dir, 'media')
        file_name = player.participant.code + "trytech"
        path_to_file = os.path.join(your_media_root, f'{file_name}.png')
        try:
            im.save(path_to_file)
        except Exception as e:
            print(f"Error saving image: {e}")


page_sequence = [Welcome, Consent, TechInfo, TryTech]
