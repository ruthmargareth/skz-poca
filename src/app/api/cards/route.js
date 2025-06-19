import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/cards
export async function GET() {
  try {
    const cards = await prisma.card.findMany({
      orderBy: { createdAt: 'asc' },
    });
    return NextResponse.json(cards);
  } catch (error) {
    console.error(" GET Error:", error); // log error lengkap ke terminal
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// POST /api/cards
export async function POST(req) {
  try {
    const body = await req.json();
    const { name, era, title, type, imageUrlFront, imageUrlBack } = body;

    const newCard = await prisma.card.create({
      data: {
        name,
        era,
        title,
        type,
        imageUrlFront,
        imageUrlBack,
      },
    });

    return NextResponse.json(newCard, { status: 201 });
  } catch (error) {
    console.error('POST Error:', error);
    return NextResponse.json({ error: 'Gagal menambahkan kartu' }, { status: 500 });
  }
}
