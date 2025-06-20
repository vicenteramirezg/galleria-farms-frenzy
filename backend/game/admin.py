from django.contrib import admin
from .models import Score


@admin.register(Score)
class ScoreAdmin(admin.ModelAdmin):
    list_display = ['initials', 'score', 'timestamp']
    list_filter = ['timestamp']
    search_fields = ['initials']
    ordering = ['-score', '-timestamp']
    readonly_fields = ['timestamp']
    
    fieldsets = (
        ('Game Score', {
            'fields': ('initials', 'score')
        }),
        ('Metadata', {
            'fields': ('timestamp',),
            'classes': ('collapse',)
        }),
    )
