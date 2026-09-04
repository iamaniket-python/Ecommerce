from decouple import config

env = config('DJANGO_ENV', default='development')

if env == 'production':
    from .prod import *
else:
    from .dev import *