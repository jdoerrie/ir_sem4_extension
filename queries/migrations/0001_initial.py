# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Click',
            fields=[
                ('id', models.AutoField(serialize=False, verbose_name='ID', auto_created=True, primary_key=True)),
                ('current_url', models.TextField()),
                ('next_url', models.TextField()),
                ('timestamp', models.DateTimeField()),
            ],
        ),
        migrations.CreateModel(
            name='Hover',
            fields=[
                ('id', models.AutoField(serialize=False, verbose_name='ID', auto_created=True, primary_key=True)),
                ('text_under_cursor', models.TextField()),
                ('url', models.TextField()),
                ('location_x', models.IntegerField()),
                ('location_y', models.IntegerField()),
                ('timestamp', models.DateTimeField()),
            ],
        ),
        migrations.CreateModel(
            name='SearchQuery',
            fields=[
                ('id', models.AutoField(serialize=False, verbose_name='ID', auto_created=True, primary_key=True)),
                ('search_engine', models.TextField()),
                ('query', models.TextField()),
                ('timestamp', models.DateTimeField()),
            ],
        ),
        migrations.CreateModel(
            name='SearchResult',
            fields=[
                ('id', models.AutoField(serialize=False, verbose_name='ID', auto_created=True, primary_key=True)),
                ('title', models.TextField()),
                ('url', models.TextField()),
                ('description', models.TextField()),
                ('rank_in_query', models.IntegerField()),
                ('search_query', models.ForeignKey(to='queries.SearchQuery')),
            ],
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.AutoField(serialize=False, verbose_name='ID', auto_created=True, primary_key=True)),
                ('user_id', models.TextField(unique=True)),
                ('user_agent', models.TextField()),
            ],
        ),
        migrations.AddField(
            model_name='searchquery',
            name='user',
            field=models.ForeignKey(to='queries.User'),
        ),
        migrations.AddField(
            model_name='hover',
            name='user',
            field=models.ForeignKey(to='queries.User'),
        ),
        migrations.AddField(
            model_name='click',
            name='search_result',
            field=models.ForeignKey(blank=True, to='queries.SearchResult'),
        ),
        migrations.AddField(
            model_name='click',
            name='user',
            field=models.ForeignKey(to='queries.User'),
        ),
    ]
