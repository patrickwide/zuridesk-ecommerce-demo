import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useToast, Box, Text, Center } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateOrderToPaid } from '../../store/slices/orderSlice';
import { clearCart } from '../../store/slices/cartSlice';

const PayPalButton = ({ orderId, total }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useSelector((state) => state.auth);
  const { order } = useSelector((state) => state.orders);

  const initialOptions = {
    clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
    currency: "USD",
    intent: "capture",
  };

  // Check order ownership before allowing payment
  if (order && user && !user.isAdmin && order.user._id !== user._id) {
    return (
      <Center p={4}>
        <Text color="red.500">You are not authorized to pay for this order</Text>
      </Center>
    );
  }

  const handlePaymentSuccess = async (data, actions) => {
    try {
      // Revalidate ownership before processing payment
      if (order && user && !user.isAdmin && order.user._id !== user._id) {
        throw new Error('You are not authorized to pay for this order');
      }

      const details = await actions.order.capture();
      const paymentResult = {
        id: details.id,
        status: details.status,
        update_time: details.update_time,
        email_address: details.payer.email_address,
        paymentMethod: 'PayPal'
      };
      
      await dispatch(updateOrderToPaid({ orderId, paymentResult })).unwrap();
      dispatch(clearCart());
      
      toast({
        title: "Payment successful",
        description: "Thank you for your purchase!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      navigate(`/orders/${orderId}`);
    } catch (err) {
      toast({
        title: "Payment failed",
        description: err.message || "There was an error processing your payment",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (!import.meta.env.VITE_PAYPAL_CLIENT_ID) {
    return (
      <Center p={4}>
        <Text color="red.500">PayPal configuration is missing</Text>
      </Center>
    );
  }

  return (
    <Box
      width="100%"
      maxWidth="500px"
      mx="auto"
      p={4}
      borderRadius="md"
      bg="white"
      shadow="sm"
    >
      <PayPalScriptProvider options={initialOptions}>
        <PayPalButtons
          style={{
            layout: "vertical",
            shape: "rect",
            label: "pay",
          }}
          createOrder={(data, actions) => {
            // Final ownership check before creating PayPal order
            if (order && user && !user.isAdmin && order.user._id !== user._id) {
              throw new Error('You are not authorized to pay for this order');
            }
            
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: total.toFixed(2),
                  },
                  reference_id: orderId,
                  description: `Order #${orderId}`,
                },
              ],
            });
          }}
          onApprove={handlePaymentSuccess}
          onError={(err) => {
            toast({
              title: "Payment Error",
              description: "There was a problem processing your payment",
              status: "error",
              duration: 5000,
              isClosable: true,
            });
          }}
          onCancel={() => {
            toast({
              title: "Payment Cancelled",
              description: "You have cancelled the payment process",
              status: "info",
              duration: 3000,
              isClosable: true,
            });
          }}
        />
      </PayPalScriptProvider>
    </Box>
  );
};

export default PayPalButton;