import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params;

    // Fetch orders for this product that block availability
    const orders = await prisma.order.findMany({
      where: {
        productId,
        status: {
          in: ['PENDING', 'PREPARING', 'DISPATCHED', 'IN_USE']
        }
      },
      select: {
        startDate: true,
        endDate: true
      }
    });

    // Fetch dates blocked manually by the vendor
    const blockedDates = await prisma.blockedDate.findMany({
      where: { productId },
      select: {
        startDate: true,
        endDate: true
      }
    });

    const allUnavailableDates = [...orders, ...blockedDates];

    return NextResponse.json({ bookedDates: allUnavailableDates });
  } catch (error) {
    console.error('Failed to fetch booked dates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch booked dates' },
      { status: 500 }
    );
  }
}
