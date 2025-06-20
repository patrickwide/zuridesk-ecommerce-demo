import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useToast, Box } from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { updateOrderToPaid } from '../../store/slices/orderSlice';

const PayPalButton = ({ orderId, total }) => {
  const dispatch = useDispatch();
  const toast = useToast();

  const initialOptions = {
    clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
    currency: "USD",
    intent: "capture",
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
                    value: total,
                  },
                  description: `Order #${orderId}`,
                },
              ],
            });
          }}
          onApprove={async (data, actions) => {
            try {
              const details = await actions.order.capture();
              const paymentResult = {
                id: details.id,
                status: details.status,
                update_time: details.update_time,
                email_address: details.payer.email_address,
              };
              
              await dispatch(updateOrderToPaid({ 
                orderId, 
                paymentResult 
              })).unwrap();
              
              toast({
                title: "Payment successful",
                description: "Thank you for your purchase!",
                status: "success",
                duration: 5000,
                isClosable: true,
              });
            } catch (error) {
              toast({
                title: "Payment failed",
                description: error.message || "There was an error processing your payment",
                status: "error",
                duration: 5000,
                isClosable: true,
              });
            }
          }}
          onError={(err) => {
            toast({
              title: "Payment Error",
              description: "There was an error processing your payment",
              status: "error",
              duration: 5000,
              isClosable: true,
            });
            console.error("PayPal Error:", err);
          }}
        />
      </PayPalScriptProvider>
    </Box>
  );
};

export default PayPalButton;