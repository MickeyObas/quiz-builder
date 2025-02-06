from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view

from .models import Quiz, Question, Option
from .serializers import QuizSerializer, QuizDisplaySerializer, QuestionSerializer

@api_view(['GET'])
def quiz_list(request):
    quizzes = Quiz.objects.all()
    serializer = QuizSerializer(quizzes, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def quiz_detail(request, pk):
    try:
        quiz = Quiz.objects.get(id=pk)
        serializer = QuizDisplaySerializer(quiz)
        return Response(serializer.data)
    except Quiz.DoesNotExist:
        return Response({'error': 'Quiz does not exist'},status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def quiz_create(request):
    data = request.data
    serializer = QuizSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def question_create(request, pk):
    data = request.data
    try:
        quiz = Quiz.objects.get(id=pk)
    except Quiz.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    # Create Question
    new_question = Question.objects.create(
        quiz=quiz,
        content=data['content']
    )
    # Create Options
    for idx, option in enumerate(data['options']):
        Option.objects.create(
            question=new_question,
            content=option,
            is_answer=(idx==data['answer'])
        )

    print(data)
    return Response({'test': 'test'})
    # serializer = QuestionSerializer(data=data)
    # if serializer.is_valid():
    #     serializer.save()
    #     return Response(serializer.data)
    # return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)