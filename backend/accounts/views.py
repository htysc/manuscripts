from django.shortcuts import get_object_or_404
from rest_framework.generics import CreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.core.exceptions import PermissionDenied
from .serializers import UserSerializer
from django.contrib.auth.models import User

# Create your views here.
class UserCreateAPIView(CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = UserSerializer

class UserRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        user = get_object_or_404(User, id=self.kwargs['pk'])
        if user.id != self.request.user.id:
            raise PermissionDenied()
        return user
