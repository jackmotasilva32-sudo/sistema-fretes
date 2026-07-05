from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from .models import Motorista
from .serializers import MotoristasSerializer


class MotoristasViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gerenciar Motoristas.
    Suporta CRUD completo com filtros e busca.
    """
    queryset = Motorista.objects.all()
    serializer_class = MotoristasSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['ativo', 'categoria_cnh', 'estado']
    search_fields = ['nome', 'cpf', 'cnh', 'email', 'telefone']
    ordering_fields = ['nome', 'data_cadastro']
    ordering = ['-data_cadastro']