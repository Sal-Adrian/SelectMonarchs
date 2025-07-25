import datetime

from django.shortcuts import get_object_or_404
from django.test import TestCase
from django.urls import reverse
from django.utils import timezone

from .models import Bet, Choice


def create_bet(bet_text, days):
    """
    Create a bet with the given `bet_text` and published the
    given number of `days` offset to now (negative for bets published
    in the past, positive for bets that have yet to be published).
    """
    time = timezone.now() + datetime.timedelta(days=days)
    return Bet.objects.create(bet_text=bet_text, pub_date=time)

def create_choice(bet_id, choice_text, amount):
    """
    Make a bet on an existing offer (bet_id) and published the
    amount that was bet.
    """
    bet = get_object_or_404(Bet, pk=bet_id)
    return Choice.objects.create(bet=bet, choice_text=choice_text, amount=amount)


class BetModelTests(TestCase):
    def test_was_published_recently_with_future_bet(self):
        """
        was_published_recently() returns False for bets whose pub_date
        is in the future.
        """
        time = timezone.now() + datetime.timedelta(days=30)
        future_bet = Bet(pub_date=time)
        self.assertIs(future_bet.was_published_recently(), False)

    def test_was_published_recently_with_old_bet(self):
        """
        was_published_recently() returns False for bets whose pub_date
        is older than 1 day.
        """
        time = timezone.now() - datetime.timedelta(days=1, seconds=1)
        old_bet = Bet(pub_date=time)
        self.assertIs(old_bet.was_published_recently(), False)


    def test_was_published_recently_with_recent_bet(self):
        """
        was_published_recently() returns True for bets whose pub_date
        is within the last day.
        """
        time = timezone.now() - datetime.timedelta(hours=23, minutes=59, seconds=59)
        recent_bet = Bet(pub_date=time)
        self.assertIs(recent_bet.was_published_recently(), True)


class BetIndexViewTests(TestCase):
    def test_no_bets(self):
        """
        If no bets exist, an appropriate message is displayed.
        """
        response = self.client.get(reverse("bookies:index"))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "No bets are available.")
        self.assertQuerySetEqual(response.context["latest_bet_list"], [])

    def test_past_bet(self):
        """
        Bets with a pub_date in the past are displayed on the
        index page.
        """
        bet = create_bet(bet_text="Past bet.", days=-30)
        response = self.client.get(reverse("bookies:index"))
        self.assertQuerySetEqual(
            response.context["latest_bet_list"],
            [bet],
        )

    def test_future_bet(self):
        """
        Bets with a pub_date in the future aren't displayed on
        the index page.
        """
        create_bet(bet_text="Future bet.", days=30)
        response = self.client.get(reverse("bookies:index"))
        self.assertContains(response, "No bets are available.")
        self.assertQuerySetEqual(response.context["latest_bet_list"], [])

    def test_future_bet_and_past_bet(self):
        """
        Even if both past and future bets exist, only past bets
        are displayed.
        """
        bet = create_bet(bet_text="Past bet.", days=-30)
        create_bet(bet_text="Future bet.", days=30)
        response = self.client.get(reverse("bookies:index"))
        self.assertQuerySetEqual(
            response.context["latest_bet_list"],
            [bet],
        )

    def test_two_past_bets(self):
        """
        The bets index page may display multiple bets.
        """
        bet1 = create_bet(bet_text="Past bet 1.", days=-30)
        bet2 = create_bet(bet_text="Past bet 2.", days=-5)
        response = self.client.get(reverse("bookies:index"))
        self.assertQuerySetEqual(
            response.context["latest_bet_list"],
            [bet2, bet1],
        )

    def test_placed_bets(self):
        """
        The index view of a bet displays the existing bets and 
        the amounts placed on it.
        """
        bet = create_bet(bet_text="New Bet.", days=0)
        choice1 = create_choice(bet_id=bet.id, choice_text="Yes", amount=104)
        choice2 = create_choice(bet_id=bet.id, choice_text="No", amount=73)

        response = self.client.get(reverse("bookies:index"))

        self.assertContains(response, choice1.choice_text)
        self.assertContains(response, choice1.amount)
        self.assertContains(response, choice2.choice_text)
        self.assertContains(response, choice2.amount)


class BetDetailViewTests(TestCase):
    def test_future_bet(self):
        """
        The detail view of a bet with a pub_date in the future
        returns a 404 not found.
        """
        future_bet = create_bet(bet_text="Future bet.", days=5)
        url = reverse("bookies:detail", args=(future_bet.id,))
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)

    def test_past_bet(self):
        """
        The detail view of a bet with a pub_date in the past
        displays the bet's text, the bets made, and the amounts
        placed on it.
        """
        past_bet = create_bet(bet_text="Past bet.", days=-5)
        choice1 = create_choice(bet_id=past_bet.id, choice_text="Yes", amount=104)
        choice2 = create_choice(bet_id=past_bet.id, choice_text="No", amount=73)

        url = reverse("bookies:detail", args=(past_bet.id,))
        response = self.client.get(url)

        self.assertContains(response, past_bet.bet_text)
        self.assertContains(response, choice1.choice_text)
        self.assertContains(response, choice1.amount)
        self.assertContains(response, choice2.choice_text)
        self.assertContains(response, choice2.amount)


class BetResultsViewTests(TestCase):
    def test_future_bet(self):
        """
        The results view of a bet with a pub_date in the future
        returns a 404 not found.
        """
        future_bet = create_bet(bet_text="Future bet.", days=5)
        url = reverse("bookies:results", args=(future_bet.id,))
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)

    def test_past_bet(self):
        """
        The results view of a bet with a pub_date in the past
        displays the bet's text.
        """
        past_bet = create_bet(bet_text="Past bet.", days=-5)
        url = reverse("bookies:results", args=(past_bet.id,))
        response = self.client.get(url)
        self.assertContains(response, past_bet.bet_text)