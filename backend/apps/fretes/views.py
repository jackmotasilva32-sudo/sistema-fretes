from rest_framework import viewsets, filters, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from .models import Frete
from .serializers import FreteSerializer


class FreteViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gerenciar Fretes.
    """
    queryset = Frete.objects.all()
    serializer_class = FreteSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'cliente', 'motorista']
    search_fields = ['cidade_origem', 'cidade_destino', 'cliente__nome']
    ordering_fields = ['data_criacao', 'data_entrega']
    ordering = ['-data_criacao']
    
    @action(detail=True, methods=['patch'], url_path='atualizar-status')
    def atualizar_status(self, request, pk=None):
        """
        Atualiza o status do frete.
        """
        frete = self.get_object()
        novo_status = request.data.get('status')
        
        if novo_status not in dict(Frete.STATUS_CHOICES):
            return Response(
                {'erro': f'Status inválido. Opções: {list(dict(Frete.STATUS_CHOICES).keys())}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        frete.status = novo_status
        
        if novo_status == 'COLETADO':
            frete.data_coleta = timezone.now()
        elif novo_status == 'ENTREGUE':
            frete.data_entrega = timezone.now()
        
        frete.save()
        
        return Response(
            FreteSerializer(frete).data,
            status=status.HTTP_200_OK
        )