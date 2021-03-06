# Singleton class to control all physical elements of this project
import control.micro_switch as micro_switch
import control.motor as motor
import control.led as led
import control.physical_interfaces as phy
import time


class Controller:
    class __Controller:
        def __init__(self):
            self.name_to_interface = {}

            self.dna_0_ms = micro_switch.Switch(phy.DNA_0_MS.pins[0])
            self.name_to_interface[phy.DNA_0_MS.name] = self.dna_0_ms

            self.dna_1_ms = micro_switch.Switch(phy.DNA_1_MS.pins[0])
            self.name_to_interface[phy.DNA_1_MS.name] = self.dna_1_ms

            self.tube = micro_switch.Switch(phy.TUBE_MS.pins[0])
            self.name_to_interface[phy.TUBE_MS.name] = self.tube

            self.dna_0_led = led.Led(phy.DNA_0_LED.pins[0])
            self.dna_1_led = led.Led(phy.DNA_1_LED.pins[0])
            self.tube_led = led.Led(phy.TUBE_LED.pins[0])

    instance = None

    def __init__(self):
        if not Controller.instance:
            Controller.instance = Controller.__Controller()

    def __getattr__(self, item):
        return getattr(self.instance, item)
