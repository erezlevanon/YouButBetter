# Controls a single pump

import RPi.GPIO as GPIO


class Led:
    __MIN = 0
    __MAX = 100

    def __init__(self, pin_number):
        self.__pin = pin_number
        GPIO.setmode(GPIO.BCM)
        GPIO.setup(self.__pin, GPIO.OUT, initial=GPIO.LOW)
        self.__pwm = GPIO.PWM(self.__pin, 100)
        self.__duty_cycle = Led.__MIN
        self.__sign = 1

    def start_pwm(self):
        self.__duty_cycle = Led.__MIN
        self.__sign = 1
        self.__pwm.start(Led.__MIN)

    def tick_pwm(self):
        self.__pwm.ChangeDutyCycle(self.__duty_cycle)
        self.__duty_cycle += 1 * self.__sign
        if self.__duty_cycle >= Led.__MAX or self.__duty_cycle <= Led.__MIN:
            self.__sign *= -1

    def stop_pwm(self):
        self.__pwm.stop()

    def on(self):
        GPIO.output(self.__pin, GPIO.HIGH)

    def off(self):
        GPIO.output(self.__pin, GPIO.LOW)
