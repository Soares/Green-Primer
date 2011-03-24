from django.db import models

class Standard(models.Model):
	name = models.CharField(max_length=50, unique=True)
	year = models.PositiveSmallIntegerField(unique=True)
	
	class Meta:
		ordering = 'year',

	def __unicode__(self):
		return self.name


class Requirements(models.Model):
    standard = models.ForeginKey(Standard)
    zone = models.PositiveSmallIntegerField()
    wall_r = models.FloatField()
    roof_r = models.FloatField()
    window_u = models.FloatField()
    window_shgc = models.FloatField()
    window_vt = models.FloatField()

    class Meta:
        unique_together = 'standard', 'zone'

    def __unicode__(self):
        return 'Zone %d requirements for %s' % (self.zone, self.standard)

    def wall(self):
        return WallInsulation.objects.filter(r__gte=self.wall_r).first()

    def roof(self):
        return RoofInsulation.objects.filter(r__gte=self.roof_r).first()

    def window(self, size):
        return Window.objects.filter(
                max_size__gte=size,
                u__lte=self.window_u,
                shgc__lte=self.window_shgc,
                vt__lte=self.window_vt).first()


class Component(models.Model):
    cost = models.DecimalField(max_digits=5, decimal_places=2)
    description = models.CharField(max_length=100)

    def __unicode__(self):
        return self.description


class WallInsulation(Component):
    r = models.FloatField()

    class Meta:
        ordering = 'r',


class RoofInsulation(Component):
    r = models.FloatField()

    class Meta:
        ordering = 'r',


class Window(Component):
    u = models.FloatField()
    shgc = models.FloatField()
    vt = models.FloatField()
    max_size = models.FloatField()

    class Meta:
        ordering = 'u', 'shgc', 'vt'
