export const orderDeliveredTemplate = (order, user) => {
  return `
  <div style="font-family:Arial;padding:20px">

  <h2>Order Delivered 📦</h2>

  <p>Hello ${user.name},</p>

  <p>Your order <b>#${order._id}</b> has been delivered.</p>

  <p>Thank you for shopping with GenXTrends!</p>

  </div>
  `;
};