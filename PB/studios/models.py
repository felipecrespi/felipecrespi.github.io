from django.db import models
from django.core.validators import RegexValidator

# Create your models here.
class Studio(models.Model):
    name = models.CharField(max_length=50, unique=True)
    address = models.CharField(max_length=200)
    latitude = models.DecimalField(max_digits=17, decimal_places=15)
    longitude = models.DecimalField(max_digits=17, decimal_places=15)
    postal_code = models.CharField(
        max_length=7,
        validators=[RegexValidator('^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$', ('Invalid postal code'))],
    )
    phone_num = models.CharField(
        max_length=20,
        validators=[RegexValidator('^\+?1?\d{9,15}$', ('Invalid phone number'))],
    )

    def __str__(self):
         return str(self.name)

class StudioImages(models.Model):
    img = models.ImageField()
    studio = models.ForeignKey(to=Studio, on_delete=models.CASCADE, related_name='images')

    class Meta:
        verbose_name = 'Studio\'s Images'
        verbose_name_plural = 'Studio\'s Images'

class Amenities(models.Model):
    name = models.CharField(max_length=100)
    quantity = models.PositiveIntegerField()
    studio = models.ForeignKey(to=Studio, on_delete=models.CASCADE, related_name='amenities')

    class Meta:
        verbose_name = 'Studio\'s Amenities'
        verbose_name_plural = 'Studio\'s Amenities'

    def __str__(self):
         return str(self.name)