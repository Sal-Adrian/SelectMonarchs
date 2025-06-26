from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader

from .models import Bet

def index(request):
    latest_bet_list = Bet.objects.order_by("-pub_date")[:5]
    output = ", ".join([b.bet_text for b in latest_bet_list])
    return HttpResponse(output)


def detail(request, bet_id):
    return HttpResponse("You're looking at bet %s." % bet_id)


def results(request, bet_id):
    response = "You're looking at the results of bet %s."
    return HttpResponse(response % bet_id)


def bet(request, bet_id):
    return HttpResponse("You're betting on bet %s." % bet_id)