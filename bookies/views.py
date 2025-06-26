from django.db.models import F
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import get_object_or_404, render
from django.urls import reverse

from .models import Choice, Bet

def index(request):
    latest_bet_list = Bet.objects.order_by("-pub_date")[:5]
    context = {"latest_bet_list": latest_bet_list}
    return render(request, "bookies/index.html", context)


def detail(request, bet_id):
    bet = get_object_or_404(Bet, pk=bet_id)
    return render(request, "bookies/detail.html", {"bet": bet})


def results(request, bet_id):
    bet = get_object_or_404(Bet, pk=bet_id)
    return render(request, "bookies/results.html", {"bet": bet})


def bet(request, bet_id):
    bet = get_object_or_404(Bet, pk=bet_id)
    try:
        selected_choice = bet.choice_set.get(pk=request.POST["choice"])
    except (KeyError, Choice.DoesNotExist):
        return render(
            request,
            "bookies/detail.html",
            {
                "bet": bet,
                "error_message": "You didn't select a choice.",
            },
        )
    else:
        selected_choice.amount = F("amount") + 1
        selected_choice.save()

        return HttpResponseRedirect(reverse("bookies:results", args=(bet.id,)))