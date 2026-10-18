import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackEvent } from '../lib/tracking';
import { useAuth } from '../contexts/AuthContext';
import type { Product } from '../types';

export function useTracking() {
  const location = useLocation();
  const { user } = useAuth();

  // Auto-track page_view on route change
  useEffect(() => {
    trackEvent('page_view', { path: location.pathname, search: location.search }, user?.id);
  }, [location.pathname, location.search, user?.id]);

  const logProductView = (product: Product) => {
    trackEvent(
      'product_view',
      {
        productId: product.id,
        productName: product.name,
        category: product.category,
        price: product.price,
      },
      user?.id
    );
  };

  const logAddToCart = (product: Product, quantity: number, unitPrice: number) => {
    trackEvent(
      'add_to_cart',
      {
        productId: product.id,
        productName: product.name,
        quantity,
        unitPrice,
        total: quantity * unitPrice,
      },
      user?.id
    );
  };

  const logCheckoutStarted = (itemCount: number, subtotal: number) => {
    trackEvent(
      'checkout_started',
      {
        itemCount,
        subtotal,
      },
      user?.id
    );
  };

  const logOrderPlaced = (orderId: string, total: number, paymentMethod: string) => {
    trackEvent(
      'order_placed',
      {
        orderId,
        total,
        paymentMethod,
      },
      user?.id
    );
  };

  const logLogin = (email: string) => {
    trackEvent('login', { email }, user?.id);
  };

  const logRegister = (email: string) => {
    trackEvent('register', { email }, user?.id);
  };

  return {
    logProductView,
    logAddToCart,
    logCheckoutStarted,
    logOrderPlaced,
    logLogin,
    logRegister,
  };
}
