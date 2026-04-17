import { prisma } from "../../../lib/prisma";

// GET → récupérer toutes les notes
export async function GET() {
const notes = await prisma.note.findMany({
orderBy: {
createdAt: "desc",
},
});

return Response.json(notes);
}

// POST → créer une note
export async function POST(req: Request) {
const body = await req.json();

const note = await prisma.note.create({
data: {
title: body.title,
content: body.content,
},
});

return Response.json(note);
}
