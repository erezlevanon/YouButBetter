# Generated by Django 2.1.4 on 2019-01-17 19:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0004_trait_effect_val'),
    ]

    operations = [
        migrations.AddField(
            model_name='trait',
            name='effect_absolute',
            field=models.BooleanField(default=False),
        ),
    ]