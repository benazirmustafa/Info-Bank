# Generated by Django 3.1.2 on 2020-10-19 19:27

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('infobank', '0009_auto_20201019_1738'),
    ]

    operations = [
        migrations.RenameField(
            model_name='category',
            old_name='owner',
            new_name='owners',
        ),
        migrations.RenameField(
            model_name='folder',
            old_name='owner',
            new_name='owners',
        ),
    ]
