from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt

from control import controller
from control import motor


def index(request):
    return render(request, 'testing_page.html')


@csrf_exempt
def run(request):
    if request.method == 'POST':
        c = controller.Controller()
        if request.POST['machine'] == 'petri':
            c.petri_motor.run(motor.Motor.DIRECTION.CW, 128)
    return HttpResponseRedirect(reverse('testing:index'))
