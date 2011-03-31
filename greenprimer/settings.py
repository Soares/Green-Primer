import os.path
import socket
setting = lambda generator: tuple(generator())
path = lambda *args: os.path.normpath(os.path.realpath(os.path.join(*args)))

# SETUP {{{1

PROJECT_NAME = 'greenprimer'
PROJECT_ROOT = path(os.path.dirname(__file__))

ADMINS = (
    ('Nathaniel Soares', 'nate@natesoares.com'),
)

MANAGERS = ADMINS

DATABASES = {
    'default': {
        'ENGINE': 'postgresql_psycopg2',
        'NAME': 'greenprimer',
        'PORT': '5433',
    }
}


# RESTRICTED {{{1

from restricted.settings import SECRET_KEY, DATABASE_PASSWORDS

DATABASES['default']['password'] = DATABASE_PASSWORDS['default']


# ENVIRONMENT {{{1

# Hostname lists for local/dev/staging/production machines
SERVERS = {
    'DEV': ['Falcon'],
    'STAGING': [],
    'PROD': [],
}

for (key, names) in SERVERS.items():
    if socket.gethostname() in names:
        SERVER_TYPE = key
        break
else:
    SERVER_TYPE = 'PROD'

DEBUG = SERVER_TYPE == 'DEV'
if DEBUG:
    USE_ETAGS = False
    CACHE_BACKEND = 'dummy:///'
    EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# Now that we have sentry, we always want debug info
TEMPLATE_DEBUG = True


# PREFERENCES {{{1

ROOT_URLCONF = PROJECT_NAME + '.urls'

DEFAULT_FROM_EMAIL = 'webmaster@greenprimer.com'

# Local time zone for this installation. Choices can be found here:
# http://en.wikipedia.org/wiki/List_of_tz_zones_by_name
# although not all choices may be available on all operating systems.
# On Unix systems, a value of None will cause Django to use the same
# timezone as the operating system.
# If running in a Windows environment this must be set to the same as your
# system time zone.
TIME_ZONE = 'America/New_York'

# Language code for this installation. All choices can be found here:
# http://www.i18nguy.com/unicode/language-identifiers.html
LANGUAGE_CODE = 'en-us'

# If you set this to False, Django will make some optimizations so as not
# to load the internationalization machinery.
USE_I18N = True


# WEBSITE {{{1

SITE_ID = 1
INTERNAL_IPS = ('127.0.0.1',)


# STATIC FILES {{{1

# Absolute path to the directory that holds media.
# Example: "/home/media/media.lawrence.com/"
MEDIA_ROOT = PROJECT_ROOT + '/static/'

# URL that handles the media served from MEDIA_ROOT. Make sure to use a
# trailing slash if there is a path component (optional in other cases).
# Examples: "http://media.lawrence.com", "http://example.com/media/"
MEDIA_URL = '/static/'

# URL prefix for admin media -- CSS, JavaScript and images. Make sure to use a
# trailing slash.
# Examples: "http://foo.com/media/", "/media/".
ADMIN_MEDIA_PREFIX = MEDIA_URL + 'admin/'

