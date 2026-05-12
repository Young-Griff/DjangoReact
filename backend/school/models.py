from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MaxValueValidator

# Create your models here.
class SchoolUser(AbstractUser):
    
    STATE_CHOICES = (
        ("AL", "Alabama"), ("AK", "Alaska"), ("AZ", "Arizona"), ("AR", "Arkansas"), 
        ("CA", "California"), ("CO", "Colorado"), ("CT", "Connecticut"), ("DE", "Delaware"), 
        ("FL", "Florida"), ("GA", "Georgia"), ("HI", "Hawaii"), ("ID", "Idaho"), 
        ("IL", "Illinois"), ("IN", "Indiana"), ("IA", "Iowa"), ("KS", "Kansas"), 
        ("KY", "Kentucky"), ("LA", "Louisiana"), ("ME", "Maine"), ("MD", "Maryland"), 
        ("MA", "Massachusetts"), ("MI", "Michigan"), ("MN", "Minnesota"), ("MS", "Mississippi"), 
        ("MO", "Missouri"), ("MT", "Montana"), ("NE", "Nebraska"), ("NV", "Nevada"), 
        ("NH", "New Hampshire"), ("NJ", "New Jersey"), ("NM", "New Mexico"), ("NY", "New York"), 
        ("NC", "North Carolina"), ("ND", "North Dakota"), ("OH", "Ohio"), ("OK", "Oklahoma"), 
        ("OR", "Oregon"), ("PA", "Pennsylvania"), ("RI", "Rhode Island"), ("SC", "South Carolina"), 
        ("SD", "South Dakota"), ("TN", "Tennessee"), ("TX", "Texas"), ("UT", "Utah"), 
        ("VT", "Vermont"), ("VA", "Virginia"), ("WA", "Washington"), ("WV", "West Virginia"), 
        ("WI", "Wisconsin"), ("WY", "Wyoming"),
    )

    # TODO: set a means for automatically creating a login
    state = models.CharField(max_length=13, choices=STATE_CHOICES, default="NJ")

    def __str__(self):
        return f"{self.first_name} {self.last_name}"
    


class Department(models.Model):
    
    dept = models.CharField(max_length=25)
    dept_short = models.CharField(max_length=3)
    dean = models.ForeignKey(SchoolUser, null=True, on_delete=models.SET_NULL)

    def __str__(self):
        return f"{self.dept} - {self.dept_short}"


class Worker(models.Model):

    ROLE_CHOICES = (
        ("DEAN", "Dean"),
        ("TENURED PROFESSOR", "Tenured Professor"),
        ("ADJUNCT PROFESSOR", "Adjunct Professor"),
        ("ADMIN STAFF", "Administrative Staff"),
        ("MAINTENANCE", "Maintenance Staff"),
        ("WORK STUDY", "Student Worker"),
    )

    employee = models.ForeignKey(SchoolUser, on_delete=models.CASCADE)
    rate = models.IntegerField()
    role = models.CharField(max_length=25, choices=ROLE_CHOICES)
    role_started = models.DateField()
    role_ended = models.DateField(null=True, blank=True, default=None)

    def __str__(self):
        return f"{self.employee} - {self.role} - ${self.rate}"

class Course(models.Model):

    dept = models.ForeignKey(Department, on_delete=models.CASCADE)
    cid = models.CharField(max_length=3)
    name = models.CharField(max_length=100)
    credits = models.IntegerField()

    def __str__(self):
        return f"{self.dept}{self.cid} - {self.name}"

class CourseSection(models.Model):

    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    term = models.CharField(max_length=10)
    year = models.IntegerField()
    section = models.IntegerField()
    people = models.ManyToManyField(SchoolUser, through='CourseEnrollment')

    def __str__(self):
        try:
            instructor = self.people.filter(role='INSTRUCTOR')[0].person
            instructor_name = f"{instructor.first_name} {instructor.last_name}"
            out = f"{self.course.dept}{self.course.cid}-{self.section} - Professor {instructor_name}"
        except: 
            out = f"{self.course.dept.dept_short}{self.course.cid}-{self.section} - Professor TBD"
        return out

class CourseEnrollment(models.Model):

    ROLE_CHOICES = (
        ("STUDENT", "Student"),
        ("INSTRUCTOR", "Instructor"),
        ("TA", "Teaching Assistant"),
        ("GRADER", "Grader"),
        ("OTHER", "Other"),
    )

    course_section = models.ForeignKey(CourseSection, on_delete=models.CASCADE)
    person = models.ForeignKey(SchoolUser, on_delete=models.CASCADE)
    role = models.CharField(max_length=25, choices=ROLE_CHOICES)

    def __str__(self):
        return f"{self.course_section.course.dept}{self.course_section.course.cid}-{self.course_section.section} - {self.person} - {self.role}"

class Grade(models.Model):
    GRADE_CHOICES = (
        ("A", "4.0"),
        ("A-", "3.67"),
        ("B+", "3.33"),
        ("B", "3.0"),
        ("B-", "2.67"),
        ("C+", "2.33"),
        ("C", "2.0"),
        ("C-", "1.67"),
        ("D+", "1.33"),
        ("D", "1.0"),
        ("D-", "0.67"),
        ("F", "0.0"),
    )
    course_enrollment = models.ForeignKey(CourseEnrollment, on_delete=models.CASCADE)
    grade = models.CharField(max_length=4, choices=GRADE_CHOICES)
    
    def __str__(self):
        return f"{self.course_enrollment.person.username} has a grade of {self.grade} in {self.course_enrollment.course_section.course.dept}{self.course_enrollment.course_section.course.cid}"

class Major(models.Model):

    dept = models.ForeignKey(Department, on_delete=models.CASCADE)
    students = models.ManyToManyField(SchoolUser, through='MajorStudent')

    def __str__(self):
        return f"{self.dept.dept_short}"

class Minor(models.Model):

    dept = models.ForeignKey(Department, on_delete=models.CASCADE)
    students = models.ManyToManyField(SchoolUser, through='MinorStudent')

    def __str__(self):
        return f"{self.dept.dept_short}"

class MajorStudent(models.Model):

    major = models.ForeignKey(Major, on_delete=models.CASCADE)
    student = models.ForeignKey(SchoolUser, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.student.username} is majoring in {self.major.dept}"

class MinorStudent(models.Model):

    minor = models.ForeignKey(Minor, on_delete=models.CASCADE)
    student = models.ForeignKey(SchoolUser, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.student.username} is minoring in {self.minor.dept}"
