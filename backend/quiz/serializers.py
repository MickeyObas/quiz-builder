from rest_framework.serializers import (
    ModelSerializer,
    CharField,
    SerializerMethodField
)

from .models import Quiz, Question
from categories.serializers import CategorySerializer
from accounts.serializers import UserSerializer


class QuizSerializer(ModelSerializer):
    class Meta:
        model = Quiz
        fields = [
            'id',
            'title',
            'owner',
            'category',
            'questionTotal'
        ]


class QuizDisplaySerializer(ModelSerializer):
    category = CharField(source='category.title')
    questions = SerializerMethodField()
    
    class Meta:
        model = Quiz
        fields = [
            'id',
            'title',
            'owner',
            'category',
            'questions',
            'questionTotal'
        ]

    def get_questions(self, obj):
        return [question.content for question in obj.question_set.all()]
    

class QuestionSerializer(ModelSerializer):
    class Meta:
        model = Question
        fields = [
            'quiz',
            'content'
        ]