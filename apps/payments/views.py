import razorpay
from rest_framework import permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.conf import settings
from apps.orders.models import Order
from .models import Payment
from .serializers import PaymentSerializer, PaymentVerifySerializer

client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))


class CreatePaymentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        order_id = request.data.get('order_id')
        order = Order.objects.filter(id=order_id, user=request.user).first()
        if not order:
            return Response({'success': False, 'error': 'Order not found.'}, status=404)

        if hasattr(order, 'payment'):
            return Response({'success': False, 'error': 'Payment already initiated for this order.'}, status=400)

        amount_paise = int(order.total_amount * 100)  # Razorpay works in paise

        razorpay_order = client.order.create({
            'amount': amount_paise,
            'currency': 'INR',
            'receipt': f'order_{order.id}',
            'payment_capture': 1,
        })

        payment = Payment.objects.create(
            order=order,
            razorpay_order_id=razorpay_order['id'],
            amount=order.total_amount,
            status='created',
        )

        return Response({
            'success': True,
            'data': {
                'razorpay_order_id': razorpay_order['id'],
                'amount': amount_paise,
                'currency': 'INR',
                'key': settings.RAZORPAY_KEY_ID,
                'payment_db_id': payment.id,
            }
        }, status=status.HTTP_201_CREATED)


class VerifyPaymentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = PaymentVerifySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        payment = Payment.objects.filter(razorpay_order_id=data['razorpay_order_id']).first()
        if not payment:
            return Response({'success': False, 'error': 'Payment record not found.'}, status=404)

        try:
            client.utility.verify_payment_signature({
                'razorpay_order_id': data['razorpay_order_id'],
                'razorpay_payment_id': data['razorpay_payment_id'],
                'razorpay_signature': data['razorpay_signature'],
            })
        except razorpay.errors.SignatureVerificationError:
            payment.status = 'failed'
            payment.save()
            return Response({'success': False, 'error': 'Payment verification failed.'}, status=400)

        payment.razorpay_payment_id = data['razorpay_payment_id']
        payment.razorpay_signature = data['razorpay_signature']
        payment.status = 'paid'
        payment.save()

        payment.order.status = 'confirmed'
        payment.order.save()

        return Response({'success': True, 'message': 'Payment verified successfully.', 'data': PaymentSerializer(payment).data})