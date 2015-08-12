import datetime
import json
import logging
import random
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt

from .models import User, Hover, SearchQuery, SearchResult, Click, Topic


# Create your views here.
def index(request):
    return HttpResponse("Hello, World. You're at the queries index.")


def get_topic(request):
    topics = Topic.objects.all()
    min_use = min([t.num_used for t in topics])
    topic = random.choice([t for t in topics if t.num_used == min_use])
    topic.num_used += 1
    topic.save()
    return HttpResponse(topic.topic)


def selectors(request, engine):
    engine_selectors = {
        'google': {
            'searchBar':       '#sbtc',
            'searchForm':      '.cdr_frm input',
            'resultsEntry':    '#search li.g',
            'navbar':          '#nav',
            'currResultsPage': '#nav td.cur',
        },

        'bing': {
            'searchBar':       'div .b_searchboxForm',
            'searchForm':      '#sb_form_q',
            'resultsEntry':    '#b_results li.b_algo',
            'navbar':          '#b_results li.b_pag',
            'currResultsPage': '#b_results li.b_pag a.sb_pagS',
        },

        'yahoo': {
            'searchBar':       'form[role="search"]',
            'searchForm':      '#yschsp',
            'resultsEntry':    '.searchCenterMiddle div.algo',
            'navbar':          'div.compPagination',
            'currResultsPage': 'div.compPagination strong',
        },
    }

    return JsonResponse(engine_selectors.get(engine.lower(), {}))


@csrf_exempt
def post(request):
    logging.info(request)
    try:
        if not request.body:
            return HttpResponse("Wrong Entry.")

        body_decode = request.body.decode('utf-8')
        data = json.loads(body_decode)
        logging.info(data)
        for entry in data:
            # Get current User, create a new one if no user with the
            # current id exists
            user_id = entry["UserId"]
            users = User.objects.filter(user_id=user_id)
            if len(users) == 1:
                user = users[0]
            else:
                user = User(user_id=user_id, user_agent="")
                user.save()

            # JavaScript Date.now() returns milliseconds
            timestamp = entry.get("Timestamp", 0) / 1000
            timestamp = datetime.datetime.utcfromtimestamp(timestamp)
            event = entry.get("Event")

            if event == "UserAgent":
                user_agent = entry.get("UserAgent")
                user.user_agent = user_agent
                user.save()
                logging.info('Received UserAgent')

            elif event == "Hover":
                # Hover Fields in JavaScript:
                # 'Event': 'Hover',
                # 'URL': window.location.href,
                # 'Text': $(this).text(),
                # 'PageX': event.pageX,
                # 'PageY': event.pageY
                text = entry.get("Text")
                url = entry.get("URL")
                page_x = entry.get("PageX", 0)
                page_y = entry.get("PageY", 0)
                duration = entry.get("Duration", 0)
                delta = datetime.timedelta(milliseconds=duration)
                hover = Hover(text=text, url=url, page_x=page_x, page_y=page_y,
                              user=user, duration=delta, timestamp=timestamp)
                hover.save()
                logging.info("Received Hover")

            elif event == "Query":
                # Query Fields in JavaScript:
                # 'Event': 'Query',
                # 'Engine': engine,
                # 'Query': SERPTools.getQuery(),
                # 'Results': SERPTools.getResultsList()
                engine = entry.get("Engine")
                query = entry.get("Query")
                search_query = SearchQuery(engine=engine, query=query,
                                           user=user, timestamp=timestamp)
                search_query.save()
                logging.info("Received Search Query")
                results = entry.get("Results")
                for result in results:
                    # Result List Construction in JavaScript:
                    # resultsList.push({
                    #   'Rank': idx,
                    #   'Text': text,
                    #   'Link': href,
                    #   'Desc': href
                    # });
                    rank = result.get("Rank")
                    text = result.get("Text")
                    link = result.get("Link")
                    desc = result.get("Desc")
                    search_result = SearchResult(rank=rank,
                                                 text=text,
                                                 link=link,
                                                 desc=desc,
                                                 search_query=search_query)
                    search_result.save()
            elif event == "Click":
                # Click Fields in JavaScript:
                # 'Event': 'Click',
                # 'CurrURL': window.location.href,
                # 'PageX': event.pageX,
                # 'PageY': event.pageY,
                # 'Link': this.href,
                # 'Text': text
                url = entry.get("CurrURL")
                link = entry.get("Link")
                page_x = entry.get("PageX", 0)
                page_y = entry.get("PageY", 0)
                text = entry.get("Text")
                click = Click(url=url, link=link, page_x=page_x, page_y=page_y,
                              text=text, user=user, timestamp=timestamp)
                if "Rank" in entry:
                    rank = entry.get("Rank", 0)
                    search_results = SearchResult.objects.filter(
                        rank=rank, text=text, link=link,
                        search_query__user=user).order_by(
                            '-search_query__timestamp')
                    if len(search_results):
                        click.search_result = search_results[0]
                click.save()
                logging.info("Received Click")
                # In case we are procressing a SERPClick try to find reference
                # to the corresponding Search Result.

    except KeyError:
        return HttpResponse("Wrong Entry.")
    else:
        return HttpResponse("Correct Entry.")
