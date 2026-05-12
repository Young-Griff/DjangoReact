"""
Create 20 test SchoolUser records.

Run from the backend directory (with Django available on PYTHONPATH):

    python manage.py shell < scripts/_seed_test_users.py

Or:

    python manage.py shell
    >>> exec(open("scripts/_seed_test_users.py").read())
"""
import random
from school.models import SchoolUser

FIRST_NAMES = [
    "Emma", "Liam", "Olivia", "Noah", "Ava", "Oliver", "Sophia", "Elijah", "Isabella", "James",
    "Mia", "Benjamin", "Charlotte", "Lucas", "Amelia", "Mason", "Harper", "Ethan", "Evelyn", "Alexander",
    "Abigail", "Henry", "Emily", "Sebastian", "Elizabeth", "Jack", "Sofia", "Michael", "Avery", "Daniel",
    "Ella", "Matthew", "Scarlett", "Aiden", "Grace", "Owen", "Chloe", "Samuel", "Victoria", "David",
    "Riley", "Joseph", "Aria", "John", "Lily", "Wyatt", "Zoey", "Gabriel", "Nora", "Julian",
]
LAST_NAMES = [
    "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez",
    "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin",
    "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson",
    "Walker", "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores",
    "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell", "Carter", "Roberts",
]

STATE_CODES = [c[0] for c in SchoolUser.STATE_CHOICES]
PASSWORD = "Test_123!"

used = set(SchoolUser.objects.values_list("username", flat=True))
created = []
for _ in range(20):
    while True:
        fn = random.choice(FIRST_NAMES)
        ln = random.choice(LAST_NAMES)
        initials = (fn[0] + ln[0]).lower()
        num = random.randint(0, 999)
        username = f"{initials}{num:03d}"
        if username not in used:
            used.add(username)
            break
    SchoolUser.objects.create_user(
        username=username,
        password=PASSWORD,
        email=f"{username}@school.com",
        first_name=fn,
        last_name=ln,
        state=random.choice(STATE_CODES),
    )
    created.append((username, fn, ln))

print("Created 20 SchoolUser records:")
for username, fn, ln in created:
    u = SchoolUser.objects.get(username=username)
    print(f"  {username:8}  {fn} {ln}  state={u.state}  {u.email}")
