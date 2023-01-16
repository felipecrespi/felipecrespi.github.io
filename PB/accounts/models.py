from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
from calendar import mdays
# Create your models here.

class Profile(AbstractUser):
    # Install Pillow for image library
    avatar = models.ImageField(upload_to='profile_avatars/', null=True, blank=True)
    # taken from https://stackoverflow.com/questions/19130942/whats-the-best-way-to-store-a-phone-number-in-django-models
    phone = models.CharField(max_length=11, validators=[RegexValidator(regex=r'^\+?1?\d{9,15}$', message='Not a valid Phone numer')], blank=True)
    # A Profile can either be associated with No Subscription Plan or be associated with One Subscription Plan
    # If we choose to remove plan, set subscription to Null, without removing it from SubscriptionHistory

    # If User's subscription is Null, then cannot enroll in classes
    current_subscription = models.OneToOneField("Subscription", null=True, blank=True, on_delete= models.SET_NULL)
    card_info = models.CharField(max_length=19, blank=True, null=True)

class Plan(models.Model):
    YEARLY = ('Yearly', 'Yearly')
    MONTHLY =  ('Monthly','Monthly')
    WEEKLY = ('Weekly', 'Weekly')
    PLAN_OPTIONS = [YEARLY, MONTHLY, WEEKLY]

    name = models.CharField(primary_key = True, max_length= 200, unique=True, verbose_name = 'Plan')
    price = models.DecimalField(max_digits=10, decimal_places=2)
    billing_period = models.CharField(max_length = 7, choices = PLAN_OPTIONS)

    def __str__(self):
         return str(self.name)

class Subscription(models.Model):
    # A Profile can only have one Subscription Plan, but a Subscription Plan can be associated with many Subscriptions

    # a row in this model is equivalent to a made payment
    user = models.ForeignKey("Profile", on_delete=models.CASCADE)
    plan = models.ForeignKey(Plan, on_delete=models.CASCADE)
    date_of_purchase = models.DateTimeField() # 7 , 1 month , year
    next_payment = models.DateTimeField(null = True) # 7 , 1 month , year
    card_info = models.CharField(max_length=19)