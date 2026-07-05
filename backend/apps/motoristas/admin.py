from django.contrib import admin
from .models import Motorista


@admin.register(Motorista)
class MotoristasAdmin(admin.ModelAdmin):
    list_display = ('nome', 'cpf', 'cnh', 'categoria_cnh', 'validade_cnh', 'ativo', 'data_cadastro')
    list_filter = ('ativo', 'categoria_cnh', 'estado', 'data_cadastro')
    search_fields = ('nome', 'cpf', 'cnh', 'email')
    readonly_fields = ('id', 'data_cadastro')