export const orderPendingTemplate = (order, user) => {
  return `
    <h2>Hi ${user.name},</h2>

    <p>Thank you for your order!</p>

    <p><strong>Order ID:</strong> ${order._id}</p>
    <p><strong>Total:</strong> ₹${order.totalPrice}</p>

    <p>Your order is currently <b>Pending</b>.</p>

    <p>Our team will review and confirm it shortly.</p>

    <p>You will receive another email once your order is confirmed.</p>

    <br/>

    <p>Thanks for shopping with <b>GenXTrends</b> ❤️</p>
  `;
};