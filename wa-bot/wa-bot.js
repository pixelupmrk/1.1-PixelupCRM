(() => {
  const cfg = window.PIXELUP_BOT_CONFIG || {};
  if (!cfg.API_URL || !cfg.API_TOKEN) {
    console.error("[PixelUpBot] Falta API_URL ou API_TOKEN em window.PIXELUP_BOT_CONFIG");
    return;
  }

  // ===== UI simples (caixinha flutuante) =====
  const box = document.createElement("div");
  box.id = "pixelup-bot";
  box.style.cssText = `
    position:fixed;right:20px;bottom:20px;width:320px;max-height:460px;
    background:#0a0f18;color:#eaf6ff;border:1px solid #2c4b77;border-radius:12px;
    font-family: system-ui, Arial, sans-serif;display:flex;flex-direction:column;
    overflow:hidden;z-index:9999;box-shadow:0 10px 30px rgba(0,0,0,.35);
  `;
  box.innerHTML = `
    <div style="background:#102437;padding:10px 12px;font-weight:700;">🤖 Atendimento PixelUp</div>
    <div id="px-messages" style="flex:1;overflow:auto;padding:10px 12px;font-size:14px;">
      <div><b>Bot:</b> Olá! Como posso te ajudar?</div>
    </div>
    <div style="display:flex;gap:6px;padding:10px;background:#0a0f18;border-top:1px solid #2c4b77;">
      <input id="px-input" type="text" placeholder="Digite sua mensagem..." 
             style="flex:1;padding:8px;border-radius:6px;border:1px solid #2a3a58;background:#0d131c;color:#eaf6ff;outline:none;">
      <button id="px-send" style="background:#2c7be5;border:none;color:#fff;padding:8px 12px;border-radius:6px;cursor:pointer;">
        Enviar
      </button>
    </div>
  `;
  document.body.appendChild(box);

  const $msgs = document.getElementById("px-messages");
  const $input = document.getElementById("px-input");
  const $send  = document.getElementById("px-send");

  function append(role, text) {
    const line = document.createElement("div");
    line.innerHTML = `<b>${role}:</b> ${text}`;
    line.style.marginBottom = "8px";
    $msgs.appendChild(line);
    $msgs.scrollTop = $msgs.scrollHeight;
  }

  async function askGemini(userText) {
    // você pode usar header "x-goog-api-key" OU query param ?key=
    const url = `${cfg.API_URL}?key=${encodeURIComponent(cfg.API_TOKEN)}`;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          { parts: [ { text: userText } ] }
        ]
      })
    });

    if (!res.ok) {
      const t = await res.text().catch(()=> "");
      throw new Error(`HTTP ${res.status} - ${t}`);
    }

    const data = await res.json();
    // caminho de retorno comum do Gemini:
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || "Não entendi, pode tentar de outro jeito?";
  }

  async function send() {
    const text = $input.value.trim();
    if (!text) return;
    append("Você", text);
    $input.value = "";

    try {
      const reply = await askGemini(text);
      append("Bot", reply.replaceAll("\n", "<br>"));
    } catch (err) {
      console.error(err);
      append("Bot", "Desculpe, houve um erro ao responder.");
    }
  }

  $send.addEventListener("click", send);
  $input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") send();
  });
})();
