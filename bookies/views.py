from django.db.models import F
from django.http import HttpResponseRedirect
from django.shortcuts import get_object_or_404, render
from django.urls import reverse
from django.utils import timezone
from django.views import generic

from .models import Choice, Bet

class IndexView(generic.ListView):
    template_name = "bookies/index.html"
    context_object_name = "latest_bet_list"

    def get_queryset(self):
        """
        Return the last five published bets (not including those set to be
        published in the future).
        """
        return Bet.objects.filter(pub_date__lte=timezone.now()).order_by("-pub_date")[:5]


class DetailView(generic.DetailView):
    model = Bet
    template_name = "bookies/detail.html"

    def get_queryset(self):
        """
        Excludes any bets that aren't published yet.
        """
        return Bet.objects.filter(pub_date__lte=timezone.now())


class ResultsView(generic.DetailView):
    model = Bet
    template_name = "bookies/results.html"

    def get_queryset(self):
        """
        Excludes any bets that aren't published yet.
        """
        return Bet.objects.filter(pub_date__lte=timezone.now())


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