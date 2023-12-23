from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import UserCreateAPIView, UserRetrieveUpdateDestroyAPIView

app_name='accounts'

urlpatterns = [
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('', UserCreateAPIView.as_view(), name='user_create'),
    path('<int:pk>/', UserRetrieveUpdateDestroyAPIView.as_view(), name='user_retrieve_update_destroy'),
]
