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
    c = controller.Controller()
    c.dna_0_led.on()
    c.dna_1_led.on()
    c.tube_led.on()
    topics = Topic.objects
    context = {
        'topics': topics.all(),
    }
    return render(request, 'main/interface.html', context)


@csrf_exempt
def produce(request):
    c = controller.Controller()
    c.dna_0_led.blink()
    c.dna_1_led.blink()
    c.tube_led.blink()
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

    c.dna_0_led.off()
    c.dna_1_led.off()
    c.tube_led.on()

    return HttpResponse()


@csrf_exempt
def read_samples(request):
    timeout = 15

    control = controller.Controller()
    dna_0 = control.dna_0_ms
    dna_1 = control.dna_1_ms
    led_0 = control.dna_0_led
    led_1 = control.dna_1_led
    motor_0 = control.dna_0_motor
    motor_1 = control.dna_1_motor

    led_0.blink()
    led_1.blink()
    motor_0.start_parallel_run()
    motor_1.start_parallel_run()
    start = time.time()
    while not (dna_0.read() and dna_1.read()):
        if dna_0.read():
            led_0.on()
            motor_0.stop_parallel_run()
        if dna_1.read():
            led_1.on()
            motor_1.stop_parallel_run()
        time.sleep(0.3)
        if time.time() - start > timeout:
            print("timeout")
            break
    led_0.on()
    led_1.on()
    motor_0.stop_parallel_run()
    motor_1.stop_parallel_run()
    return HttpResponse()


@csrf_exempt
def read_tube(request):
    c = controller.Controller()
    c.tube_led.blink()
    start = time.time()
    timeout = 15
    while not (c.tube.read()):
        time.sleep(0.3)
        if time.time() - start > timeout:
            break
    c.tube_led.on()
    return HttpResponse()


@csrf_exempt
def read_tube_done(request):
    c = controller.Controller()
    c.tube_led.blink()
    start = time.time()
    timeout = 15
    while c.tube.read():
        time.sleep(0.3)
        if time.time() - start > timeout:
            break
    c.tube_led.on()
    return HttpResponse()
