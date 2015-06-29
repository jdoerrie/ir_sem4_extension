# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('queries', '0007_auto_20150629_1036'),
    ]

    operations = [
        migrations.AlterField(
            model_name='click',
            name='search_result',
            field=models.ForeignKey(null=True, blank=True, to='queries.SearchResult'),
        ),
    ]
