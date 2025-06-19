import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/cards/[id]
export async function GET(req, { params }) {
  const { id } = params;

  try {
    const card = await prisma.card.findUnique({
      where: { id },
    });

    if (!card) {
      return NextResponse.json({ error: 'Kartu tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json(card);
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: 'Gagal mengambil kartu' }, { status: 500 });
  }
}

// PUT /api/cards/[id]
export async function PUT(req, { params }) {
  const { id } = params;
  const body = await req.json();

  try {
    const { name, era, title, type, imageUrlFront, imageUrlBack } = body;

    const updatedCard = await prisma.card.update({
      where: { id },
      data: {
        name,
        era,
        title,
        type,
        imageUrlFront,
        imageUrlBack,
      },
    });

    return NextResponse.json(updatedCard);
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json({ error: 'Gagal memperbarui kartu' }, { status: 500 });
  }
}

// DELETE /api/cards/[id]
export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    await prisma.card.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Kartu berhasil dihapus' });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ error: 'Gagal menghapus kartu' }, { status: 500 });
  }
}