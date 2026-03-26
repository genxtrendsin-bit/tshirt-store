export const orderShippedTemplate = (order, user) => {
  return `
  <div style="font-family:Arial;padding:20px">

  <h2>Your Order Has Shipped 🚚</h2>

  <p>Hello ${user.name},</p>

  <p>Your order <b>#${order._id}</b> is on the way.</p>

  <p>Estimated delivery: 3-5 days</p>

  <hr/>

  <p>GenXTrends</p>

  </div>
  `;
};