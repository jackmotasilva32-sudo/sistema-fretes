from django.db import models
import uuid
from django.utils import timezone
from apps.motoristas.models import Motorista
from apps.fretes.models import Frete


class Pagamento(models.Model):
    """
    Modelo de Pagamento para registrar pagamentos aos motoristas.
    """
    STATUS_CHOICES = [
        ('PENDENTE', 'Pendente'),
        ('PAGO', 'Pago'),
        ('CANCELADO', 'Cancelado'),
    ]
    
    FORMA_PAGAMENTO_CHOICES = [
        ('DINHEIRO', 'Dinheiro'),
        ('CHEQUE', 'Cheque'),
        ('CARTAO', 'Cartão'),
        ('TRANSFERENCIA', 'Transferência'),
        ('PIX', 'PIX'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    motorista = models.ForeignKey(Motorista, on_delete=models.CASCADE, related_name='pagamentos')
    frete = models.ForeignKey(Frete, on_delete=models.SET_NULL, null=True, blank=True, related_name='pagamentos')
    
    valor = models.DecimalField(max_digits=10, decimal_places=2)
    data_prevista = models.DateField()
    data_efetiva = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='PENDENTE')
    forma_pagamento = models.CharField(max_length=50, choices=FORMA_PAGAMENTO_CHOICES)
    
    referencia = models.CharField(max_length=255, null=True, blank=True)  # Cheque, TED, etc
    data_criacao = models.DateTimeField(default=timezone.now)
    observacoes = models.TextField(null=True, blank=True)
    
    class Meta:
        ordering = ['-data_criacao']
        verbose_name = 'Pagamento'
        verbose_name_plural = 'Pagamentos'
        indexes = [
            models.Index(fields=['motorista', 'status']),
            models.Index(fields=['data_prevista']),
        ]
        
    def __str__(self):
        return f"Pagamento {self.id} - {self.motorista.nome} - R$ {self.valor}"