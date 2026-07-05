from rest_framework import serializers
from .models import Pagamento


class PagamentoSerializer(serializers.ModelSerializer):
    motorista_nome = serializers.CharField(source='motorista.nome', read_only=True)
    frete_id = serializers.CharField(source='frete.id', read_only=True, allow_null=True)
    
    class Meta:
        model = Pagamento
        fields = '__all__'
        read_only_fields = ('id', 'data_criacao')