from rest_framework import serializers
from .models import Product, Category, ProductImage


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'parent']


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'is_primary']


class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    owner_username = serializers.ReadOnlyField(source='owner.username')
    final_price = serializers.ReadOnlyField()

    class Meta:
        model = Product
        fields = ['id', 'owner', 'owner_username', 'category', 'name', 'slug', 'description',
                  'price', 'discount_price', 'final_price', 'stock', 'status', 'images', 'created_at']
        read_only_fields = ['id', 'owner', 'slug', 'created_at']