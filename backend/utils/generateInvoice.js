import PDFDocument from "pdfkit";

export const generateInvoice = (order, res) => {

  const doc = new PDFDocument({ margin: 30 });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `inline; filename=invoice_${order._id}.pdf`
  );

  doc.pipe(res);

  /* ================= HEADER ================= */

  doc.fontSize(18).text(process.env.STORE_NAME, 30, 30);

  doc
    .fontSize(10)
    .text("Tax Invoice / Bill of Supply", 350, 30);

  doc.moveDown(2);

  /* ================= SELLER BOX ================= */

  doc.rect(30, 80, 540, 80).stroke();

  doc.fontSize(10).text("Sold By:", 40, 90);
  doc.text(process.env.STORE_NAME, 40, 105);
  doc.text(process.env.STORE_ADDRESS, 40, 120);

  doc.text(`PAN: ${process.env.STORE_PAN}`, 300, 105);
  doc.text(`GST: ${process.env.STORE_GST}`, 300, 120);

  /* ================= ADDRESS BOX ================= */

  doc.rect(30, 170, 260, 100).stroke();
  doc.rect(310, 170, 260, 100).stroke();

  doc.text("Billing Address:", 40, 180);
  doc.text(order.shippingAddress.fullName, 40, 200);
  doc.text(order.shippingAddress.street, 40, 215);
  doc.text(order.shippingAddress.city, 40, 230);

  doc.text("Shipping Address:", 320, 180);
  doc.text(order.shippingAddress.fullName, 320, 200);
  doc.text(order.shippingAddress.street, 320, 215);
  doc.text(order.shippingAddress.city, 320, 230);

  /* ================= ORDER DETAILS ================= */

  doc.rect(30, 280, 540, 60).stroke();

  doc.text(`Order ID: ${order._id}`, 40, 290);
  doc.text(
    `Order Date: ${new Date(order.createdAt).toLocaleDateString()}`,
    40,
    305
  );
  doc.text(`Invoice Date: ${new Date().toLocaleDateString()}`, 40, 320);

  doc.text(`Payment: ${order.paymentMethod}`, 300, 290);
  doc.text(`Status: ${order.status}`, 300, 305);

  /* ================= TABLE ================= */

  const tableTop = 360;

  doc.rect(30, tableTop, 540, 25).stroke();

  doc.text("Sl", 40, tableTop + 8);
  doc.text("Description", 70, tableTop + 8);
  doc.text("Qty", 300, tableTop + 8);
  doc.text("Price", 350, tableTop + 8);
  doc.text("Total", 450, tableTop + 8);

  let y = tableTop + 25;

  order.items.forEach((item, i) => {

    const total = item.quantity * item.price;

    doc.rect(30, y, 540, 25).stroke();

    doc.text(i + 1, 40, y + 8);
    doc.text(item.name, 70, y + 8);
    doc.text(item.quantity, 300, y + 8);
    doc.text(`₹${item.price}`, 350, y + 8);
    doc.text(`₹${total}`, 450, y + 8);

    y += 25;
  });

  /* ================= TOTAL BOX ================= */

  doc.rect(30, y, 540, 80).stroke();

  const tax = order.totalPrice * 0.18;
  const grandTotal = order.totalPrice + tax;

  doc.text(`Subtotal: ₹${order.totalPrice}`, 350, y + 10);
  doc.text(`IGST (18%): ₹${tax.toFixed(2)}`, 350, y + 25);

  doc
    .fontSize(12)
    .text(`TOTAL: ₹${grandTotal.toFixed(2)}`, 350, y + 45);

  /* ================= COD HIGHLIGHT ================= */

  if (order.paymentMethod === "COD") {

    doc.rect(30, y + 90, 540, 30).fillAndStroke("#ffe6e6", "#ff0000");

    doc
      .fillColor("red")
      .text(
        `⚠ Collect ₹${order.pendingAmount} on delivery`,
        40,
        y + 100
      );

    doc.fillColor("black");
  }

  /* ================= AMOUNT WORDS ================= */

  doc
    .fontSize(10)
    .text(
      `Amount in Words: ${numberToWords(Math.round(grandTotal))} only`,
      30,
      y + 140
    );

  /* ================= SIGNATURE ================= */

  doc.rect(350, y + 170, 200, 60).stroke();

  doc.text(" GenXTrends ", 360, y + 180);
  doc.text("Authorized Signatory", 360, y + 210);




  doc.text(`if undelivered, return to: ${process.env.STORE_ADDRESS}`, 30, y + 250, { align: "center" });

  /* ================= FOOTER ================= */

  doc
    .fontSize(9)
    .fillColor("#666")
    .text(
      "This is a system generated invoice.",
      30,
      y + 280,
      { align: "center" }
    );

  doc.end();
};

/* ================= NUMBER TO WORDS ================= */

function numberToWords(num) {

  if (!num || isNaN(num)) return "Zero";

  const a = [
    "", "One", "Two", "Three", "Four", "Five", "Six",
    "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve",
    "Thirteen", "Fourteen", "Fifteen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen"
  ];

  const b = [
    "", "", "Twenty", "Thirty", "Forty",
    "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
  ];

  if (num < 20) return a[num];

  if (num < 100)
    return b[Math.floor(num / 10)] + " " + a[num % 10];

  if (num < 1000)
    return (
      a[Math.floor(num / 100)] +
      " Hundred " +
      numberToWords(num % 100)
    );

  if (num < 100000)
    return (
      numberToWords(Math.floor(num / 1000)) +
      " Thousand " +
      numberToWords(num % 1000)
    );

  if (num < 10000000)
    return (
      numberToWords(Math.floor(num / 100000)) +
      " Lakh " +
      numberToWords(num % 100000)
    );

  return "Amount too large";
}