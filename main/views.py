from django.http import HttpResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt

import time

from control import controller
from .models import Topic


@csrf_exempt
def index(request):
    topics = Topic.objects
    context = {
        'topics': topics.all(),
    }
    return render(request, 'main/interface.html', context)


@csrf_exempt
def produce(request):
    c = controller.Controller()
    time.sleep(6)   # Todo: Create choreography.
    return HttpResponse()