MEDIA_BUNDLES = (
    ('main.css',
        'media/css/reset.css',
        'media/css/scaffold.css',
        'jquery/ui/mytheme.css',
    ),
    ('home.css',
        'media/sass/home.sass',
    ),
    ('analyzer.css',
        'analyzer/sass/base.sass',
        'analyzer/sass/layout.sass',
        'analyzer/sass/key.sass',
        'analyzer/sass/toolbar.sass',
        'analyzer/sass/dashboard.sass',
        'analyzer/sass/other.sass',
    ),
    ('outline.css',
        'analyzer/sass/outline.sass',
    ),
    ('floor.css',
        'analyzer/sass/floor.sass',
    ),
    ('demo.css',
        'analyzer/sass/demo.sass',
        'analyzer/sass/layout.sass',
        'analyzer/sass/key.sass',
        'analyzer/sass/toolbar.sass',
        'analyzer/sass/dashboard.sass',
    ),
    ('properties.css',
        'media/sass/properties.sass',
    ),
    ('properties.js',
        'media/js/properties.js',
        'media/js/zones.js',
    ),
    ('main.js',
        'jquery/1.4.4.min.js',
        'jquery/ui/1.8.7.dev.js',
        'modernizr/1.6.min.js',
        'modernizr/1.6.min.js',
    ),
    ('box.js',
        # Box2D JS
        'box2D/lib/prototype-1.6.0.2.js',
        'box2D/js/box2d/common/b2Settings.js',
        'box2D/js/box2d/common/math/b2Vec2.js',
        'box2D/js/box2d/common/math/b2Mat22.js',
        'box2D/js/box2d/common/math/b2Math.js',
        'box2D/js/box2d/collision/b2AABB.js',
        'box2D/js/box2d/collision/b2Bound.js',
        'box2D/js/box2d/collision/b2BoundValues.js',
        'box2D/js/box2d/collision/b2Pair.js',
        'box2D/js/box2d/collision/b2PairCallback.js',
        'box2D/js/box2d/collision/b2BufferedPair.js',
        'box2D/js/box2d/collision/b2PairManager.js',
        'box2D/js/box2d/collision/b2BroadPhase.js',
        'box2D/js/box2d/collision/b2Collision.js',
        'box2D/js/box2d/collision/Features.js',
        'box2D/js/box2d/collision/b2ContactID.js',
        'box2D/js/box2d/collision/b2ContactPoint.js',
        'box2D/js/box2d/collision/b2Distance.js',
        'box2D/js/box2d/collision/b2Manifold.js',
        'box2D/js/box2d/collision/b2OBB.js',
        'box2D/js/box2d/collision/b2Proxy.js',
        'box2D/js/box2d/collision/ClipVertex.js',
        'box2D/js/box2d/collision/shapes/b2Shape.js',
        'box2D/js/box2d/collision/shapes/b2ShapeDef.js',
        'box2D/js/box2d/collision/shapes/b2BoxDef.js',
        'box2D/js/box2d/collision/shapes/b2CircleDef.js',
        'box2D/js/box2d/collision/shapes/b2CircleShape.js',
        'box2D/js/box2d/collision/shapes/b2MassData.js',
        'box2D/js/box2d/collision/shapes/b2PolyDef.js',
        'box2D/js/box2d/collision/shapes/b2PolyShape.js',
        'box2D/js/box2d/dynamics/b2Body.js',
        'box2D/js/box2d/dynamics/b2BodyDef.js',
        'box2D/js/box2d/dynamics/b2CollisionFilter.js',
        'box2D/js/box2d/dynamics/b2Island.js',
        'box2D/js/box2d/dynamics/b2TimeStep.js',
        'box2D/js/box2d/dynamics/contacts/b2ContactNode.js',
        'box2D/js/box2d/dynamics/contacts/b2Contact.js',
        'box2D/js/box2d/dynamics/contacts/b2ContactConstraint.js',
        'box2D/js/box2d/dynamics/contacts/b2ContactConstraintPoint.js',
        'box2D/js/box2d/dynamics/contacts/b2ContactRegister.js',
        'box2D/js/box2d/dynamics/contacts/b2ContactSolver.js',
        'box2D/js/box2d/dynamics/contacts/b2CircleContact.js',
        'box2D/js/box2d/dynamics/contacts/b2Conservative.js',
        'box2D/js/box2d/dynamics/contacts/b2NullContact.js',
        'box2D/js/box2d/dynamics/contacts/b2PolyAndCircleContact.js',
        'box2D/js/box2d/dynamics/contacts/b2PolyContact.js',
        'box2D/js/box2d/dynamics/b2ContactManager.js',
        'box2D/js/box2d/dynamics/b2World.js',
        'box2D/js/box2d/dynamics/b2WorldListener.js',
        'box2D/js/box2d/dynamics/joints/b2JointNode.js',
        'box2D/js/box2d/dynamics/joints/b2Joint.js',
        'box2D/js/box2d/dynamics/joints/b2JointDef.js',
        'box2D/js/box2d/dynamics/joints/b2DistanceJoint.js',
        'box2D/js/box2d/dynamics/joints/b2DistanceJointDef.js',
        'box2D/js/box2d/dynamics/joints/b2Jacobian.js',
        'box2D/js/box2d/dynamics/joints/b2GearJoint.js',
        'box2D/js/box2d/dynamics/joints/b2GearJointDef.js',
        'box2D/js/box2d/dynamics/joints/b2MouseJoint.js',
        'box2D/js/box2d/dynamics/joints/b2MouseJointDef.js',
        'box2D/js/box2d/dynamics/joints/b2PrismaticJoint.js',
        'box2D/js/box2d/dynamics/joints/b2PrismaticJointDef.js',
        'box2D/js/box2d/dynamics/joints/b2PulleyJoint.js',
        'box2D/js/box2d/dynamics/joints/b2PulleyJointDef.js',
        'box2D/js/box2d/dynamics/joints/b2RevoluteJoint.js',
        'box2D/js/box2d/dynamics/joints/b2RevoluteJointDef.js',
    ),
    ('utils.js',
        # 3rd Party
        'raphael/raphael.js',
        'raphael/arrange.js',
        'jquery/scrollTo-1.4.2.js',
        'jquery/tools/tools.min.js',
        'jquery/svg.js',
        'jquery/svgdom.js',
    ),
    ('base.js',
        # Green Primer
        'analyzer/gp.js',

        'analyzer/base/exceptions.js',
        'analyzer/base/utilities.js',
        'analyzer/base/notify.js',
        'analyzer/base/warnings.js',
        # 'analyzer/base/json.js',

        'analyzer/geom/vector.js',
        'analyzer/geom/point.js',
        'analyzer/geom/line.js',

        'analyzer/actions/action.js',
        'analyzer/actions/stack.js',

        'analyzer/mode/mode.js',
    ),
    ('ui.js',
        'analyzer/ui/key.js',
        'analyzer/ui/toolbar.js',
        'analyzer/ui/dashboard.js',
            'analyzer/ui/scroll.js',
    ),
    ('shared.js',
        'analyzer/layout/layout.js',
        'analyzer/layout/element.js',
        'analyzer/layout/dot.js',
        'analyzer/layout/joint.js',
        'analyzer/layout/wall.js',

        'analyzer/mode/delete.js',
        'analyzer/mode/move.js',

        'analyzer/mode/door.js',

        'analyzer/analyze/area.js',
    ),
    ('floor.js',
        'analyzer/layout/door.js',
        'analyzer/layout/window.js',
        'analyzer/layout/vent.js',
        'analyzer/layout/stair.js',

        'analyzer/mode/vent.js',
        'analyzer/mode/wall.js',
        'analyzer/mode/window.js',
        'analyzer/mode/stair.js',

        'analyzer/mode/heatflow.js',
        'analyzer/mode/ventilate.js',

        'analyzer/analyze/pressure.js',
        'analyzer/analyze/graph.js',

        'analyzer/floor.js',
        'analyzer/physics.js',
    ),
    ('outline.js',
        'analyzer/mode/outerwall.js',
        'analyzer/outline.js',
    ),
)

