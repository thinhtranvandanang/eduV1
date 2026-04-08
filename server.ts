import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Supabase OAuth Callback Handler
  app.get(['/auth/callback', '/auth/callback/'], (req, res) => {
    res.send(`
      <html>
        <body>
          <script>
            if (window.opener) {
              // Gửi toàn bộ URL (bao gồm cả ?code=... hoặc #access_token=...) về cửa sổ chính
              window.opener.postMessage({ 
                type: 'SUPABASE_AUTH_SUCCESS',
                url: window.location.href 
              }, '*');
              window.close();
            } else {
              window.location.href = '/';
            }
          </script>
          <p>Đang xác thực... Cửa sổ này sẽ tự đóng.</p>
        </body>
      </html>
    `);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
