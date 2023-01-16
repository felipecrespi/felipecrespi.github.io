from rest_framework import serializers

from accounts.serializers import ProfileSerializer
from classes.models import Klass

from collections import OrderedDict

class KlassSerializer(serializers.ModelSerializer):
    user = ProfileSerializer(many=True)

    class Meta:
        model = Klass
        fields = ['id', 'name', 'description', 'coach', 'capacity', 'keywords', 'studio', 'day', 'start_time', 'end_time', 'end_recursion', 'user', 'date']
    
    def to_representation(self, value):
        '''Don't serialize empty fields'''
        repr_dict = super(KlassSerializer, self).to_representation(value)
        return OrderedDict((k, v) for k, v in repr_dict.items() 
                           if v not in [None, [], '', {}])