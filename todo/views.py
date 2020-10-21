from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import TodoSerializer
from .models import Todo
# Create your views here.
@api_view(['GET'])
def api(request):
    data = {
        'List' : '/task-list/',
        'Detail View' : '/task-detail/<str:pk>/',
        'Create' : '/task-create/',
        'Delete' : '/task-delete/<str:pk>',
        'Update' : '/task-update/<str:pk>'
    }
    return Response(data)

@api_view(['GET'])
def taskList(request):
    todos = Todo.objects.all().order_by('-id')
    serializer = TodoSerializer(todos, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def taskDetail(request, pk):
    todo = Todo.objects.get(id=pk)
    serializer = TodoSerializer(todo, many=False)
    return Response(serializer.data)

@api_view(['POST'])
def TaskCreate(request):
    serializer = TodoSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)

@api_view(['POST'])
def taskUpdate(request, pk):
    todo = Todo.objects.get(id=pk)
    serializer = TodoSerializer(instance=todo, data=request.data)
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)

@api_view(['DELETE'])
def taskDelete(request, pk):
    todo = Todo.objects.get(id=pk)
    # serializer = TodoSerializer()
    todo.delete()
    return Response('Item Successfully Deleted')