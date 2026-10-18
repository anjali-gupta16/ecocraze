/**
 * Order Notification Service
 * Sends SMS and Email confirmations after successful payment
 */

export interface OrderNotification {
  orderId: string;
  customerName: string;
  phone: string;
  email: string;
  amount: number;
  trackingId: string;
}

// Simulate sending SMS via gateway (MSG91 / Twilio style)
export async function sendOrderSMS(details: OrderNotification): Promise<boolean> {
  const message = `✅ Ecocraze Order Confirmed!\n\nHi ${details.customerName},\nYour order #${details.orderId.slice(0, 8).toUpperCase()} for ₹${details.amount.toFixed(2)} has been placed successfully.\n\nTracking ID: TRK-ECO-${details.orderId.slice(0, 8).toUpperCase()}\nEstimated Delivery: 24-48 Hours\n\nTrack your order at Ecocraze.\n\n— Team Ecocraze`;

  console.log(`📱 SMS sent to +91 ${details.phone}:\n${message}`);

  // Simulate network delay
  await new Promise((r) => setTimeout(r, 300));
  return true;
}

// Simulate sending Email confirmation
export async function sendOrderEmail(details: OrderNotification): Promise<boolean> {
  const subject = `Order Confirmed — #${details.orderId.slice(0, 8).toUpperCase()} | ₹${details.amount.toFixed(2)}`;

  const body = `
Dear ${details.customerName},

Thank you for your purchase! Your order has been confirmed and payment verified.

━━━━━━━━━━━━━━━━━━━━━━━━━━━
ORDER DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Order ID      : #${details.orderId.slice(0, 8).toUpperCase()}
Amount Paid   : ₹${details.amount.toFixed(2)}
Payment Mode  : UPI QR Scanner
Payment Status: ✅ Verified

TRACKING INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Tracking ID   : TRK-ECO-${details.orderId.slice(0, 8).toUpperCase()}
Estimated ETA : 24–48 Hours (Bangalore Hub)
Status        : Confirmed & Processing

━━━━━━━━━━━━━━━━━━━━━━━━━━━

For any queries, reach us on WhatsApp: +91 7676349773

Warm regards,
Team Ecocraze
Eco-Friendly Paper Products at Wholesale Prices
  `.trim();

  console.log(`📧 Email sent to ${details.email}:\nSubject: ${subject}\n\n${body}`);

  // Simulate network delay
  await new Promise((r) => setTimeout(r, 400));
  return true;
}

// Send both SMS + Email together
export async function sendAllOrderNotifications(details: OrderNotification): Promise<{
  smsSent: boolean;
  emailSent: boolean;
}> {
  const [smsSent, emailSent] = await Promise.all([
    sendOrderSMS(details),
    sendOrderEmail(details),
  ]);

  // Store notification status in localStorage for the confirmation page to read
  try {
    const key = `order_notif_${details.orderId}`;
    localStorage.setItem(
      key,
      JSON.stringify({
        smsSent,
        emailSent,
        phone: details.phone,
        email: details.email,
        sentAt: new Date().toISOString(),
      })
    );
  } catch (e) {
    console.warn('Could not store notification status', e);
  }

  return { smsSent, emailSent };
}

// Read notification status for a given order
export function getNotificationStatus(orderId: string): {
  smsSent: boolean;
  emailSent: boolean;
  phone: string;
  email: string;
  sentAt: string;
} | null {
  try {
    const raw = localStorage.getItem(`order_notif_${orderId}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
