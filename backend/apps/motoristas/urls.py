from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MotoristasViewSet

router = DefaultRouter()
router.register(r'', MotoristasViewSet)

urlpatterns = [
    path('', include(router.urls)),
]