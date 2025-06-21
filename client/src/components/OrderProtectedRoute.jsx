import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';

const OrderProtectedRoute = ({ children }) => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useSelector((state) => state.auth);
  const { order } = useSelector((state) => state.orders);

  useEffect(() => {
    if (order && user && !user.isAdmin && order.user._id !== user._id) {
      toast({
        title: "Access Denied",
        description: "You do not have permission to access this order",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      navigate('/orders');
    }
  }, [order, user, navigate, toast]);

  return children;
}

export default OrderProtectedRoute;