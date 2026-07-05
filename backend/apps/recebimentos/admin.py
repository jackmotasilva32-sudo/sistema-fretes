from django.contrib import admin
from .models import Recebimento


@admin.register(Recebimento)
class RecebimentoAdmin(admin.ModelAdmin):
    list_display = ('id', 'cliente', 'valor', 'status', 'data_prevista', 'data_efetiva', 'forma_pagamento')
    list_filter = ('status', 'forma_pagamento', 'data_prevista', 'data_criacao')
    search_fields = ('id', 'cliente__nome', 'referencia')
    readonly_fields = ('id', 'data_criacao')