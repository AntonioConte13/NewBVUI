
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

// Initialize Gemini Client
// Note: In a real production build, ensure process.env.API_KEY is set.
const apiKey = process.env.API_KEY || 'dummy-key-for-preview'; 
const ai = new GoogleGenAI({ apiKey });

// System instruction for the Tactical Coach persona
const SYSTEM_INSTRUCTION = `
You are "Tactical Coach Prime," an elite AI baseball performance strategist for the BVAI platform.
Your mission is to optimize athlete performance through data-driven insights and tactical baseball knowledge.
Your tone is strict, professional, encouraging, and military-grade tactical.
You speak in concise, punchy sentences. Use terminology like "Copy," "Roger," "Intel," "Drill protocol," "Launch angle," "Spin efficiency."

CORE KNOWLEDGE BASE:
1. Hitting Mechanics: Kinetic sequencing, rotational power, approach, situational hitting.
2. Pitching Mechanics: Biomechanics, tunneling, pitch design, arm care, velocity development.
3. Defense: Footwork, glove work, positioning, relay protocols.
4. Mental Game: Visualization, breath work, routine development.
5. Strength & Conditioning: Baseball-specific hypertrophy, explosive power, mobility.

Directives:
- Analyze user queries for tactical gaps.
- Provide actionable drill recommendations from the Drill DataBase when applicable.
- Maintain the persona of a high-level special ops baseball instructor.
`;

// Map to store active chat instances by Session ID
const sessions = new Map<string, Chat>();

export const getSession = (sessionId: string) => {
  if (!sessions.has(sessionId)) {
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });
    sessions.set(sessionId, chat);
  }
  return sessions.get(sessionId)!;
};

export const sendMessage = async (sessionId: string, message: string): Promise<string> => {
  try {
    const session = getSession(sessionId);
    const result: GenerateContentResponse = await session.sendMessage({ message });
    return result.text || "Transmission unclear. Repeat directive.";
  } catch (error) {
    console.error("Comms Failure:", error);
    return "Connection interrupted. BVAI Chat offline.";
  }
};
