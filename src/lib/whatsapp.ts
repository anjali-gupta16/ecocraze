// Utility to generate direct WhatsApp links with pre-filled messages

export function getWhatsAppPhone(): string {
  const phone = import.meta.env.VITE_WHATSAPP_PHONE || '917676349773';
  return phone.replace(/[^0-9]/g, '');
}

export function createWhatsAppUrl(message: string): string {
  const phone = getWhatsAppPhone();
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encoded}`;
}

export function getProductWhatsAppMessage(productName: string, quantity?: number, unitPrice?: number): string {
  if (quantity && unitPrice) {
    const total = quantity * unitPrice;
    return `Hello Ecocraze! I am interested in placing a bulk order for:
*Product:* ${productName}
*Quantity:* ${quantity} packets
*Estimated Rate:* ₹${unitPrice}/packet
*Estimated Subtotal:* ₹${total.toLocaleString('en-IN')}

Could you please confirm the delivery time and best wholesale quote?`;
  }

  return `Hello Ecocraze! I would like to inquire about wholesale pricing and bulk stock availability for:
*Product:* ${productName}

Please share your latest product catalogue and delivery terms.`;
}

export function getCartWhatsAppMessage(items: { name: string; qty: number; price: number }[], total: number): string {
  const itemList = items.map((i, idx) => `${idx + 1}. ${i.name} — ${i.qty} pkts @ ₹${i.price}/pkt = ₹${(i.qty * i.price).toLocaleString('en-IN')}`).join('\n');
  return `Hello Ecocraze! I want to order via WhatsApp:

${itemList}

*Total Order Value:* ₹${total.toLocaleString('en-IN')}
Please share payment details and dispatch timeline.`;
}
