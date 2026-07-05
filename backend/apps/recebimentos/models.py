from django.db import models
import uuid
from django.utils import timezone
from apps.clientes.models import Cliente
from apps.fretes.models import Frete


class Recebimento(models.Model):
    """
    Modelo de Recebimento para registrar recebimentos dos clientes.
    """
    STATUS_CHOICES = [
        ('PENDENTE', 'Pendente'),
        ('RECEBIDO', 'Recebido'),
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
    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE, related_name='recebimentos')
    frete = models.ForeignKey(Frete, on_delete=models.CASCADE, related_name='recebimentos')
    
    valor = models.DecimalField(max_digits=10, decimal_places=2)
    data_prevista = models.DateField()
    data_efetiva = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='PENDENTE')
    forma_pagamento = models.CharField(max_length=50, choices=FORMA_PAGAMENTO_CHOICES, null=True, blank=True)
    
    referencia = models.CharField(max_length=255, null=True, blank=True)  # Cheque, TED, etc
    data_criacao = models.DateTimeField(default=timezone.now)
    observacoes = models.TextField(null=True, blank=True)
    
    class Meta:
        ordering = ['-data_criacao']
        verbose_name = 'Recebimento'
        verbose_name_plural = 'Recebimentos'
        indexes = [
            models.Index(fields=['cliente', 'status']),
            models.Index(fields=['data_prevista']),
        ]
        
    def __str__(self):
        return f"Recebimento {self.id} - {self.cliente.nome} - R$ {self.valor}"