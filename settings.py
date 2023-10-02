from os import environ

SESSION_CONFIGS = [
     dict(
         name='Ideation',
         app_sequence=['main_1_intro', 'main_2_task', 'main_3_survey'],
         num_demo_participants=7,
     ),
    dict(
        name='Rater',
        app_sequence=['rater'],
        num_demo_participants=4,
    )
]

# if you set a property in SESSION_CONFIG_DEFAULTS, it will be inherited by all configs
# in SESSION_CONFIGS, except those that explicitly override it.
# the session config can be accessed from methods in your apps as self.session.config,
# e.g. self.session.config['participation_fee']

SESSION_CONFIG_DEFAULTS = dict(
    real_world_currency_per_point=1.00, participation_fee=0.00, doc=""
)

PARTICIPANT_FIELDS = ['expiry', 'allwords', 'clicked_last', 'all_data', 'images', 'treat', 'passed','photoid_list','participated_before']
SESSION_FIELDS = ['rater_pict_quotas','dict_for_quotas', 'ids']

# ISO-639 code
# for example: de, fr, ja, ko, zh-hans
LANGUAGE_CODE = 'en'

# e.g. EUR, GBP, CNY, JPY
REAL_WORLD_CURRENCY_CODE = 'USD'
USE_POINTS = True

ADMIN_USERNAME = 'admin'
# for security, best to set admin password in an environment variable
ADMIN_PASSWORD = environ.get('OTREE_ADMIN_PASSWORD')

DEMO_PAGE_INTRO_HTML = """ """

SECRET_KEY = '2443553256687'
