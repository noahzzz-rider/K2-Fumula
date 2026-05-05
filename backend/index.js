import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import authRoutes from './routes/auth.js';
import gameRoutes from './routes/game.js';
import { init as dbInit, getUserById } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'gacha-secret-key-2024-v3';

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes);

// Serve frontend static files from dist/
app.use(express.static(path.join(__dirname, '../dist')));

app.get('/api/me', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ error: '未授权' });

  try {
    const decoded = jwt.verify(authHeader.split(' ')[1], JWT_SECRET);
    const user = await getUserById(decoded.userId);
    if (!user) return res.status(404).json({ error: '用户不存在' });
    res.json({ id: user.id, username: user.username, points: user.points, cards: user.cards || [] });
  } catch { return res.status(401).json({ error: 'Token无效' }); }
});

// SPA fallback — serve index.html for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

async function start() {
  await dbInit();
  app.listen(PORT, () => { console.log(`抽卡系统已启动: http://localhost:${PORT}`); });
}

start();
