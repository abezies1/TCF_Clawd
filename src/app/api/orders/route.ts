import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { customerName, phone, email, pickupDate, pickupTime, items } = body;

    if (!customerName || !phone || !email || !pickupDate || !pickupTime) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "Order must have at least one item" },
        { status: 400 }
      );
    }

    const orderId = uuidv4();

    // In production, save to a database. For now, log it.
    console.log("New order received:", {
      orderId,
      customerName,
      phone,
      email,
      pickupDate,
      pickupTime,
      items,
      subtotal: body.subtotal,
      tax: body.tax,
      total: body.total,
      notes: body.notes,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ orderId, status: "confirmed" });
  } catch {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}
