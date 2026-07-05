from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VeiculoViewSet, MotoristVeiculoViewSet

router = DefaultRouter()
router.register(r'', VeiculoViewSet, basename='veiculo')
router.register(r'motorista-veiculo', MotoristVeiculoViewSet, basename='motorista-veiculo')

urlpatterns = [
    path('', include(router.urls)),
]