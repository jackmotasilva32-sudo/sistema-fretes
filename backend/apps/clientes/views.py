from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from .models import Cliente
from .serializers import ClienteSerializer


class ClienteViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gerenciar Clientes.
    Suporta CRUD completo com filtros e busca.
    """
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['ativo', 'estado', 'cidade']
    search_fields = ['nome', 'cnpj_cpf', 'email', 'telefone']
    ordering_fields = ['nome', 'data_cadastro']
    ordering = ['-data_cadastro']