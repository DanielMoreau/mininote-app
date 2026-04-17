import { prisma } from "../../../lib/prisma";

// GET
export async function GET() {
  const notes = await prisma.note.findMany({
    orderBy: { pinned: "desc" }
  });

  return Response.json(notes);
}

// POST
export async function POST(req: Request) {
  const body = await req.json();

  if (!body.content) {
    return Response.json({ error: "Empty content" }, { status: 400 });
  }

  const note = await prisma.note.create({
    data: {
      content: body.content
    }
  });

  return Response.json(note);
}

// DELETE
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return Response.json({ error: "Missing id" }, { status: 400 });
  }

  await prisma.note.delete({
    where: { id }
  });

  return Response.json({ success: true });
}

// PATCH
export async function PATCH(req: Request) {
  const body = await req.json();

  if (!body.id) {
    return Response.json({ error: "Missing id" }, { status: 400 });
  }

  const note = await prisma.note.findUnique({
    where: { id: body.id }
  });

  await prisma.note.update({
    where: { id: body.id },
    data: {
      pinned: !note?.pinned
    }
  });

  return Response.json({ success: true });
}