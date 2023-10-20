from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser, PermissionsMixin

class UserAccountManager(BaseUserManager):
    def create_user(self, first_name, last_name, username, password=None):
        if not username:
            raise ValueError('Users must have an username.')
        
        username = username.lower()
        
        user = self.model(
            first_name = first_name,
            last_name = last_name,
            username = username,
        )

        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, first_name, last_name, username, password=None):
        # Creates and saves a superuser with the given username and password.
        
        user = self.create_user(
            first_name,
            last_name,
            username,
            password = password
        )

        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user
    
class UserAccount(AbstractBaseUser, PermissionsMixin):
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    username = models.CharField(unique=True, max_length=255)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserAccountManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    def __str__(self):
        return self.username
