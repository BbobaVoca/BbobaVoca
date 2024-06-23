# Create your models here.
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

class UserManager(BaseUserManager):
    def create_user(self, email, password, nickname, **extra_fields):
        if not email:
            raise ValueError('Users must have an email address')
        if not nickname:
            raise ValueError('Users must have a nickname')

        extra_fields.setdefault('credit', 5000)

        user = self.model(
            email=email,
            nickname=nickname,
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password, nickname='admin', **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(email, password, nickname, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(max_length=30, unique=True, null=False, blank=False)
    nickname = models.CharField(max_length=15, unique=True, null=True)
    credit = models.IntegerField(default=5000)
    is_superuser = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['nickname']

class Baby(models.Model):
    user = models.ForeignKey(User, related_name='babies', on_delete=models.CASCADE)
    name = models.CharField(max_length=30)
    profile = models.CharField(max_length=255)