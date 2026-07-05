from django.db import models
import uuid
from django.utils import timezone
from apps.motoristas.models import Motorista


class Veiculo(models.Model):
    """
    Modelo de Veículo para armazenar informações de veículos.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    placa = models.CharField(max_length=10, unique=True)
    marca = models.CharField(max_length=100)
    modelo = models.CharField(max_length=100)
    ano = models.IntegerField()
    capacidade_kg = models.DecimalField(max_digits=10, decimal_places=2)
    cor = models.CharField(max_length=50, null=True, blank=True)
    renavam = models.CharField(max_length=11, unique=True, null=True, blank=True)
    chassis = models.CharField(max_length=17, unique=True, null=True, blank=True)
    data_cadastro = models.DateTimeField(default=timezone.now)
    ativo = models.BooleanField(default=True)
    observacoes = models.TextField(null=True, blank=True)
    
    class Meta:
        ordering = ['-data_cadastro']
        verbose_name = 'Veículo'
        verbose_name_plural = 'Veículos'
        indexes = [
            models.Index(fields=['placa']),
        ]
        
    def __str__(self):
        return f"{self.marca} {self.modelo} ({self.placa})"


class MotoristVeiculo(models.Model):
    """
    Modelo para vincular Motoristas com Veículos.
    Um motorista pode ter múltiplos veículos ao longo do tempo.
    Um veículo pode ter múltiplos motoristas.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    motorista = models.ForeignKey(Motorista, on_delete=models.CASCADE, related_name='veiculos')
    veiculo = models.ForeignKey(Veiculo, on_delete=models.CASCADE, related_name='motoristas')
    data_inicio = models.DateTimeField(default=timezone.now)
    data_fim = models.DateTimeField(null=True, blank=True)
    ativo = models.BooleanField(default=True)
    observacoes = models.TextField(null=True, blank=True)
    
    class Meta:
        ordering = ['-data_inicio']
        verbose_name = 'Vínculo Motorista-Veículo'
        verbose_name_plural = 'Vínculos Motorista-Veículo'
        unique_together = [['motorista', 'veiculo', 'data_inicio']]
        
    def __str__(self):
        return f"{self.motorista.nome} - {self.veiculo.placa}"