import settings
from django.conf.urls.defaults import patterns, include
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    (r'^admin/doc/', include('django.contrib.admindocs.urls')),
    (r'^admin/', include(admin.site.urls)),
    (r'^layout/(?P<pk>\d+)$', 'layouts.views.layout'),
    (r'^$', 'django.views.generic.simple.direct_to_template', {'template': 'main.hisp'}),
)

if settings.DEBUG:
    urlpatterns += patterns('',
        (r'^site_media/(?P<path>.*\.(?!js|css).*)$', 'django.views.static.serve',
            {'document_root': settings.MEDIA_ROOT}),
    )
