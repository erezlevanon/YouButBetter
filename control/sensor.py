# Controls a single pump

import RPi.GPIO as GPIO
import time


class Pump:

    __DURATION = 1

    def __init__(self, pin_number):
        self.__pin = pin_number
        GPIO.setmode(GPIO.BCM)
        GPIO.setup(self.__pin, GPIO.OUT, initial=GPIO.LOW)

    def run(self):
        GPIO.output(self.__pin, GPIO.HIGH)
        time.sleep(Pump.__DURATION)
        GPIO.output(self.__pin, GPIO.LOW)
