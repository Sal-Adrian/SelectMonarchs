from django.contrib import admin

from .models import Choice, Bet

class ChoiceInline(admin.TabularInline):
    model = Choice
    extra = 2


class BetAdmin(admin.ModelAdmin):
    list_display = ["bet_text", "pub_date", "was_published_recently"]
    list_filter = ["pub_date"]
    fieldsets = [
        (None, {"fields": ["bet_text"]}),
        ("Date information", {"fields": ["pub_date"], "classes": ["collapse"]}),
    ]
    inlines = [ChoiceInline]
    search_fields = ["bet_text"]

admin.site.register(Bet, BetAdmin)