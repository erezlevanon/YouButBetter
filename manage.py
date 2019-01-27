#!/usr/bin/env python
import os
import sys
from signal import *
import RPi.GPIO as GPIO


def cleanup(signalnum, stack_trace):
    GPIO.cleanup()
    sys.stdout.write("youbutbetter: cleanup done.")
    sys.stderr.write("youbutbetter: cleanup done.")
    sys.exit(0)


if __name__ == '__main__':
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'v1.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc

    for sig in (SIGINT, SIGABRT, SIGTERM):
        signal(sig, cleanup)

    execute_from_command_line(sys.argv)
