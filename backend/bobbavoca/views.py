from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import Category, Card
from .serializers import CategorySerializer
from django.conf import settings
import jwt
from common.models import User
from .cards import *
from django.shortcuts import get_object_or_404
from .utils import upload_to_aws  # Assuming the upload_to_aws function is in a utils.py file

from PIL import Image, ImageDraw, ImageFont

from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from .serializers import *
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import status
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from django.conf import settings
import os
import io
import boto3
import requests
from botocore.exceptions import NoCredentialsError

import jwt
from rest_framework.views import APIView
from .serializers import *
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenRefreshSerializer
from rest_framework import status
from rest_framework.response import Response
from django.contrib.auth import authenticate
from django.shortcuts import render, get_object_or_404
from config.settings import SECRET_KEY
import random

pastelColors = [
    "bg-red-100",
    "bg-red-200",
    "bg-red-300",
    "bg-pink-100",
    "bg-pink-200",
    "bg-pink-300",
    "bg-orange-100",
    "bg-orange-200",
    "bg-orange-300",
    "bg-amber-100",
    "bg-amber-200",
    "bg-yellow-100",
    "bg-yellow-200",
    "bg-lime-200",
    "bg-emerald-100",
    "bg-emerald-200",
    "bg-emerald-300",
    "bg-teal-100",
    "bg-teal-200",
    "bg-teal-300",
    "bg-cyan-100",
    "bg-cyan-200",
    "bg-cyan-300",
    "bg-sky-100",
    "bg-sky-200",
    "bg-sky-300",
    "bg-blue-100",
    "bg-blue-200",
    "bg-blue-300",
    "bg-indigo-100",
    "bg-indigo-200",
    "bg-violet-100",
    "bg-violet-200",
    "bg-violet-300",
    "bg-purple-100",
    "bg-purple-200",
    "bg-purple-300",
    "bg-fuchsia-100",
    "bg-fuchsia-200",
    "bg-fuchsia-300",
    "bg-rose-50",
    "bg-rose-100",
    "bg-rose-200",
    "bg-rose-300"
]


def upload_to_aws(file_obj, bucket, s3_file_name):
    session = boto3.Session(
        aws_access_key_id='AKIA6ODU6XD4OCV4IJAU',
        aws_secret_access_key='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',
        region_name='us-east-2'
    )
    s3 = session.client('s3')

    try:
        s3.upload_fileobj(file_obj, bucket, s3_file_name)
        url = f"https://{bucket}.s3.{s3.meta.region_name}.amazonaws.com/{s3_file_name}"
        return url
    except NoCredentialsError:
        print("Credentials not available")
        return None

class CardsGenerateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # 헤더에서 JWT 토큰 추출
        token = request.headers.get('Authorization', None)
        if token is None:
            raise AuthenticationFailed('Authorization token not provided')

        # "Bearer " 부분을 제거하여 실제 토큰 값만 추출
        if not token.startswith('Bearer '):
            raise AuthenticationFailed('Invalid token format')
        token = token.split('Bearer ')[1]

        # 토큰 디코딩
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Token has expired')
        except jwt.PyJWTError as e:
            raise AuthenticationFailed(f'Token decoding error: {str(e)}')

        # 페이로드에서 유저 ID 추출 및 유저 객체 조회
        user_id = payload.get('user_id')
        if not user_id:
            raise AuthenticationFailed('Token payload invalid')


        print(request.data)

        user = get_object_or_404(User, pk=user_id)

        category_name = request.data.get('category')
        description = request.data.get('description')
        language = request.data.get('language')
        
        idx_color = random.randrange(0,len(pastelColors))
        bgColor = pastelColors[idx_color]

        # Category 데이터 생성
        category_data = {
            "name": category_name,
            "description": description,
            "bgColor": bgColor,
            "user": user.id  # user.id를 사용
        }

        print(category_data)
        
        # CategorySerializer에서 context로 request를 전달
        category_serializer = CategorySerializer(data=category_data, context={'request': request})
        if category_serializer.is_valid():
            category = category_serializer.save()

            # GPT를 활용하여 단어 리스트 생성
            res = get_words(category_name, description, 2, 1)
            words = res.split('/')
            
            for word in words[:8]:
                word_list = []
                example = get_example(word, word_list)
                word_list.append(example)
                other = get_foreign_word(word, language)
                
                # 이미지 생성 및 URL 가져오기
                image_url = get_image(example)
                
                # URL에서 이미지 다운로드
                response = requests.get(image_url)
                response.raise_for_status()
                file_obj = io.BytesIO(response.content)

                # S3 업로드
                s3_url = upload_to_aws(file_obj, 'possg', f"{user.nickname}/cards/{category_name}/{word}.png")
                
                card_data = {
                    "src": s3_url,
                    "kor": word,
                    "other": other,
                    "example": example
                }
                card_serializer = CardSerializer(data=card_data)
                
                if card_serializer.is_valid():
                    card_serializer.save(category=category)  # 여기서 category를 명시적으로 설정
                else:
                    return Response(card_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            response = {
                "category": category_name,
                "description": description
            }
            
            return Response(response, status=status.HTTP_201_CREATED)
        else:
            return Response(category_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


        
        
        
class CategoryListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # 헤더에서 JWT 토큰 추출
        token = request.headers.get('Authorization', None)
        if token is None:
            raise AuthenticationFailed('Authorization token not provided')

        # "Bearer " 부분을 제거하여 실제 토큰 값만 추출
        if not token.startswith('Bearer '):
            raise AuthenticationFailed('Invalid token format')
        token = token.split('Bearer ')[1]

        # 토큰 디코딩
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Token has expired')
        except jwt.PyJWTError as e:
            raise AuthenticationFailed(f'Token decoding error: {str(e)}')

        # 페이로드에서 유저 ID 추출 및 유저 객체 조회
        user_id = payload.get('user_id')
        if not user_id:
            raise AuthenticationFailed('Token payload invalid')

        user = get_object_or_404(User, pk=user_id)

        # 유저가 생성한 모든 카테고리 조회
        categories = Category.objects.filter(user=user)
        serializer = CategorySerializer(categories, many=True)

        # 필요한 필드만 포함하여 응답 데이터 구성
        response_data = [
            {
                "category": category['name'],
                "description": category['description'],
                "bgColor": category['bgColor']
            } for category in serializer.data
        ]

        return Response(response_data, status=status.HTTP_200_OK)
    
    
    
    

class CategoryCardsView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # 헤더에서 JWT 토큰 추출
        token = request.headers.get('Authorization', None)
        if token is None:
            raise AuthenticationFailed('Authorization token not provided')

        # "Bearer " 부분을 제거하여 실제 토큰 값만 추출
        if not token.startswith('Bearer '):
            raise AuthenticationFailed('Invalid token format')
        token = token.split('Bearer ')[1]

        # 토큰 디코딩
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Token has expired')
        except jwt.PyJWTError as e:
            raise AuthenticationFailed(f'Token decoding error: {str(e)}')

        # 페이로드에서 유저 ID 추출 및 유저 객체 조회
        user_id = payload.get('user_id')
        if not user_id:
            raise AuthenticationFailed('Token payload invalid')

        user = get_object_or_404(User, pk=user_id)

        # 요청 바디에서 category와 description 추출
        category_name = request.data.get('category')
        description = request.data.get('description')

        # 유저의 해당 카테고리 조회
        category = get_object_or_404(Category, user=user, name=category_name, description=description)
        cards = Card.objects.filter(category=category)

        # 카테고리와 카드를 시리얼라이즈
        category_serializer = CategorySerializer(category)
        card_serializer = CardSerializer(cards, many=True)

        # 응답 데이터 구성
        response_data = {
            "category": category_serializer.data['name'],
            "description": category_serializer.data['description'],
            "bgColor": category_serializer.data['bgColor'],
            "cards": card_serializer.data
        }

        return Response(response_data, status=status.HTTP_200_OK)
    
    
    
class CategoryDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # 헤더에서 JWT 토큰 추출
        token = request.headers.get('Authorization', None)
        if token is None:
            raise AuthenticationFailed('Authorization token not provided')

        # "Bearer " 부분을 제거하여 실제 토큰 값만 추출
        if not token.startswith('Bearer '):
            raise AuthenticationFailed('Invalid token format')
        token = token.split('Bearer ')[1]

        # 토큰 디코딩
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Token has expired')
        except jwt.PyJWTError as e:
            raise AuthenticationFailed(f'Token decoding error: {str(e)}')

        # 페이로드에서 유저 ID 추출 및 유저 객체 조회
        user_id = payload.get('user_id')
        if not user_id:
            raise AuthenticationFailed('Token payload invalid')

        user = get_object_or_404(User, pk=user_id)

        # 요청 바디에서 category와 description 추출
        category_name = request.data.get('category')
        description = request.data.get('description')

        # 유저의 해당 카테고리 조회
        category = get_object_or_404(Category, user=user, name=category_name, description=description)
        
        # 카테고리의 모든 카드 삭제
        cards = Card.objects.filter(category=category)
        cards.delete()

        # 카테고리 삭제
        category.delete()

        return Response({"message": "Category and its cards deleted"}, status=status.HTTP_200_OK)
    
    
class AllCategoriesView(APIView):

    def get(self, request):
        # 모든 카테고리 조회
        categories = Category.objects.all()
        response_data = []
        for category in categories:
            response_data.append({
                "category": category.name,
                "description": category.description,
                "bgColor": category.bgColor,
                "nickname": category.user.nickname  # Assuming the User model has a nickname field
            })

        return Response(response_data, status=status.HTTP_200_OK)
    
    
    
    
from rest_framework.parsers import JSONParser
from rest_framework.renderers import JSONRenderer

def resize_image(image, target_height):
    """
    이미지의 세로 길이를 target_height에 맞추고, 가로 길이는 비율을 유지하여 조정합니다.
    """
    width, height = image.size
    aspect_ratio = width / height
    new_height = target_height
    new_width = int(new_height * aspect_ratio)
    resized_image = image.resize((new_width, new_height), Image.ANTIALIAS)
    return resized_image

class CreateTemplateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # 헤더에서 JWT 토큰 추출
        token = request.headers.get('Authorization', None)
        if token is None:
            raise AuthenticationFailed('Authorization token not provided')

        # "Bearer " 부분을 제거하여 실제 토큰 값만 추출
        if not token.startswith('Bearer '):
            raise AuthenticationFailed('Invalid token format')
        token = token.split('Bearer ')[1]

        # 토큰 디코딩
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Token has expired')
        except jwt.PyJWTError as e:
            raise AuthenticationFailed(f'Token decoding error: {str(e)}')

        # 페이로드에서 유저 ID 추출 및 유저 객체 조회
        user_id = payload.get('user_id')
        if not user_id:
            raise AuthenticationFailed('Token payload invalid')

        user = get_object_or_404(User, pk=user_id)

        # 요청 바디에서 데이터 추출
        category_name = request.data.get('category')
        description = request.data.get('description')
        nickname = request.data.get('nickname')
        type = request.data.get('type')
        template = request.data.get('template')

        # 유저의 해당 카테고리 조회
        category = get_object_or_404(Category, user=user, name=category_name, description=description)
        cards = Card.objects.filter(category=category)

        if not cards.exists():
            return Response({"error": "No cards found for the given category and description."}, status=status.HTTP_404_NOT_FOUND)

        # 이미지 생성 로직
        template_image_path = '/home/honglee0317/BobbaVoca/backend/template2.png'  # 템플릿 이미지 경로
        try:
            template_image = Image.open(template_image_path)
        except Exception as e:
            return Response({"error": f"Error opening template image: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        draw = ImageDraw.Draw(template_image)
        font_path = "/home/honglee0317/BobbaVoca/backend/fonts/Maplestory_Light.ttf"
        font_path_kor = "/home/honglee0317/BobbaVoca/backend/fonts/온글잎 의청수 시우체.ttf"  
        try:
            font = ImageFont.truetype(font_path, 24)  # 폰트와 크기 설정
            font_title = ImageFont.truetype(font_path_kor, 40)  # 폰트와 크기 설정
            font_kor = ImageFont.truetype(font_path_kor, 24)  # 폰트와 크기 설정
            
        except Exception as e:
            return Response({"error": f"Error loading font: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # 카드 데이터를 격자에 배치
        card_width = 794 // 2
        card_height = 1123 // 4

        for idx, card in enumerate(cards[:8]):  # 최대 8개의 카드를 배치
            row = idx // 2
            col = idx % 2
            x = col * card_width + 50
            y = row * card_height + 55

            # 카드 이미지 열기
            try:
                response = requests.get(card.src)
                response.raise_for_status()
                card_image = Image.open(io.BytesIO(response.content))
                card_image = resize_image(card_image, card_height // 2)  # 이미지 크기 조정
                if card_image.mode == 'RGBA':
                    card_image = card_image.convert('RGB')
                template_image.paste(card_image, (x, y))
            except Exception as e:
                print(f"Error loading image for {card.kor}: {e}")

            # 텍스트 추가
            draw.text((x + 170, y + card_height // 2 - 100), f' {card.kor}', font=font_title, fill='black')
            draw.text((x + 180, y + card_height // 2 - 40), f' {card.other}', font=font, fill='black')
            draw.text((x + 10, y + card_height // 2 + 30), f' {card.example}', font=font_kor, fill='black')

        # 결과 이미지를 저장하거나 반환
        if not os.path.exists(settings.MEDIA_ROOT):
            os.makedirs(settings.MEDIA_ROOT)

     
        filename = f'template_01.png'
        filepath = os.path.join(settings.MEDIA_ROOT, filename)
        try:
            template_image.save(filepath, format='PNG')
        except Exception as e:
            return Response({"error": f"Error saving image: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        image_url = request.build_absolute_uri(settings.MEDIA_URL + filename)
        return Response({"message": "Image created successfully", "image_url": image_url}, status=status.HTTP_200_OK)