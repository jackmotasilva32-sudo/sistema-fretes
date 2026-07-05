from django.db import models
import uuid
from django.utils import timezone


class Motorista(models.Model):
    """
    Modelo de Motorista para armazenar informações de motoristas.
    """
    CATEGORIA_CHOICES = [
        ('A', 'A'),
        ('B', 'B'),
        ('C', 'C'),
        ('D', 'D'),
        ('E', 'E'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nome = models.CharField(max_length=255)
    cpf = models.CharField(max_length=14, unique=True)
    cnh = models.CharField(max_length=12, unique=True, null=True, blank=True)
    categoria_cnh = models.CharField(max_length=5, choices=CATEGORIA_CHOICES, null=True, blank=True)
    validade_cnh = models.DateField(null=True, blank=True)
    telefone = models.CharField(max_length=20, null=True, blank=True)
    email = models.EmailField(null=True, blank=True)
    endereco = models.TextField(null=True, blank=True)
    cidade = models.CharField(max_length=100, null=True, blank=True)
    estado = models.CharField(max_length=2, null=True, blank=True)
    data_nascimento = models.DateField(null=True, blank=True)
    data_cadastro = models.DateTimeField(default=timezone.now)
    ativo = models.BooleanField(default=True)
    observacoes = models.TextField(null=True, blank=True)
    
    class Meta:
        ordering = ['-data_cadastro']
        verbose_name = 'Motorista'
        verbose_name_plural = 'Motoristas'
        indexes = [
            models.Index(fields=['nome']),
            models.Index(fields=['cpf']),
        ]
        
    def __str__(self):
        return self.nome