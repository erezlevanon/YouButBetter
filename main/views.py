import json
import random

from django.http import HttpResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from decouple import config

import time
from .models import Topic

EXHIBIT = config('EXHIBIT', cast=bool)
if EXHIBIT:
    from control import controller


@csrf_exempt
def index(request):
    topics = Topic.objects
    context = {
        'topics': topics.all(),
    }
    if EXHIBIT:
        c = controller.Controller()
        c.dna_0_led.on()
        c.dna_1_led.on()
        c.tube_led.on()
        return render(request, 'main/interface.html', context)
    else:
        return render(request, 'main/mockup.html', context)


@csrf_exempt
def produce(request):
    if EXHIBIT:
        c = controller.Controller()
        c.dna_0_led.blink()
        c.dna_1_led.blink()
        c.tube_led.blink()

    time.sleep(10)

    if EXHIBIT:
        c.dna_0_led.off()
        c.dna_1_led.off()
        c.tube_led.on()

    return HttpResponse()


@csrf_exempt
def read_samples(request):
    if EXHIBIT:
        timeout = 60
        control = controller.Controller()
        dna_0 = control.dna_0_ms
        dna_1 = control.dna_1_ms
        led_0 = control.dna_0_led
        led_1 = control.dna_1_led

        led_0.blink()
        led_1.blink()
        start = time.time()
        while not (dna_0.read() and dna_1.read()):
            if dna_0.read():
                led_0.on()
            if dna_1.read():
                led_1.on()
            time.sleep(0.3)
            if time.time() - start > timeout:
                print("timeout")
                break
        led_0.on()
        led_1.on()
    return HttpResponse()


@csrf_exempt
def read_tube(request):
    if EXHIBIT:
        c = controller.Controller()
        c.tube_led.blink()
        start = time.time()
        timeout = 30
        while not (c.tube.read()):
            time.sleep(0.3)
            if time.time() - start > timeout:
                break
        c.tube_led.on()
    return HttpResponse()


@csrf_exempt
def read_tube_done(request):
    if EXHIBIT:
        print("IN DONE")
        c = controller.Controller()
        c.tube_led.blink()
        start = time.time()
        timeout = 60
        while c.tube.read():
            time.sleep(0.3)
            if time.time() - start > timeout:
                break
        c.tube_led.on()
    return HttpResponse()
