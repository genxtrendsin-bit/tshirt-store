export const orderConfirmedTemplate = (order, user) => {

  const itemsHtml = order.items.map(item => {

    const name = item.name || item.product?.name || "Product";
    const quantity = item.quantity || 1;
    const price = item.price || 0;

    return `
      <tr>
        <td style="padding:8px;border:1px solid #ddd;">${name}</td>
        <td style="padding:8px;border:1px solid #ddd;text-align:center;">${quantity}</td>
        <td style="padding:8px;border:1px solid #ddd;text-align:right;">₹${price}</td>
      </tr>
    `;
  }).join("");

  return `
  <div style="font-family:Arial,Helvetica,sans-serif;background:#f5f5f5;padding:20px">

    <div style="max-width:600px;margin:auto;background:white;padding:20px;border-radius:8px">

      <h2 style="color:#0d6efd">GenXTrends</h2>

      <h3>Order Confirmed 🎉</h3>

      <p>Hello <b>${user.name}</b>,</p>

      <p>Your order <b>#${order._id}</b> has been successfully confirmed.</p>

      <h3 style="margin-top:20px">Order Summary</h3>

      <table style="width:100%;border-collapse:collapse">

        <thead>
          <tr style="background:#f1f1f1">
            <th style="padding:10px;border:1px solid #ddd;text-align:left">Product</th>
            <th style="padding:10px;border:1px solid #ddd">Qty</th>
            <th style="padding:10px;border:1px solid #ddd;text-align:right">Price</th>
          </tr>
        </thead>

        <tbody>
          ${itemsHtml}
        </tbody>

      </table>

      <h3 style="margin-top:20px;text-align:right">
        Total: ₹${order.totalPrice}
      </h3>

      <p style="margin-top:20px">
        We will notify you once your order ships.
      </p>

      <hr/>

      <p style="font-size:14px;color:#777">
        Thank you for shopping with <b>GenXTrends</b>.
      </p>

    </div>

  </div>
  `;
};