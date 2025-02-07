from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view

from accounts.models import User
from .models import Quiz, Question, Option, UserQuiz, UserQuestionOptionMap
from .serializers import QuizSerializer, QuizDisplaySerializer, QuestionSerializer, UserQuizSerializer


@api_view(['GET'])
def quiz_list(request):
    quizzes = Quiz.objects.all()
    serializer = QuizDisplaySerializer(quizzes, many=True)
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
    data = request.data.copy()
    data['owner'] = request.user.id
    print(data)
    serializer = QuizSerializer(data=data, context={'request': request})
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


@api_view(['POST'])
def create_user_quiz(request, quiz_id):
    try:
        quiz = Quiz.objects.get(id=quiz_id)
    except Quiz.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    UserQuiz.objects.create(
        user=request.user,
        quiz=quiz
    )

    return Response({'success': 'success'})


@api_view(['POST'])
def process_quiz(request, quiz_id):
    try:
        quiz = Quiz.objects.get(id=quiz_id)
        user_quiz = UserQuiz.objects.get(
            user=request.user,
            quiz=quiz
        )
        print(request.data)
        for quiz_response in request.data:
            question = Question.objects.get(id=quiz_response['questionId'])
            option = Option.objects.get(id=quiz_response['optionId'])
            # Create Map
            UserQuestionOptionMap.objects.create(
                user_quiz=user_quiz,
                question=question,
                option=option,
            )
        return Response({'test': 'test'})
    except Quiz.DoesNotExist:
        return Response({'error': 'Quiz does not exist.'}, status=status.HTTP_404_NOT_FOUND)
    except UserQuiz.DoesNotExist:
        return Response({'error': 'UserQuiz does not exist'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(e)
        return Response({'error': str(e)})
    

@api_view(['GET'])
def user_quiz_list(request, user_id):
    user = User.objects.get(id=user_id)
    user_quizzes = UserQuiz.objects.filter(
        user=user
    )
    serializer = UserQuizSerializer(user_quizzes, many=True)
    return Response(serializer.data)