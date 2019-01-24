# Controls a single pump

import RPi.GPIO as GPIO


class Switch:
    def __init__(self, pin_number):
        self.__pin = pin_number
        self.__status = False
        GPIO.setmode(GPIO.BCM)
        GPIO.setup(self.__pin, GPIO.IN, pull_up_down=GPIO.PUD_UP)
        GPIO.add_event_detect(self.__pin, GPIO.FALLING, callback=self.change)

    def read(self):
        return self.__status

    def change(self, channel):
        if channel:
            if GPIO.input(channel):
                self.__status = False
            else:
                self.__status = True
