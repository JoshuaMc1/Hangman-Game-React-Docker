from django.db import models

# Create your models here.
class users (models.Model):
    id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=100)
    password = models.CharField(max_length=250)
    points = models.IntegerField(default=0)

    def __str__(self):
        return self.id

class words (models.Model):
    id = models.AutoField(primary_key=True)
    word = models.CharField(max_length=250)
    clue = models.TextField()
    difficulty = models.CharField(max_length=50, default="easy")
    time = models.IntegerField(default=120)

    def __str__(self):
        return self.id