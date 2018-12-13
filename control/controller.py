# Singleton class to control all physical elements of this project
import control.motor as motor
import control.pump as pump
import RPi.GPIO as GPIO
import time


class Controller:
    class __Controller:
        def __init__(self):
            self.petri_motor = motor.Motor('petri', 2, 3, 4, 17)
            self.pump_1 = pump.Pump(14)
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
    c.petri_motor.run(motor.Motor.DIRECTION.CW, 128)
    time.sleep(0.3)
    c.petri_motor.run(motor.Motor.DIRECTION.CCW, 128)
    time.sleep(0.5)
    c.pump_1.run()
    GPIO.cleanup()
