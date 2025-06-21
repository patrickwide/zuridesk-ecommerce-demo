import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';
import { fetchOrderById } from '../store/slices/orderSlice';

const OrderProtectedRoute = ({ children }) => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const toast = useToast();
  const { user } = useSelector((state) => state.auth);
  const { order, loading } = useSelector((state) => state.orders);

  useEffect(() => {
    const loadOrder = async () => {
      if (orderId && (!order || order._id !== orderId)) {
        try {
          await dispatch(fetchOrderById(orderId)).unwrap();
        } catch (err) {
          // Only show error toast if it's not a permission error (handled by second useEffect)
          if (!err.message?.includes('permission')) {
            toast({
              title: "Error",
              description: err.message || "Could not load order",
              status: "error",
              duration: 5000,
              isClosable: true,
            });
          }
          // Navigate away if order not found or access denied
          if (err.message?.includes('not found') || err.message?.includes('permission')) {
            navigate('/orders');
          }
        }
      }
    };
    loadOrder();
  }, [orderId, dispatch, order, navigate, toast]);

  useEffect(() => {
    // Skip effect if still loading or order is undefined
    if (loading || !order) {
      console.log('Order data not ready');
      return;
    }
    
    // Access control logic
    if (!user?.isAdmin && order?.user?._id !== undefined && order?.user?._id !== user?._id) {
      toast({
        title: "Access Denied",
        description: "You do not have permission to access this order",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      console.error('Access denied: User does not have permission to view this order');
      navigate('/orders');
      return;
    }
  
    // Redirect if trying to access checkout for a paid order
    if (location.pathname.includes('/checkout/') && order?.isPaid) {
      navigate(`/orders/${orderId}`);
    }
  }, [order, user, navigate, toast, loading, location.pathname, orderId]);

  return children;
}

export default OrderProtectedRoute;