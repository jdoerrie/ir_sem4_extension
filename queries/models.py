from django.db import models


# Anomymous User class, has a unique identifier and stores the user
# agent.
class User(models.Model):
    user_id = models.TextField(unique=True)
    user_agent = models.TextField()


# Hover class, logs every hover event. Keeps track of the text under
# the cursor, location on the webpage, the actual url, current user and
# timestamp.
class Hover(models.Model):
    text = models.TextField()
    url = models.TextField()
    page_x = models.IntegerField()
    page_y = models.IntegerField()
    user = models.ForeignKey(User)
    duration = models.DurationField()
    timestamp = models.DateTimeField()


# Search Query class, tracks search engine, search query, user and
# timestamp.
class SearchQuery(models.Model):
    engine = models.TextField()
    query = models.TextField()
    user = models.ForeignKey(User)
    timestamp = models.DateTimeField()


# Search Result, tracks rank, text and link of the result. In addition
# it points to the corresponding SearchQuery.
class SearchResult(models.Model):
    rank = models.IntegerField()
    text = models.TextField()
    link = models.TextField()
    desc = models.TextField()
    search_query = models.ForeignKey(SearchQuery)


# Click class, keeps track of current and next url, user and timestamp.
# Furthermore stores reference to the Search Result, if this url
# corresponds to one.
class Click(models.Model):
    url = models.TextField()
    link = models.TextField()
    page_x = models.IntegerField()
    page_y = models.IntegerField()
    text = models.TextField()
    search_result = models.ForeignKey(SearchResult, null=True, blank=True)
    user = models.ForeignKey(User)
    timestamp = models.DateTimeField()
