from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView
from .views import *
from rest_framework import routers


urlpatterns = [
    path('make', CardsGenerateView.as_view(), name='generate-cards'),
    path('myvoca', CategoryListView.as_view(), name='category-list'),
    path('select-myvoca', CategoryCardsView.as_view(), name='category-cards'),
    path('remove', CategoryDeleteView.as_view(), name='delete-cards'),
    path('allvoca', AllCategoriesView.as_view(), name='all-categories'),
    path('print', CreateTemplateView.as_view(), name='create-template'),
    path('make-timeline', CreateTimelineView.as_view(), name='create-message'),
    path('timeline', UserTimelineView.as_view(), name='user-timeline'),
]