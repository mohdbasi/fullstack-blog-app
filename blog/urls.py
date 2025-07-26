from django.urls import path
from . import views
from .views import (
    RegisterView, LoginView, logout_view,
    PostListCreate, PostDetail, PostLikeToggle,
    CommentListCreate, CommentDetail
)

urlpatterns = [

    # Frontend page routes
    path('', views.frontend_index_view, name='home'),
    path('login/', views.frontend_login_view, name='login-page'),
    path('register/', views.frontend_register_view, name='register-page'),

    # Auth
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/logout/', logout_view, name='logout'),

    # Posts
    path('posts/', PostListCreate.as_view(), name='post-list-create'),
    path('posts/<int:pk>/', PostDetail.as_view(), name='post-detail'),
    path('posts/<int:pk>/like/', PostLikeToggle.as_view(), name='post-like'),

    # Comments
    path('posts/<int:post_id>/comments/', CommentListCreate.as_view(), name='comment-list-create'),
    path('comments/<int:pk>/', CommentDetail.as_view(), name='comment-detail'),
]
