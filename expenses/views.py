from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import Expense
from .serializers import ExpenseSerializer,RegisterSerializer
from rest_framework import status
from google.oauth2 import id_token
from google.auth.transport import requests
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken

GOOGLE_CLIENT_ID = "530487705514-1tb9gk3q3bq8megndqilmmp8vm52drdr.apps.googleusercontent.com"


# ✅ ViewSet (recommended way)
class ExpenseViewSet(viewsets.ModelViewSet):
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        return Expense.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# ✅ GET (secured)
@api_view(['GET', 'POST'])
@authentication_classes([JWTAuthentication])   # 🔥 FIX
@permission_classes([IsAuthenticated])
def get_expenses(request):

    if request.method == 'GET':
        expenses = Expense.objects.filter(user=request.user)
        serializer = ExpenseSerializer(expenses, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = ExpenseSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data)

        return Response(serializer.errors)


# ✅ POST (secured)
# @api_view(['POST'])
# @authentication_classes([JWTAuthentication])   # 🔥 FIX
# @permission_classes([IsAuthenticated])
# def add_expense(request):
#     serializer = ExpenseSerializer(data=request.data)

#     if serializer.is_valid():
#         serializer.save(user=request.user)
#         return Response(serializer.data)

#     return Response(serializer.errors)


# ✅ DELETE (secured)
@api_view(['DELETE'])
@authentication_classes([JWTAuthentication])   # 🔥 FIX
@permission_classes([IsAuthenticated])
def delete_expense(request, id):
    try:
        expense = Expense.objects.get(id=id, user=request.user)
        expense.delete()
        return Response({"message": "Deleted"})
    except Expense.DoesNotExist:
        return Response({"error": "Not found"})


# ✅ UPDATE (secured)
@api_view(['PUT'])
@authentication_classes([JWTAuthentication])   # 🔥 FIX
@permission_classes([IsAuthenticated])
def update_expense(request, id):
    try:
        expense = Expense.objects.get(id=id, user=request.user)
    except Expense.DoesNotExist:
        return Response({"error": "Not found"})

    serializer = ExpenseSerializer(expense, data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

    return Response(serializer.errors)

@api_view(['POST'])
def register_user(request):
    serializer = RegisterSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def google_login(request):
    token = request.data.get("token")

    try:
        idinfo = id_token.verify_oauth2_token(
            token, requests.Request(), GOOGLE_CLIENT_ID
        )

        email = idinfo['email']
        username = email.split('@')[0]

        user, created = User.objects.get_or_create(
            email=email,
            defaults={'username': username}
        )

        refresh = RefreshToken.for_user(user)

        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        })

    except Exception:
        return Response({"error": "Invalid token"})