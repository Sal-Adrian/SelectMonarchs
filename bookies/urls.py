from django.urls import path

from . import views

app_name = "bookies"
urlpatterns = [
    path("", views.BetListCreate.as_view(), name="bet-list"),
    path("<int:pk>/", views.DetailView.as_view(), name="detail"),
    path("<int:pk>/results/", views.ResultsView.as_view(), name="results"),
    path("<int:bet_id>/bet/", views.bet, name="bet"),
]