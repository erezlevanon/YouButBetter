# Singleton class to control all physical elements of this project
from motor import Motor
import RPi.GPIO as GPIO


class Controller:
    class __Controller:
        def __init__(self):
            self.petri_motor = Motor('petri', 2, 3, 4, 17)
            pass

    instance = None

    def __init__(self):
        if not Controller.instance:
            Controller.instance = Controller.__Controller()

    def __getattr__(self, item):
        return getattr(self.instance, item)


if __name__ == "__main__":
    c = Controller()
    print(c.petri_motor)
    c.petri_motor.run(Motor.DIRECTION.CW, 100)
    GPIO.cleanup()
