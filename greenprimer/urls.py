import settings
from django.conf.urls.defaults import patterns, include
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    (r'^admin/doc/', include('django.contrib.admindocs.urls')),
    (r'^admin/', include(admin.site.urls)),
)

urlpatterns += patterns('layouts.views',
    (r'^layouts/new/$', 'new'),
    (r'^layouts/properties/(?P<layout>\d+)/$', 'properties'),
    (r'^layouts/duplicate/(?P<layout>\d+)/$', 'duplicate'),
    (r'^layouts/delete/(?P<layout>\d+)/$', 'delete'),

    (r'^layouts/edit/(?P<layout>\d+)/$', 'outline'),
    (r'^layouts/edit/(?P<layout>\d+)/(?P<story>\d+)/$', 'floor'),

    (r'^layouts/save/(?P<layout>\d+)/$', 'outersave'),
    (r'^layouts/save/(?P<layout>\d+)/(?P<story>\d+)/$', 'innersave'),

    (r'^layouts/js/(?P<layout>\d+)/$', 'outerjs'),
    (r'^layouts/js/(?P<layout>\d+)/(?P<story>\d+)/$', 'innerjs'),
)

urlpatterns += patterns('users.views',
    (r'^$', 'main'),
    (r'^home/$', 'home'),
    (r'^register/$', 'register'),
    (r'^logout/$', 'logout'),
)

urlpatterns += patterns('django.views.generic.simple',
    (r'^layout/$', 'direct_to_template', {'template': 'layout.hisp'}),
    (r'^demo/$', 'direct_to_template', {'template': 'demo.hisp'}),
)

if settings.DEBUG:
    urlpatterns += patterns('',
        (r'^site_media/(?P<path>.*\.(?!js|css).*)$', 'django.views.static.serve',
            {'document_root': settings.MEDIA_ROOT}),
    )
