from datetime import datetime
from django.shortcuts import render
# DRF requirements
from rest_framework.views import APIView 
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authentication import SessionAuthentication
from .authentication import CustomBasicAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework import exceptions
from .serializers import *
# basic Django auth tools and CSRF tokenizer
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.hashers import check_password
from django.middleware.csrf import get_token
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect, csrf_exempt

from .models import *

# authentication views
@api_view(["POST"])
@permission_classes([AllowAny])
@csrf_exempt
def api_login(request: Request):
    # get username and password of request
    if request.method == 'POST':
        creds = request.data
        user = authenticate(username=creds["username"], password=creds["password"])
        login(request, user)
        return Response("Logged In!")

@api_view(["POST"])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
@csrf_protect
def api_logout(request: Request):
    logout(request)
    return Response("Logged Out!")

ensure_csrf = method_decorator(ensure_csrf_cookie)
class GetCSRF(APIView):
    permission_classes = [AllowAny]
    @ensure_csrf
    def get(self, request):
        return Response("CSRF Cookie Set")

@api_view(['GET'])
@permission_classes([AllowAny])
def logged_in(request: Request):
    if request.user.is_authenticated:
        return Response({'loggedIn': True})
    else:
        return Response({'loggedIn': False})

# Data views
@api_view(["GET", "POST", "PUT"])
@permission_classes([AllowAny])
def get_departments(request, format=None):
    if request.method == "GET":
        departments = Department.objects.all()
        serializer = DepartmentSerializer(departments, many=True)
        return Response(serializer.data)
    elif request.method == "POST":
        # TODO: verify user is logged in with JWT 
        # (need login function and frontend page)
        return Response({"Error":"Not Authorized to Edit Departments."}, status=status.HTTP_403_FORBIDDEN)
    elif request.method == "PUT":
        # TODO: verify user is logged in with JWT 
        # (need login function and frontend page)
        return Response({"Error":"Not Authorized to Edit Departments."}, status=status.HTTP_403_FORBIDDEN)

@api_view(["GET"])
@permission_classes([AllowAny])
def get_dept_courses(request, dept, format=None):
    if request.method == "GET":
        print(dept.title())
        courses = Course.objects.filter(dept__dept=dept.title().strip())
        serializer = CourseSerializer(courses, many=True)
        return Response(serializer.data)

@api_view(["GET"])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
def get_workers(request: Request):
    if request.method == "GET":
        workers = Worker.objects.all()
        serializer = WorkerSerializer(workers, many=True)
        return Response(serializer.data)

@api_view(["GET"])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
def get_users(request: Request):
    if request.method == "GET":
        users = SchoolUser.objects.all().order_by('username')
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

@api_view(["GET"])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
def get_roles(request: Request):
    if request.method == "GET":
        roles = Worker.ROLE_CHOICES
        roles_json = []
        for role in roles:
            row = {}
            row['title'] = role[1]
            row['role'] = role[0]
            roles_json.append(row)
        return Response(roles_json)


@api_view(["POST", "PUT"])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
@csrf_protect
def add_worker(request: Request):
    if request.method == "POST":
        data = request.data
        print(data)
        worker = SchoolUser.objects.get(username=data["employee"])
        print(worker)
        if not worker:
            return Response("Invalid User ID")
        start_date = datetime.strptime(data['role_started'], "%Y-%m-%d")
        if data.get('role_ended', '') != '':
            role_ended = datetime.strptime(data['role_ended'], "%Y-%m-%d")
            new_worker = Worker(employee=worker, rate=data['rate'], role=data['role'], role_started=start_date, role_ended=role_ended)
        else:
            new_worker = Worker(employee=worker, rate=data['rate'], role=data['role'], role_started=start_date)
        new_worker.save()
        return Response("New Worker Saved!")
    if request.method == "PUT":
        data = request.data
        print(data)
        role = Worker.objects.get(id=data["id"])
        print(role)
        if not role:
            return Response("Invalid User ID")
        role.role_started = datetime.strptime(data['role_started'], "%Y-%m-%d")
        role.rate = data["rate"]
        role.role = data["role"]
        if data.get('role_ended', '') != '':
            role.role_ended = datetime.strptime(data['role_ended'], "%Y-%m-%d")
        role.save()
        print(role)
        return Response("User Updated!")

@api_view(["DELETE"])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
def remove_role(request, id):
    if request.method == "DELETE":
        role = Worker.objects.get(id=id)
        print(role)
        if role:
            role.delete()
        return Response("Role Deleted!")