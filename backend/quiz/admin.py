from django.contrib import admin

from .models import (
    Quiz,
    Question,
    Option, 
    UserQuiz,
    UserQuestionOptionMap
)


class UserQuizModelAdmin(admin.ModelAdmin):
    list_display = [
        'user',
        'quiz',
        'score'
    ]

admin.site.register(Quiz)
admin.site.register(UserQuiz, UserQuizModelAdmin)
admin.site.register(Question)
admin.site.register(Option)
admin.site.register(UserQuestionOptionMap)