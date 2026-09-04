from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.db import transaction
from apps.cart.models import Cart
from .models import Order, OrderItem
from .serializers import OrderSerializer


class OrderListCreateView(generics.ListCreateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).prefetch_related('items')

    def create(self, request, *args, **kwargs):
        cart = Cart.objects.filter(user=request.user).first()
        if not cart or not cart.items.exists():
            return Response({'success': False, 'error': 'Cart is empty.'}, status=400)

        shipping_address = request.data.get('shipping_address')
        if not shipping_address:
            return Response({'success': False, 'error': 'Shipping address is required.'}, status=400)

        with transaction.atomic():
            order = Order.objects.create(
                user=request.user, total_amount=cart.total_price, shipping_address=shipping_address
            )
            for item in cart.items.select_related('product'):
                if item.quantity > item.product.stock:
                    transaction.set_rollback(True)
                    return Response({'success': False, 'error': f'{item.product.name} out of stock.'}, status=400)
                OrderItem.objects.create(
                    order=order, product=item.product, product_name=item.product.name,
                    price=item.product.final_price, quantity=item.quantity
                )
                item.product.stock -= item.quantity
                item.product.save()
            cart.items.all().delete()

        return Response({'success': True, 'data': OrderSerializer(order).data}, status=status.HTTP_201_CREATED)


class OrderDetailView(generics.RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)