from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import *

# Register your models here.
class SchoolUserAdmin(UserAdmin):
    fieldsets = (
        (None, {'fields':
            ("username",
             "password",
             "first_name",
             "last_name",
             "email",
             "state",)
             }
        ),
        ("Permissions", {'fields':
            ("is_active",
             "is_staff",
             "is_superuser",
             "groups",
             "user_permissions")
             }
        ),
        ("Key Dates", {'fields':
            ("last_login",
             "date_joined")
             }
        ),
    )

admin.site.register(SchoolUser, SchoolUserAdmin)
admin.site.register(Department)
admin.site.register(Worker)
admin.site.register(Course)
admin.site.register(CourseSection)
admin.site.register(CourseEnrollment)
admin.site.register(Grade)
admin.site.register(Major)
admin.site.register(Minor)
admin.site.register(MajorStudent)
admin.site.register(MinorStudent)