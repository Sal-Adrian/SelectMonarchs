from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Bet, Choice, Profile

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        Profile.objects.create(user=user)
        return user
        
class ChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        fields = ['id', 'choice_text', 'amount', 'win_condition']
        extra_kwargs = {'win_condition': {'read_only': True}}

class BetSerializer(serializers.ModelSerializer):
    choices = ChoiceSerializer(many=True, source='choice_set', read_only=True)
    
    class Meta:
        model = Bet
        fields = ['id', 'bet_text', 'pub_date', 'win_probability', 'choices']
        extra_kwargs = {'pub_date': {'read_only': True}}

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['id', 'user', 'balance']