# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('queries', '0002_remove_user_user_agent'),
    ]

    operations = [
        migrations.RenameField(
            model_name='click',
            old_name='next_url',
            new_name='link',
        ),
        migrations.RenameField(
            model_name='click',
            old_name='current_url',
            new_name='url',
        ),
        migrations.RenameField(
            model_name='hover',
            old_name='location_x',
            new_name='page_x',
        ),
        migrations.RenameField(
            model_name='hover',
            old_name='location_y',
            new_name='page_y',
        ),
        migrations.AddField(
            model_name='click',
            name='page_x',
            field=models.IntegerField(default=0),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='click',
            name='page_y',
            field=models.IntegerField(default=0),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='click',
            name='text',
            field=models.TextField(default=''),
            preserve_default=False,
        ),
    ]
