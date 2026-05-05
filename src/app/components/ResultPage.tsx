import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { Sparkles, Coins } from 'lucide-react';
import { Button } from './ui/button';
import type { Card } from '../App';

interface ResultPageProps {
  type: 'single' | 'ten';
  cards: Card[];
  onKeepAll: () => void;
  onConvertAll: () => void;
  onKeepCard: (cardId: string) => void;
  onConvertCard: (cardId: string) => void;
}

export function ResultPage({ type, cards, onKeepAll, onConvertAll }: ResultPageProps) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setRevealed(true);

      const hasSSR = cards.some(c => c.rarity === 'SSR');
      const hasSR = cards.some(c => c.rarity === 'SR');

      if (hasSSR) {
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.6 },
          colors: ['#FFD700', '#FFA500', '#FF6347']
        });
      } else if (hasSR) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#EF4444', '#EC4899', '#F43F5E']
        });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [cards]);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'SSR': return 'from-yellow-500 to-orange-600';
      case 'SR': return 'from-red-500 to-rose-600';
      case 'R': return 'from-emerald-500 to-teal-500';
      default: return 'from-gray-600 to-gray-700';
    }
  };

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case 'SSR': return 'border-yellow-500 shadow-yellow-500/50';
      case 'SR': return 'border-red-500 shadow-red-500/50';
      case 'R': return 'border-emerald-500 shadow-emerald-500/50';
      default: return 'border-gray-600 shadow-gray-600/30';
    }
  };

  const getTotalPoints = () => {
    return cards.reduce((sum, card) => {
      const rarityPoints = { N: 1, R: 5, SR: 20, SSR: 100 };
      return sum + rarityPoints[card.rarity];
    }, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950 p-4 flex items-center justify-center">
      <div className="max-w-4xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-4"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent mb-1">
            拆包结果
          </h1>
          <p className="text-gray-300 text-sm">恭喜获得 {cards.length} 张卡牌！</p>
        </motion.div>

        <div className={`grid gap-2 mb-4 ${cards.length === 1 ? 'grid-cols-1 max-w-[140px] mx-auto' : 'grid-cols-5 max-w-3xl mx-auto'}`}>
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, scale: 1, rotateY: 180 }}
              animate={revealed ? {
                opacity: 1,
                scale: 1,
                rotateY: 0
              } : {}}
              transition={{
                delay: index * 0.2,
                duration: 0.6,
                ease: "easeOut"
              }}
              whileHover={{ scale: 1.05, y: -8 }}
              className="relative"
              style={{ perspective: 1000 }}
            >
              <div className={`relative bg-gradient-to-br ${getRarityColor(card.rarity)} rounded-lg p-2 border-3 ${getRarityBorder(card.rarity)} shadow-xl aspect-[2/3] flex flex-col items-center justify-between overflow-hidden`}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-white/30 pointer-events-none"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.15),transparent_60%)] pointer-events-none"></div>

                <div className="absolute top-0 left-0 w-full h-full opacity-40">
                  <div className="absolute top-1 left-1 w-5 h-5 border-t-2 border-l-2 border-white/60 rounded-tl-lg"></div>
                  <div className="absolute top-1 right-1 w-5 h-5 border-t-2 border-r-2 border-white/60 rounded-tr-lg"></div>
                  <div className="absolute bottom-1 left-1 w-5 h-5 border-b-2 border-l-2 border-white/60 rounded-bl-lg"></div>
                  <div className="absolute bottom-1 right-1 w-5 h-5 border-b-2 border-r-2 border-white/60 rounded-br-lg"></div>
                </div>

                <div className="absolute inset-2 border border-white/20 rounded-md pointer-events-none"></div>

                <div className="absolute top-1.5 right-1.5 bg-gradient-to-br from-white via-gray-50 to-white backdrop-blur-sm text-gray-900 text-[10px] font-black px-2 py-0.5 rounded-full shadow-xl z-10 border-2 border-white/80">
                  <span className="bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent">{card.rarity}</span>
                </div>

                <div className="flex-1 flex items-center justify-center z-10">
                  <div className="relative">
                    <div className="absolute inset-0 bg-white/30 rounded-full blur-2xl scale-[2.5]"></div>
                    <div className="absolute inset-0 bg-white/20 rounded-full blur-xl scale-150"></div>
                    <div className="relative text-4xl drop-shadow-2xl">{card.emoji}</div>
                  </div>
                </div>

                <div className="w-full z-10 px-1">
                  <div className="h-px bg-gradient-to-r from-transparent via-white/50 to-transparent mb-1"></div>
                  <div className="bg-black/20 backdrop-blur-sm rounded px-1 py-0.5 border border-white/20">
                    <p className="text-white text-center font-black text-[11px] leading-tight drop-shadow-2xl tracking-wide">{card.name}</p>
                  </div>
                </div>

                {card.rarity === 'SSR' && (
                  <>
                    <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-yellow-200 rounded-full blur-sm animate-pulse"></div>
                    <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-orange-200 rounded-full blur-sm animate-pulse delay-300"></div>
                    <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-yellow-300 rounded-full blur-sm animate-pulse delay-500"></div>
                  </>
                )}
              </div>

              {card.rarity === 'SSR' && (
                <motion.div
                  className="absolute -inset-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 rounded-lg -z-10 blur-xl"
                  animate={{ opacity: [0.7, 1, 0.7], scale: [1, 1.05, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                />
              )}

              {card.rarity === 'SR' && (
                <motion.div
                  className="absolute -inset-1.5 bg-gradient-to-r from-red-500 via-rose-500 to-red-500 rounded-lg -z-10 blur-lg"
                  animate={{ opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              )}

              {card.rarity === 'R' && (
                <motion.div
                  className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500 rounded-lg -z-10 blur-md"
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                />
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: cards.length * 0.1 + 0.3 }}
          className="flex flex-row gap-2 max-w-md mx-auto"
        >
          <Button
            onClick={onKeepAll}
            className="group relative flex-1 py-2.5 px-4 bg-gradient-to-r from-green-500 via-emerald-500 to-emerald-600 hover:from-green-600 hover:via-emerald-600 hover:to-emerald-700 text-white font-bold rounded-lg shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 text-sm transition-all hover:scale-105 border-2 border-green-400/30 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-white/20"></div>
            <div className="absolute top-0 left-0 w-16 h-16 bg-white/20 rounded-full blur-xl"></div>
            <div className="relative flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>{type === 'single' ? '保留该张' : '全部保留'}</span>
            </div>
          </Button>

          <Button
            onClick={onConvertAll}
            className="group relative flex-1 py-2.5 px-4 bg-gradient-to-r from-orange-500 via-orange-600 to-red-600 hover:from-orange-600 hover:via-orange-700 hover:to-red-700 text-white font-bold rounded-lg shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 text-sm transition-all hover:scale-105 border-2 border-orange-400/30 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-white/20"></div>
            <div className="absolute top-0 right-0 w-16 h-16 bg-white/20 rounded-full blur-xl"></div>
            <div className="relative flex items-center justify-center gap-2">
              <Coins className="w-4 h-4" />
              <span>转积分 (+{getTotalPoints()})</span>
            </div>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-3 text-gray-400 text-xs"
        >
          <p>转换比例: N=1分 | R=5分 | SR=20分 | SSR=100分</p>
        </motion.div>
      </div>
    </div>
  );
}
