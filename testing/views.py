from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt

from control import controller, motor, physical_interfaces


def index(request):
    return render(request, 'testing_page.html', {'phy': physical_interfaces.PHYSICAL_INTERFACES})


@csrf_exempt
def run(request):
    if request.method == 'POST':
        c = controller.Controller()
        interface = c.name_to_interface[request.POST.get('choice')]
        if interface:
            print('testing ', request.POST.get('choice'), '.')
            interface.run()
    return HttpResponseRedirect(reverse('testing:index'))


@csrf_exempt
def demo(request):
    if request.method == 'POST':
        c = controller.Controller()
        petri = c.name_to_interface['petri']
        needle = c.name_to_interface['act0']
        pump = c.name_to_interface['pump0']
        petri.run(200, motor.Motor.DIRECTION.CW)
        petri.run(30, motor.Motor.DIRECTION.CCW)
        needle.run(90, motor.Motor.DIRECTION.CW)
        pump.run()
        needle.run(90, motor.Motor.DIRECTION.CCW)
        petri.run(100, motor.Motor.DIRECTION.CW)
        petri.run(30, motor.Motor.DIRECTION.CCW)
        needle.run(90, motor.Motor.DIRECTION.CW)
        pump.run()
        needle.run(90, motor.Motor.DIRECTION.CCW)
        petri.run(200, motor.Motor.DIRECTION.CCW)
        petri.run(30, motor.Motor.DIRECTION.CW)
        needle.run(90, motor.Motor.DIRECTION.CW)
        pump.run()
        needle.run(90, motor.Motor.DIRECTION.CCW)
        petri.run(100, motor.Motor.DIRECTION.CW)
    return HttpResponseRedirect(reverse('testing:index'))
