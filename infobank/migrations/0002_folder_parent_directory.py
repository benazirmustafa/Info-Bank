# Generated by Django 3.1.2 on 2020-10-15 11:58

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('infobank', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='folder',
            name='parent_directory',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='infobank.folder'),
        ),
    ]
