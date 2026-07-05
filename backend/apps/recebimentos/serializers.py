from rest_framework import serializers
from .models import Recebimento


class RecebimentoSerializer(serializers.ModelSerializer):
    cliente_nome = serializers.CharField(source='cliente.nome', read_only=True)
    frete_id = serializers.CharField(source='frete.id', read_only=True)
    
    class Meta:
        model = Recebimento
        fields = '__all__'
        read_only_fields = ('id', 'data_criacao')