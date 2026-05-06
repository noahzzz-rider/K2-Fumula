import { useState } from 'react';
import { Star, LogOut, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'motion/react';
import type { User, Card } from '../App';

interface MainPageProps {
  user: User;
  totalDraws: number;
  onGacha: (type: 'single' | 'ten') => void;
  onLogout: () => void;
  onRecharge: (amount: number) => void;
}

export function MainPage({ user, totalDraws, onGacha, onLogout, onRecharge }: MainPageProps) {
  const [currentPackIndex, setCurrentPackIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState(0);
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [showAllCards, setShowAllCards] = useState(false);
  const [showCardsDrawer, setShowCardsDrawer] = useState(false);

  const cardPacks = [
    { id: 0, name: '基础卡包', subtitle: 'Basic Pack', image: 'https://images.unsplash.com/photo-1683732063736-206f03d2be1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwY2FyZCUyMGRlY2slMjBmYW50YXN5JTIwbWFnaWNhbHxlbnwxfHx8fDE3Nzc1NTA5OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 1, name: '神秘卡包', subtitle: 'Premium Gold Pack', image: 'https://images.unsplash.com/photo-1637720728290-e962c4921723?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxseHVyeSUyMGNhcmQlMjBwYWNrJTIwYm94JTIwZ29sZCUyMHByZW1pdW18ZW58MXx8fHwxNzc3NTUwOTkwfDA&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 2, name: '高级卡包', subtitle: 'Elite Pack', image: 'https://images.unsplash.com/photo-1760804876166-aae5861ec7c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxseHVyeSUyMGNhcmQlMjBwYWNrJTIwYm94JTIwZ29sZCUyMHByZW1pdW18ZW58MXx8fHwxNzc3NTUwOTkwfDA&ixlib=rb-4.1.0&q=80&w=1080' },
  ];

  const rarityStats = { N: user.cards.filter(c => c.rarity === 'N').length, R: user.cards.filter(c => c.rarity === 'R').length, SR: user.cards.filter(c => c.rarity === 'SR').length, SSR: user.cards.filter(c => c.rarity === 'SSR').length };

  const handlePackChange = (newIndex: number) => { if (newIndex < 0 || newIndex >= cardPacks.length) return; setSlideDirection(newIndex > currentPackIndex ? 1 : -1); setCurrentPackIndex(newIndex); };
  const currentPack = cardPacks[currentPackIndex];
  const prevPack = cardPacks[(currentPackIndex - 1 + cardPacks.length) % cardPacks.length];
  const nextPack = cardPacks[(currentPackIndex + 1) % cardPacks.length];

  const getRarityColor = (rarity: string) => { switch (rarity) { case 'SSR': return 'from-yellow-500 to-orange-600'; case 'SR': return 'from-red-500 to-rose-600'; case 'R': return 'from-emerald-500 to-teal-500'; default: return 'from-gray-600 to-gray-700'; } };
  const getRarityBorder = (rarity: string) => { switch (rarity) { case 'SSR': return 'border-yellow-500 shadow-yellow-500/50'; case 'SR': return 'border-red-500 shadow-red-500/50'; case 'R': return 'border-emerald-500 shadow-emerald-500/50'; default: return 'border-gray-600 shadow-gray-600/30'; } };

  if (showAllCards) { return <AllCardsPage cards={user.cards} onBack={() => setShowAllCards(false)} getRarityColor={getRarityColor} getRarityBorder={getRarityBorder} />; }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIvPjwvZz48L3N2Zz4=')] opacity-20"></div>
      <div className="relative max-w-6xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div><h2 className="text-gray-400 text-sm mb-1">欢迎回来</h2><h1 className="text-3xl font-bold text-white">{user.username}</h1></div>
            <button onClick={onLogout} className="group bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600/30 hover:border-gray-500/50 px-3 py-2 rounded-lg transition-all text-gray-400 hover:text-gray-200"><LogOut className="w-4 h-4" /></button>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowRechargeModal(true)} className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-pointer">
              <div className="flex items-center gap-2"><Star className="w-6 h-6 text-white fill-white" /><span className="text-white font-bold text-xl">{user.points}</span><span className="text-white/80 text-sm">积分</span><span className="text-white/60 text-xs ml-1">+</span></div>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="group relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-gray-600/50 rounded-lg px-3 py-2 shadow-md hover:shadow-lg transition-all overflow-hidden">
            <div className="absolute top-0 right-0 w-12 h-12 bg-white/5 rounded-full blur-xl"></div>
            <div className="relative"><div className="flex items-center justify-between mb-1"><div className="text-gray-400 text-[10px] uppercase tracking-wide">总抽卡</div><div className="text-sm opacity-20">🎴</div></div><div className="text-lg font-bold text-white">{totalDraws}</div></div>
          </div>
          <div className="group relative bg-gradient-to-br from-emerald-900/60 to-teal-900/60 backdrop-blur-sm border border-emerald-500/40 rounded-lg px-3 py-2 shadow-md shadow-emerald-500/10 hover:shadow-lg transition-all overflow-hidden">
            <div className="absolute top-0 right-0 w-12 h-12 bg-emerald-400/10 rounded-full blur-xl"></div>
            <div className="relative"><div className="flex items-center justify-between mb-1"><div className="text-emerald-200 text-[10px] uppercase tracking-wide">R</div><div className="text-sm opacity-30">💎</div></div><div className="text-lg font-bold text-emerald-300">{rarityStats.R}</div></div>
          </div>
          <div className="group relative bg-gradient-to-br from-rose-900/60 to-pink-900/60 backdrop-blur-sm border border-rose-500/40 rounded-lg px-3 py-2 shadow-md shadow-rose-500/10 hover:shadow-lg transition-all overflow-hidden">
            <div className="absolute top-0 right-0 w-12 h-12 bg-rose-400/10 rounded-full blur-xl"></div>
            <div className="relative"><div className="flex items-center justify-between mb-1"><div className="text-rose-200 text-[10px] uppercase tracking-wide">SSR</div><div className="text-sm opacity-30">👑</div></div><div className="text-lg font-bold text-rose-300">{rarityStats.SSR}</div></div>
          </div>
        </div>

        <div className="relative">
          <div className="flex items-center justify-center gap-4">
            <button onClick={() => handlePackChange(currentPackIndex - 1)} className="absolute left-0 z-20 bg-black/30 hover:bg-black/50 backdrop-blur-sm p-2 rounded-full transition-all hover:scale-110"><ChevronLeft className="w-6 h-6 text-white" /></button>
            <div className="relative w-[200px] h-[280px]">
              <AnimatePresence mode="wait">
                <motion.div key={currentPack.id} initial={{ opacity: 0, x: slideDirection * 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -slideDirection * 100 }} transition={{ duration: 0.3 }} className="absolute inset-0">
                  <img src={prevPack.image} alt="" className="w-full h-full object-cover rounded-2xl opacity-30 blur-sm scale-90" />
                </motion.div>
                <motion.div key={`current-${currentPack.id}`} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3 }} className="absolute inset-0 z-10">
                  <img src={currentPack.image} alt={currentPack.name} className="w-full h-full object-cover rounded-2xl shadow-2xl" />
                </motion.div>
                <motion.div key={`next-${currentPack.id}`} initial={{ opacity: 0, x: -slideDirection * 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: slideDirection * 100 }} transition={{ duration: 0.3 }} className="absolute inset-0">
                  <img src={nextPack.image} alt="" className="w-full h-full object-cover rounded-2xl opacity-30 blur-sm scale-90" />
                </motion.div>
              </AnimatePresence>
            </div>
            <button onClick={() => handlePackChange(currentPackIndex + 1)} className="absolute right-0 z-20 bg-black/30 hover:bg-black/50 backdrop-blur-sm p-2 rounded-full transition-all hover:scale-110"><ChevronRight className="w-6 h-6 text-white" /></button>
          </div>
          <div className="flex justify-center gap-1.5 mb-6">{cardPacks.map((pack, i) => (<button key={pack.id} onClick={() => handlePackChange(i)} className={`rounded-full transition-all ${i === currentPackIndex ? 'bg-yellow-400 w-3 h-3' : 'bg-white/30 w-2 h-2'}`}></button>))}</div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={currentPack.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="text-center mb-6">
            <h3 className="text-white font-bold text-xl mb-2">{currentPack.name}</h3>
            <div className="flex items-center justify-center gap-2 text-gray-300 text-sm mb-4"><span>👁️</span><span>概率: N 65% | R 25% | SR 8% | SSR 2%</span></div>
          </motion.div>
        </AnimatePresence>

        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => onGacha('single')} disabled={user.points < 10} className="group relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-500 to-cyan-600 hover:from-emerald-500 hover:via-teal-400 hover:to-cyan-500 disabled:from-gray-700 disabled:to-gray-800 rounded-xl py-4 px-6 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/30 disabled:hover:scale-100 border-2 border-emerald-400/50 disabled:border-gray-600">
            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-white/30"></div>
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute -top-1 -left-1 w-16 h-16 bg-emerald-300/20 rounded-full blur-xl group-hover:bg-emerald-300/40 transition-all"></div>
            <div className="relative text-center"><div className="text-white font-bold text-lg drop-shadow-md">单抽</div><div className="text-white/90 text-sm font-medium">10积分</div></div>
          </button>
          <button onClick={() => onGacha('ten')} disabled={user.points < 90} className="group relative overflow-hidden bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 hover:from-amber-400 hover:via-orange-400 hover:to-red-400 disabled:from-gray-700 disabled:to-gray-800 rounded-xl py-4 px-6 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-500/30 disabled:hover:scale-100 border-2 border-orange-400/50 disabled:border-gray-600">
            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-white/30"></div>
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute -top-1 -right-1 w-16 h-16 bg-orange-300/20 rounded-full blur-xl group-hover:bg-orange-300/40 transition-all"></div>
            <div className="relative text-center"><div className="text-white font-bold text-lg drop-shadow-md">十连</div><div className="text-white/90 text-sm font-medium">90积分</div></div>
          </button>
        </div>

        <div className="text-center">
          <button onClick={() => setShowAllCards(true)} className="bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600/30 hover:border-gray-500/50 px-6 py-3 rounded-xl transition-all text-gray-300 hover:text-white">
            <div className="flex items-center gap-2"><span>📦</span><span>我的卡牌 ({user.cards.length})</span></div>
          </button>
        </div>
      </div>

      <AnimatePresence>{showRechargeModal && <RechargeModal user={user} onRecharge={onRecharge} onClose={() => setShowRechargeModal(false)} />}</AnimatePresence>
    </div>
  );
}

