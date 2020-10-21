from django.urls import path
from . import views

urlpatterns = [
    path('', views.api, name='api-lists'),
    path('task-lists/', views.taskList, name='task-lists'),
    path('task-detail/<str:pk>/', views.taskDetail, name='task-detail'),
    path('task-create/', views.TaskCreate, name='task-create'),
    path('task-update/<str:pk>/', views.taskUpdate, name='task-update'),
    path('task-delete/<str:pk>/', views.taskDelete, name='task-delete'),
]