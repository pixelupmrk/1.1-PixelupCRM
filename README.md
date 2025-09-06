# PixelUp SuperApp (Vercel)

Frontend estático + função Serverless para ChatBot Gemini.

## Estrutura
- `index.html` — Frontend simples com chat.
- `api/chat.js` — Função serverless chama Gemini (usa `GEMINI_API_KEY`).
- `vercel.json` — Rotas / builds.
- `package.json` — Script opcional para `vercel dev`.

## Deploy
1. Suba este repo no GitHub.
2. Conecte no Vercel.
3. Em *Settings → Environment Variables* crie:
   - `GEMINI_API_KEY` = SUA_CHAVE_REAL
4. Deploy.

Acesse a URL do Vercel e teste o chat.
