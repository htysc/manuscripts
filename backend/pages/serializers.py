from rest_framework import serializers
from .models import Manuscript, Page
from accounts.serializers import UserSerializer

class ManuscriptSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Manuscript
        fields = '__all__'

class PageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Page
        fields = '__all__'
        read_only_fields = ('manuscript',)
