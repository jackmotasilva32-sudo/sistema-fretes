"""
URL configuration for sistema-fretes project.
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Authentication
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # API Endpoints
    path('api/clientes/', include('apps.clientes.urls')),
    path('api/motoristas/', include('apps.motoristas.urls')),
    path('api/veiculos/', include('apps.veiculos.urls')),
    path('api/fretes/', include('apps.fretes.urls')),
    path('api/pagamentos/', include('apps.pagamentos.urls')),
    path('api/recebimentos/', include('apps.recebimentos.urls')),
    path('api/relatorios/', include('apps.relatorios.urls')),
]