import { describe, it, expect } from "vitest";
import { GET, POST } from "../app/api/notes/route";

describe("API /api/notes", () => {
  it("should create and retrieve notes", async () => {
    // 1. créer une note
    const request = new Request("http://localhost/api/notes", {
      method: "POST",
      body: JSON.stringify({ content: "Test note" }),
      headers: {
        "Content-Type": "application/json"
      }
    });

    await POST(request);

    // 2. récupérer les notes
    const response = await GET();
    const data = await response.json();

    // 3. vérifier
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
    expect(data[0].content).toBe("Test note");
  });
});