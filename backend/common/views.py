from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from .serializers import *
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import status
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from django.conf import settings
from .utils import upload_to_aws  # Assuming the upload_to_aws function is in a utils.py file
import os



    

class RegisterAPIView(APIView):
    def post(self, request):
        # 요청 데이터 복사
        data = request.data.copy()

        print(data)
        # 파일 필드 처리
        name = data.get('name')
        profile = request.FILES.get('profile')
        if not profile:
            s3_url = "https://i.ibb.co/ZTqGtW4/default-image.png"
        else:
            # S3에 업로드할 파일 경로 설정
            s3_file_path = os.path.join(data.get('nickname'), "profile", profile.name)

            # S3에 파일 업로드
            s3_url = upload_to_aws(profile, 'possg', s3_file_path)
            if not s3_url:
                return Response({"error": "File upload failed."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


        # babies 필드를 포함하도록 데이터 수정
        data['babies'] = {
            "name": name,
            "profile": s3_url
        }

        print("Modified data: ", data)

        # QueryDict에서 일반 딕셔너리로 변환
        data = {key: value[0] if isinstance(value, list) else value for key, value in data.items()}

        # UserSerializer를 사용하여 유저 생성
        serializer = UserSerializer(data=data)
        if serializer.is_valid():
            user = serializer.save()

            # JWT 토큰 가져오기
            token = TokenObtainPairSerializer.get_token(user)
            refresh_token = str(token)
            access_token = str(token.access_token)
            res = Response(
                {
                    "message": "signup success",
                },
                status=status.HTTP_200_OK,
            )

            # JWT 토큰을 쿠키에 저장
            res.set_cookie("access", access_token, httponly=True)
            res.set_cookie("refresh", refresh_token, httponly=True)

            return res

        # 유효성 검사 오류 메시지 출력
        print("Serializer errors: ", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



import jwt
from rest_framework.views import APIView
from .serializers import *
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenRefreshSerializer
from rest_framework import status
from rest_framework.response import Response
from django.contrib.auth import authenticate
from django.shortcuts import render, get_object_or_404
from config.settings import SECRET_KEY



class AuthAPIView(APIView):
    # 유저 정보 확인
    def get(self, request):
        try:
            # access token을 decode 해서 유저 id 추출 => 유저 식별
            access = request.COOKIES['access']
            payload = jwt.decode(access, SECRET_KEY, algorithms=['HS256'])
            pk = payload.get('user_id')
            user = get_object_or_404(User, pk=pk)
            serializer = UserSerializer(instance=user)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except(jwt.exceptions.ExpiredSignatureError):
            # 토큰 만료 시 토큰 갱신
            data = {'refresh': request.COOKIES.get('refresh', None)}
            serializer = TokenRefreshSerializer(data=data)
            if serializer.is_valid(raise_exception=True):
                access = serializer.data.get('access', None)
                refresh = serializer.data.get('refresh', None)
                payload = jwt.decode(access, SECRET_KEY, algorithms=['HS256'])
                pk = payload.get('user_id')
                user = get_object_or_404(User, pk=pk)
                serializer = UserSerializer(instance=user)
                res = Response(serializer.data, status=status.HTTP_200_OK)
                res.set_cookie('access', access)
                res.set_cookie('refresh', refresh)
                return res
            raise jwt.exceptions.InvalidTokenError

        except(jwt.exceptions.InvalidTokenError):
            # 사용 불가능한 토큰일 때
            return Response(status=status.HTTP_400_BAD_REQUEST)

    # 로그인
    def post(self, request):
    	# 유저 인증
        user = authenticate(
            email=request.data.get("email"), password=request.data.get("password")
        )
        # 이미 회원가입 된 유저일 때
        if user is not None:
            serializer = UserSerializer(user)
            # jwt 토큰 접근
            token = TokenObtainPairSerializer.get_token(user)
            refresh_token = str(token)
            access_token = str(token.access_token)
            res = Response(
                {
                    "token": access_token,
                },
                status=status.HTTP_200_OK,
            )
            # jwt 토큰 => 쿠키에 저장
            res.set_cookie("access", access_token, httponly=True)
            res.set_cookie("refresh", refresh_token, httponly=True)
            return res
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    # 로그아웃
    def delete(self, request):
        # 쿠키에 저장된 토큰 삭제 => 로그아웃 처리
        response = Response({
            "message": "Logout success"
            }, status=status.HTTP_202_ACCEPTED)
        response.delete_cookie("access")
        response.delete_cookie("refresh")
        return response
    
    
 
    
# views.py
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .serializers import *

# jwt 토근 인증 확인용 뷰셋
# Header - Authorization : Bearer <발급받은토큰>
class UserViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
    
class EmailCheckView(APIView):
    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({"error": "이메일 주소를 제공해주세요."}, status=status.HTTP_400_BAD_REQUEST)
        
        # 이메일 중복 검사
        data = {"isExist": User.objects.filter(email=email).exists()}
        return Response(data, status=status.HTTP_200_OK)

class CheckNicknameAPIView(APIView):
    def post(self, request):
        nickname = request.data.get('nickname')
        if not nickname:
            return Response({"error": "닉네임을 제공해주세요."}, status=status.HTTP_400_BAD_REQUEST)
        
        # 닉네임 중복 검사
        data = {"isExist": User.objects.filter(nickname=nickname).exists()}
        return Response(data, status=status.HTTP_200_OK)
    
class UserListView(APIView):
    def get(self, request):
        users = User.objects.all()
        serializer = UserInfoSerializer(users, many=True)  # 여러 객체를 직렬화하기 위해 many=True 옵션 사용
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserInfoSerializer(request.user)
        return Response(serializer.data)
    
class LogoutView(APIView):
    def post(self, request):
        # 클라이언트에 로그아웃 요청을 성공적으로 받았다고 응답
        # 쿠키에 저장된 토큰 삭제 => 로그아웃 처리
        response = Response({
            "message": "Logout success"
            }, status=status.HTTP_202_ACCEPTED)
        response.delete_cookie("access")
        response.delete_cookie("refresh")
        return response
    
    
class UserDetailView(APIView):
    def get(self, request):
        try:
            print("detail view.......")
            print("")
            
            
            # 헤더에서 JWT 토큰 추출
            token = request.headers.get('Authorization', None)
            if token is None:
                raise AuthenticationFailed('Authorization token not provided')

            # "Bearer " 부분을 제거하여 실제 토큰 값만 추출
            if not token.startswith('Bearer '):
                raise AuthenticationFailed('Invalid token format')
            token = token.split('Bearer ')[1]

            # 토큰 디코딩
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])

            # 페이로드에서 유저 ID 추출 및 유저 객체 조회
            user_id = payload.get('user_id')
            if not user_id:
                raise AuthenticationFailed('Token payload invalid')

            user = get_object_or_404(User, pk=user_id)

            print("user success...:", user)


            # 사용자 관련 아기 정보 시리얼라이즈
            babies = user.babies.all()[0]
            
            baby_data = BabySerializer(babies).data
            
            
            # 응답 데이터 구성
            
            user_data = {
                "email": user.email,
                "nickname": user.nickname,
                "credit": user.credit,
            }
            
            response_data = {
                "email": user_data['email'],
                "nickname": user_data['nickname'],
                "babies": baby_data,
                "credit": user_data['credit']
            }
            
            print(response_data)

            return Response(response_data, status=status.HTTP_200_OK)
        except jwt.ExpiredSignatureError:
            return Response({'error': 'Token has expired'}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.PyJWTError as e:
            return Response({'error': 'Error in token decoding: ' + str(e)}, status=status.HTTP_401_UNAUTHORIZED)
        except AuthenticationFailed as e:
            return Response({'error': str(e)}, status=status.HTTP_401_UNAUTHORIZED)




class UpdateBabyProfileAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # 헤더에서 JWT 토큰 추출
        token = request.headers.get('Authorization')
        if not token:
            return Response({"error": "Authorization token not provided"}, status=status.HTTP_401_UNAUTHORIZED)
        
        # "Bearer " 부분을 제거하여 실제 토큰 값만 추출
        if not token.startswith('Bearer '):
            return Response({"error": "Invalid token format"}, status=status.HTTP_401_UNAUTHORIZED)
        token = token.split('Bearer ')[1]

        # 토큰 디코딩
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            return Response({'error': 'Token has expired'}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.PyJWTError as e:
            return Response({'error': 'Error in token decoding: ' + str(e)}, status=status.HTTP_401_UNAUTHORIZED)

        # 페이로드에서 유저 ID 추출 및 유저 객체 조회
        user_id = payload.get('user_id')
        if not user_id:
            return Response({'error': 'Token payload invalid'}, status=status.HTTP_401_UNAUTHORIZED)

        user = get_object_or_404(User, pk=user_id)

        # 요청 데이터에서 아기 이름 및 파일 추출
        baby_name = request.data.get('name')
        if not baby_name:
            return Response({"error": "Baby name is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            baby = user.babies.get(name=baby_name)
        except Baby.DoesNotExist:
            return Response({"error": "Baby not found."}, status=status.HTTP_404_NOT_FOUND)

        file = request.FILES.get('file')
        if not file:
            return Response({"error": "File is required."}, status=status.HTTP_400_BAD_REQUEST)

        # S3에 업로드할 파일 경로 설정
        s3_file_path = os.path.join(user.nickname, "profile", file.name)

        # S3에 파일 업로드
        s3_url = upload_to_aws(file, 'possg', s3_file_path)
        if not s3_url:
            return Response({"error": "File upload failed."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # 프로필 URL 업데이트
        baby.profile = s3_url
        baby.save()

        # 응답 데이터 구성
        serializer = BabyUpdateSerializer(baby)
        return Response(serializer.data, status=status.HTTP_200_OK)