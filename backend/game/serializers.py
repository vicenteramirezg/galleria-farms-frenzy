from rest_framework import serializers
from .models import Score


class ScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Score
        fields = ['id', 'initials', 'score', 'timestamp']
        read_only_fields = ['id', 'timestamp']

    def validate_initials(self, value):
        """Ensure initials are uppercase"""
        return value.upper()

    def validate_score(self, value):
        """Ensure score is non-negative"""
        if value < 0:
            raise serializers.ValidationError("Score must be non-negative")
        return value


class LeaderboardSerializer(serializers.ModelSerializer):
    """Serializer for leaderboard display - simplified fields"""
    class Meta:
        model = Score
        fields = ['initials', 'score', 'timestamp'] 