from django.urls import path

from . import views

app_name = 'testing'

urlpatterns = [
    path('', views.index, name='index'),
    path('run', views.run, name='run'),
    path('demo', views.demo, name='run'),
]
