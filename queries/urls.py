from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^index/?$', views.index, name='index'),
    url(r'^post/?$',  views.post,  name='post'),
    url(r'^get/topic/?$', views.get_topic, name='topic'),
    url(r'^get/selectors/(?P<engine>\w+)/?$',  views.selectors,
        name='selectors'),
]
