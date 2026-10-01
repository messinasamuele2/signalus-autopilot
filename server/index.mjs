import { mkdir, readFile, stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { basename, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import ffmpegPath from 'ffmpeg-static';
import { checkInstagramConnection, publishReel } from './instagram-client.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const outputDirectory = join(root, 'generated');
const frontendDirectory = join(root, 'dist');
const rssFeeds = [
  'https://feeds.bbci.co.uk/news/rss.xml',
  'https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml',
];

async function loadEnvFile() {
  try {
    const contents = await readFile(join(root, '.env'), 'utf8');
    for (const line of contents.split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
      if (match && !process.env[match[1]]) process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, '');
    }
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
}

function sendJson(response, status, body) {
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  response.end(JSON.stringify(body));
}

async function serveStatic(response, pathname) {
  const relativePath = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  const filePath = join(frontendDirectory, relativePath);
  if (!filePath.startsWith(frontendDirectory)) return false;
  try {
    const fileInfo = await stat(filePath);
    if (!fileInfo.isFile()) return false;
    const contentType = filePath.endsWith('.html') ? 'text/html; charset=utf-8'
      : filePath.endsWith('.css') ? 'text/css; charset=utf-8'
        : filePath.endsWith('.js') ? 'text/javascript; charset=utf-8' : 'application/octet-stream';
    response.writeHead(200, { 'Content-Type': contentType });
    response.end(await readFile(filePath));
    return true;
  } catch {
    return false;
  }
}

function decodeXml(value = '') {
  return value.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").trim();
}

function parseRss(xml, feed) {
  return [...xml.matchAll(/<item\b[^>]*>([\s\S]*?)<\/item>/gi)].slice(0, 10).map((match) => {
    const item = match[1];
    const field = (name) => decodeXml(item.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)<\\/${name}>`, 'i'))?.[1]);
    return { title: field('title'), link: field('link'), description: field('description'), publishedAt: field('pubDate'), source: feed };
  }).filter((item) => item.title && item.link);
}

async function getNews() {
  const results = await Promise.allSettled(rssFeeds.map(async (feed) => {
    const response = await fetch(feed, { headers: { 'User-Agent': 'SignalUS-News/1.0' } });
    if (!response.ok) throw new Error(`${feed} returned ${response.status}`);
    return parseRss(await response.text(), feed);
  }));
  const news = results.flatMap((result) => result.status === 'fulfilled' ? result.value : []);
  if (!news.length) throw new Error('No RSS feed could be read.');
  return news;
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = '';
    request.on('data', (chunk) => { body += chunk; if (body.length > 1_000_000) reject(new Error('Request body too large.')); });
    request.on('end', () => { try { resolve(body ? JSON.parse(body) : {}); } catch { reject(new Error('Request body must be valid JSON.')); } });
    request.on('error', reject);
  });
}

function runFfmpeg(news, outputPath) {
  return new Promise((resolve, reject) => {
    const text = `${news.title}\\n\\n${news.description || news.link}`.replace(/'/g, '\\u2019').slice(0, 900);
    const ffmpegProcess = spawn(globalThis.process.env.FFMPEG_PATH || ffmpegPath || 'ffmpeg', [
      '-y', '-f', 'lavfi', '-i', 'color=c=0x101827:s=1080x1920:r=30', '-t', '30',
      '-vf', `drawtext=text='${text}':fontcolor=white:fontsize=46:line_spacing=16:x=(w-text_w)/2:y=(h-text_h)/2`,
      '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', outputPath,
    ], { windowsHide: true });
    let error = '';
    ffmpegProcess.stderr.on('data', (chunk) => { error += chunk; });
    ffmpegProcess.on('error', () => reject(new Error('ffmpeg is not available. Install ffmpeg and ensure it is on PATH (or set FFMPEG_PATH).')));
    ffmpegProcess.on('close', (code) => code === 0 ? resolve() : reject(new Error(`ffmpeg failed with exit code ${code}: ${error.slice(-500)}`)));
  });
}

async function runPipeline({ publish = false } = {}) {
  const news = (await getNews())[0];
  const filename = `news-${Date.now()}.mp4`;
  await runFfmpeg(news, join(outputDirectory, filename));
  const baseUrl = (process.env.PUBLIC_BASE_URL || `http://localhost:${port}`).replace(/\/$/, '');
  const mediaUrl = `${baseUrl}/generated/${filename}`;
  const caption = `${news.title}\n\nFonte: ${news.source}\n\n#USMarkets #Economy #News`;

  if (!publish) return { published: false, news, mediaUrl, filename, caption };
  if (!baseUrl.startsWith('https://')) {
    throw new Error('Automatic publishing requires PUBLIC_BASE_URL to be a public HTTPS URL.');
  }

  const published = await publishReel({ mediaUrl, caption });
  return { published: true, news, mediaUrl, filename, caption, ...published };
}

await loadEnvFile();
await mkdir(outputDirectory, { recursive: true });
const port = Number.parseInt(process.env.PORT || '8787', 10);
const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url, `http://${request.headers.host || 'localhost'}`);
    if (request.method === 'GET' && url.pathname === '/api/instagram/status') {
      sendJson(response, 200, await checkInstagramConnection());
    } else if (request.method === 'GET' && url.pathname === '/api/news') {
      sendJson(response, 200, { news: await getNews() });
    } else if (request.method === 'POST' && url.pathname === '/api/pipeline/run') {
      sendJson(response, 201, await runPipeline({ publish: process.env.AUTO_PUBLISH === 'true' }));
    } else if (request.method === 'POST' && url.pathname === '/api/instagram/publish') {
      const body = await readBody(request);
      let mediaUrl;
      try { mediaUrl = new URL(body.mediaUrl); } catch { throw new Error('mediaUrl must be a valid public HTTPS URL.'); }
      if (mediaUrl.protocol !== 'https:') throw new Error('mediaUrl must be a public HTTPS URL.');
      if (mediaUrl.hostname === 'localhost' || mediaUrl.hostname === '::1'
        || mediaUrl.hostname.endsWith('.local') || /^(10|127)\./.test(mediaUrl.hostname)
        || /^192\.168\./.test(mediaUrl.hostname) || /^172\.(1[6-9]|2\d|3[01])\./.test(mediaUrl.hostname)) {
        throw new Error('mediaUrl must point to a publicly reachable HTTPS host.');
      }
      if (typeof body.caption !== 'string' || body.caption.length > 2_200) throw new Error('caption is required and must be at most 2200 characters.');
      sendJson(response, 201, await publishReel({ mediaUrl: mediaUrl.toString(), caption: body.caption }));
    } else if (request.method === 'GET' && url.pathname.startsWith('/generated/')) {
      const filename = basename(url.pathname);
      const filePath = join(outputDirectory, filename);
      const data = await readFile(filePath);
      response.writeHead(200, { 'Content-Type': 'video/mp4', 'Cache-Control': 'public, max-age=3600' });
      response.end(data);
    } else {
      const served = request.method === 'GET' && await serveStatic(response, url.pathname);
      if (!served) sendJson(response, 404, { error: 'Not found' });
    }
  } catch (error) {
    console.error('[backend]', error.message);
    sendJson(response, 400, { error: error.message });
  }
});
server.listen(port, () => console.log(`SignalUS backend listening on http://localhost:${port}`));

if (process.env.AUTO_PUBLISH === 'true') {
  const intervalMinutes = Number.parseInt(process.env.PUBLISH_INTERVAL_MINUTES || '60', 10);
  const interval = Math.max(15, intervalMinutes) * 60 * 1000;
  setInterval(() => runPipeline({ publish: true }).catch((error) => {
    console.error('[scheduled-pipeline]', error.message);
  }), interval);
  console.log(`Automatic publishing enabled every ${Math.max(15, intervalMinutes)} minutes.`);
}
