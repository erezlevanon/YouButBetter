from django.shortcuts import render

from control import controller


def index(request):
    c = controller.Controller()
    return render(request, 'main/interface.html')
