// app/api/chat/route.ts
import { GoogleGenAI } from "@google/genai";

export const runtime = "edge";

// ==========================================
// 1. DEFINISI TIPE DATA (100% TYPE-SAFE)
// ==========================================
interface IncomingMessage {
  role: string;
  content: string;
}

interface ChatRequestBody {
  messages?: IncomingMessage[];
  modelId?: string;
}

export async function POST(req: Request) {
  try {
    // 2. INISIALISASI DI DALAM TRY-CATCH
    // Mencegah crash fatal jika API Key tidak ditemukan
    const ai = new GoogleGenAI({
      apiKey:
        process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
        process.env.GEMINI_API_KEY ||
        "",
    });

    const body = (await req.json()) as ChatRequestBody;
    const messages = body.messages || [];
    const modelId = body.modelId;

    const safeModelId = modelId || "gemini-2.5-flash";

    // 3. MAPPING KETAT UNTUK GEMINI
    // Gemini hanya mengenali role "user" dan "model"
    const formattedContents = messages.map((m: IncomingMessage) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const encoder = new TextEncoder();

    // 4. PEMBUATAN STREAM MURNI
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const responseStream = await ai.models.generateContentStream({
            model: safeModelId,
            contents: formattedContents,
            // config: {
            //   systemInstruction:
            //     "Kamu adalah NS AI, asisten virtual yang cerdas. Jawab menggunakan format Markdown.",
            // },
          });

          for await (const chunk of responseStream) {
            // chunk.text adalah getter di SDK Unified terbaru
            if (chunk.text) {
              controller.enqueue(encoder.encode(chunk.text));
            }
          }
          controller.close();
        } catch (e: unknown) {
          console.error("Gemini Stream Error:", e);
          controller.error(e);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache", // Pastikan stream tidak tersendat oleh cache
      },
    });
  } catch (error: unknown) {
    console.error("Global Backend Error:", error);
    return new Response(
      JSON.stringify({ error: "Gagal memproses permintaan AI" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
