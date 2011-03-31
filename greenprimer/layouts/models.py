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

    def duplicate(self):
        new = Layout.objects.create(
                user=self.user,
                name=self.name + ' copy',
                budget=self.budget,
                zone=self.zone,
                story_height=self.story_height,
                outline=self.outline,
                perimiter=self.perimiter,
                floor_area=self.floor_area)
        for floor in self.floors.all():
            floor.duplicate(new)
        for window in self.windows.all():
            window.duplicate(new)
        for door in self.doors.all():
            door.duplicate(new)
        return new

    #######################################################
    # Standard Compliance
    
    def materials_for(self, standard):
        from costing import models as costing
        requirements = costing.Requirements.objects.get(standard=standard, zone=self.zone)
        roof = requirements.roof()
        wall = requirements.wall()
        windows = dict((w, requirements.window(w.operability)) for w in self.windows.all())
        
        roof_cost = float(roof.cost) * self.floor_area
        wall_cost = float(wall.cost) * self.wall_area
        window_costs = dict((w, float(c.cost) * w.area) for (w, c) in windows.items())
        window_cost = sum(window_costs.values())
        cost = roof_cost + wall_cost + window_cost

        leftover = float(self.budget) - cost
        return {
            'roof_insulation': roof,
            'roof_insulation_cost': roof_cost,
            'wall_insulation': wall,
            'wall_insulation_cost': wall_cost,
            'windows': windows,
            'window_cost': window_cost,
            'window_costs': window_costs,
            'cost': cost,
            'leftover': leftover,
        }

    #######################################################
    # Budget Compliance
    
    def best_materials(self):
        from costing.models import Standard, RoofInsulation, WallInsulation, Window
        lec = Standard.objects.get(year=2007)
        lec_data = self.materials_for(lec)
        lec_cost = lec_data['cost']
        budget = float(self.budget)

        windows = {}
        window_costs = {}
        for window in self.windows.all():
            window_ratio = lec_data['window_costs'][window] / lec_cost
            window_ratio += 0.025 # Window importance bump, compensates for first-loss
            lec_cost -= lec_data['window_costs'][window]
            window_money = window_ratio * budget
            window_price = (window_money / window.area) + 3
            options = Window.objects.filter(operability=window.operability).order_by('cost')
            component = options.filter(cost__lte=window_price).order_by('u', 'shgc', 'vt').first()
            component = component or options[0]
            window_cost = float(component.cost) * window.area
            budget -= window_cost
            windows[window] = component
            window_costs[window] = window_cost

        wall_ratio = lec_data['wall_insulation_cost'] / lec_cost
        lec_cost -= lec_data['wall_insulation_cost']
        wall_money = wall_ratio * budget
        wall_price = wall_money / self.wall_area
        wall = WallInsulation.objects.filter(cost__lte=wall_price).order_by('-r').first()
        wall = wall or WallInsulation.objects.filter(r__gt=0).order_by('cost')[0]
        wall_cost = float(wall.cost) * self.wall_area
        budget -= wall_cost

        roof_ratio = lec_data['roof_insulation_cost'] / lec_cost
        lec_cost -= lec_data['roof_insulation_cost']
        roof_money = roof_ratio * budget
        roof_price = roof_money / self.floor_area
        roof = RoofInsulation.objects.filter(cost__lte=roof_price).order_by('-r').first()
        roof_cost = float(roof.cost) * self.floor_area
        budget -= roof_cost

        cost = roof_cost + wall_cost + sum(window_costs.values())

        leftover = float(self.budget) - cost
        return {
            'roof_insulation': roof,
            'roof_insulation_cost': roof_cost,
            'wall_insulation': wall,
            'wall_insulation_cost': wall_cost,
            'windows': windows,
            'window_cost': window_cost,
            'window_costs': window_costs,
            'cost': cost,
            'leftover': leftover,
        }


class Window(models.Model):
    index = models.PositiveSmallIntegerField(blank=True)
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
        unique_together = 'index', 'layout'

    @property
    def area(self):
        if self.curtain:
            width = sum(c.width for c in self.counts.all())
        else:
            width = self.width
        return (width / 12) * (self.height / 12) * self.count

    @property
    def operability(self):
        if self.curtain:
            return 2
        elif self.width < 24:
            return 0
        return 1

    def __unicode__(self):
        return self.label

    def duplicate(self, layout):
        new = Window.objects.create(
                layout=layout,
                index=self.index,
                label=self.label,
                height=self.height,
                width=self.width,
                curtain=self.curtain)
        for count in self.counts.all():
            count.duplicate(new)
        return new


class Door(models.Model):
    index = models.PositiveSmallIntegerField(blank=True)
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
        unique_together = 'index', 'layout'

    def __unicode__(self):
        return self.label

    def duplicate(self, layout):
        new = Door.objects.create(
                index=self.index,
                layout=layout,
                label=self.label,
                width=self.width)
        for count in self.counts.all():
            count.duplicate(new)
        return new


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

    def duplicate(self, layout):
        return Floor.objects.create(
                layout=layout,
                name=self.name,
                story=self.story,
                json=self.json)


class WindowCount(models.Model):
    floor = models.ForeignKey(Floor)
    window = models.ForeignKey(Window, related_name='counts')
    count = models.PositiveSmallIntegerField(default=0)
    width = models.FloatField(default=0)

    class Meta:
        unique_together = 'floor', 'window'

    def __unicode__(self):
        return '%d %ss on %s' % (self.count, self.window, self.floor)

    def duplicate(self, window):
        return WindowCount.objects.create(
                floor=self.floor,
                window=window,
                count=self.count,
                width=self.width)


class DoorCount(models.Model):
    floor = models.ForeignKey(Floor)
    door = models.ForeignKey(Door, related_name='counts')
    count = models.PositiveSmallIntegerField(default=0)

    class Meta:
        unique_together = 'floor', 'door'

    def __unicode__(self):
        return '%d %ss on %s' % (self.count, self.door, self.floor)

    def duplicate(self, door):
        return DoorCount.objects.create(
                floor=self.floor,
                door=door,
                count=self.count)
