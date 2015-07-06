from django.contrib import admin

from .models import User, Hover, SearchQuery, SearchResult, Click

length = 50


class UserAdmin(admin.ModelAdmin):
    fields = list_display = ('user_id', 'user_agent')


class HoverAdmin(admin.ModelAdmin):
    list_display = ('text', 'short_url', 'page_x', 'page_y', 'duration',
                    'get_user', 'timestamp')

    def short_url(self, obj):
        return obj.url[:length] + ('', '...')[len(obj.url) > length]

    def get_user(self, obj):
        return obj.user.user_id

    get_user.short_description = 'User'
    get_user.admin_order_field = 'user__user_id'


class SearchQueryAdmin(admin.ModelAdmin):
    list_display = ('query', 'engine', 'get_user', 'timestamp')

    def get_user(self, obj):
        return obj.user.user_id

    get_user.short_description = 'User'
    get_user.admin_order_field = 'user__user_id'


class SearchResultAdmin(admin.ModelAdmin):
    list_display = ('text', 'rank', 'short_link', 'short_desc',
                    'get_search_query')

    def short_desc(self, obj):
        return obj.desc[:length] + ('', '...')[len(obj.desc) > length]

    def short_link(self, obj):
        return obj.link[:length] + ('', '...')[len(obj.link) > length]

    def get_search_query(self, obj):
        return obj.search_query.query

    get_search_query.short_description = 'Search Query'
    get_search_query.admin_order_field = 'search_query__query'


class ClickAdmin(admin.ModelAdmin):
    list_display = ('short_link', 'short_url', 'page_x', 'page_y', 'text',
                    'search_query', 'rank',  'get_user', 'timestamp')

    def search_query(self, obj):
        if obj.search_result:
            return obj.search_result.search_query.query
        else:
            return "---"

    def rank(self, obj):
        if obj.search_result:
            return obj.search_result.rank
        else:
            return "---"

    def short_url(self, obj):
        return obj.url[:length] + ('', '...')[len(obj.url) > length]

    def short_link(self, obj):
        return obj.link[:length] + ('', '...')[len(obj.link) > length]

    def get_user(self, obj):
        return obj.user.user_id

    get_user.short_description = 'User'
    get_user.admin_order_field = 'user__user_id'

# Register your models here.
admin.site.register(User, UserAdmin)
admin.site.register(Hover, HoverAdmin)
admin.site.register(SearchQuery, SearchQueryAdmin)
admin.site.register(SearchResult, SearchResultAdmin)
admin.site.register(Click, ClickAdmin)
