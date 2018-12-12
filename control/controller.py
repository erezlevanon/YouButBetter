# Singleton class to control all physical elements of this project


class Controller:
    class __Controller:
        def __init__(self):
            pass;

    instance = None;

    def __init__(self):
        if not Controller.instance:
            Controller.instance = Controller.__Controller()

    def __getattr__(self, item):
        return getattr(self.instance, item)
