from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RecebimentoViewSet

router = DefaultRouter()
router.register(r'', RecebimentoViewSet, basename='recebimento')

urlpatterns = [
    path('', include(router.urls)),
]