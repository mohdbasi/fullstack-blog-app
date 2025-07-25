from django.urls import path
from . import views

urlpatterns = [
    path('posts/', views.PostListCreate.as_view()),
    path('posts/<int:pk>/', views.PostDetail.as_view()),
    path('posts/<int:pk>/like/', views.PostLikeToggle.as_view()),
    path('posts/<int:post_id>/comments/', views.CommentListCreate.as_view()),
    path('comments/<int:pk>/', views.CommentDetail.as_view()),
]
