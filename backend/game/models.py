from django.db import models
from django.core.validators import RegexValidator


class Score(models.Model):
    initials = models.CharField(
        max_length=3,
        validators=[
            RegexValidator(
                regex=r'^[A-Z]{3}$',
                message='Initials must be exactly 3 uppercase letters',
                code='invalid_initials'
            )
        ],
        help_text='Player initials (3 uppercase letters)'
    )
    score = models.IntegerField(
        help_text='Game score points'
    )
    timestamp = models.DateTimeField(
        auto_now_add=True,
        help_text='When the score was submitted'
    )

    class Meta:
        ordering = ['-score', '-timestamp']
        verbose_name = 'Game Score'
        verbose_name_plural = 'Game Scores'

    def __str__(self):
        return f"{self.initials}: {self.score} points"
