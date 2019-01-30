# Controls a single pump

import RPi.GPIO as GPIO


class Switch:
    def __init__(self, pin_number):
        self.__pin = pin_number
        GPIO.setmode(GPIO.BCM)
        GPIO.setup(self.__pin, GPIO.IN, pull_up_down=GPIO.PUD_UP)

    def read(self):
        res = not GPIO.input(self.__pin)
        print(str(self.__pin) + ': ' + str(res))
        return res
