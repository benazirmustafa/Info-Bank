# Generated by Django 3.1.2 on 2021-05-02 09:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
        ('infobank', '0012_auto_20210215_2210'),
    ]

    operations = [
        migrations.CreateModel(
            name='Designation',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=100)),
                ('job_description', models.TextField(blank=True, max_length=5000, null=True)),
                ('group', models.ManyToManyField(to='auth.Group')),
            ],
        ),
    ]
