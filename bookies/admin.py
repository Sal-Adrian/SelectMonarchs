from django.contrib import admin

from .models import Choice, Bet, Profile

class ChoiceInline(admin.TabularInline):
    model = Choice
    extra = 2


class BetAdmin(admin.ModelAdmin):
    list_display = ["bet_text", "win_probability", "was_published_recently"]
    list_filter = ["pub_date"]
    fieldsets = [
        (None, {"fields": ["bet_text", "win_probability"]}),
        ("Date information", {"fields": ["pub_date"], "classes": ["collapse"]}),
    ]
    inlines = [ChoiceInline]
    search_fields = ["bet_text"]

class ProfileAdmin(admin.ModelAdmin):
    list_display = ["user", "balance", "id"]
    search_fields = ["user__username"]

admin.site.register(Bet, BetAdmin)
admin.site.register(Profile, ProfileAdmin)