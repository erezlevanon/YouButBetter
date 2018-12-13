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
        print(request.POST.get('choice'))
        c = controller.Controller()
        interface = c.name_to_interface[request.POST.get('choice')]
        if interface:
            print('testing ', request.POST.get('choice'), '.')
            interface.run()
    return HttpResponseRedirect(reverse('testing:index'))
