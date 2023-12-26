from django.shortcuts import get_object_or_404
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated
from django.core.exceptions import PermissionDenied
from .serializers import ManuscriptSerializer, PageSerializer
from .models import Manuscript, Page

# Create your views here.
class ManuscriptListCreateAPIView(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ManuscriptSerializer

    def get_queryset(self):
        return Manuscript.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        Manuscript.objects.create(**serializer.validated_data, user=self.request.user)

class ManuscriptRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ManuscriptSerializer

    def get_object(self):
        manuscript = get_object_or_404(Manuscript, id=self.kwargs['manuscript'])
        if manuscript.user.id != self.request.user.id:
            raise PermissionDenied()
        return manuscript

class PageListCreateAPIView(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PageSerializer

    def get_queryset(self):
        return Page.objects.filter(manuscript=self.kwargs['manuscript']).order_by('number', 'id')

    def perform_create(self, serializer):
        manuscript = get_object_or_404(Manuscript, id=self.kwargs['manuscript'])
        Page.objects.create(**serializer.validated_data, manuscript=manuscript)

class PageRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PageSerializer

    def get_object(self):
        page = get_object_or_404(Page, id=self.kwargs['page'], manuscript=self.kwargs['manuscript'])
        if page.manuscript.user.id != self.request.user.id:
            raise PermissionDenied()
        return page
