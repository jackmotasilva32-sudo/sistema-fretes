from rest_framework import viewsets, filters, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from .models import Recebimento
from .serializers import RecebimentoSerializer


class RecebimentoViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gerenciar Recebimentos dos clientes.
    """
    queryset = Recebimento.objects.all()
    serializer_class = RecebimentoSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'cliente', 'forma_pagamento']
    search_fields = ['cliente__nome', 'referencia']
    ordering_fields = ['data_prevista', 'data_criacao']
    ordering = ['-data_criacao']
    
    @action(detail=True, methods=['patch'], url_path='registrar-recebimento')
    def registrar_recebimento(self, request, pk=None):
        """
        Marca um recebimento como realizado.
        """
        recebimento = self.get_object()
        
        if recebimento.status == 'CANCELADO':
            return Response(
                {'erro': 'Não é possível receber um recebimento cancelado.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        forma_pagamento = request.data.get('forma_pagamento')
        if not forma_pagamento:
            return Response(
                {'erro': 'Forma de pagamento é obrigatória.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        recebimento.status = 'RECEBIDO'
        recebimento.data_efetiva = timezone.now()
        recebimento.forma_pagamento = forma_pagamento
        recebimento.save()
        
        return Response(
            RecebimentoSerializer(recebimento).data,
            status=status.HTTP_200_OK
        )