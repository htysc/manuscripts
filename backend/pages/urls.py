from django.urls import path
from .views import ManuscriptListCreateAPIView, ManuscriptRetrieveUpdateDestroyAPIView, PageListCreateAPIView, PageRetrieveUpdateDestroyAPIView

app_name='pages'

urlpatterns = [
    path('', ManuscriptListCreateAPIView.as_view(), name='manuscript_list_create'),
    path('<int:manuscript>/', ManuscriptRetrieveUpdateDestroyAPIView.as_view(), name='manuscript_retrieve_update_destroy'),
    path('<int:manuscript>/pages/', PageListCreateAPIView.as_view(), name='page_list_create'),
    path('<int:manuscript>/pages/<int:page>/', PageRetrieveUpdateDestroyAPIView.as_view(), name='page_retrieve_update_destroy'),
]
