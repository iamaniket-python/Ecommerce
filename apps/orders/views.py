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

        required_fields = ['full_name', 'email', 'phone', 'address_line', 'city', 'state', 'pincode']
        missing = [f for f in required_fields if not request.data.get(f)]
        if missing:
            return Response({'success': False, 'error': f'Missing fields: {", ".join(missing)}'}, status=400)

        with transaction.atomic():
            order = Order.objects.create(
                user=request.user,
                total_amount=cart.total_price,
                full_name=request.data.get('full_name'),
                email=request.data.get('email'),
                phone=request.data.get('phone'),
                address_line=request.data.get('address_line'),
                city=request.data.get('city'),
                state=request.data.get('state'),
                pincode=request.data.get('pincode'),
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