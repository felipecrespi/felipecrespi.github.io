from rest_framework import serializers

from studios.models import Studio, StudioImages, Amenities
from classes.serializers import KlassSerializer

class StudioImagesSerializer(serializers.ModelSerializer):

    class Meta:
        model = StudioImages
        fields = ['img']

class AmenitiesSerializer(serializers.ModelSerializer):

    class Meta:
        model = Amenities
        fields = ['name', 'quantity']

class StudioSerializer(serializers.ModelSerializer):
    klass = KlassSerializer(many=True)
    images = StudioImagesSerializer(many=True)
    amenities = AmenitiesSerializer(many=True)

    class Meta:
        model = Studio
        fields = ['id', 'name', 'address', 'longitude', 'latitude', 'postal_code', 'phone_num', 'images', 'klass', 'amenities']