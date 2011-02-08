from django.db import models
from django.contrib.auth.models import User

class Layout(models.Model):
    user = models.ForeignKey(User)
    name = models.CharField(max_length=50)
    json = models.TextField()

    def __unicode__(self):
        return self.name

    @models.permalink
    def get_absolute_url(self):
        return 'layouts.views.layout', [self.pk]