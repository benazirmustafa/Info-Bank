# Generated by Django 3.1.2 on 2021-02-15 16:09

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('infobank', '0010_auto_20201019_1927'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='folder',
            options={'permissions': (('custom_folder', 'Custom folder'),)},
        ),
    ]
