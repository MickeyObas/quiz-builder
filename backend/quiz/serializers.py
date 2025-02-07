from rest_framework.serializers import (
    ModelSerializer,
    CharField,
    SerializerMethodField,
    IntegerField
)

from .models import Quiz, Question, Option, UserQuiz


class OptionSerializer(ModelSerializer):
    class Meta:
        model = Option
        fields = [
            'id',
            'content',
            'is_answer'
        ]

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

    def create(self, validated_data):
        # request = self.context.get('request')
        # user_id = request.user.id
        # validated_data['owner'] = user_id
        return super().create(validated_data)


class QuestionSerializer(ModelSerializer):
    options = SerializerMethodField()

    class Meta:
        model = Question
        fields = [
            'id',
            'content',
            'options'
        ]

    def get_options(self, obj):
        options = obj.option_set.all()
        serializer = OptionSerializer(options, many=True)
        return serializer.data

class QuizDisplaySerializer(ModelSerializer):
    category = CharField(source='category.title')
    owner = CharField(source='owner.email')
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
        questions = obj.question_set.all()
        serializer = QuestionSerializer(questions, many=True)
        return serializer.data
    

class UserQuizSerializer(ModelSerializer):
    quiz = QuizDisplaySerializer()

    class Meta:
        model = UserQuiz
        fields = [
            'user',
            'quiz',
            'score'
        ]