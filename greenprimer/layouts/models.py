from django.db import models
from django.contrib.auth.models import User
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
    story_height = models.FloatField()
    zone = models.PositiveSmallIntegerField(default=1)
    outline = models.TextField(default='')

    perimiter = models.FloatField(null=True)
    floor_area = models.FloatField(null=True)

    @property
    def stories(self):
        return self.floors.count()

    @property
    def square_feet(self):
        return self.area * self.stories

    @property
    def height(self):
        return self.story_height * self.stories

    @property
    def side_area(self):
        return self.perimiter * self.height

    @property
    def door_area(self):
        return sum(d.area for d in self.doors.all())

    @property
    def window_area(self):
        return sum(w.area for w in self.windows.all())

    @property
    def wall_area(self):
        return self.side_area - self.door_area - self.window_area

    def __unicode__(self):
        return self.name

    @models.permalink
    def get_absolute_url(self):
        return 'layouts.views.outline', [self.pk]

    def cost(self, standard):
        from costing import models as costing
        requirements = costing.Requirements.get(standard=standard, zone=self.zone)
        wall = requirements.wall().cost * self.side_area
        roof = requirements.roof().cost * self.floor_area
        windows = [requirements.window(w.width) * w.area for w in self.windows.all()]
        return wall + roof + sum(windows)



class Window(models.Model):
    layout = models.ForeignKey(Layout, related_name='windows')
    label = models.CharField(max_length=50)
    height = models.PositiveSmallIntegerField(default=100)
    width = models.PositiveSmallIntegerField(default=60)
    count = models.PositiveSmallIntegerField(default=0)
    curtain = models.BooleanField(default=False)

    class Meta:
        ordering = 'id',

    @property
    def area(self):
        return self.width * self.height * self.count
        

    @property
    def curtain(self):
        return self.width == 0

    def __unicode__(self):
        return self.label


class Door(models.Model):
    layout = models.ForeignKey(Layout, related_name='doors')
    label = models.CharField(max_length=50)
    width = models.PositiveSmallIntegerField(default=90)
    count = models.PositiveSmallIntegerField(default=0)

    @property
    def area(self):
        return self.width * self.layout.story_height * self.count

    class Meta:
        ordering = 'id',

    def __unicode__(self):
        return self.label


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

    @models.permalink
    def get_absolute_url(self):
        return 'layouts.views.floor', [self.layout.pk, self.story]
