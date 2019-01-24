import json
import random

from django.http import HttpResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt

import time

from control import controller, motor
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
    tube_motor = c.tube_motor
    step_offset = 0
    direction = motor.Motor.DIRECTION.CCW
    data = json.loads(request.body.decode())
    for topic in data["traits_by_topic"]:
        for trait in topic[1]:
            cur_step = random.randint(50, 400)
            tube_motor.run(cur_step, direction)

            if direction == motor.Motor.DIRECTION.CCW:
                step_sign = 1
                direction = motor.Motor.DIRECTION.CW
            else:
                step_sign = -1
                direction = motor.Motor.DIRECTION.CCW
            step_offset += step_sign * cur_step
    if step_offset > 0:
        tube_motor.run(step_offset, motor.Motor.DIRECTION.CW)
    elif step_offset < 0:
        tube_motor.run(-step_offset, motor.Motor.DIRECTION.CCW)
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
