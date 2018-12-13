# A file that defines the physical connections of this project
from enum import Enum


class MOTOR_TYPES(Enum):
    STEPPER = 1
    PUMP = 2

class PhysicalInterface:
    def __init__(self, name, display, type, pins):
        self.name = name
        self.display = display
        self.type = type
        self.pins = pins


PETRI_MOTOR = PhysicalInterface(
    'petri',
    'Petri Motor',
    MOTOR_TYPES.STEPPER,
    [2, 3, 4, 17]
)

ACTUATOR_0 = PhysicalInterface(
    'act0',
    'Needle Motor 0',
    MOTOR_TYPES.STEPPER,
    [6, 13, 19, 26]
)

ACTUATOR_1 = PhysicalInterface(
    'act1',
    'Needle Motor 1',
    MOTOR_TYPES.STEPPER,
    [18, 23, 24, 25]
)

ACTUATOR_2 = PhysicalInterface(
    'act2',
    'Needle Motor 2',
    MOTOR_TYPES.STEPPER,
    [27, 22, 5, 12]
)

PUMP_0 = PhysicalInterface(
    'pump0',
    'Pump 0',
    MOTOR_TYPES.PUMP,
    [21]
)

PUMP_1 = PhysicalInterface(
    'pump1',
    'Pump 1',
    MOTOR_TYPES.PUMP,
    [20]
)

PUMP_2 = PhysicalInterface(
    'pump2',
    'Pump 2',
    MOTOR_TYPES.PUMP,
    [16]
)

PHYSICAL_INTERFACES = [
    PETRI_MOTOR,
    PUMP_0,
    PUMP_1,
    PUMP_2,
    ACTUATOR_0,
    ACTUATOR_1,
    ACTUATOR_2,
]
