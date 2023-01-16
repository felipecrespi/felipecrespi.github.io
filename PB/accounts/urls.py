from django.urls import path
from accounts.views import CardView, PlanView, CancelSubscriptionView, PaymentHistoryView, ProfileView, SubscribeView, UpdateCardView, UpdateProfileView, RegisterProfileView, UpdateSubscriptionView
from rest_framework_simplejwt.views import (TokenObtainPairView, TokenRefreshView)
from rest_framework import routers

router = routers.DefaultRouter()
router.register("subscribe", SubscribeView, "SubscribeView")
app_name = 'accounts'

urlpatterns = [
    path('view/', ProfileView.as_view(), name="account"),
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('plans/', PlanView.as_view(), name="plan"),
    path('edit/', UpdateProfileView.as_view(), name='edit'),
    path('signup/', RegisterProfileView.as_view(), name='signup'),
    path('card_view/', CardView.as_view(), name='card_view'),
    path('card_update/', UpdateCardView.as_view(), name='card_update'),
    path('subscription_update/', UpdateSubscriptionView.as_view(), name='update_subscription'),
    path('subscription_cancel/', CancelSubscriptionView.as_view(), name='cancel_subscription'),
    path('payment_history/', PaymentHistoryView.as_view(), name='payment_history'),
]
urlpatterns= urlpatterns+router.urls