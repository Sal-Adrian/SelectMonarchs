from django.contrib import admin

from .models import Choice, Bet

admin.site.register(Bet)
admin.site.register(Choice)