from django.shortcuts import render
from django.http import HttpResponse
from django.shortcuts import get_list_or_404, get_object_or_404

from rest_framework.permissions import IsAuthenticated, BasePermission
from rest_framework.generics import RetrieveAPIView, ListAPIView, CreateAPIView, UpdateAPIView

from studios.serializers import StudioSerializer
from studios.models import Studio
from classes.serializers import KlassSerializer
from classes.models import Klass

import datetime

class EnrollPermission(BasePermission):
    message = ''
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            self.message = 'You need to log in to enroll in a class.'
            return False
        if Klass.objects.filter(user__in=[request.user], pk=request.resolver_match.kwargs.get('class_id')).exists():
            self.message = 'You are already enrolled.'
            return False
        klass = get_object_or_404(Klass, pk=request.resolver_match.kwargs.get('class_id'))
        if klass is None or klass.capacity - klass.user.all().count() <= 0:
            self.message = 'This class is full.'
            return False
        if request.user.current_subscription is None:
            self.message = 'You must have an active subscription to enroll.'
            return False
        return True

class DropoutPermission(BasePermission):
    message = ''
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            self.message = 'You need to log in to drop a class.'
            return False
        if not Klass.objects.filter(user__in=[request.user], pk=request.resolver_match.kwargs.get('class_id')).exists():
            self.message = 'You must be enrolled to drop a class.'
            return False
        return True

class EnrollAllPermission(BasePermission):
    message = ''
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            self.message = 'You need to log in to enroll in a class.'
            return False
        if request.user.current_subscription is None:
            self.message = 'You must have an active subscription to enroll.'
            return False
        main_klass = get_object_or_404(Klass, pk=request.resolver_match.kwargs.get('class_id'))
        klasses = Klass.objects.filter(name=main_klass.name, studio=main_klass.studio, day=main_klass.day, 
            start_time=main_klass.start_time, end_time=main_klass.end_time, date__gte=datetime.datetime.today())
        exist = False
        for klass in klasses:
            if not Klass.objects.filter(user__in=[request.user], pk=klass.id).exists():
                exist = True
            if not (klass.capacity - klass.user.all().count() > 0):
                self.message = 'At least one of the classes if full.'
                return False
        if not exist:
            self.message = 'You cannot enroll in a class twice.'
            return False
        return True

class DropoutAllPermission(BasePermission):
    message = ''
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            self.message = 'You need to log in to drop a class.'
            return False
        main_klass = get_object_or_404(Klass, pk=request.resolver_match.kwargs.get('class_id'))
        klasses = Klass.objects.filter(name=main_klass.name, studio=main_klass.studio, day=main_klass.day, 
            start_time=main_klass.start_time, end_time=main_klass.end_time, date__gte=datetime.datetime.today())
        print(klasses)
        for klass in klasses:
            if not Klass.objects.filter(user__in=[request.user], pk=klass.id).exists():
                self.message = 'You cannot drop a class that you are not currently enrolled in.'
                return False
        return True

# Create your views here.
class EnrollClassView(UpdateAPIView):
    serializer_class = KlassSerializer
    permission_classes = [EnrollPermission]

    def get_object(self):
        return get_object_or_404(Klass, pk=self.kwargs['class_id'])

    def update(self, request,  *args, **kwargs):
        klass = self.get_object()
        klass.user.add(self.request.user)
        return HttpResponse(status=200)

class EnrollAllClassesView(UpdateAPIView):
    serializer_class = KlassSerializer
    permission_classes = [EnrollAllPermission]

    def get_object(self):
        return get_object_or_404(Klass, id=self.kwargs['class_id'])

    def update(self, request,  *args, **kwargs):
        klasses = get_list_or_404(Klass, name=self.get_object().name, studio=self.get_object().studio, day=self.get_object().day, 
            start_time=self.get_object().start_time, end_time=self.get_object().end_time, date__gte=datetime.datetime.today())
        for klass in klasses:
            if request.user not in klass.user.all():
                klass.user.add(self.request.user)
        return HttpResponse(status=200)

class DropClassView(UpdateAPIView):
    serializer_class = KlassSerializer
    permission_classes = [DropoutPermission]

    def get_object(self):
        return get_object_or_404(Klass, id=self.kwargs['class_id'])

    def update(self, request,  *args, **kwargs):
        klass = self.get_object()
        klass.user.remove(self.request.user)
        klass.save()
        return HttpResponse(status=200)

class DropAllClassesView(UpdateAPIView):
    serializer_class = KlassSerializer
    permission_classes = [DropoutAllPermission]

    def get_object(self):
        return get_object_or_404(Klass, id=self.kwargs['class_id'])

    def update(self, request,  *args, **kwargs):
        klasses = get_list_or_404(Klass, name=self.get_object().name, studio=self.get_object().studio, day=self.get_object().day, 
            start_time=self.get_object().start_time, end_time=self.get_object().end_time, date__gte=datetime.datetime.today())
        for klass in klasses:
            klass.user.remove(self.request.user)
        return HttpResponse(status=200)


class ListClassHistoryView(ListAPIView):
    serializer_class = KlassSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        classes = Klass.objects.filter(user=self.request.user)
        return classes