import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { GoogleGenAI } from "@google/genai";
import { getServerSession } from "next-auth";

interface IncomingMessage {
  role: string;
  content: string;
}

interface ChatRequestBody {
  messages: IncomingMessage[];
  modelId?: string;
  chatId?: string;
  guestId?: string;
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    console.log("SESSION:", session);
    console.log("USER ID:", session?.user?.id);
    const loggedInUserId = session?.user?.id;

    const ai = new GoogleGenAI({
      apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || "",
    });

    const body = (await req.json()) as ChatRequestBody;

    const { messages, modelId = "gemini-2.5-flash", chatId, guestId } = body;

    if (!messages || messages.length === 0) {
      return Response.json({ error: "Messages are required" }, { status: 400 });
    }

    /**
     * =========================================================
     * MIGRATE GUEST CHAT -> USER CHAT
     * =========================================================
     */
    if (loggedInUserId && guestId) {
      await prisma.chat.updateMany({
        where: {
          guestId,
          userId: null,
          expiresAt: {
            gt: new Date(),
          },
        },
        data: {
          userId: loggedInUserId,
          guestId: null,
          expiresAt: null,
        },
      });
    }

    /**
     * =========================================================
     * FIND EXISTING CHAT
     * =========================================================
     */
    let chat = null;

    if (chatId) {
      chat = await prisma.chat.findFirst({
        where: loggedInUserId
          ? {
              id: chatId,
              userId: loggedInUserId,
            }
          : {
              id: chatId,
              guestId,
              expiresAt: {
                gt: new Date(),
              },
            },
      });
    }

    /**
     * =========================================================
     * CREATE NEW CHAT
     * =========================================================
     */
    if (!chat) {
      chat = await prisma.chat.create({
        data: {
          title: messages[0]?.content?.slice(0, 50) || "New Chat",

          model: modelId,

          userId: loggedInUserId || null,

          guestId: !loggedInUserId ? guestId : null,

          expiresAt: !loggedInUserId
            ? new Date(Date.now() + 24 * 60 * 60 * 1000)
            : null,
        },
      });
    }

    /**
     * =========================================================
     * SAVE USER MESSAGE
     * =========================================================
     */
    const lastUserMessage = messages[messages.length - 1];

    await prisma.message.create({
      data: {
        chatId: chat.id,
        role: "user",
        content: lastUserMessage.content,
      },
    });

    /**
     * =========================================================
     * FORMAT FOR GEMINI
     * =========================================================
     */
    const formattedContents = messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    /**
     * =========================================================
     * STREAM RESPONSE
     * =========================================================
     */
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        let aiFullResponse = "";

        try {
          const responseStream = await ai.models.generateContentStream({
            model: modelId,
            contents: formattedContents,
          });

          for await (const chunk of responseStream) {
            if (chunk.text) {
              aiFullResponse += chunk.text;

              controller.enqueue(encoder.encode(chunk.text));
            }
          }

          controller.close();

          /**
           * SAVE AI MESSAGE
           */
          await prisma.message.create({
            data: {
              chatId: chat.id,
              role: "assistant",
              content: aiFullResponse,
            },
          });
        } catch (error) {
          console.error("Gemini Stream Error:", error);

          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "X-Chat-ID": chat.id,
      },
    });
  } catch (error) {
    console.error("Global Backend Error:", error);

    return Response.json(
      {
        error: "Gagal memproses permintaan",
      },
      {
        status: 500,
      },
    );
  }
}
