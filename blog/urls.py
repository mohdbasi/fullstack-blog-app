from django.urls import path
from . import views
from .views import (
    RegisterView, LoginView, logout_view,
    PostListCreate, PostDetail, PostLikeToggle,
    CommentListCreate, CommentDetail
)

urlpatterns = [

    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/logout/', logout_view, name='logout'),


    # Post routes
    path('posts/', PostListCreate.as_view(), name='post-list-create'),
    path('posts/<int:pk>/', PostDetail.as_view(), name='post-detail'),
    path('posts/<int:pk>/like/', PostLikeToggle.as_view(), name='post-like'),

    # Comment routes
    path('posts/<int:post_id>/comments/', CommentListCreate.as_view(), name='comment-list-create'),
    path('comments/<int:pk>/', CommentDetail.as_view(), name='comment-detail'),

    # Auth API
    path('auth/register/', views.RegisterView.as_view()),
    path('auth/login/', views.LoginView.as_view()),
    path('auth/logout/', views.logout_view),
]
