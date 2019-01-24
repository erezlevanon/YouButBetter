# A file that defines the physical connections of this project


class PhysicalInterface:
    def __init__(self, name, display, pins):
        self.name = name
        self.display = display
        self.pins = pins


DNA_MS_0 = PhysicalInterface(
    'dna_0_microswitch',
    'DNA Sample 0 Present',
    [17],
)

DNA_MS_1 = PhysicalInterface(
    'dna_1_microswitch',
    'DNA Sample 1 Present',
    [27],
)

TUBE_MS = PhysicalInterface(
    'tube_microswitch',
    'Tube Present',
    [22],
)

TUBE_MOTOR = PhysicalInterface(
    'tube_motor',
    'Tube motor',
    [12, 16, 20, 21],
)


PHYSICAL_INTERFACES = [
    DNA_MS_0,
    DNA_MS_1,
    TUBE_MS,
]
