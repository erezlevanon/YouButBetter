# A file that defines the physical connections of this project


class PhysicalInterface:
    def __init__(self, name, display, pins):
        self.name = name
        self.display = display
        self.pins = pins

# Micro switches
DNA_0_MS = PhysicalInterface(
    'dna_0_microswitch',
    'DNA Sample 0 Present',
    [17],
)

DNA_1__MS = PhysicalInterface(
    'dna_1_microswitch',
    'DNA Sample 1 Present',
    [27],
)

TUBE_MS = PhysicalInterface(
    'tube_microswitch',
    'Tube Present',
    [22],
)

# LEDs
DNA_0_LED = PhysicalInterface(
    'dna_0_led',
    'DNA Sample 0 LED',
    [13],
)

DNA_1_LED = PhysicalInterface(
    'dna_1_led',
    'DNA Sample 1 LED',
    [19],
)

TUBE_LED = PhysicalInterface(
    'tube_led',
    'DNA Sample 1 LED',
    [26],
)

# Stepper motors
DNA_0_MOTOR = PhysicalInterface(
    'dna_0_motor',
    'DNA Motor 0',
    [23, 18, 15, 14],
)

DNA_1_MOTOR = PhysicalInterface(
    'dna_1_motor',
    'DNA Motor 1',
    [7, 8, 25, 24],
)

TUBE_MOTOR = PhysicalInterface(
    'tube_motor',
    'Tube motor',
    [12, 16, 20, 21],
)


PHYSICAL_INTERFACES = [
    DNA_0_MS,
    DNA_0_LED,
    DNA_1__MS,
    DNA_1_LED,
    TUBE_MS,
    TUBE_MOTOR,
    TUBE_LED,
]
