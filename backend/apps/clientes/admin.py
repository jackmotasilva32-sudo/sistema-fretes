from django.contrib import admin
from .models import Cliente


@admin.register(Cliente)
class ClienteAdmin(admin.ModelAdmin):
    list_display = ('nome', 'cnpj_cpf', 'email', 'telefone', 'ativo', 'data_cadastro')
    list_filter = ('ativo', 'estado', 'data_cadastro')
    search_fields = ('nome', 'cnpj_cpf', 'email')
    readonly_fields = ('id', 'data_cadastro')