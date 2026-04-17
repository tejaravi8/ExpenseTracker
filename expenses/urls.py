from django.urls import path
from . import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    # ✅ Expense APIs
    path('expenses/', views.get_expenses),
    # path('add/', views.add_expense),
    path('delete/<int:id>/', views.delete_expense),
    path('update/<int:id>/', views.update_expense),
    path('register/', views.register_user),
    path('google-login/', views.google_login),

    # ✅ JWT Auth (FIXED PATHS)
    # path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    # path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]