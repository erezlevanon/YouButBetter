# Control a single motor
from RpiMotorLib import RpiMotorLib
from enum import Enum
import time
import threading


class Motor:
    __TYPE = "28BYJ"
    __STEP_TYPE = "half"
    __WAIT_TIME = .001

    __P_INTERVALS = 10

    class DIRECTION(Enum):
        CW = False
        CCW = True

    def __init__(self, name, pins):
        self.__motor = RpiMotorLib.BYJMotor(name, Motor.__TYPE)
        self.pins = pins

        # parallel vars
        self.__p_thread = None
        self.__p_direction = None
        self.__p_on = False

    def run(self, steps=512, direction=DIRECTION.CW):
        self.__motor.motor_run(self.pins, Motor.__WAIT_TIME, steps, direction.value, False, Motor.__STEP_TYPE)

    def __paraller_run(self):
        while self.__p_on:
            self.run(steps=Motor.__P_INTERVALS, direction=self.__p_direction)

    def start_parallel_run(self, direction=DIRECTION.CW):
        if self.__p_thread is None:
            self.__p_on = True
            self.__p_direction = direction
            self.__p_thread = threading.Thread(target=self.__paraller_run)
            self.__p_thread.start()

    def stop_parallel_run(self):
        if self.__p_thread is not None:
            self.__p_on = False
            self.__p_thread.join()
            time.sleep(0.2)
