from django.contrib import admin

from .models import User, Hover, SearchQuery, SearchResult, Click
# Register your models here.
admin.site.register(User)
admin.site.register(Hover)
admin.site.register(SearchQuery)
admin.site.register(SearchResult)
admin.site.register(Click)
