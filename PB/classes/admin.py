from django.contrib import admin

from classes.models import Klass

from django.db import models
from datetime import datetime
from classes.models import Klass, KlassAdmin

import datetime

# Register your models here.
admin.site.register(Klass, KlassAdmin)