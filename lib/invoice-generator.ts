import PDFDocument from 'pdfkit';
import { Order, Product, User } from '@prisma/client';

type OrderWithRelations = Order & {
  customer: User;
  product: Product;
};

export async function generateInvoicePDF(order: OrderWithRelations): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const buffers: Buffer[] = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // Header
      doc.fontSize(20).text('INVOICE', { align: 'right' });
      doc.fontSize(10).text('Look On Rent (LOR)', 50, 50);
      doc.text('Mumbai, Maharashtra, India', 50, 65);
      doc.text('GSTIN: 27XXXXX1234X1ZX', 50, 80);

      doc.moveDown();

      // Order Info
      doc.fontSize(10).text(`Invoice Number: ${order.orderNumber}`, 50, 130);
      doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 50, 145);
      
      // Customer Info
      doc.text('Billed To:', 300, 130);
      doc.text(order.customer.name || order.customer.email, 300, 145);
      // We parse the string to show a cleaner address, or just dump the string.
      const addrLines = order.shippingAddress || 'N/A';
      doc.text(addrLines, 300, 160, { width: 200 });

      doc.moveDown(3);

      // Table Header
      const tableTop = 250;
      doc.font('Helvetica-Bold');
      doc.text('Item Description', 50, tableTop);
      doc.text('Rental Dates', 300, tableTop);
      doc.text('Amount', 450, tableTop, { align: 'right' });
      
      doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

      // Table Row
      doc.font('Helvetica');
      const itemTop = tableTop + 25;
      const rentalDates = `${new Date(order.startDate).toLocaleDateString()} - ${new Date(order.endDate).toLocaleDateString()}`;
      
      doc.text(order.product.name, 50, itemTop, { width: 240 });
      doc.text(rentalDates, 300, itemTop);
      doc.text(`Rs. ${order.rentalAmount.toFixed(2)}`, 450, itemTop, { align: 'right' });

      doc.moveTo(50, itemTop + 35).lineTo(550, itemTop + 35).stroke();

      // Totals
      const totalsTop = itemTop + 50;
      doc.text('Subtotal (Rental Fee):', 300, totalsTop);
      doc.text(`Rs. ${order.rentalAmount.toFixed(2)}`, 450, totalsTop, { align: 'right' });

      doc.text('GST (18% inclusive):', 300, totalsTop + 15);
      doc.text(`Rs. ${order.taxAmount.toFixed(2)}`, 450, totalsTop + 15, { align: 'right' });

      doc.text('Security Deposit (Refundable):', 300, totalsTop + 30);
      doc.text(`Rs. ${order.securityDeposit.toFixed(2)}`, 450, totalsTop + 30, { align: 'right' });

      if (order.discountAmount > 0) {
        doc.text('Discount Applied:', 300, totalsTop + 45);
        doc.text(`- Rs. ${order.discountAmount.toFixed(2)}`, 450, totalsTop + 45, { align: 'right' });
      }

      doc.moveTo(300, totalsTop + 65).lineTo(550, totalsTop + 65).stroke();
      
      doc.font('Helvetica-Bold');
      doc.text('Total Paid:', 300, totalsTop + 75);
      doc.text(`Rs. ${order.totalAmount.toFixed(2)}`, 450, totalsTop + 75, { align: 'right' });

      doc.moveDown(4);
      doc.font('Helvetica-Oblique').fontSize(8).text(
        'Note: The Security Deposit is a non-taxable liability and is fully refundable upon return of the item in its original condition, as per our return policy.',
        50,
        totalsTop + 120,
        { width: 500, align: 'center' }
      );

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}
