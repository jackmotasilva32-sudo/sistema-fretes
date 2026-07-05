from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FreteViewSet

router = DefaultRouter()
router.register(r'', FreteViewSet, basename='frete')

urlpatterns = [
    path('', include(router.urls)),
]