import datetime
from calendar import mdays
from django.shortcuts import get_object_or_404
from rest_framework import serializers
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
from .models import Plan, Profile, Subscription


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['username', 'first_name', 'last_name', 'email', 'password', 'phone', 'avatar']

        def __str__(self):
            return self.username

    def update(self, instance, validated_data):
        try:
            instance.username = validated_data['username']
        except:
            pass
        try:
            instance.first_name=validated_data['first_name'] 
        except:
            pass
        try:
            instance.last_name=validated_data['last_name']
        except:
            pass
        try:
            instance.email =validated_data['email']
        except:
            pass
        try:
            instance.avatar = validated_data['avatar']
        except:
            pass
        try:
            instance.phone = validated_data['phone']
        except:
            pass
        try:
            instance.set_password(validated_data['password'])
        except:
            pass
        instance.save()
        return instance

class RegistrationSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(style={"input_type": "password"}, write_only=True)

    class Meta:
        model = Profile
        fields = ['username', 'first_name', 'last_name', 'email', 'avatar', 'phone', 'password', 'password2']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def save(self):
        user = Profile(username=self.validated_data['username'], 
        first_name=self.validated_data['first_name'], 
        last_name=self.validated_data['last_name'], 
        email =self.validated_data['email'], 
        avatar = self.validated_data['avatar'],
        phone = self.validated_data['phone']
        )
        password = self.validated_data['password']
        password2 = self.validated_data['password2']
        if password != password2:
            raise serializers.ValidationError({'password': 'Passwords must match.'})
        user.set_password(password)
        user.save()
        return user

class PlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plan
        fields = '__all__'
    
class SubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = [
            'id',
            'user',
            'plan',
            'date_of_purchase',
            'next_payment',
            'card_info',
        ]

class UpdateSubscriptionSerializer(serializers.ModelSerializer):
    card_info = serializers.CharField(allow_null=True)
    class Meta:
        model = Subscription
        fields = [
            'plan',
            'card_info',
        ]

class SubscriptionSaveSerializer(serializers.ModelSerializer):
    card_info = serializers.CharField(allow_null=True)
    class Meta:
        model = Subscription
        fields = ['plan','card_info']

    def save(self):
        plan_  = self.validated_data['plan']
        user  = self.context['request'].user
        date_of_purchase = datetime.now()

        if self.validated_data['card_info'] == None:
            # check user profile
            if user.card_info != "":
                card_info = user.card_info
            else:
                raise serializers.ValidationError({'error': 'User does not have a card associated with account.'})
        else:
            card_info = self.validated_data['card_info']

        if plan_.billing_period == 'Monthly':
            next_payment = date_of_purchase + timedelta(mdays[date_of_purchase.month])            
        if plan_.billing_period == 'Yearly':
            next_payment = date_of_purchase + relativedelta(years=1)
        if plan_.billing_period == 'Weekly':
            next_payment = date_of_purchase + datetime.timedelta(days = 7)            
        
        plan = Plan.objects.get(name=plan_)
        
        sub = Subscription(user = user, 
            date_of_purchase = date_of_purchase,
            next_payment=next_payment,
            card_info =card_info,
            plan = plan,
            )
        
        sub.save()
        user.current_subscription = sub 
        user.save()
        
        return sub
    
    