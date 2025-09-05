
document.addEventListener("DOMContentLoaded", () => {
  const chat = document.createElement("div");
  chat.innerHTML = `
    <div id="botBox" style="position:fixed;bottom:20px;right:20px;background:#fff;padding:15px;border-radius:8px;box-shadow:0 0 10px rgba(0,0,0,0.3);z-index:9999;">
      <strong>🤖 Bot PixelUp</strong><br><br>
      <input id="pergunta" placeholder="Digite sua pergunta..." style="width:100%;padding:8px;border:1px solid #ccc;border-radius:4px;" /><br><br>
      <button id="enviarBot" style="width:100%;padding:8px;background:#007bff;color:#fff;border:none;border-radius:4px;">Enviar</button>
      <div id="respostaBot" style="margin-top:10px;font-size:14px;"></div>
    </div>`;
  document.body.appendChild(chat);

  const btn = document.getElementById("enviarBot");
  btn.addEventListener("click", async () => {
    const pergunta = document.getElementById("pergunta").value;
    const respostaEl = document.getElementById("respostaBot");
    respostaEl.innerHTML = "⌛ Processando...";

    try {
      const config = window.PIXELUP_BOT_CONFIG;
      const resposta = await fetch(config.API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": config.API_TOKEN
        },
        body: JSON.stringify({
          contents: [ { parts: [ { text: pergunta } ] } ]
        })
      });
      const data = await resposta.json();
      const output = data?.candidates?.[0]?.content?.parts?.[0]?.text || "❌ Erro ao obter resposta.";
      respostaEl.innerHTML = output.replaceAll("\n", "<br>");
    } catch (e) {
      respostaEl.innerHTML = "❌ Erro ao conectar com o bot.";
    }
  });
});
