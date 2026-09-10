from rest_framework import serializers
from .models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):
    subtotal = serializers.ReadOnlyField()

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'price', 'quantity', 'subtotal']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    shipping_address = serializers.ReadOnlyField()

    class Meta:
        model = Order
        fields = [
            'id', 'status', 'total_amount', 'full_name', 'email', 'phone',
            'address_line', 'city', 'state', 'pincode', 'shipping_address',
            'items', 'created_at'
        ]
        read_only_fields = ['id', 'status', 'total_amount', 'created_at']