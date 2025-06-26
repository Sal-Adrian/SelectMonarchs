from django.urls import path

from . import views

app_name = "bookies"
urlpatterns = [
    path("", views.index, name="index"),
    path("<int:bet_id>/", views.detail, name="detail"),
    path("<int:bet_id>/results/", views.results, name="results"),
    path("<int:bet_id>/bet/", views.bet, name="bet"),
]