# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('queries', '0005_auto_20150629_1016'),
    ]

    operations = [
        migrations.RenameField(
            model_name='searchresult',
            old_name='url',
            new_name='link',
        ),
    ]
