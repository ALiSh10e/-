import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import https from 'https';

function ttsProxyPlugin(): Plugin {
  const handler = (req: any, res: any, next: any) => {
    if (!req.url?.startsWith('/api/tts')) {
      return next();
    }
    const host = req.headers.host || 'localhost:3000';
    const parsedUrl = new URL(req.url, `http://${host}`);
    const text = parsedUrl.searchParams.get('text') || parsedUrl.searchParams.get('q') || '';
    if (!text.trim()) {
      res.statusCode = 400;
      res.end('Missing text parameter');
      return;
    }

    const cleanText = text.slice(0, 180);
    const targetUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=ar&client=tw-ob&q=${encodeURIComponent(cleanText)}`;
    
    const clientReq = https.get(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://translate.google.com/'
      }
    }, (clientRes) => {
      res.writeHead(clientRes.statusCode || 200, {
        'Content-Type': clientRes.headers['content-type'] || 'audio/mpeg',
        'Cache-Control': 'public, max-age=604800, immutable',
        'Access-Control-Allow-Origin': '*'
      });
      clientRes.pipe(res);
    });

    clientReq.on('error', (err) => {
      res.statusCode = 502;
      res.end(`TTS Fetch Error: ${err.message}`);
    });
  };

  return {
    name: 'tts-proxy-plugin',
    configureServer(server) {
      server.middlewares.use(handler);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler);
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), ttsProxyPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
