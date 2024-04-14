from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import words
from .models import users
import jwt

secret = '123456789ASCQCPMQKMASCPMA'

# Create your views here.
@api_view(['POST'])
def login(request):
    username = request.data['username']
    password = request.data['password']

    if users.objects.filter(username=username, password=password).exists():
        token = jwt.encode({'id': users.objects.get(username=username).id, 'username': username}, secret, algorithm='HS256')
        return Response({'success': True, 'message': 'El usuario ha iniciado sesión con éxito.', 'token': token})
    else:
        return Response({'success': False, 'message': 'Credenciales incorrectas.'})

@api_view(['POST'])
def register(request):
    username = request.data['username']
    password = request.data['password']
    
    if users.objects.filter(username=username).exists():
        return Response({'success': False, 'message': 'El usuario ya existe.'})
    else:
        if len(password) < 8:
            return Response({'success': False, 'message': 'La contraseña debe tener al menos 8 caracteres.'})

        users.objects.create(username=username, password=password)

        return Response({'success': True, 'message': 'El usuario ha sido creado con éxito.'})

@api_view(['GET'])
def me(request):
    token = request.headers['Authorization'].replace('Bearer ', '')
    decoded = jwt.decode(token, secret, algorithms=['HS256'])

    user = users.objects.get(id=decoded['id'])
    data = {'id': user.id, 'username': user.username, 'points': user.points}

    return Response({'success': True, 'data': data})

@api_view(['GET'])
def points(request):
    top_users = users.objects.order_by('-points')[:10]
    data = []
    for user in top_users:
        data.append({'id': user.id, 'username': user.username, 'points': user.points})

    return Response({'success': True, 'data': data})

@api_view(['POST'])
def points_update(request):
    token = request.headers['Authorization'].replace('Bearer ', '')
    decoded = jwt.decode(token, secret, algorithms=['HS256'])
    points = request.data['points']

    user = users.objects.get(id=decoded['id'])
    user.points = user.points + points
    user.save()

    return Response({'success': True, 'message': 'Puntos actualizados con exito.'})

@api_view(['GET'])
def random_word(request, difficulty):
    word = words.objects.filter(difficulty=difficulty).order_by('?').first()
    data = {'id': word.id, 'word': word.word.upper(), 'clue': word.clue, 'difficulty': word.difficulty, 'time': word.time, 'word_uppercase': word.word.upper()}

    return Response({'success': True, 'data': data})

@api_view(['POST'])
def word_create(request):
    word = request.data['word']
    clue = request.data['clue']
    difficulty = request.data['difficulty']
    time = request.data['time']

    words.objects.create(word=word, clue=clue, difficulty=difficulty, time=time)

    return Response({'success': True, 'message': 'Palabra guardada con exito.', 'data': {'word': word, 'clue': clue, 'difficulty': difficulty, 'time': time}})