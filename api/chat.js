export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ reply: "Método não permitido" });
  }

  try {
    const { message } = req.body;
    const API_KEY = process.env.GEMINI_API_KEY; // Defina no painel da Vercel

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: message }] }]
        })
      }
    );

    if (!response.ok) {
      throw new Error("Erro API Google AI: " + response.status);
    }

    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sem resposta";

    res.status(200).json({ reply });
  } catch (err) {
    res.status(500).json({ reply: "Erro no servidor: " + err.message });
  }
}
