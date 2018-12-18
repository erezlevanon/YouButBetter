from django.shortcuts import render
from django.http import HttpResponse

from control import controller
from control import motor


def index(request):
    c = controller.Controller()
    return HttpResponse("Main Page!")
