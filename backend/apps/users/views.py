from django.shortcuts import render
from rest_framework.views import APIView
from apps.users.serizalizer import UserCreateSerializer, UserSerializer
from rest_framework.response import Response
from rest_framework import permissions, status
from django.views.decorators.csrf import csrf_exempt
from django.http.response import JsonResponse
from django.contrib.auth import authenticate
from django.contrib.auth.tokens import default_token_generator
class RegisterView(APIView):
  def post(self, request):
    data = request.data

    serializer = UserCreateSerializer(data=data)

    if not serializer.is_valid():
      return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    user = serializer.create(serializer.validated_data)
    user = UserSerializer(user)

    return Response(user.data, status=status.HTTP_201_CREATED)


class RetrieveUserView(APIView):
  permission_classes = [permissions.IsAuthenticated]

  def get(self, request):
    user = request.user
    user = UserSerializer(user)

    return Response(user.data, status=status.HTTP_200_OK)
