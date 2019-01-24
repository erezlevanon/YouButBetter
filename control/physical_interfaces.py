# A file that defines the physical connections of this project


class PhysicalInterface:
    def __init__(self, name, display, pins):
        self.name = name
        self.display = display
        self.pins = pins


DNA_MS_0 = PhysicalInterface(
    'dna_0',
    'DNA Sample 0 Present',
    [17],
)

DNA_MS_1 = PhysicalInterface(
    'dna_1',
    'DNA Sample 1 Present',
    [22],
)

TUBE_MS = PhysicalInterface(
    'tube',
    'Tube Present',
    [27],
)


PHYSICAL_INTERFACES = [
    DNA_MS_0,
    DNA_MS_1,
    TUBE_MS,
]
