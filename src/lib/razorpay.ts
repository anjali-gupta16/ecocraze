declare global {
  interface Window {
    Razorpay: any;
  }
}

export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export interface RazorpayOrderOptions {
  orderId: string;
  amount: number; // in paise
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  onSuccess: (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => void;
  onFailure: (error: any) => void;
}

export async function initiateRazorpayPayment(options: RazorpayOrderOptions) {
  const loaded = await loadRazorpayScript();
  if (!loaded) {
    options.onFailure(new Error('Razorpay SDK failed to load'));
    return;
  }

  const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID;

  const rzp = new window.Razorpay({
    key: keyId,
    amount: options.amount,
    currency: 'INR',
    name: 'Ecocraze',
    description: `Order #${options.orderId.slice(0, 8)}`,
    order_id: options.orderId,
    prefill: {
      name: options.customerName,
      email: options.customerEmail,
      contact: options.customerPhone,
    },
    theme: {
      color: '#16A34A',
    },
    handler: options.onSuccess,
    modal: {
      ondismiss: () => options.onFailure(new Error('Payment cancelled by user')),
    },
  });

  rzp.open();
}
