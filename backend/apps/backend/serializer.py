from rest_framework import serializers
from apps.backend.models import Products
# from backend.models import MemberForm
from apps.backend.models import MarketBasketCLN
from apps.backend.models import MarketBasketTemp


class ProductsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Products
        fields = '__all__'

# class MemberFormSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = MemberForm
#         fields = '__all__'

class MarketBasketSerializer(serializers.ModelSerializer):
    class Meta:
        model = MarketBasketCLN
        fields = '__all__'

class MarketBasketSerializerTemp(serializers.ModelSerializer):
    class Meta:
        model = MarketBasketTemp
        fields = '__all__'

# class UserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = ('id', 'username', 'password')  
#         extra_kwargs = {
#             'password': {'write_only': True},  
#         }

#     def create(self, validated_data):
#         # print(validated_data)
        
#         # Create a new user using the validated data (including hashed password)
#         user = User.objects.create_user(**validated_data)
#         return user
        
