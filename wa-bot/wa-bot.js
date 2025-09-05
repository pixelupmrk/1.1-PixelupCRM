(async function () {
  const config = window.PIXELUP_BOT_CONFIG || {};
  const API_URL = config.API_URL;
  const API_TOKEN = config.API_TOKEN;

  function criarInterfaceDoBot() {
    const bot = document.createElement("div");
    bot.id = "pixelup-bot";
    bot.innerHTML = `
      <style>
        #pixelup-bot {
          position: fixed;
          bottom: 20px;
          right: 20px;
          width: 320px;
          max-height: 420px;
          background: #0a0f18;
          border: 1px solid #2c4b77;
          border-radius: 12px;
          font-family: sans-serif;
          display: flex;
          flex-direction: column;
          z-index: 9999;
          overflow: hidden;
        }
        #pixelup-bot header {
          background: #102437;
          color: #eaf6ff;
          padding: 12px;
          font-weight: bold;
        }
        #pixelup-bot .messages {
          flex: 1;
          padding: 10px;
          overflow-y: auto;
          background: #0d131c;
          color: #eaf6ff;
          font-size: 14px;
        }
        #pixelup-bot .messages div {
          margin-bottom: 8px;
        }
        #pixelup-bot footer {
          display: flex;
          padding: 8px;
          background: #0a0f18;
          border-top: 1px solid #2c4b77;
        }
        #pixelup-bot input {
          flex: 1;
          padding: 6px;
          border: none;
          border-radius: 4px;
          font-size: 14px;
        }
        #pixelup-bot button {
          background: #2c4b77;
          color: white;
          border: none;
          margin-left: 6px;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
        }
      </style>
      <header>🤖 Atendimento PixelUp</header>
      <div class="messages" id="pixelup-bot-messages">
        <div><b>Bot:</b> Olá! Como posso te ajudar hoje?</div>
      </div>
      <footer>
        <input id="pixelup-bot-input" type="text" placeholder="Digite sua pergunta..." />
        <button id="pixelup-bot-enviar">Enviar</button>
      </footer>
    `;
    document.body.appendChild(bot);
    document.getElementById("pixelup-bot-enviar").onclick = enviarMensagem;
    document.getElementById("pixelup-bot-input").addEventListener("keypress", function (e) {
      if (e.key === "Enter") enviarMensagem();
    });
  }

  async function enviarMensagem() {
    const input = document.getElementById("pixelup-bot-input");
    const mensagem = input.value.trim();
    if (!mensagem) return;
    const areaMensagens = document.getElementById("pixelup-bot-messages");

    areaMensagens.innerHTML += `<div><b>Você:</b> ${mensagem}</div>`;
    input.value = "";

    try {
      const resposta = await fetch(`${API_URL}?key=${API_TOKEN}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: mensagem }]
            }
          ]
        })
      });

      const data = await resposta.json();
      const texto = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Desculpe, não entendi.";

      areaMensagens.innerHTML += `<div><b>Bot:</b> ${texto}</div>`;
      areaMensagens.scrollTop = areaMensagens.scrollHeight;
    } catch (e) {
      areaMensagens.innerHTML += `<div><b>Bot:</b> Ocorreu um erro ao buscar resposta.</div>`;
    }
  }

  if (API_URL && API_TOKEN) {
    criarInterfaceDoBot();
  } else {
    console.error("⚠️ PIXELUP_BOT_CONFIG não encontrado ou incompleto.");
  }
})();
