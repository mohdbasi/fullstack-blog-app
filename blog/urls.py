from django.urls import path
from . import views
from .views import RegisterView

urlpatterns = [

    path('auth/register/', RegisterView.as_view(), name='register'),

    # Post API
    path('posts/', views.PostListCreate.as_view()),
    path('posts/<int:pk>/', views.PostDetail.as_view()),
    path('posts/<int:pk>/like/', views.PostLikeToggle.as_view()),

    # Comments API
    path('posts/<int:post_id>/comments/', views.CommentListCreate.as_view()),
    path('comments/<int:pk>/', views.CommentDetail.as_view()),

    # Auth API
    path('auth/register/', views.register_view),
    path('auth/login/', views.login_view),
    path('auth/logout/', views.logout_view),
]
