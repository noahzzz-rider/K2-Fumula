import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const supabase = createClient(
  process.env.SUPABASE_URL || 'https://ryiqmfapsiocskojrdvz.supabase.co',
  process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5aXFtZmFwc2lvY3Nrb2pyZHZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2MTc4NTgsImV4cCI6MjA5MzE5Mzg1OH0.PDKOiA5UY6a98xT2_o9CXPGE_ELDr_ih75QaQTeJU8g'
);

export async function init() {
  console.log('Supabase 数据库连接就绪');
}

export async function createUser(username, password) {
  const hashedPassword = bcrypt.hashSync(password, 10);
  const { data, error } = await supabase
    .from('users')
    .insert({ username, password_hash: hashedPassword, points: 100, cards: [] })
    .select('id')
    .single();
  if (error) throw error;
  await supabase.from('user_stats').insert({ user_id: data.id });
  return data.id;
}

export async function getUserByUsername(username) {
  const { data } = await supabase
    .from('users')
    .select('id, username, password_hash, points, cards')
    .eq('username', username)
    .single();
  if (data) data.password = data.password_hash;
  return data;
}

export async function getUserById(id) {
  const { data } = await supabase
    .from('users')
    .select('id, username, password_hash, points, cards')
    .eq('id', id)
    .single();
  if (data) data.password = data.password_hash;
  return data;
}

export async function getUserStats(userId) {
  const { data } = await supabase
    .from('user_stats')
    .select('*')
    .eq('user_id', userId)
    .single();
  return data || { total_draws: 0, pity_sr: 0, pity_ssr: 0 };
}

export async function updateUserStats(userId, stats) {
  await supabase
    .from('user_stats')
    .upsert({
      user_id: userId,
      total_draws: stats.total_draws,
      pity_sr: stats.pity_sr,
      pity_ssr: stats.pity_ssr
    });
}

export async function getUserPoints(id) {
  const { data } = await supabase
    .from('users')
    .select('points')
    .eq('id', id)
    .single();
  return data?.points ?? 0;
}

export async function updatePoints(id, points) {
  await supabase.from('users').update({ points }).eq('id', id);
}

export async function getUserCards(id) {
  const { data } = await supabase
    .from('users')
    .select('cards')
    .eq('id', id)
    .single();
  return data?.cards || [];
}

export async function updateCards(id, cards) {
  await supabase.from('users').update({ cards }).eq('id', id);
}

export function verifyPassword(plainPassword, hashedPassword) {
  return bcrypt.compareSync(plainPassword, hashedPassword);
}
