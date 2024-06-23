# Generated by Django 3.2.25 on 2024-06-22 15:22

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('bobbavoca', '0002_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='card',
            name='created_date',
            field=models.DateField(default=django.utils.timezone.now),
        ),
        migrations.AlterField(
            model_name='category',
            name='bgColor',
            field=models.CharField(blank=True, max_length=30, null=True),
        ),
    ]
