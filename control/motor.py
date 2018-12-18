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


    def __init__(self, name, pins):
        self.__motor = RpiMotorLib.BYJMotor(name, Motor.__TYPE)
        self.pins = pins

    def run(self, steps=512, direction=DIRECTION.CW):
        self.__motor.motor_run(self.pins, Motor.__WAIT_TIME, steps, direction.value, False, Motor.__STEP_TYPE)
