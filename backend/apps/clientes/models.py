from django.db import models
import uuid
from django.utils import timezone


class Cliente(models.Model):
    """
    Modelo de Cliente para armazenar informações de clientes.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nome = models.CharField(max_length=255)
    cnpj_cpf = models.CharField(max_length=18, unique=True, null=True, blank=True)
    endereco = models.TextField(null=True, blank=True)
    cidade = models.CharField(max_length=100, null=True, blank=True)
    estado = models.CharField(max_length=2, null=True, blank=True)
    cep = models.CharField(max_length=10, null=True, blank=True)
    telefone = models.CharField(max_length=20, null=True, blank=True)
    email = models.EmailField(null=True, blank=True)
    contato = models.CharField(max_length=255, null=True, blank=True)
    data_cadastro = models.DateTimeField(default=timezone.now)
    ativo = models.BooleanField(default=True)
    observacoes = models.TextField(null=True, blank=True)
    
    class Meta:
        ordering = ['-data_cadastro']
        verbose_name = 'Cliente'
        verbose_name_plural = 'Clientes'
        indexes = [
            models.Index(fields=['nome']),
            models.Index(fields=['cnpj_cpf']),
        ]
        
    def __str__(self):
        return self.nome