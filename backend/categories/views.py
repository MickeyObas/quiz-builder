from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view

from .models import Category
from .serializers import CategorySerializer


@api_view(['GET'])
def category_list(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)