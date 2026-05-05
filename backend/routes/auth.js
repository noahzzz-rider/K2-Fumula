import express from 'express';
import jwt from 'jsonwebtoken';
import { createUser, getUserByUsername, verifyPassword } from '../db.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'gacha-secret-key-2024-v3';

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: '用户名和密码不能为空' });
  if (username.length < 3 || username.length > 20) return res.status(400).json({ error: '用户名长度需在3-20个字符之间' });
  if (password.length < 6) return res.status(400).json({ error: '密码长度至少6个字符' });

  try {
    const existing = await getUserByUsername(username);
    if (existing) return res.status(400).json({ error: '用户名已存在' });

    const userId = await createUser(username, password);
    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ message: '注册成功', token, user: { id: userId, username, points: 100, cards: [] } });
  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({ error: '注册失败' });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: '用户名和密码不能为空' });

  try {
    const user = await getUserByUsername(username);
    if (!user) return res.status(401).json({ error: '用户名或密码错误' });
    if (!verifyPassword(password, user.password)) return res.status(401).json({ error: '用户名或密码错误' });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ message: '登录成功', token, user: { id: user.id, username: user.username, points: user.points, cards: user.cards || [] } });
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({ error: '登录失败' });
  }
});

export default router;
