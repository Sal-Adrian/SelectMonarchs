import datetime

from django.contrib import admin
from django.db import models
from django.utils import timezone
from django.core.validators import MaxValueValidator, MinValueValidator
from django.contrib.auth.models import User

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    balance = models.DecimalField(max_digits=11, decimal_places=2, default=1000)

    def __str__(self):
        return self.user.username

class Bet(models.Model):
    bet_text = models.CharField(max_length=200)
    pub_date = models.DateTimeField("date published")
    win_probability = models.DecimalField(max_digits=3, decimal_places=2, default=0.5, validators=[MinValueValidator(0.0), MaxValueValidator(1.0)])

    def __str__(self):
        return self.bet_text
        
    @admin.display(
        boolean=True,
        ordering="pub_date",
        description="Published recently?",
    )
    def was_published_recently(self):
        now = timezone.now()
        return now - datetime.timedelta(days=1) <= self.pub_date <= now

class Choice(models.Model):
    bet = models.ForeignKey(Bet, on_delete=models.CASCADE)
    choice_text = models.CharField(max_length=200)
    amount = models.DecimalField(max_digits=11, decimal_places=2, default=0)
    win_condition = models.BooleanField(default=False)

    def __str__(self):
        return self.choice_text