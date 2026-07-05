from django.contrib import admin
from .models import Pagamento


@admin.register(Pagamento)
class PagamentoAdmin(admin.ModelAdmin):
    list_display = ('id', 'motorista', 'valor', 'status', 'data_prevista', 'data_efetiva', 'forma_pagamento')
    list_filter = ('status', 'forma_pagamento', 'data_prevista', 'data_criacao')
    search_fields = ('id', 'motorista__nome', 'referencia')
    readonly_fields = ('id', 'data_criacao')