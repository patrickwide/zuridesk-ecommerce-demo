import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { Box, Text, Center } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateOrderToPaid } from '../../store/slices/orderSlice';
import { clearCart } from '../../store/slices/cartSlice';

const PayPalButton = ({ orderId, total }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { order } = useSelector((state) => state.orders);

  const initialOptions = {
    clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
    currency: "USD",
    intent: "capture",
  };

  if (!import.meta.env.VITE_PAYPAL_CLIENT_ID) {
    return (
      <Center p={4}>
        <Text color="red.500">PayPal configuration is missing</Text>
      </Center>
    );
  }

  const handlePaymentSuccess = async (data, actions) => {
    try {
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

      navigate(`/orders/${orderId}`);
    } catch (err) {
      console.error('Payment error:', err);
    }
  };

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
            console.error('PayPal error:', err);
          }}
          onCancel={() => {
            console.log('Payment cancelled');
          }}
        />
      </PayPalScriptProvider>
    </Box>
  );
};

export default PayPalButton;