from rest_framework import serializers
from .models import Motorista


class MotoristasSerializer(serializers.ModelSerializer):
    class Meta:
        model = Motorista
        fields = '__all__'
        read_only_fields = ('id', 'data_cadastro')