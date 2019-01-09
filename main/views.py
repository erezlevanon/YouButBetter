from django.shortcuts import render

from control import controller
from .models import Topic


def index(request):
    c = controller.Controller()
    topics = Topic.objects
    context = {
        'topics': topics.all(),
    }
    return render(request, 'main/interface.html', context)
