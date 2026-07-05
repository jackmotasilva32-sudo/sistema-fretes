from django.db import models
import uuid
from django.utils import timezone
from apps.clientes.models import Cliente
from apps.motoristas.models import Motorista
from apps.veiculos.models import Veiculo


class Frete(models.Model):
    """
    Modelo de Frete para rastrear operações de transporte.
    """
    STATUS_CHOICES = [
        ('PENDENTE', 'Pendente'),
        ('COLETADO', 'Coletado'),
        ('EM_TRANSITO', 'Em Trânsito'),
        ('ENTREGUE', 'Entregue'),
        ('CANCELADO', 'Cancelado'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    cliente = models.ForeignKey(Cliente, on_delete=models.PROTECT, related_name='fretes')
    motorista = models.ForeignKey(Motorista, on_delete=models.SET_NULL, null=True, blank=True, related_name='fretes')
    veiculo = models.ForeignKey(Veiculo, on_delete=models.SET_NULL, null=True, blank=True, related_name='fretes')
    
    cidade_origem = models.CharField(max_length=255)
    cidade_destino = models.CharField(max_length=255)
    endereco_origem = models.TextField(null=True, blank=True)
    endereco_destino = models.TextField(null=True, blank=True)
    
    peso_kg = models.DecimalField(max_digits=10, decimal_places=2)
    valor_frete = models.DecimalField(max_digits=10, decimal_places=2)
    
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='PENDENTE')
    
    data_criacao = models.DateTimeField(default=timezone.now)
    data_coleta = models.DateTimeField(null=True, blank=True)
    data_entrega = models.DateTimeField(null=True, blank=True)
    
    observacoes = models.TextField(null=True, blank=True)
    
    class Meta:
        ordering = ['-data_criacao']
        verbose_name = 'Frete'
        verbose_name_plural = 'Fretes'
        indexes = [
            models.Index(fields=['id', 'data_criacao']),
            models.Index(fields=['cliente']),
            models.Index(fields=['status']),
        ]
        
    def __str__(self):
        return f"Frete {self.id} - {self.cidade_origem} → {self.cidade_destino}"