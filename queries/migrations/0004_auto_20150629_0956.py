# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('queries', '0003_auto_20150628_2321'),
    ]

    operations = [
        migrations.RenameField(
            model_name='hover',
            old_name='text_under_cursor',
            new_name='text',
        ),
    ]
