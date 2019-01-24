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


@csrf_exempt
def read_samples(request):
    control = controller.Controller()
    dna_0 = control.dna_0
    dna_1 = control.dna_1
    start = time.time()
    timeout = 15
    while not (dna_0.read() and dna_1.read()):
        time.sleep(0.3)
        if time.time() - start > timeout:
            print("timeout")
            return HttpResponse(408)
    print("good")
    return HttpResponse()


@csrf_exempt
def read_tube(request):
    # Todo: Create choreography.
    control = controller.Controller()
    start = time.time()
    timeout = 15
    while not (control.tube.read()):
        time.sleep(0.3)
        if time.time() - start > timeout:
            return HttpResponse(408)
    return HttpResponse()

@csrf_exempt
def read_tube_done(request):
    control = controller.Controller()
    start = time.time()
    timeout = 6
    while control.tube.read():
        time.sleep(0.3)
        if time.time() - start > timeout:
            return HttpResponse(408)
    return HttpResponse()
