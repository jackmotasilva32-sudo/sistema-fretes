from django.contrib import admin
from .models import Veiculo, MotoristVeiculo


@admin.register(Veiculo)
class VeiculoAdmin(admin.ModelAdmin):
    list_display = ('placa', 'marca', 'modelo', 'ano', 'capacidade_kg', 'ativo', 'data_cadastro')
    list_filter = ('ativo', 'marca', 'ano', 'data_cadastro')
    search_fields = ('placa', 'marca', 'modelo', 'renavam')
    readonly_fields = ('id', 'data_cadastro')


@admin.register(MotoristVeiculo)
class MotoristVeiculoAdmin(admin.ModelAdmin):
    list_display = ('motorista', 'veiculo', 'data_inicio', 'data_fim', 'ativo')
    list_filter = ('ativo', 'data_inicio')
    search_fields = ('motorista__nome', 'veiculo__placa')
    readonly_fields = ('id',)