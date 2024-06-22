from django.db import models
from common.models import User
# Create your models here.


class Category(models.Model):
    name = models.CharField(max_length=255)  # 생성 키워드
    description = models.TextField(blank=True, null=True)  # 설명
    bgColor = models.CharField(max_length=30, blank=True, null=True)  # 배경 색상 (Hex 코드)
    user = models.ForeignKey(User, related_name='categories', on_delete=models.CASCADE)  # 유저 정보

    def __str__(self):
        return self.name

class Card(models.Model):
    category = models.ForeignKey(Category, related_name='cards', on_delete=models.CASCADE)
    src = models.URLField()  # 이미지 URL
    kor = models.CharField(max_length=255)  # 한글 단어
    other = models.CharField(max_length=255)  # 번역된 단어
    example = models.TextField()  # 예문

    def __str__(self):
        return self.kor