MEDIA_DEV_MODE = DEBUG
GLOBAL_MEDIA_DIRS = (MEDIA_ROOT,)
GENERATED_MEDIA_DIR = '.generated_media'
PRODUCTION_MEDIA_URL = '/media/'

ROOT_MEDIA_FILTERS = {
    'css': 'mediagenerator.filters.yuicompressor.YUICompressor',
    'js': 'mediagenerator.filters.closure.Closure',
}

YUICOMPRESSOR_PATH = os.path.join(MEDIA_ROOT, 'yuicompressor', 'yuicompressor-2.4.2.jar')
CLOSURE_COMPILER_PATH = os.path.join(MEDIA_ROOT, 'closure', 'compiler.jar')


# TEMPLATES {{{1

# List of callables that know how to import templates from various sources.
@setting
def TEMPLATE_LOADERS():
    template_loaders = (
        'django.template.loaders.filesystem.Loader',
        'django.template.loaders.app_directories.Loader',
    )
    hisp_loaders = (
        ('hisp.loaders.convert.Loader', template_loaders),
    )
    loaders = hisp_loaders + template_loaders
    return loaders if DEBUG else ('django.templates.loaders.cached.Loader', loaders)

@setting
def TEMPLATE_CONTEXT_PROCESSORS():
    yield 'django.core.context_processors.auth'
    yield 'django.core.context_processors.media'
    yield 'django.core.context_processors.request'
    if USE_I18N:
        yield 'django.core.context_processors.i18n'
    if DEBUG:
        yield 'django.core.context_processors.debug'

