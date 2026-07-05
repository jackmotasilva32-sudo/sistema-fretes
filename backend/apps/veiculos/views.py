from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from .models import Veiculo, MotoristVeiculo
from .serializers import VeiculoSerializer, MotoristVeiculoSerializer


class VeiculoViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gerenciar Veículos.
    """
    queryset = Veiculo.objects.all()
    serializer_class = VeiculoSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['ativo', 'marca', 'ano']
    search_fields = ['placa', 'marca', 'modelo']
    ordering_fields = ['placa', 'data_cadastro']
    ordering = ['-data_cadastro']


class MotoristVeiculoViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gerenciar vínculos Motorista-Veículo.
    """
    queryset = MotoristVeiculo.objects.all()
    serializer_class = MotoristVeiculoSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['ativo', 'motorista', 'veiculo']
    search_fields = ['motorista__nome', 'veiculo__placa']
    ordering = ['-data_inicio']