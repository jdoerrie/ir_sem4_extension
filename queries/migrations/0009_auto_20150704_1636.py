# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from datetime import timedelta


class Migration(migrations.Migration):

    dependencies = [
        ('queries', '0008_auto_20150629_1122'),
    ]

    operations = [
        migrations.AddField(
            model_name='hover',
            name='duration',
            field=models.DurationField(default=timedelta(milliseconds=1)),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='searchresult',
            name='desc',
            field=models.TextField(default=''),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='user',
            name='user_agent',
            field=models.TextField(default=''),
            preserve_default=False,
        ),
    ]
