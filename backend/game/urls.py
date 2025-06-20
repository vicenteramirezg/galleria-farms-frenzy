from django.urls import path
from .views import ScoreCreateView, LeaderboardView, health_check

app_name = 'game'

urlpatterns = [
    path('scores/', ScoreCreateView.as_view(), name='score-create'),
    path('scores/top/', LeaderboardView.as_view(), name='leaderboard'),
    path('health/', health_check, name='health-check'),
] 