from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import *

# serializers
class LoginSerializer(serializers.Serializer):
    
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, attrs):
        print("Attrs: ", attrs)
        user = authenticate(username=attrs['username'], password=attrs['password'])
        print("User: ", user)
        if not user:
            raise serializers.ValidationError("Incorrect username or password.")
        elif not user.is_active:
            raise serializers.ValidationError("Account is inactive.")
        return {'user': user}

class DepartmentSerializer(serializers.Serializer):

    dept = serializers.CharField(read_only=True)
    dept_short = serializers.CharField(read_only=True)
    dean_fname = serializers.CharField(source='dean.first_name', read_only=True)
    dean_lname = serializers.CharField(source='dean.last_name', read_only=True)
    dean_email = serializers.CharField(source='dean.email', read_only=True)

    class Meta:
        model = Department
        fields = ('dept', 'dept_short', 'dean_fname', 'dean_lname', 'dean_email')

class CourseSerializer(serializers.Serializer):

    dept = serializers.CharField(read_only=True)
    cid = serializers.CharField(read_only=True)
    name = serializers.CharField(read_only=True)
    credits = serializers.IntegerField(read_only=True)

    class Meta:
        model = Course
        fields = '__all__'

class UserSerializer(serializers.Serializer):
    # only let admins see user data
    username = serializers.CharField()
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    email = serializers.CharField()
    state = serializers.CharField()

    class Meta:
        model = SchoolUser
        fields = ('username', 'first_name', 'last_name', 'email', 'state')

class WorkerSerializer(serializers.Serializer):

    id = serializers.IntegerField(read_only=True)
    emp_uname = serializers.CharField(source='employee.username', read_only=True)    
    emp_fname = serializers.CharField(source='employee.first_name', read_only=True)
    emp_lname = serializers.CharField(source='employee.last_name', read_only=True)
    rate = serializers.IntegerField(read_only=True)
    role = serializers.CharField(read_only=True)
    role_started = serializers.DateField(read_only=True)
    role_ended = serializers.DateField(read_only=True)
    class Meta:
        model = Worker
        fields = ('id','emp_uname', 'emp_fname', 'emp_lname', 'rate', 'role', 'role_started', 'role_ended')