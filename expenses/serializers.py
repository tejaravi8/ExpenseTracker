from rest_framework import serializers
from .models import Expense
from django.contrib.auth.models import User

class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = '__all__'
        read_only_fields = ['user']   # 🔥 VERY IMPORTANT

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }
    
    # def validate_username(self, value):
    #     if User.objects.filter(username=value).exists():
    #         raise serializers.ValidationError("Username already exists")
    #     return value
    
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user