"""
These are the database objects holding the ASHRAE and Reeds data that green
primer uses to do its material analysis.
"""
from django.db import models

class Standard(models.Model):
    """ An ASHRAE energy standard """
    name = models.CharField(max_length=50, unique=True)
    year = models.PositiveSmallIntegerField(unique=True)

    class Meta:
        ordering = 'year',

    def __unicode__(self):
        return self.name


class Requirements(models.Model):
    """
    The requirements of an ASHRAE energy standard for one specific climate zone
    """
    standard = models.ForeignKey(Standard)
    zone = models.PositiveSmallIntegerField()
    wall_r = models.FloatField()
    roof_r = models.FloatField()
    window_u = models.FloatField()
    window_shgc = models.FloatField()
    window_vt = models.FloatField()

    class Meta:
        unique_together = 'standard', 'zone'
        verbose_name_plural = 'requirement sets'

    def __unicode__(self):
        return 'Zone %d requirements for %s' % (self.zone, self.standard)

    def wall(self):
        return WallInsulation.objects.filter(r__gte=self.wall_r).order_by('cost').first()

    def roof(self):
        return RoofInsulation.objects.filter(r__gte=self.roof_r).order_by('cost').first()

    def window(self, operability):
        return Window.objects.filter(
                operability=operability,
                u__lte=self.window_u,
                shgc__lte=self.window_shgc,
                vt__lte=self.window_vt).first()


class Component(models.Model):
    """ One material component (abstract base class) """
    cost = models.DecimalField(max_digits=5, decimal_places=2)
    description = models.CharField(max_length=100)

    class Meta:
        abstract = True

    def __unicode__(self):
        return self.description


class WallInsulation(Component):
    """ Wall insulation cost data """
    r = models.FloatField()

    class Meta:
        ordering = 'r',

    def __unicode__(self):
        if self.cost < 1:
            price = u'%02d\u00A2' % (self.cost * 100)
        else:
            price = '$%.2f' % self.cost
        return 'r%.2f %s' % (self.r, self.description)


class RoofInsulation(Component):
    """ Roof insulation cost data """
    r = models.FloatField()

    class Meta:
        ordering = 'r',

    def __unicode__(self):
        if self.cost < 1:
            price = u'%02d\u00A2' % (self.cost * 100)
        else:
            price = '$%.2f' % self.cost
        return 'r%.2f %s' % (self.r, self.description)


class Window(models.Model):
    """ Window cost data """
    description = models.CharField(max_length=150)
    cost = models.DecimalField(max_digits=5, decimal_places=2)
    u = models.FloatField()
    shgc = models.FloatField()
    vt = models.FloatField()
    operability = models.PositiveSmallIntegerField(choices=(
        (0, 'Fixed'),
        (1, 'Operable'),
        (2, 'Curtain Wall'),
    ))
    coatings = models.CharField(max_length=50)
    frame = models.CharField(max_length=50)
    film = models.CharField(max_length=50)

    class Meta:
        ordering = 'u', 'shgc', 'vt'

    def __unicode__(self):
        return '%s, %s, %s, %s film' % (self.get_operability_display(), self.description, self.frame, self.film)
