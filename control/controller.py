# Singleton class to control all physical elements of this project
import control.motor as motor
import control.pump as pump
import control.physical_interfaces as phy
import RPi.GPIO as GPIO
import time


class Controller:
    class __Controller:
        def __init__(self):
            self.petri_motor = motor.Motor(
                phy.PETRI_MOTOR.name,
                phy.PETRI_MOTOR.pins
            )
            self.act_0 = motor.Motor(
                phy.ACTUATOR_0.name,
                phy.ACTUATOR_0.pins,
            )
            self.act_1 = motor.Motor(
                phy.ACTUATOR_1.name,
                phy.ACTUATOR_1.pins,
            )
            self.act_2 = motor.Motor(
                phy.ACTUATOR_2.name,
                phy.ACTUATOR_2.pins,
            )
            self.pump_0 = pump.Pump(phy.PUMP_0.pins[0])
            self.pump_1 = pump.Pump(phy.PUMP_1.pins[0])
            self.pump_2 = pump.Pump(phy.PUMP_2.pins[0])

    instance = None

    def __init__(self):
        if not Controller.instance:
            Controller.instance = Controller.__Controller()

    def __getattr__(self, item):
        return getattr(self.instance, item)


if __name__ == "__main__":
    c = Controller()
    c.petri_motor.run(motor.Motor.DIRECTION.CW, 128)
    time.sleep(0.3)
    c.petri_motor.run(motor.Motor.DIRECTION.CCW, 128)
    time.sleep(0.5)
    c.pump_0.run()
    GPIO.cleanup()
