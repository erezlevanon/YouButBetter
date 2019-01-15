from django.http import HttpResponse
from django.shortcuts import render
from django.views.decorators.csrf import ensure_csrf_cookie

import time

from control import controller
from .models import Topic


@ensure_csrf_cookie
def index(request):
    topics = Topic.objects
    context = {
        'topics': topics.all(),
    }
    return render(request, 'main/interface.html', context)


def produce(request):
    c = controller.Controller()
    time.sleep(6)   # Todo: Create choreography.
    return HttpResponse()
