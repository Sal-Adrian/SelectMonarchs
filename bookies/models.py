from django.db import models

class Bet(models.Model):
    bet_text = models.CharField(max_length=200)
    pub_date = models.DateTimeField("date published")

    def __str__(self):
        return self.bet_text

class Choice(models.Model):
    bet = models.ForeignKey(Bet, on_delete=models.CASCADE)
    choice_text = models.CharField(max_length=200)
    amount = models.IntegerField(default=0)

    def __str__(self):
        return self.choice_text