@setting
def TEMPLATE_DIRS():
    yield path(PROJECT_ROOT, 'templates')
    for root, dirs, files in os.walk(PROJECT_ROOT):
        if 'templates' in dirs:
            yield path(root, 'templates')


# MIDDLEWARE {{{1

@setting
def MIDDLEWARE_CLASSES():
    yield 'django.middleware.gzip.GZipMiddleware'
    if DEBUG:
        yield 'mediagenerator.middleware.MediaMiddleware'
    # yield 'django.middleware.cache.UpdateCacheMiddleware'
    yield 'django.middleware.http.ConditionalGetMiddleware'
    yield 'django.middleware.common.CommonMiddleware'
    yield 'django.contrib.sessions.middleware.SessionMiddleware'
    # yield 'django.middleware.csrf.CsrfViewMiddleware'
    # yield 'django.middleware.locale.LocaleMiddleware',
    yield 'django.contrib.auth.middleware.AuthenticationMiddleware'
    #if DEBUG:
    #    yield 'debug_toolbar.middleware.DebugToolbarMiddleware'
    yield 'django.contrib.messages.middleware.MessageMiddleware'
    # yield 'django.contrib.flatpages.middleware.FlatpageFallbackMiddleware',
    # yield 'django.contrib.redirects.middleware.RedirectFallbackMiddleware',
    yield 'xframeoptions.middleware.Header'
    # yield 'django.middleware.transaction.TransactionMiddleware',


# APPS {{{1

@setting
def INSTALLED_APPS():
    # Django Contrib
    yield 'django.contrib.admin'
    yield 'django.contrib.admindocs'
    yield 'django.contrib.auth'
    # yield 'django.contrib.comments'
    yield 'django.contrib.contenttypes'
    # yield 'django.contrib.databrowse' # read-only version of the admin
    # yield 'django.contrib.flatpages'
    yield 'django.contrib.humanize'
    yield 'django.contrib.markup' # includes textile, markdown, ReST
    yield 'django.contrib.messages'
    # yield 'django.contrib.redirects' # db-level redirects
    yield 'django.contrib.sessions'
    # yield 'django.contrib.sitemaps'
    yield 'django.contrib.sites'
    # yield 'django.contrib.syndication'
    yield 'django.contrib.webdesign' # lorem ipsum generator
    
    # Third-Party
    yield 'django_extensions'
    # yield 'indexer'
    yield 'mediagenerator'
    yield 'paging'
    # yield 'sentry'
    yield 'sentry.client'
    yield 'south'
    yield 'hisp'
    yield 'xframeoptions'
    #if DEBUG:
    #   yield 'debug_toolbar'

    # Green Primer
    yield 'users'
    yield 'layouts'
    yield 'costing'

LOGIN_REDIRECT_URL = '/'

X_FRAME_OPTIONS = 'SAMEORIGIN'

DEBUG_TOOLBAR_PANELS = (
    'debug_toolbar.panels.version.VersionDebugPanel',
    'debug_toolbar.panels.timer.TimerDebugPanel',
    'debug_toolbar.panels.settings_vars.SettingsVarsDebugPanel',
    'debug_toolbar.panels.headers.HeaderDebugPanel',
    'debug_toolbar.panels.request_vars.RequestVarsDebugPanel',
    'debug_toolbar.panels.template.TemplateDebugPanel',
    'debug_toolbar.panels.sql.SQLDebugPanel',
    'debug_toolbar.panels.signals.SignalDebugPanel',
    'debug_toolbar.panels.logger.LoggingPanel',
)
