# Generated by Django 3.1.2 on 2020-10-18 07:22

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('infobank', '0006_auto_20201015_1854'),
    ]

    operations = [
        migrations.AddField(
            model_name='file',
            name='category',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='infobank.category'),
        ),
    ]
