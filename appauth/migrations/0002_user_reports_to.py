# Generated by Django 3.1.2 on 2021-05-02 11:05

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('appauth', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='reports_to',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL),
        ),
    ]
