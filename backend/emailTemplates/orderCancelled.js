export const orderCancelledTemplate = (order, user) => {
  return `
  <div style="font-family:Arial;padding:20px">

  <h2>Order Cancelled</h2>

  <p>Hello ${user.name},</p>

  <p>Your order <b>#${order._id}</b> has been cancelled.</p>

  <p>If payment was made, refund will be processed.</p>

  </div>
  `;
};