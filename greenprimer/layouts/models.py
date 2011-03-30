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
    zone = models.PositiveSmallIntegerField(default=1)
    story_height = models.FloatField(default=8)
    outline = models.TextField(default='')

    perimiter = models.FloatField(default=0)
    floor_area = models.FloatField(default=0)

    @property
    def stories(self):
        return self.floors.count()

    @property
    def square_feet(self):
        return self.floor_area * self.stories

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
        return self.side_area - self.window_area - self.door_area

    def __unicode__(self):
        return self.name

    @models.permalink
    def get_absolute_url(self):
        return 'layouts.views.outline', [self.pk]

    #######################################################
    # Standard Compliance
    
    def wall_insulation(self, standard):
        from costing import models as costing
        requirements = costing.Requirements.get(standard=standard, zone=self.zone)
        return requirements.wall()

    def roof_insulation(self, standard):
        from costing import models as costing
        requirements = costing.Requirements.get(standard=standard, zone=self.zone)
        return requirements.roof()

    def windows_for(self, standard):
        from costing import models as costing
        requirements = costing.Requirements.get(standard=standard, zone=self.zone)
        return dict((w, requirements.window(w.width, w.curtain)) for w in self.windows.all())

    def cost_for(self, standard):
        wall = self.wall_insulation(standard).cost * self.wall_area
        roof = self.roof_insulation(standard).cost * self.floor_area
        windows = sum(w.area * c.cost for (w, c) in self.windows_for(standard).items())
        return wall + roof + windows

    #######################################################
    # Budget Compliance
    
    @property
    def wall(self):
        pass

    @property
    def roof(self):
        pass

    @property
    def windows(self):
        pass

    @property
    def price(self):
        pass


class Window(models.Model):
    layout = models.ForeignKey(Layout, related_name='windows')
    label = models.CharField(max_length=50)
    height = models.PositiveSmallIntegerField(default=36)
    width = models.PositiveSmallIntegerField(default=24)
    curtain = models.BooleanField(default=False)

    @property
    def count(self):
        return sum(c.count for c in self.counts.all())

    class Meta:
        ordering = 'id',

    @property
    def area(self):
        if self.curtain:
            width = sum(c.width for c in self.counts.all())
        else:
            width = self.width
        return (width / 12) * (self.height / 12) * self.count

    def __unicode__(self):
        return self.label


class Door(models.Model):
    layout = models.ForeignKey(Layout, related_name='doors')
    label = models.CharField(max_length=50)
    width = models.PositiveSmallIntegerField(default=38)

    @property
    def count(self):
        return sum(c.count for c in self.counts.all())

    @property
    def area(self):
        return (self.width / 12) * self.layout.story_height * self.count

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


class WindowCount(models.Model):
    floor = models.ForeignKey(Floor)
    window = models.ForeignKey(Window, related_name='counts')
    count = models.PositiveSmallIntegerField(default=0)
    width = models.FloatField(default=0)

    class Meta:
        unique_together = 'floor', 'window'

    def __unicode__(self):
        return '%d %ss on %s' % (self.count, self.window, self.floor)


class DoorCount(models.Model):
    floor = models.ForeignKey(Floor)
    door = models.ForeignKey(Door, related_name='counts')
    count = models.PositiveSmallIntegerField(default=0)

    class Meta:
        unique_together = 'floor', 'door'

    def __unicode__(self):
        return '%d %ss on %s' % (self.count, self.door, self.floor)
