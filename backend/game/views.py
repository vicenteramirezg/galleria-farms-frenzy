from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from .models import Score
from .serializers import ScoreSerializer, LeaderboardSerializer


@method_decorator(csrf_exempt, name='dispatch')
class ScoreCreateView(generics.CreateAPIView):
    """API endpoint to submit a new score"""
    queryset = Score.objects.all()
    serializer_class = ScoreSerializer

    def create(self, request, *args, **kwargs):
        try:
            response = super().create(request, *args, **kwargs)
            return Response({
                'success': True,
                'message': 'Score submitted successfully',
                'data': response.data
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({
                'success': False,
                'message': str(e),
                'data': None
            }, status=status.HTTP_400_BAD_REQUEST)


class LeaderboardView(generics.ListAPIView):
    """API endpoint to get top 10 scores"""
    serializer_class = LeaderboardSerializer
    
    def get_queryset(self):
        return Score.objects.all()[:10]

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'success': True,
            'message': 'Leaderboard retrieved successfully',
            'data': serializer.data
        })


@csrf_exempt
@api_view(['GET'])
def health_check(request):
    """Simple health check endpoint"""
    return Response({
        'success': True,
        'message': 'Flower Farm API is running',
        'timestamp': Score.objects.count()
    })
