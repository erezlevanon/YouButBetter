from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('produce', views.produce, name='produce'),
    path('read_samples', views.read_samples, name='read_samples'),
    path('read_tube', views.read_tube, name='read_tube'),
]
