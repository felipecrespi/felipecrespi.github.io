from django.shortcuts import render
from django.http import HttpResponse
from django.shortcuts import get_list_or_404, get_object_or_404
from rest_framework.generics import RetrieveAPIView, ListAPIView, CreateAPIView, UpdateAPIView
from rest_framework import filters
from django.db.models import Case, When
from math import radians, cos, sin, asin, sqrt

from studios.serializers import StudioSerializer, AmenitiesSerializer, StudioImagesSerializer
from studios.models import Studio, StudioImages, Amenities
from classes.serializers import KlassSerializer
from classes.models import Klass

import datetime

# Create your views here.
class StudioView(RetrieveAPIView):
    serializer_class = StudioSerializer

    def get_object(self):
        return get_object_or_404(Studio, id=self.kwargs['studio_id'])

class ListStudioClassesView(ListAPIView):
    serializer_class = KlassSerializer

    def get_queryset(self):
        if Klass.objects.filter(studio__pk=self.kwargs['studio_id'], date__gte=datetime.datetime.today()).exists():
            queryset = Klass.objects.filter(studio__pk=self.kwargs['studio_id'], date__gte=datetime.datetime.today())

            if self.request.GET.get('name'):
                queryset = queryset.filter(name=self.request.GET.get('name'))
            if self.request.GET.get('day'):
                queryset = queryset.filter(day=self.request.GET.get('day'))
            if self.request.GET.get('coach'):
                queryset = queryset.filter(coach=self.request.GET.get('coach'))
            if self.request.GET.get('start_time'):
                queryset = queryset.filter(start_time=self.request.GET.get('start_time'))
            if self.request.GET.get('end_time'):
                queryset = queryset.filter(end_time=self.request.GET.get('end_time'))
            
            return queryset
        return HttpResponse(status=404)
    
    def get_time_value(self, pk):
        '''Returns 100 * weekday + time, where weekday starts from today=0 to 6
        If today is Monday, and the class is on Thurdays at 6 am, it returns 306.0'''
        klass = Klass.objects.filter(pk=pk).first()

        weekday_dic = {'Monday': 0, 'Tuesday': 1, 'Wednesday': 2, 'Thursday': 3, 'Friday': 4, 'Saturday': 5, 'Sunday': 6}

        # shift weeklist by today's weekday (monday=0 to sunday=6) to the right so week_list[0] = today's weekday
        week_list = [0, 1, 2, 3, 4, 5, 6]
        n = datetime.datetime.today().weekday()
        week_list = week_list = week_list[-n:] + week_list[:-n]

        weekday = week_list[weekday_dic[klass.day]]
        time = (klass.start_time.hour + klass.start_time.minute)/60.0
        
        return 100 * weekday + time

class ListStudioView(ListAPIView):
    serializer_class = StudioSerializer

    def get_queryset(self):
        if Studio.objects.exists():
            pk_list = Studio.objects.values_list('pk', flat=True)
            pk_list = sorted(pk_list, key=self.get_distance)
            preserved = Case(*[When(pk=pk, then=pos) for pos, pk in enumerate(pk_list)])

            queryset = Studio.objects.filter(pk__in=pk_list).order_by(preserved)

            name = self.request.GET.get('name')
            class_name = self.request.GET.get('class_name')
            coach = self.request.GET.get('coach')
            amenities = self.request.GET.get('amenities')

            if name and len(name) > 0:
                queryset = queryset.filter(name=name)
            if class_name and len(class_name) > 0:
                queryset = queryset.filter(klass__name=class_name).distinct()
            if coach and len(coach) > 0:
                queryset = queryset.filter(klass__coach=coach).distinct()
            if amenities and len(amenities) > 0:
                queryset = queryset.filter(amenities__name=amenities).distinct()
            return queryset
        return HttpResponse(status=404)
    
    def get_distance(self, pk) -> float:
        #got it from https://stackoverflow.com/questions/4913349/haversine-formula-in-python-bearing-and-distance-between-two-gps-points
        R = 3959.87433 # this is in miles.  For Earth radius in kilometers use 6372.8 km

        lat2 = float(Studio.objects.filter(pk=pk).first().latitude)
        lon2 = float(Studio.objects.filter(pk=pk).first().longitude)

        dLat = radians(lat2 - float(self.request.query_params.get('latitude')))
        dLon = radians(lon2 - float(self.request.query_params.get('longitude')))

        lat1 = radians(float(self.request.query_params.get('latitude')))
        lat2 = radians(lat2)

        a = sin(dLat/2)**2 + cos(lat1)*cos(lat2)*sin(dLon/2)**2
        c = 2*asin(sqrt(a))

        return R * c