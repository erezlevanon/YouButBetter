from django.db import models

MAX_DESC_LENGTH = 20


class Company(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name


class Topic(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Sale(models.Model):
    title = models.CharField(max_length=100)
    text = models.CharField(max_length=200, null=True)

    def __str__(self):
        return self.title


class Trait(models.Model):
    INTELLIGENCE = 'intelligence'
    HEIGHT = 'height'
    WEIGHT = 'weight'
    EMOTIONAL = 'emotional'
    LIFE_EXPECTANCY = 'life_expectancy'
    NONE = 'none'
    EFFECTS = (
        (INTELLIGENCE, INTELLIGENCE),
        (HEIGHT, HEIGHT),
        (WEIGHT, WEIGHT),
        (EMOTIONAL, EMOTIONAL),
        (LIFE_EXPECTANCY, LIFE_EXPECTANCY),
        (NONE, NONE),
    )

    title = models.CharField(max_length=100)
    description = models.CharField(max_length=500)
    price = models.DecimalField(max_digits=14, decimal_places=2)
    sale_price = models.DecimalField(max_digits=14, decimal_places=2, null=True)
    sale = models.ForeignKey(Sale, on_delete=models.CASCADE, null=True)
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE)
    effect = models.CharField(max_length=20, choices=EFFECTS, default=NONE)
    effect_val = models.IntegerField(default=0)
    effect_absolute = models.BooleanField(default=False)

    def __str__(self):
        suffix = ''
        if len(self.description) > MAX_DESC_LENGTH:
            suffix = '...'
        return self.title + ': ' + self.description[0:20] + suffix
