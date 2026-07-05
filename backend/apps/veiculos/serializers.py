from rest_framework import serializers
from .models import Veiculo, MotoristVeiculo


class VeiculoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Veiculo
        fields = '__all__'
        read_only_fields = ('id', 'data_cadastro')


class MotoristVeiculoSerializer(serializers.ModelSerializer):
    motorista_nome = serializers.CharField(source='motorista.nome', read_only=True)
    veiculo_placa = serializers.CharField(source='veiculo.placa', read_only=True)
    
    class Meta:
        model = MotoristVeiculo
        fields = '__all__'
        read_only_fields = ('id',)