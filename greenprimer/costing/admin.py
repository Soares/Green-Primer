from django.contrib import admin
from costing.models import Standard, Requirements, WallInsulation, RoofInsulation, Window

admin.site.register(Standard)
admin.site.register(Requirements)
admin.site.register(WallInsulation)
admin.site.register(RoofInsulation)
admin.site.register(Window)
