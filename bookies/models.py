import datetime

from django.db import models
from django.utils import timezone

class Bet(models.Model):
    bet_text = models.CharField(max_length=200)
    pub_date = models.DateTimeField("date published")

    def __str__(self):
        return self.bet_text

    def was_published_recently(self):
        now = timezone.now()
        return now - datetime.timedelta(days=1) <= self.pub_date <= now

class Choice(models.Model):
    bet = models.ForeignKey(Bet, on_delete=models.CASCADE)
    choice_text = models.CharField(max_length=200)
    amount = models.IntegerField(default=0)

    def __str__(self):
        return self.choice_text