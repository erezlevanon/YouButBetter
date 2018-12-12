# Control a single motor
from RpiMotorLib import RpiMotorLib
from enum import Enum

class Motor:

    __TYPE = "28BYJ"
    __STEP_TYPE = "half"
    __WAIT_TIME = .001

    class DIRECTION(Enum):
        CW = False
        CCW = True


    def __init__(self, name, pin_1, pin_2, pin_3, pin_4):
        self.__motor = RpiMotorLib.BYJMotor(name, Motor.__TYPE)
        self.pins = [pin_1, pin_2, pin_3, pin_4]

    def run(self, direction, steps=512):
        self.__motor.motor_run(self.pins, Motor.__WAIT_TIME, steps, direction, False, Motor.__STEP_TYPE)
