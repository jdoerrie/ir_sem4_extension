# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('queries', '0004_auto_20150629_0956'),
    ]

    operations = [
        migrations.RenameField(
            model_name='searchquery',
            old_name='search_engine',
            new_name='engine',
        ),
        migrations.RenameField(
            model_name='searchresult',
            old_name='rank_in_query',
            new_name='rank',
        ),
    ]