function RechargeModal({ user, onRecharge, onClose }: { user: User; onRecharge: (amount: number) => void; onClose: () => void }) {
  const rechargeOptions = [{ amount: 100, price: 6, bonus: 0, label: '首充特惠' }, { amount: 500, price: 30, bonus: 0, label: '' }, { amount: 1000, price: 50, bonus: 150, label: '送150' }, { amount: 2000, price: 98, bonus: 400, label: '送400' }, { amount: 5000, price: 238, bonus: 1200, label: '送1200' }];
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-gray-900/95 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full border border-white/10" onClick={e => e.stopPropagation()}>
        <div className="text-center mb-6"><h2 className="text-2xl font-bold text-yellow-400 mb-2">💰 积分充值</h2><p className="text-gray-400 text-sm">仅供演示，实际不会扣费</p></div>
        <div className="space-y-3">{rechargeOptions.map(option => (
          <button key={option.amount} onClick={() => { onRecharge(option.amount + option.bonus); onClose(); }} className="w-full flex items-center justify-between p-4 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600/30 hover:border-yellow-500/50 rounded-xl transition-all relative">
            {option.label && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{option.label}</span>}
            <div className="flex items-center gap-3"><span className="text-2xl">⭐</span><div><div className="text-yellow-400 font-bold text-lg">{option.amount}积分</div><div className="text-gray-400 text-sm">¥{option.price}</div></div></div>
            {option.bonus > 0 && <div className="text-green-400 text-sm font-medium">+{option.bonus}</div>}
          </button>
        ))}</div>
        <div className="text-center text-gray-400 text-xs mt-6"><p>⚠️ 仅供演示，实际不会扣费</p></div>
        <button onClick={onClose} className="w-full mt-4 py-3 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600/30 hover:border-gray-500/50 rounded-xl transition-all text-gray-400 hover:text-white">关闭</button>
      </motion.div>
    </motion.div>
  );
}

