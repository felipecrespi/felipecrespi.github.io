from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.generics import RetrieveAPIView, UpdateAPIView, CreateAPIView, ListAPIView
from .models import Plan, Profile, Subscription
from .serializers import PlanSerializer, ProfileSerializer, RegistrationSerializer, SubscriptionSaveSerializer, SubscriptionSerializer, UpdateSubscriptionSerializer
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
import datetime
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework import viewsets
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
from calendar import mdays
from django.http import JsonResponse
# Create your views here.

# Accounts Views

# Profile View not needed. just for testing
class ProfileView(RetrieveAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]
    def get_object(self):
        return self.request.user

class RegisterProfileView(CreateAPIView):
    serializer_class = RegistrationSerializer

class UpdateProfileView(UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ProfileSerializer
    def get_object(self):
        print(self.request.user.avatar)
        return self.request.user

# Subscription Views
class SubscribeView(viewsets.ModelViewSet):
    # Need to create a new subscription 
    # formdata chooses the plan, plan is chosen with plan_name
    # assign it to user
    serializer_class = SubscriptionSerializer
    queryset = Subscription.objects.filter()
    
    def get_serializer_class(self):
        if self.action == "create":    
            return SubscriptionSaveSerializer
        return SubscriptionSerializer

    def create(self, request, *args, **kwargs):
        if request.user.current_subscription != None:
            return Response({'error': 'User already has a current subscription'})

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response({"message": "subscribed to plan successfully"}, status=status.HTTP_201_CREATED, headers=headers)

class UpdateSubscriptionView(UpdateAPIView):
    # Update a user's existing subscription plan
    # (1) User must be authenticated using token
    permission_classes = [IsAuthenticated]
    serializer_class = UpdateSubscriptionSerializer
    # (2) User must have an existing credit card/debit card to subscribe
    # (3) User must already have a subscription plan
    def post(self, request):
        try:
            id = request.user.current_subscription.id
        except:
            return Response({"error": "Subscription doesn't exist for current user", "status": 404})

        plan = request.data.get("plan")
        card_info = request.data.get("card_info")
        
        if card_info == "" and request.user.card_info == "":
            return Response({"error": "User does not have a card associated with account.", "status": 404})

        if card_info == "":
            card_info = request.user.card_info

        try:
            Subscription.objects.get(id=id)    
        except:
            return Response({"error": "Subscription ID not exist", "status": 404})
        try:
          Plan.objects.get(pk=plan)    
        except:
            return Response({"error": "Plan ID not exist", "status": 404})
            
        subscription_obj = Subscription.objects.get(id=id)   
        plan = Plan.objects.get(pk=plan)
        subscription_obj.plan = plan
        subscription_obj.card_info = card_info

        subscription_obj.date_of_purchase = datetime.now()

        if subscription_obj.plan.billing_period == 'Monthly':
            next_payment = subscription_obj.date_of_purchase + timedelta(mdays[subscription_obj.date_of_purchase.month])            
        elif subscription_obj.plan.billing_period == 'Yearly':
           next_payment = subscription_obj.date_of_purchase + relativedelta(years=1)
        elif subscription_obj.plan.billing_period == 'Weekly':
            next_payment = subscription_obj.date_of_purchase + datetime.timedelta(days = 7)            

        subscription_obj.next_payment = next_payment

        subscription_obj.save()
        
        subscription_obj = Subscription.objects.get(id=id)   
        sub_ser = SubscriptionSerializer(subscription_obj)
        
        return Response(sub_ser.data)

class CancelSubscriptionView(UpdateAPIView):
    # Sets a user's existing subscription plan to null
    # (1) User must be authenticated using token
    permission_classes = [IsAuthenticated]
    serializer_class = SubscriptionSerializer
    # (2) User must already have a subscription plan
    def post(self, request):
        try:
            id = request.user.current_subscription.id
        except:
            return Response({"error": "Subscription doesn't exist for current user", "status": 404})
                

        id = request.user.current_subscription.id
        
        try:
            sub = Subscription.objects.get(id=id)    
        except:
            return Response({"error": "Subscription ,ID not exist", "status": 404})

        sub.next_payment = None
        sub.save()
        request.user.current_subscription = None
        request.user.save()
        
        return Response({'message':'subscription cancelled successfully'})

class CardView(APIView):
    # Update a user's current credit/debit card information 
    # Can set to blank, if blank, make sure future payment shows None
    # (1) User must be authenticated using token
    permission_classes = [IsAuthenticated]
    serializer_class = ProfileSerializer
    def get(self, request):
        card = request.user.card_info
        return JsonResponse({"current_card": card}, safe=False)

class UpdateCardView(APIView):
    # Update a user's current credit/debit card information 
    # Can set to blank, if blank, make sure future payment shows None
    # (1) User must be authenticated using token
    permission_classes = [IsAuthenticated]
    serializer_class = ProfileSerializer
    def post(self, request):
        card = request.data.get("card_info")
        request.user.card_info = card
        request.user.save()

        if card == '':
            return Response({'message':'Card removed successfully'})

        return Response({'message':'Card updated successfully'})

class PlanView(APIView):
    serializer_class = PlanSerializer
    def get(self, request):
        serializer = PlanSerializer(Plan.objects.all(), many=True)
        all_plans = serializer.data
        return Response({"plans": all_plans})

class PaymentHistoryView(APIView):
    # query for user in Subscription

    # Add a future payment variable on list: 
    # (1) User must be authenticated using token
    permission_classes = [IsAuthenticated]
    serializer_class = SubscriptionSerializer
    def get(self, request):
        user = request.user
        serializer = SubscriptionSerializer(Subscription.objects.filter(user=user), many=True)

        current_subscription_plan = SubscriptionSerializer(user.current_subscription).data
        total_payment_history = serializer.data

        return Response({"current_subscription": current_subscription_plan, "payment_history": total_payment_history})

def make_payments():
    today = datetime.date.today()
    due_today = Subscription.objects.filter(next_payment__date = today)

    for x in due_today:
        curr_user = x['user']
        curr_plan = x['plan']
        curr_next_payment = x['next_payment']
        
        if curr_user.card_info == "":
            continue

        if curr_plan.billing_period.value == 'Monthly':
            next_payment = curr_next_payment + timedelta(mdays[curr_next_payment.month])            
        if curr_plan.billing_period.value == 'Yearly':
           next_payment = curr_next_payment + relativedelta(years=1)
        if curr_plan.billing_period.value == 'Weekly':
            next_payment = curr_next_payment + datetime.timedelta(days = 7)            

        sub = Subscription(user = curr_user,
            date_of_purchase = datetime.now(),
            plan = curr_plan,
            next_payment = next_payment,
            card_info = curr_user.card_info)
        sub.save()
        curr_user.current_subscription = sub
        curr_user.save()

