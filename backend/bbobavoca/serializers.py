from rest_framework import serializers
from .models import Category, Card

class CardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = ['src', 'kor', 'other', 'example']

class CategorySerializer(serializers.ModelSerializer):
    cards = CardSerializer(many=True)
    user = serializers.ReadOnlyField(source='user.username')  # 유저 필드를 읽기 전용으로 설정

    class Meta:
        model = Category
        fields = ['name', 'description', 'bgColor', 'cards', 'user']

    def create(self, validated_data):
        cards_data = validated_data.pop('cards')
        category = Category.objects.create(**validated_data)
        for card_data in cards_data:
            Card.objects.create(category=category, **card_data)
        return category
