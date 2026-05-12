from django.contrib import admin
from django.urls import path
from .views import *

app_name = 'api'
urlpatterns = [
    # login and logout
    path('login/', api_login, name='login'),
    path('logout/', api_logout, name='logout'),
    path('user-status/', logged_in, name='user-status'),
    path('get-csrf/', GetCSRF.as_view(), name='csrf'),
    path('departments/', get_departments, name='dept-data'),
    path('department-courses/<str:dept>', get_dept_courses, name='dept-courses'),
    path('get-roles/', get_roles, name='get-roles'),
    path('employees/', get_workers, name='emp-data'),
    path('users/', get_users, name='users'),
    path('add-employee/', add_worker, name='add-emp'),
    path('remove-role/<int:id>', remove_role, name='remove-role'),
]