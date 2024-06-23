from django.contrib import admin
from django.urls import path, include
#from possg.views import CreateUserFolder, ImageUploadView, UserFoldersInfoView, FolderView


from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('admin/', admin.site.urls),
    path('voca/members/', include('common.urls')),
    path('voca/bbobavoca/', include('bobbavoca.urls')),
]