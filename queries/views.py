import datetime
import json
import logging
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt

from .models import User, Hover, SearchQuery, SearchResult, Click


# Create your views here.
def index(request):
    return HttpResponse("Hello, World. You're at the queries index.")


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
    try:
        if not request.body:
            return HttpResponse("Wrong Entry.")

        body_decode = request.body.decode('utf-8')
        data = json.loads(body_decode)
        for entry in data:
            # Get current User, create a new one if no user with the
            # current id exists
            user_id = entry["UserId"]
            users = User.objects.filter(user_id=user_id)
            if len(users) == 1:
                user = users[0]
            else:
                user = User(user_id=user_id)
                user.save()

            # JavaScript Date.now() returns milliseconds
            timestamp = float(entry.get("Timestamp", "0")) / 1000
            timestamp = datetime.datetime.utcfromtimestamp(timestamp)
            event = entry.get("Event")

            if event == "Hover":
                # Hover Fields in JavaScript:
                # 'Event': 'Hover',
                # 'URL': window.location.href,
                # 'Text': $(this).text(),
                # 'PageX': event.pageX,
                # 'PageY': event.pageY
                text = entry.get("Text")
                url = entry.get("URL")
                page_x = int(entry.get("PageX", "0"))
                page_y = int(entry.get("PageY", "0"))
                hover = Hover(text=text, url=url, page_x=page_x, page_y=page_y,
                              user=user, timestamp=timestamp)
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
                    #   'Link': href
                    # });
                    rank = result.get("Rank")
                    text = result.get("Text")
                    link = result.get("Link")
                    search_result = SearchResult(rank=rank,
                                                 text=text,
                                                 link=link,
                                                 search_query=search_query)
                    search_result.save()
            elif event.endswith("Click"):
                # SERPClick Fields in JavaScript:
                # 'Event': "SERPClick",
                # 'CurrURL': window.location.href,
                # 'PageX': event.pageX,
                # 'PageY': event.pageY,
                # 'Link': href,
                # 'Text': text,
                # 'Rank': idx

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
                # In case we are procressing a SERPClick try to find reference
                # to the corresponding Search Result.
                if event == 'SERPClick':
                    rank = entry.get("Rank", 0)
                    search_results = SearchResult.objects.filter(
                        rank=rank, text=text, link=link,
                        search_query__user=user).order_by(
                            '-search_query__timestamp')
                    if len(search_results):
                        click.search_result = search_results[0]
                click.save()
                logging.info("Received Click")

    except KeyError:
        return HttpResponse("Wrong Entry.")
    else:
        return HttpResponse("Correct Entry.")
