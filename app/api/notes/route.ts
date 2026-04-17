import { prisma } from "@/lib/prisma";

// GET → récupérer toutes les notes
export async function GET() {
  const notes = await prisma.note.findMany({
    orderBy: [
      { pinned: "desc" },      // notes épinglées en premier
      { createdAt: "desc" }    // puis les plus récentes
    ]
  });

  return Response.json(notes);
}

// POST → créer une note
export async function POST(request: Request) {
  const body = await request.json();

  // sécurité minimale
  if (!body.title) {
    return new Response(JSON.stringify({ error: "Title is required" }), {
      status: 400
    });
  }

  const note = await prisma.note.create({
    data: {
      title: body.title,
      content: body.content || "",
      pinned: body.pinned ?? false
    }
  });

  return Response.json(note);
}