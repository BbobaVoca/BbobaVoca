# serializers.py

from .models import User, Baby
from rest_framework import serializers

class BabySerializer(serializers.ModelSerializer):
    class Meta:
        model = Baby
        fields = ['name', 'profile']

class BabyUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Baby
        fields = ['name', 'profile']



class UserSerializer(serializers.ModelSerializer):
    babies = BabySerializer()

    class Meta:
        model = User
        fields = ['email', 'password', 'nickname', 'babies', 'credit']
        extra_kwargs = {
            'password': {'write_only': True},
            'credit': {'read_only': True}
        }

    def create(self, validated_data):
        # babies 필드 데이터 추출
        
        print("val_data:", validated_data)
        
        baby_data = validated_data.pop('babies')
        
        
        # 사용자 생성
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            nickname=validated_data['nickname']
        )
        

        # Baby 인스턴스 생성
        Baby.objects.create(user=user, **baby_data)
        
        return user
    
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("이메일이 이미 사용 중입니다.")
        return value

    def validate_nickname(self, value):
        if User.objects.filter(nickname=value).exists():
            raise serializers.ValidationError("닉네임이 이미 사용 중입니다.")
        return value



class UserInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'nickname']
