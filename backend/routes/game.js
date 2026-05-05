import express from 'express';
import jwt from 'jsonwebtoken';
import { getUserById, getUserStats, updateUserStats, getUserPoints, updatePoints, getUserCards, updateCards } from '../db.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'gacha-secret-key-2024-v3';

const DRAW_COST = 10;
const MULTI_DISCOUNT = 9;

const CARDS = [
  { id: 'n_01', name: '暗影使者', emoji: '🌑', rarity: 'N' },
  { id: 'n_02', name: '土之僵偶', emoji: '🪨', rarity: 'N' },
  { id: 'n_03', name: '森林守卫', emoji: '🌲', rarity: 'N' },
  { id: 'n_04', name: '水之精灵', emoji: '💧', rarity: 'N' },
  { id: 'n_05', name: '风之舞者', emoji: '🍃', rarity: 'N' },
  { id: 'r_01', name: '月光刺客', emoji: '🌙', rarity: 'R' },
  { id: 'r_02', name: '烈焰魔王', emoji: '🔥', rarity: 'R' },
  { id: 'r_03', name: '冰霜法师', emoji: '❄️', rarity: 'R' },
  { id: 'r_04', name: '雷电使者', emoji: '⚡', rarity: 'R' },
  { id: 'r_05', name: '弓箭猎手', emoji: '🏹', rarity: 'R' },
  { id: 'sr_01', name: '暗夜魔王', emoji: '😈', rarity: 'SR' },
  { id: 'sr_02', name: '圣光骑士', emoji: '⚔️', rarity: 'SR' },
  { id: 'sr_03', name: '龙之守护', emoji: '🐉', rarity: 'SR' },
  { id: 'sr_04', name: '凤凰之翼', emoji: '🦅', rarity: 'SR' },
  { id: 'sr_05', name: '海洋之心', emoji: '🌊', rarity: 'SR' },
  { id: 'ssr_01', name: '创世之神', emoji: '✨', rarity: 'SSR' },
  { id: 'ssr_02', name: '毁灭魔神', emoji: '💀', rarity: 'SSR' },
  { id: 'ssr_03', name: '时空法师', emoji: '⏰', rarity: 'SSR' },
  { id: 'ssr_04', name: '命运织者', emoji: '🔮', rarity: 'SSR' },
  { id: 'ssr_05', name: '永恒之王', emoji: '👑', rarity: 'SSR' },
];

const RARITY_RATES = { 'N': 0.65, 'R': 0.25, 'SR': 0.08, 'SSR': 0.02 };
const PITY_SR_THRESHOLD = 20;
const PITY_SSR_THRESHOLD = 50;
const CONVERT_VALUES = { 'N': 1, 'R': 5, 'SR': 20, 'SSR': 100 };

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ error: '未授权' });
  try {
    const decoded = jwt.verify(authHeader.split(' ')[1], JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch { return res.status(401).json({ error: 'Token无效' }); }
}

function drawSingleCard(stats) {
  let rarity = 'N';
  if (stats.pity_ssr >= PITY_SSR_THRESHOLD) rarity = 'SSR';
  else if (stats.pity_sr >= PITY_SR_THRESHOLD) rarity = 'SR';
  else {
    const rand = Math.random();
    let cum = 0;
    for (const [r, rate] of Object.entries(RARITY_RATES)) { cum += rate; if (rand < cum) { rarity = r; break; } }
  }

  const pool = CARDS.filter(c => c.rarity === rarity);
  const card = pool[Math.floor(Math.random() * pool.length)];
  const s = { ...stats };
  if (rarity === 'SSR') { s.pity_ssr = 0; s.pity_sr = 0; }
  else if (rarity === 'SR') { s.pity_sr = 0; s.pity_ssr = (s.pity_ssr || 0) + 1; }
  else { s.pity_sr = (s.pity_sr || 0) + 1; s.pity_ssr = (s.pity_ssr || 0) + 1; }
  s.total_draws = (s.total_draws || 0) + 1;
  return { card: { ...card }, newStats: s };
}

router.post('/draw', authMiddleware, async (req, res) => {
  const { count = 1 } = req.body;
  const drawCount = Math.min(Math.max(count, 1), 10);
  const totalCost = drawCount === 10 ? drawCount * MULTI_DISCOUNT : drawCount * DRAW_COST;

  try {
    const user = await getUserById(req.userId);
    if (!user) return res.status(404).json({ error: '用户不存在' });
    if (user.points < totalCost) return res.status(400).json({ error: `积分不足，需要${totalCost}积分` });

    let stats = await getUserStats(req.userId);
    const results = [];
    let cur = { ...stats };
    for (let i = 0; i < drawCount; i++) { const r = drawSingleCard(cur); results.push(r.card); cur = r.newStats; }

    await updatePoints(req.userId, user.points - totalCost);
    await updateUserStats(req.userId, { total_draws: cur.total_draws, pity_sr: cur.pity_sr, pity_ssr: cur.pity_ssr });

    res.json({ success: true, cards: results, cost: totalCost, remainingPoints: user.points - totalCost, totalDraws: cur.total_draws });
  } catch (error) { console.error('抽卡错误:', error); res.status(500).json({ error: '抽卡失败' }); }
});

router.post('/convert', authMiddleware, async (req, res) => {
  const { cards } = req.body;
  if (!cards || !Array.isArray(cards) || !cards.length) return res.status(400).json({ error: '卡牌信息不完整' });

  try {
    let total = 0;
    const details = [];
    for (const c of cards) { const v = CONVERT_VALUES[c.rarity]; if (v) { total += v; details.push({ name: c.name, rarity: c.rarity, value: v }); } }
    if (!total) return res.status(400).json({ error: '没有可转换的卡牌' });

    const pts = await getUserPoints(req.userId);
    await updatePoints(req.userId, pts + total);
    res.json({ success: true, totalConverted: total, remainingPoints: pts + total, details });
  } catch (error) { console.error('转换错误:', error); res.status(500).json({ error: '转换失败' }); }
});

router.post('/keep', authMiddleware, async (req, res) => {
  const { cards } = req.body;
  if (!cards || !Array.isArray(cards) || !cards.length) return res.status(400).json({ error: '卡牌信息不完整' });

  try {
    const userCards = await getUserCards(req.userId);
    const newCards = [...userCards, ...cards];
    await updateCards(req.userId, newCards);
    res.json({ success: true, totalCards: newCards.length, cards: newCards });
  } catch (error) { console.error('保存错误:', error); res.status(500).json({ error: '保存失败' }); }
});

router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const stats = await getUserStats(req.userId);
    res.json({ totalDraws: stats.total_draws || 0, pitySR: stats.pity_sr || 0, pitySSR: stats.pity_ssr || 0, pitySRThreshold: PITY_SR_THRESHOLD, pitySSRThreshold: PITY_SSR_THRESHOLD });
  } catch { res.status(500).json({ error: '获取数据失败' }); }
});

export default router;
