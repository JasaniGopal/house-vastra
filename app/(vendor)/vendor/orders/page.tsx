import React from 'react';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import VendorOrdersClient from "./VendorOrdersClient";

export default async function VendorOrdersPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || (session.user.role !== "VENDOR" && session.user.role !== "ADMIN")) {
    redirect("/partner-login");
  }

  const vendor = await prisma.vendor.findUnique({
    where: { userId: session.user.id },
  });

  if (!vendor) {
    redirect("/partner-login");
  }

  // Fetch actual live orders tied to this vendor's products
  const orders = await prisma.order.findMany({
    where: {
      product: {
        vendorId: vendor.id
      }
    },
    orderBy: { createdAt: "desc" },
    include: {
      customer: {
        select: { name: true }
      },
      product: {
        include: { images: true }
      },
      dispute: {
        select: { status: true, reason: true }
      }
    }
  });

  return <VendorOrdersClient initialOrders={orders} />;
}
