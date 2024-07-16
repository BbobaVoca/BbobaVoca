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
from common.serializers import *
from .cards import *
from django.shortcuts import get_object_or_404
from .utils import upload_to_aws  # Assuming the upload_to_aws function is in a utils.py file

from django.utils import timezone
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

import datetime

import sys
sys.path.append("/home/honglee0317/BobbaVoca/backend/bobbavoca")
from PrintSample import *

from config.my_settings import *

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

def draw_text_with_wrapping(draw, text, position, font, max_width):
    lines = []
    line = ""
    
    for word in text.split():
        # 다음 단어를 추가했을 때의 너비를 계산
        test_line = f"{line} {word}".strip()
        if draw.textsize(test_line, font=font)[0] <= max_width:
            line = test_line
        else:
            lines.append(line)
            line = word
    
    # 마지막 라인 추가
    lines.append(line)
    
    # 텍스트 출력
    y = position[1]
    for line in lines:
        draw.text((position[0], y), line, font=font, fill='black')
        y += font.getsize(line)[1]


def upload_to_aws(file_obj, bucket, s3_file_name):
    session = boto3.Session(
        aws_access_key_id= aws_key_id,
        aws_secret_access_key=aws_access_key,
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
        print("timezone:", timezone.now().date())
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

        print(request.data)
        category_name = request.data.get('category')
        description = request.data.get('description')
        language = request.data.get('language')
        age = request.data.get('age')
        
        eng_description = translate_sentence_eng(description)
        
        idx_color = random.randrange(0, len(pastelColors))
        bgColor = pastelColors[idx_color]

        # 중복된 카테고리 존재 여부 확인
        if Category.objects.filter(name=category_name, description = description, user=user).exists():
            return Response({"detail": "Category already exists"}, status=status.HTTP_400_BAD_REQUEST)

        # Category 데이터 생성
        category_data = {
            "name": category_name,
            "description": description,
            "bgColor": bgColor,
            "user": user.id  # user.id를 사용
        }
        
        # CategorySerializer에서 context로 request를 전달
        category_serializer = CategorySerializer(data=category_data, context={'request': request})
        if category_serializer.is_valid():
            category = category_serializer.save()

            # GPT를 활용하여 단어 리스트 생성
            res = get_english_words(category_name, eng_description, age)
            
            words = res.split('/')
            
            print(words)
            
            for word in words:
                word_list = []
                kor_word = get_korean_word(word)
                example = get_example(word, word_list)
                
                # 이미지 생성 및 URL 가져오기
                image_url = get_image(example)
                
                example = translate_sentence(example)
                word_list.append(example)
                other = get_foreign_word(kor_word, language)
                
               
                print(image_url)
                # URL에서 이미지 다운로드
                response = requests.get(image_url)
                response.raise_for_status()
                file_obj = io.BytesIO(response.content)

                # S3 업로드
                s3_url = upload_to_aws(file_obj, 'possg', f"{user.nickname}/cards/{category_name}/{word}.png")
                
                # 예시 날짜
                example_date = datetime.date(2024, 6, 19)
                
                card_data = {
                    "src": s3_url,
                    "kor": kor_word,
                    "other": other,
                    "example": example,
                    "timestamp": example_date,
                    #"timestamp": timezone.now().date()  # 생성 일자 설정
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
            "cards": card_serializer.data[:8]
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

        print("ㄱrrr:",request.data)
        # 카드와 포스터의 레이아웃 설정
        if type == 0:  # 카드
            title_margin = 0
            x_start = 50
            y_start = 20
            rows, cols = 4, 2
            x_offset, y_offset = 50, 55
            filename = f't{template}.png'
        
        
        
        
        elif type == 1:  # 포스터
            title_margin = 130
            x_start = 50
            y_start = 30
            rows, cols = 5, 4
            x_offset, y_offset = 20, 30
            filename = f'p{template}.png'
        else:
            return Response({"error": "Invalid type specified."}, status=status.HTTP_400_BAD_REQUEST)

        # 이미지 생성 로직
        template_image_path = f"""/home/honglee0317/BobbaVoca/backend/media/templates/{filename}""" # 템플릿 이미지 경로
        try:
            template_image = Image.open(template_image_path)
            print("template open success...")
        except Exception as e:
            return Response({"error": f"Error opening template image: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


        cards = Card.objects.filter(category=category)[:rows*cols]

        if not cards.exists():
            return Response({"error": "No cards found for the given category and description."}, status=status.HTTP_404_NOT_FOUND)


        draw = ImageDraw.Draw(template_image)
        font_path = "/home/honglee0317/BobbaVoca/backend/fonts/Maplestory_Light.ttf"
        font_path_kor = "/home/honglee0317/BobbaVoca/backend/fonts/온글잎 의청수 시우체.ttf"  
        try:
            if type == 0:
                font = ImageFont.truetype(font_path, 24)  # 폰트와 크기 설정
                font_title = ImageFont.truetype(font_path_kor, 40)  # 폰트와 크기 설정
                font_kor = ImageFont.truetype(font_path_kor, 24)  # 폰트와 크기 설정
                
                
            else:
                font_cat =  ImageFont.truetype(font_path, 32)
                font = ImageFont.truetype(font_path, 16)  # 폰트와 크기 설정
                font_title = ImageFont.truetype(font_path_kor, 20)  # 폰트와 크기 설정
                font_kor = ImageFont.truetype(font_path_kor, 18)  # 폰트와 크기 설정
            
        except Exception as e:
            return Response({"error": f"Error loading font: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        

        card_width = 794 // cols
        card_height = (1123 - title_margin) // rows

        for idx, card in enumerate(cards[:rows * cols]):  # 최대 카드와 포스터의 셀 개수에 따라 배치
            row = idx // cols
            col = idx % cols
            x = col * card_width + x_start
            y = title_margin + row * card_height + y_start

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

            if type == 0:
                # 텍스트 추가
                draw.text((x + 170, y + card_height // 2 - 100), f' {card.kor}', font=font_title, fill='black')
                draw.text((x + 180, y + card_height // 2 - 40), f' {card.other}', font=font, fill='black')
                #draw.text((x + 10, y + card_height // 2 + 30), f' {card.example}', font=font_kor, fill='black')
                
                max_width = 300

                # 줄바꿈 함수 호출
                draw_text_with_wrapping(draw, f'{card.example}', (x + 10, y + card_height // 2 + 30), font, max_width)

            else:
                # 텍스트 추가
                draw.text((270, 50), f' {category.description}', font=font_cat, fill='black')
                draw.text((x - 15, y + card_height // 2 + 5), f' {card.kor}', font=font_title, fill='black')
                #draw.text((x + 50, y + card_height // 2 + 5), f' {card.other}', font=font, fill='black')  
                draw.text((x - 10, y + card_height // 2 + 25), f' {card.other}', font=font, fill='black')
            

        # 결과 이미지를 저장하거나 반환
        if not os.path.exists(settings.MEDIA_ROOT):
            os.makedirs(settings.MEDIA_ROOT)

        filepath = os.path.join(settings.MEDIA_ROOT, filename)
        try:
            template_image.save(filepath, format='PNG')
        except Exception as e:
            return Response({"error": f"Error saving image: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


        image_url = request.build_absolute_uri(settings.MEDIA_URL + filename)
        
        printId = user.printId
        print("printId:", printId)
        epson_print(printId, filepath)
        
        return Response({"message": "Image created successfully", "image_url": image_url}, status=status.HTTP_200_OK)
    
    

class UserTimelineView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # 헤더에서 JWT 토큰 추출
        print("timezone:", timezone.now().date())
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

        # 사용자 관련 아기 정보 시리얼라이즈
        baby = get_object_or_404(Baby, user=user)
        baby_data = BabySerializer(baby).data

        # 모든 타임라인 데이터 가져오기
        timelines = []
        all_dates = Card.objects.filter(category__user=user).values_list('timestamp', flat=True).distinct()
        print("dates:", all_dates)
        for date in all_dates:
            cards = Card.objects.filter(timestamp=date, category__user=user)
            selected_cards = random.sample(list(cards), 3) if cards.count() >= 3 else cards

            # 해당 날짜의 메시지 가져오기
            try:
                message = Message.objects.get(user=user)
                msg = message.msg
            except Message.DoesNotExist:
                msg = ""

            voca_arr = []
            for card in selected_cards:
                voca_arr.append(card.kor)

            timelines.append({
                "timestamp": date.strftime('%Y-%m-%d'),
                "voca": voca_arr
            })
            timelines.sort(key = lambda x:x['timestamp'])
        # 응답 데이터 구성
        response_data = {
            "babies": baby_data,
            "msg": msg,  # 마지막 메시지를 넣어주거나 필요에 따라 수정
            "vocas": timelines
        }
        
        print(response_data)

        return Response(response_data, status=200)

class CreateTimelineView(APIView):
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
        msg = request.data.get('msg')
        print("received msg:", msg)
        if not msg:
            return Response({"error": "Message is required."}, status=status.HTTP_400_BAD_REQUEST)

        # 오늘 날짜 추출
        today = timezone.now().date()

        # 메시지가 이미 존재하는지 확인
        messages = Message.objects.filter(user=user)
        if messages.exists():
            message = messages.first()
            message.msg = msg
            message.save()
            print(message)
            response_msg = "Message updated successfully."
        else:
            message = Message.objects.create(user=user, msg=msg)
            response_msg = "Message created successfully."

        return Response({"message": response_msg}, status=status.HTTP_201_CREATED)
    
    
class SelectCategoriesView(APIView):

    def post(self, request):
        # 요청 본문에서 데이터 추출
        category_name = request.data.get('category', '')
        description = request.data.get('description', '')
        username = request.data.get('nickname', '')
        
        print("request:", request.data)

        print("user", username)
        # 사용자 확인
        user = get_object_or_404(User, nickname=username)

        # 카테고리 필터링
        categories = Category.objects.filter(name__icontains=category_name, description__icontains=description, user=user)

        # 카테고리 및 카드 시리얼라이즈
        response_data = []
        for category in categories:
            category_data = {
                "category": category.name,
                "description": category.description,
                "bgColor": category.bgColor,
                "username": username,
                "cards": []
            }
            cards = category.cards.all()
            for card in cards:
                card_data = {
                    "src": card.src,
                    "kor": card.kor,
                    "other": card.other,
                    "example": card.example
                }
                category_data["cards"].append(card_data)
            response_data.append(category_data)
            print("response:",response_data)
        return Response(response_data, status=200)