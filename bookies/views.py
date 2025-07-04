from django.contrib.auth.models import User
from django.db.models import F
from django.http import HttpResponseRedirect
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.shortcuts import get_object_or_404, render
from django.urls import reverse
from django.utils import timezone
from django.views import generic

from .models import Choice, Bet, Profile
from .serializers import UserSerializer, BetSerializer, ChoiceSerializer, ProfileSerializer

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class BetListCreate(generics.ListCreateAPIView):
    serializer_class = BetSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Return all bets.
        """
        return Bet.objects.all()


class BetRetrieveView(generics.RetrieveAPIView):
    queryset = Bet.objects.all()
    serializer_class = BetSerializer
    permission_classes = [IsAuthenticated]


class ProfileView(generics.RetrieveAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        pk = self.kwargs.get("pk")
        return Profile.objects.get(user__username=pk)


class BalanceUpdate(generics.UpdateAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        # instance = self.get_object()
        # print(instance.user.username)

        pk = self.kwargs.get("pk")
        profile = Profile.objects.get(user__username=pk)
        # profile.balance = request.data.get("balance", 0)
        print(request.data)

        serializer = self.get_serializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(ProfileSerializer(profile).data, status=status.HTTP_200_OK)
        else:
            return Response({"message": "failed", "details": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    # def update(self, request, *args, **kwargs):
    #     pk = self.kwargs.get("pk")
    #     profile = Profile.objects.get(user__username=pk)
    #     profile.balance = request.data.get("balance", 0)
    #     profile.save()
    #     return Response(ProfileSerializer(profile).data, status=status.HTTP_200_OK)


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


def errorMessage(request, bet, message):
    return render(
            request,
            "bookies/detail.html",
            {
                "bet": bet,
                "error_message": message,
            },
        )

def bet(request, bet_id):
    bet = get_object_or_404(Bet, pk=bet_id)
    try:
        selected_choice = bet.choice_set.get(pk=request.POST["choice"])
    except (KeyError, Choice.DoesNotExist):
        return errorMessage(request, bet, "You didn't select a choice.")
    else:
        selected_amount = request.POST["amount"]
        try:
            int(selected_amount)
        except ValueError:
            return errorMessage(request, bet, "You didn't enter a vaild number.")
        
        amount = int(selected_amount)
        if amount <= 0:
            return errorMessage(request, bet, "You didn't put an amount greater than 0.")
    
        selected_choice.amount = F("amount") + amount
        selected_choice.save()

        return HttpResponseRedirect(reverse("bookies:results", args=(bet.id,)))