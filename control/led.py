# Controls a single pump
import threading
import time

import RPi.GPIO as GPIO


class Led:
    __MIN = 0
    __MAX = 100

    def __init__(self, pin_number):
        self.__pin = pin_number
        GPIO.setmode(GPIO.BCM)
        GPIO.setup(self.__pin, GPIO.OUT, initial=GPIO.LOW)
        self.__pwm = GPIO.PWM(self.__pin, Led.__MAX)
        self.__duty_cycle = Led.__MIN
        self.__sign = 1
        self.__interval = 3
        self.__blink_active = False
        self.__blink_sleep = 0.05
        self.__blink_thread = None

    def start_pwm(self):
        self.__duty_cycle = Led.__MAX
        self.__sign = -1
        self.__pwm.start(Led.__MIN)

    def tick_pwm(self):
        self.__pwm.ChangeDutyCycle(self.__duty_cycle)
        self.__duty_cycle += 1 * self.__sign * self.__interval
        self.__duty_cycle = max(min(self.__duty_cycle, Led.__MAX), Led.__MIN)
        if self.__duty_cycle >= Led.__MAX or self.__duty_cycle <= Led.__MIN:
            self.__sign *= -1

    def stop_pwm(self):
        self.__pwm.stop()

    def on(self):
        self.stop_blink()
        GPIO.setwarnings(True)
        GPIO.output(self.__pin, GPIO.HIGH)
        GPIO.setwarnings(False)

    def off(self):
        if self.__blink_thread is not None:
            self.stop_blink()
        GPIO.output(self.__pin, GPIO.LOW)

    def blink(self):
        if self.__blink_thread is None:
            self.__blink_active = True
            self.__blink_thread = threading.Thread(target=self.__blink)
            self.__blink_thread.start()

    def stop_blink(self):
        if self.__blink_thread is not None:
            self.__blink_active = False
            self.__blink_thread.join()
            time.sleep(0.1)
            self.__blink_thread = None

    def __blink(self):
        self.start_pwm()
        while self.__blink_active:
            self.tick_pwm()
            time.sleep(self.__blink_sleep)
        self.stop_pwm()
