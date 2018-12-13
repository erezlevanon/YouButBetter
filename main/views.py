from django.shortcuts import render
from django.http import HttpResponse

from control import controller
from control import motor

def index(request):
    c = controller.Controller()
    c.petri_motor.run(motor.Motor.DIRECTION.CW, 128)
    return HttpResponse("Motor spins!")
