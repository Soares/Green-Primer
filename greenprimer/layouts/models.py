from itertools import chain
from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MaxValueValidator, MinValueValidator
from fields import BudgetField as BudgetFormField

class BudgetField(models.DecimalField):
    formfield = BudgetFormField

    def __init__(self, *args, **kwargs):
        kwargs['max_digits'] = 11
        kwargs['decimal_places'] = 2
        super(BudgetField, self).__init__(*args, **kwargs)


class Layout(models.Model):
    user = models.ForeignKey(User, related_name='layouts')
    name = models.CharField(max_length=50)
    budget = BudgetField()
    zip_code = models.CharField(max_length=11)
    outline = models.TextField(default='')

    def __unicode__(self):
        return self.name

    @models.permalink
    def get_absolute_url(self):
        return 'layouts.views.outline', [self.pk]

    def duplicate(self):
        layout = Layout.objects.create(
            user=self.user, name=self.name + ' (copy)',
            stories=self.stories, budget=self.budget,
            zip_code=self.zip_code, outline=self.outline)
        for elem in chain(self.floors.all(), self.windows.all(), self.doors.all()):
            elem.duplicate(layout)
        return layout


class Window(models.Model):
    layout = models.ForeignKey(Layout, related_name='windows')
    label = models.CharField(max_length=50)
    height = models.PositiveSmallIntegerField(default=100)
    width = models.PositiveSmallIntegerField(default=60)

    class Meta:
        ordering = 'id',

    @property
    def curtain(self):
        return self.width == 0

    def __unicode__(self):
        return self.label

    def duplicate(self, layout):
        return Window.objects.create(
            layout=layout,
            label=self.label,
            width=self.width,
            height=self.height)


class Door(models.Model):
    layout = models.ForeignKey(Layout, related_name='doors')
    label = models.CharField(max_length=50)
    width = models.PositiveSmallIntegerField(default=90)

    class Meta:
        ordering = 'id',

    def __unicode__(self):
        return self.label

    def duplicate(self, layout):
        return Door.objects.create(
            layout=layout,
            label=self.label,
            width=self.width)


class Floor(models.Model):
    layout = models.ForeignKey(Layout, related_name='floors')
    name = models.CharField(max_length=50)
    story = models.PositiveSmallIntegerField()
    json = models.TextField(default='')

    class Meta:
        unique_together = 'layout', 'story'
        ordering = 'story',

    def __unicode__(self):
        return '%d. %s' % (self.story, self.name)

    def duplicate(self, layout):
        return Floor.objects.create(
            layout=layout,
            name=self.name,
            story=self.story,
            json=self.json)

    @models.permalink
    def get_absolute_url(self):
        return 'layouts.views.floor', [self.layout.pk, self.story]
