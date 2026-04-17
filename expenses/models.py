from django.db import models
# Create your models here.
from django.contrib.auth.models import User


class Expense(models.Model):
    TYPE_CHOICES = (
        ('income', 'Income'),
        ('expense', 'Expense'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    amount = models.FloatField()
    category = models.CharField(max_length=50)
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    date = models.DateField(auto_now_add=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.title