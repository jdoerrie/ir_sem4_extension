# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('queries', '0006_auto_20150629_1030'),
    ]

    operations = [
        migrations.RenameField(
            model_name='searchresult',
            old_name='title',
            new_name='text',
        ),
        migrations.RemoveField(
            model_name='searchresult',
            name='description',
        ),
    ]
