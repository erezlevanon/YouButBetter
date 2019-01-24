# Singleton class to control all physical elements of this project
import control.micro_switch as micro_switch
import control.motor as motor
import control.physical_interfaces as phy
import time


class Controller:
    class __Controller:
        def __init__(self):
            self.name_to_interface = {}

            self.dna_0 = micro_switch.Switch(phy.DNA_MS_0.pins[0])
            self.name_to_interface[phy.DNA_MS_0.name] = self.dna_0

            self.dna_1 = micro_switch.Switch(phy.DNA_MS_1.pins[0])
            self.name_to_interface[phy.DNA_MS_1.name] = self.dna_1

            self.tube = micro_switch.Switch(phy.TUBE_MS.pins[0])
            self.name_to_interface[phy.TUBE_MS.name] = self.tube

            self.tube_motor = motor.Motor(
                phy.TUBE_MOTOR.name,
                phy.TUBE_MOTOR.pins
            )
            self.name_to_interface[phy.TUBE_MOTOR.name] = self.tube_motor

    instance = None

    def __init__(self):
        if not Controller.instance:
            Controller.instance = Controller.__Controller()

    def __getattr__(self, item):
        return getattr(self.instance, item)
