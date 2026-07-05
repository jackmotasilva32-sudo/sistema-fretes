from rest_framework import viewsets, filters, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum, Count, Q, F
from django.utils import timezone
from datetime import datetime, timedelta
from apps.fretes.models import Frete
from apps.pagamentos.models import Pagamento
from apps.recebimentos.models import Recebimento
from apps.motoristas.models import Motorista
from apps.veiculos.models import Veiculo


class RelatorioViewSet(viewsets.ViewSet):
    """
    ViewSet para gerar relatórios de fretes, pagamentos e recebimentos.
    """
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def mensal(self, request):
        """
        Relatório mensal de fretes, pagamentos e recebimentos.
        """
        mes = request.query_params.get('mes', datetime.now().month)
        ano = request.query_params.get('ano', datetime.now().year)
        
        # Fretes do mês
        fretes = Frete.objects.filter(
            data_criacao__month=mes,
            data_criacao__year=ano
        )
        
        fretes_stats = fretes.aggregate(
            total_fretes=Count('id'),
            valor_total=Sum('valor_frete'),
            concluidos=Count('id', filter=Q(status='ENTREGUE')),
            pendentes=Count('id', filter=Q(status='PENDENTE')),
        )
        
        # Pagamentos do mês
        pagamentos = Pagamento.objects.filter(
            data_prevista__month=mes,
            data_prevista__year=ano
        )
        
        pagamentos_stats = pagamentos.aggregate(
            total_pagamentos=Count('id'),
            valor_total=Sum('valor'),
            pagos=Count('id', filter=Q(status='PAGO')),
            pendentes=Count('id', filter=Q(status='PENDENTE')),
        )
        
        # Recebimentos do mês
        recebimentos = Recebimento.objects.filter(
            data_prevista__month=mes,
            data_prevista__year=ano
        )
        
        recebimentos_stats = recebimentos.aggregate(
            total_recebimentos=Count('id'),
            valor_total=Sum('valor'),
            recebidos=Count('id', filter=Q(status='RECEBIDO')),
            pendentes=Count('id', filter=Q(status='PENDENTE')),
        )
        
        return Response({
            'mes': mes,
            'ano': ano,
            'fretes': fretes_stats,
            'pagamentos': pagamentos_stats,
            'recebimentos': recebimentos_stats,
        })
    
    @action(detail=False, methods=['get'])
    def anual(self, request):
        """
        Relatório anual de fretes, pagamentos e recebimentos.
        """
        ano = request.query_params.get('ano', datetime.now().year)
        
        relatorio_mensal = []
        
        for mes in range(1, 13):
            fretes = Frete.objects.filter(
                data_criacao__month=mes,
                data_criacao__year=ano
            )
            
            fretes_stats = fretes.aggregate(
                total_fretes=Count('id'),
                valor_total=Sum('valor_frete'),
            )
            
            pagamentos = Pagamento.objects.filter(
                data_prevista__month=mes,
                data_prevista__year=ano
            )
            
            pagamentos_stats = pagamentos.aggregate(
                total_pagamentos=Count('id'),
                valor_total=Sum('valor'),
            )
            
            recebimentos = Recebimento.objects.filter(
                data_prevista__month=mes,
                data_prevista__year=ano
            )
            
            recebimentos_stats = recebimentos.aggregate(
                total_recebimentos=Count('id'),
                valor_total=Sum('valor'),
            )
            
            relatorio_mensal.append({
                'mes': mes,
                'fretes': fretes_stats,
                'pagamentos': pagamentos_stats,
                'recebimentos': recebimentos_stats,
            })
        
        return Response({
            'ano': ano,
            'relatorio_mensal': relatorio_mensal,
        })
    
    @action(detail=False, methods=['get'])
    def por_motorista(self, request):
        """
        Relatório de fretes por motorista.
        """
        motorista_id = request.query_params.get('motorista_id')
        
        if not motorista_id:
            return Response(
                {'erro': 'motorista_id é obrigatório'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            motorista = Motorista.objects.get(id=motorista_id)
        except Motorista.DoesNotExist:
            return Response(
                {'erro': 'Motorista não encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        fretes = Frete.objects.filter(motorista=motorista)
        
        stats = fretes.aggregate(
            total_fretes=Count('id'),
            valor_total=Sum('valor_frete'),
            entregues=Count('id', filter=Q(status='ENTREGUE')),
            em_transito=Count('id', filter=Q(status='EM_TRANSITO')),
            pendentes=Count('id', filter=Q(status='PENDENTE')),
        )
        
        # Pagamentos do motorista
        pagamentos = Pagamento.objects.filter(motorista=motorista)
        pagamentos_stats = pagamentos.aggregate(
            total_pagamentos=Count('id'),
            valor_total=Sum('valor'),
            pagos=Count('id', filter=Q(status='PAGO')),
            pendentes=Count('id', filter=Q(status='PENDENTE')),
        )
        
        return Response({
            'motorista': {
                'id': motorista.id,
                'nome': motorista.nome,
            },
            'fretes': stats,
            'pagamentos': pagamentos_stats,
        })
    
    @action(detail=False, methods=['get'])
    def por_veiculo(self, request):
        """
        Relatório de fretes por veículo.
        """
        veiculo_id = request.query_params.get('veiculo_id')
        
        if not veiculo_id:
            return Response(
                {'erro': 'veiculo_id é obrigatório'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            veiculo = Veiculo.objects.get(id=veiculo_id)
        except Veiculo.DoesNotExist:
            return Response(
                {'erro': 'Veículo não encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        fretes = Frete.objects.filter(veiculo=veiculo)
        
        stats = fretes.aggregate(
            total_fretes=Count('id'),
            valor_total=Sum('valor_frete'),
            peso_total=Sum('peso_kg'),
            entregues=Count('id', filter=Q(status='ENTREGUE')),
            em_transito=Count('id', filter=Q(status='EM_TRANSITO')),
        )
        
        return Response({
            'veiculo': {
                'id': veiculo.id,
                'placa': veiculo.placa,
                'marca': veiculo.marca,
                'modelo': veiculo.modelo,
            },
            'fretes': stats,
        })
    
    @action(detail=False, methods=['get'])
    def por_cliente(self, request):
        """
        Relatório de fretes por cliente.
        """
        cliente_id = request.query_params.get('cliente_id')
        
        if not cliente_id:
            return Response(
                {'erro': 'cliente_id é obrigatório'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        from apps.clientes.models import Cliente
        
        try:
            cliente = Cliente.objects.get(id=cliente_id)
        except Cliente.DoesNotExist:
            return Response(
                {'erro': 'Cliente não encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        fretes = Frete.objects.filter(cliente=cliente)
        
        stats = fretes.aggregate(
            total_fretes=Count('id'),
            valor_total=Sum('valor_frete'),
            entregues=Count('id', filter=Q(status='ENTREGUE')),
            pendentes=Count('id', filter=Q(status='PENDENTE')),
        )
        
        # Recebimentos do cliente
        recebimentos = Recebimento.objects.filter(cliente=cliente)
        recebimentos_stats = recebimentos.aggregate(
            total_recebimentos=Count('id'),
            valor_total=Sum('valor'),
            recebidos=Count('id', filter=Q(status='RECEBIDO')),
            pendentes=Count('id', filter=Q(status='PENDENTE')),
        )
        
        return Response({
            'cliente': {
                'id': cliente.id,
                'nome': cliente.nome,
            },
            'fretes': stats,
            'recebimentos': recebimentos_stats,
        })