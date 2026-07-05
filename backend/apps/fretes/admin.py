from django.contrib import admin
from .models import Frete


@admin.register(Frete)
class FreteAdmin(admin.ModelAdmin):
    list_display = ('id', 'cliente', 'motorista', 'cidade_origem', 'cidade_destino', 'status', 'valor_frete', 'data_criacao')
    list_filter = ('status', 'data_criacao', 'cliente')
    search_fields = ('id', 'cliente__nome', 'cidade_origem', 'cidade_destino')
    readonly_fields = ('id', 'data_criacao')
    fieldsets = (
        ('Informações Principais', {
            'fields': ('id', 'cliente', 'motorista', 'veiculo', 'status')
        }),
        ('Rotas', {
            'fields': ('cidade_origem', 'endereco_origem', 'cidade_destino', 'endereco_destino')
        }),
        ('Carga', {
            'fields': ('peso_kg', 'valor_frete')
        }),
        ('Datas', {
            'fields': ('data_criacao', 'data_coleta', 'data_entrega')
        }),
        ('Observações', {
            'fields': ('observacoes',)
        }),
    )