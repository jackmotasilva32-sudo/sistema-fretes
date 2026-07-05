from rest_framework import viewsets, filters, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from .models import Pagamento
from .serializers import PagamentoSerializer


class PagamentoViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gerenciar Pagamentos aos motoristas.
    """
    queryset = Pagamento.objects.all()
    serializer_class = PagamentoSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'motorista', 'forma_pagamento']
    search_fields = ['motorista__nome', 'referencia']
    ordering_fields = ['data_prevista', 'data_criacao']
    ordering = ['-data_criacao']
    
    @action(detail=True, methods=['patch'], url_path='registrar-pagamento')
    def registrar_pagamento(self, request, pk=None):
        """
        Marca um pagamento como realizado.
        """
        pagamento = self.get_object()
        
        if pagamento.status == 'CANCELADO':
            return Response(
                {'erro': 'Não é possível pagar um pagamento cancelado.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        pagamento.status = 'PAGO'
        pagamento.data_efetiva = timezone.now()
        pagamento.save()
        
        return Response(
            PagamentoSerializer(pagamento).data,
            status=status.HTTP_200_OK
        )