function AllCardsPage({ cards, onBack, getRarityColor, getRarityBorder }: { cards: Card[]; onBack: () => void; getRarityColor: (r: string) => string; getRarityBorder: (r: string) => string }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"><ChevronLeft className="w-5 h-5" /><span>返回</span></button>
          <div className="text-center"><h1 className="text-2xl font-bold text-white">我的卡牌</h1><p className="text-gray-400 text-sm">共 {cards.length} 张</p></div>
          <div className="w-16"></div>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
          {cards.map((card, index) => (
            <motion.div key={`${card.id}-${index}`} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.02 }} className={`relative rounded-lg border-2 ${getRarityBorder(card.rarity)} shadow-lg hover:scale-110 hover:z-10 transition-transform aspect-[2/3] overflow-hidden bg-gray-900`}>
              <div className="absolute top-1 right-1 bg-white/95 text-gray-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full z-10">{card.rarity}</div>
              {card.image ? (
                <img src={card.image} alt={card.name} className="w-full h-full object-cover" loading="lazy" />
              ) : (
                <div className={`w-full h-full bg-gradient-to-br ${getRarityColor(card.rarity)} flex items-center justify-center`}>
                  <span className="text-3xl">{card.emoji}</span>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm px-1 py-0.5">
                <p className="text-white text-center text-[10px] font-semibold truncate w-full leading-tight">{card.name}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
