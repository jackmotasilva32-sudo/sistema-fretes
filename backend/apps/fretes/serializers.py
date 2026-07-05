from rest_framework import serializers
from .models import Frete


class FreteSerializer(serializers.ModelSerializer):
    cliente_nome = serializers.CharField(source='cliente.nome', read_only=True)
    motorista_nome = serializers.CharField(source='motorista.nome', read_only=True, allow_null=True)
    veiculo_placa = serializers.CharField(source='veiculo.placa', read_only=True, allow_null=True)
    
    class Meta:
        model = Frete
        fields = '__all__'
        read_only_fields = ('id', 'data_criacao')