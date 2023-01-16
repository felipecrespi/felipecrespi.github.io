from django.db import models
from django import forms
from django.contrib import admin
from studios.models import Studio
from accounts.models import Profile

import datetime


# Create your models here.
class Klass(models.Model):
    DAYS = (
        ('Monday', 'Monday'),
        ('Tuesday', 'Tuesday'),
        ('Wednesday', 'Wednesday'),
        ('Thursday', 'Thursday'),
        ('Friday', 'Friday'),
        ('Saturday', 'Saturday'),
        ('Sunday', 'Sunday'),
    )

    name = models.CharField(max_length=50)
    description = models.TextField()
    coach = models.CharField(max_length=200)
    keywords = models.TextField()
    capacity = models.PositiveIntegerField()
    studio = models.ForeignKey(to=Studio, on_delete=models.CASCADE, related_name='klass')
    day = models.CharField(max_length=10, choices=DAYS, default='Monday')
    start_time = models.TimeField(null=True)
    end_time = models.TimeField(null=True)
    first_day = models.DateField(verbose_name='First day of classes', null=True) #This field is not serialized; it is only used for setting date on KlassAdmin
    end_recursion = models.DateField(verbose_name='Final day of classes', null=True)
    #these fields cannot be seen by admin when creating class
    date = models.DateField(null=True, editable=False)
    user = models.ManyToManyField(Profile, editable=False, default=None)

    class Meta:
        verbose_name = 'Class'
        verbose_name_plural = 'Classes'
        ordering = ['date']

    def __str__(self):
         return str(self.name) + ' at ' + str(self.date) + ' on ' + str(self.studio)

class KlassForm(forms.ModelForm):
    class Meta:
        model = Klass
        fields = '__all__'

    def clean(self):
        cleaned_data = self.cleaned_data
        if not self.initial:
            if Klass.objects.filter(studio=cleaned_data.get('studio'), day=cleaned_data.get('day'), 
            start_time=cleaned_data.get('start_time'), end_time=cleaned_data.get('end_time')).exists():
                raise forms.ValidationError("This class already exists. Change the name, date, times, or studio")
            if cleaned_data.get('start_time') >= cleaned_data.get('end_time'):
                raise forms.ValidationError("Starting time must be before ending time.")
            if cleaned_data.get('first_day') >= cleaned_data.get('end_recursion'):
                raise forms.ValidationError("First day of classes must be before last day.")

        return cleaned_data


class KlassAdmin(admin.ModelAdmin):
    fields = ('name', 'description', 'coach', 'keywords', 'capacity', 'studio', 'day', 'start_time', 'end_time', 'first_day', 'end_recursion')
    form = KlassForm
    list_filter = [
         'name', 'studio', 'day', 'start_time', 'end_time'
    ]

    def save_model(self, request, obj, form, change):
        delete = False
        if not obj.pk:
            #only runs when object is being added
            curr_week = 0
            obj.date = self.date_for_weekday(obj.first_day, obj.day)

            curr_obj = obj

            while curr_obj.date + datetime.timedelta(weeks=1) <= curr_obj.end_recursion:
                curr_week += 1
                klass = Klass(name=obj.name, description=obj.description, coach=obj.coach, keywords=obj.keywords, 
                                capacity=obj.capacity, studio=obj.studio, day=obj.day, start_time=obj.start_time, 
                                end_time=obj.end_time, first_day=obj.first_day, end_recursion=obj.end_recursion, 
                                date=self.date_for_weekday(obj.first_day + datetime.timedelta(weeks=curr_week), obj.day))
                klass.save()
                curr_obj.save()
                curr_obj = klass

        elif 'end_recursion' in form.changed_data:
            delete = obj in Klass.objects.filter(studio=obj.studio, day=obj.day, start_time=obj.start_time, 
            end_time=obj.end_time, date__gt=obj.end_recursion)

            Klass.objects.filter(studio=obj.studio, day=obj.day, start_time=obj.start_time, 
            end_time=obj.end_time, date__gt=obj.end_recursion).delete()

            Klass.objects.filter(studio=obj.studio, day=obj.day, start_time=obj.start_time, 
            end_time=obj.end_time).update(end_recursion=obj.end_recursion)

            curr_obj = Klass.objects.filter(studio=obj.studio, day=obj.day, start_time=obj.start_time, 
            end_time=obj.end_time).order_by('-date').first()

            curr_week = 0

            while curr_obj.date + datetime.timedelta(weeks=1) <= curr_obj.end_recursion:
                curr_week += 1
                klass = Klass(name=obj.name, description=obj.description, coach=obj.coach, keywords=obj.keywords, 
                                capacity=obj.capacity, studio=obj.studio, day=obj.day, start_time=obj.start_time, 
                                end_time=obj.end_time, first_day=obj.first_day, end_recursion=obj.end_recursion, 
                                date=self.date_for_weekday(obj.first_day + datetime.timedelta(weeks=curr_week), obj.day))
                klass.save()
                curr_obj.next_klass = klass
                curr_obj.save()
                curr_obj = klass


        if not delete:
            super().save_model(request, obj, form, change)

    def date_for_weekday(self, d, weekday):
        weekday = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].index(weekday)
        days_ahead = weekday - d.weekday()
        if days_ahead <= 0: # Target day already happened this week
            days_ahead += 7
        return d + datetime.timedelta(days_ahead)