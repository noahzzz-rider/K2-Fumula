import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { Card } from '../App';

interface GachaAnimationProps {
  type: 'single' | 'ten';
  cards: Card[];
  onComplete: () => void;
}

export function GachaAnimation({ type, cards, onComplete }: GachaAnimationProps) {
  const [phase, setPhase] = useState<'package' | 'opening' | 'cards'>('package');
  const [showButtons, setShowButtons] = useState(false);
  const [flippedCards, setFlippedCards] = useState<boolean[]>([]);
  const [openMode, setOpenMode] = useState<'all' | 'single' | null>(null);
  const [canOpen, setCanOpen] = useState(false);

  const count = type === 'single' ? 1 : 10;

  useEffect(() => {
    setFlippedCards(new Array(count).fill(false));
  }, [count]);

  useEffect(() => {
    if (type === 'single') {
      const timer = setTimeout(() => {
        setPhase('cards');
        setTimeout(() => {
          setFlippedCards([true]);
        }, 500);
        setTimeout(() => {
          onComplete();
        }, 2000);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // 十连：延迟后允许用户点击
      const timer = setTimeout(() => {
        setCanOpen(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [type, onComplete]);

  const handleOpenPackage = () => {
    if (!canOpen || phase !== 'package') return;

    setPhase('opening');
    setTimeout(() => {
      setPhase('cards');
      setTimeout(() => {
        setShowButtons(true);
      }, 500);
    }, 600);
  };

  const handleOpenAll = () => {
    setOpenMode('all');
    setShowButtons(false);
    setFlippedCards(new Array(count).fill(true));
    setTimeout(() => {
      onComplete();
    }, 2500);
  };

  const handleOpenSingle = () => {
    setOpenMode('single');
    setShowButtons(false);
    flipNextCard();
  };

  const flipNextCard = () => {
    const nextIndex = flippedCards.findIndex(card => !card);
    if (nextIndex !== -1) {
      const newFlipped = [...flippedCards];
      newFlipped[nextIndex] = true;
      setFlippedCards(newFlipped);

      if (nextIndex === count - 1) {
        setTimeout(() => {
          onComplete();
        }, 2000);
      }
    }
  };

  const handleCardClick = () => {
    if (openMode === 'single' && flippedCards.some(card => !card)) {
      flipNextCard();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 flex items-center justify-center p-4 overflow-hidden">
      {/* 星光背景 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-yellow-400 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: 0
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0]
            }}
            transition={{
              duration: Math.random() * 2 + 1,
              repeat: Infinity,
              delay: Math.random() * 3
            }}
          />
        ))}
      </div>

      <div className="relative flex flex-col items-center justify-center">
        {/* 卡包阶段 */}
        <AnimatePresence>
          {(phase === 'package' || phase === 'opening') && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              transition={{ duration: phase === 'opening' ? 0.6 : 0.5 }}
              whileHover={canOpen ? { scale: 1.05 } : {}}
              whileTap={canOpen ? { scale: 0.98 } : {}}
              className="relative"
              onClick={handleOpenPackage}
              style={{ cursor: canOpen ? 'pointer' : 'default' }}
            >
              <motion.div
                className="absolute -inset-4 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 rounded-3xl blur-2xl opacity-60"
                animate={{
                  opacity: canOpen ? [0.5, 0.9, 0.5] : [0.4, 0.8, 0.4],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: canOpen ? 1.5 : 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              <motion.div
                className="relative w-64 h-80 rounded-3xl border-4 border-yellow-500/80 shadow-2xl overflow-hidden"
                animate={phase === 'opening' ? {
                  rotate: [0, -2, 2, -2, 2, 0],
                  scale: [1, 1.05, 1.1, 1.05, 1, 0.95]
                } : {}}
                transition={{ duration: 0.6 }}
              >
                <img
                  src="https://images.unsplash.com/photo-1680994330269-993e90deeca3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxnb2xkZW4lMjB0cmVhc3VyZSUyMGNoZXN0JTIwbHV4dXJ5JTIwYm94fGVufDF8fHx8MTc3NzU1MTEyOHww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Premium Pack"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 via-transparent to-orange-500/20"></div>

                <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                  <motion.div
                    className="w-32 h-32 bg-gradient-to-br from-yellow-400 via-orange-400 to-yellow-500 rounded-2xl mb-4 flex items-center justify-center shadow-2xl border-2 border-yellow-300/50"
                    animate={canOpen ? {
                      boxShadow: [
                        '0 0 20px rgba(251, 191, 36, 0.5)',
                        '0 0 40px rgba(251, 191, 36, 0.8)',
                        '0 0 20px rgba(251, 191, 36, 0.5)'
                      ],
                      scale: [1, 1.05, 1]
                    } : {
                      boxShadow: [
                        '0 0 20px rgba(251, 191, 36, 0.5)',
                        '0 0 40px rgba(251, 191, 36, 0.8)',
                        '0 0 20px rgba(251, 191, 36, 0.5)'
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="text-6xl">💎</div>
                  </motion.div>
                  <div className="text-yellow-400 font-bold text-2xl mb-2 drop-shadow-lg">神秘卡包</div>
                  <div className="text-yellow-200/80 text-sm mb-1 font-semibold">Premium Pack</div>
                  <div className="text-white/60 text-xs bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm mb-3">{count} Cards Inside</div>

                  {type === 'ten' && canOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-center"
                    >
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="text-white font-bold text-base mb-1 drop-shadow-lg flex items-center gap-2 justify-center"
                      >
                        <span className="text-2xl">👆</span>
                        <span>点击拆包</span>
                        <span>✨</span>
                      </motion.div>
                      <div className="text-white/50 text-xs">Click to Open</div>
                    </motion.div>
                  )}

                  {type === 'ten' && !canOpen && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="text-white/40 text-sm mt-2"
                    >
                      准备中...
                    </motion.div>
                  )}
                </div>

                <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-yellow-300/60 rounded-tl-xl"></div>
                <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-yellow-300/60 rounded-tr-xl"></div>
                <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-yellow-300/60 rounded-bl-xl"></div>
                <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-yellow-300/60 rounded-br-xl"></div>

                <div className="absolute inset-4 border border-yellow-400/20 rounded-2xl"></div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 卡牌展示阶段 */}
        <AnimatePresence>
          {phase === 'cards' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center"
            >
              {count === 1 && cards[0] ? (
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="relative"
                  style={{ perspective: 1000 }}
                >
                  <CardFlip isFlipped={flippedCards[0]} size="large" card={cards[0]} />
                </motion.div>
              ) : count === 10 ? (
                <>
                  <div className="grid grid-cols-5 gap-3 mb-8" onClick={handleCardClick}>
                    {cards.map((card, i) => (
                      <motion.div
                        key={card.id}
                        initial={{ scale: 0.5, opacity: 0, y: 50 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        transition={{
                          delay: i * 0.05,
                          type: "spring",
                          stiffness: 150
                        }}
                        className="relative"
                        style={{ perspective: 1000 }}
                      >
                        <CardFlip
                          isFlipped={flippedCards[i]}
                          size="small"
                          card={card}
                          delay={openMode === 'all' ? i * 0.1 : 0}
                        />
                      </motion.div>
                    ))}
                  </div>

                  {/* 十连剩余数量提示 */}
                  {openMode === 'single' && flippedCards.some(card => !card) && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-yellow-400 text-sm mb-4"
                    >
                      剩余 {flippedCards.filter(card => !card).length} 张卡牌
                    </motion.div>
                  )}

                  {/* 按钮 */}
                  <AnimatePresence>
                    {showButtons && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex gap-4"
                      >
                        <button
                          onClick={handleOpenAll}
                          className="group relative px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-400 hover:to-orange-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 border-2 border-yellow-400/50 overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-white/20"></div>
                          <div className="absolute top-0 left-0 w-16 h-16 bg-white/20 rounded-full blur-xl"></div>
                          <div className="relative">Open All</div>
                        </button>

                        <button
                          onClick={handleOpenSingle}
                          className="group relative px-8 py-4 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 border-2 border-gray-500/50 overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-white/20"></div>
                          <div className="absolute top-0 right-0 w-16 h-16 bg-white/20 rounded-full blur-xl"></div>
                          <div className="relative flex items-center gap-2">
                            <span>Open</span>
                            <span>→</span>
                          </div>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* 单张拆卡提示 */}
                  {openMode === 'single' && flippedCards.some(card => !card) && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-white/60 text-sm mt-4"
                    >
                      点击卡牌继续翻开
                    </motion.p>
                  )}
                </>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

interface CardFlipProps {
  isFlipped: boolean;
  size: 'large' | 'small';
  card: Card;
  delay?: number;
}

function CardFlip({ isFlipped, size, card, delay = 0 }: CardFlipProps) {
  const dimensions = size === 'large' ? 'w-48 h-72' : 'w-28 h-40';

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
      case 'SSR': return 'border-yellow-500';
      case 'SR': return 'border-red-500';
      case 'R': return 'border-emerald-500';
      default: return 'border-gray-600';
    }
  };

  return (
    <motion.div
      animate={{ rotateY: isFlipped ? 180 : 0 }}
      transition={{ duration: 0.6, delay, ease: "easeInOut" }}
      className="relative"
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* 卡牌背面 */}
      <div
        className={`absolute inset-0 ${dimensions} rounded-2xl`}
        style={{ backfaceVisibility: 'hidden' }}
      >
        <div className="relative w-full h-full rounded-2xl border-4 border-yellow-300 shadow-2xl overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1743877427459-ed950b323498?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxwcmVtaXVtJTIwY2FyZCUyMGJhY2slMjBkZXNpZ24lMjBwYXR0ZXJuJTIwZ29sZGVufGVufDF8fHx8MTc3NzU1MTEyOXww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Card Back"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/40 via-orange-500/30 to-yellow-600/40"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-white/20"></div>

          {/* 装饰图案 */}
          <div className="absolute inset-4 border-2 border-yellow-200/50 rounded-xl backdrop-blur-sm bg-white/5"></div>
          <div className="absolute inset-6 border border-yellow-300/30 rounded-lg"></div>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-md rounded-2xl p-4 border border-yellow-300/30">
              <div className={`${size === 'large' ? 'text-6xl' : 'text-4xl'} mb-2 drop-shadow-2xl`}>💎</div>
              {size === 'large' && (
                <div className="text-yellow-100 font-bold text-sm tracking-widest drop-shadow-lg">PREMIUM</div>
              )}
            </div>
          </div>

          {/* 四角光效 */}
          <div className="absolute top-2 left-2 w-6 h-6 bg-yellow-300/60 rounded-full blur-md"></div>
          <div className="absolute top-2 right-2 w-6 h-6 bg-yellow-300/60 rounded-full blur-md"></div>
          <div className="absolute bottom-2 left-2 w-6 h-6 bg-yellow-300/60 rounded-full blur-md"></div>
          <div className="absolute bottom-2 right-2 w-6 h-6 bg-yellow-300/60 rounded-full blur-md"></div>

          {/* 中心光晕 */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-yellow-300/20 rounded-full blur-3xl"></div>
        </div>

        {/* 卡牌发光 */}
        <motion.div
          className="absolute -inset-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 rounded-2xl blur-xl -z-10"
          animate={{ opacity: isFlipped ? 0 : [0.5, 0.8, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </div>

      {/* 卡牌正面（翻转后） */}
      <div
        className={`${dimensions} rounded-2xl`}
        style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
      >
        <div className={`relative w-full h-full rounded-2xl border-4 ${getRarityBorder(card.rarity)} shadow-2xl overflow-hidden bg-gray-900`}>
          {/* 卡牌图片 */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={isFlipped ? { scale: 1, opacity: 1 } : {}}
            transition={{ delay: delay + 0.2, duration: 0.4 }}
            className="w-full h-full"
          >
            {card.image ? (
              <img src={card.image} alt={card.name} className="w-full h-full object-cover" />
            ) : (
              <div className={`w-full h-full bg-gradient-to-br ${getRarityColor(card.rarity)} flex items-center justify-center`}>
                <span className={`${size === 'large' ? 'text-8xl' : 'text-5xl'}`}>{card.emoji}</span>
              </div>
            )}
          </motion.div>

          {/* 稀有度标签 */}
          <div className={`absolute ${size === 'large' ? 'top-3 right-3' : 'top-2 right-2'} bg-gradient-to-br from-white via-gray-50 to-white backdrop-blur-sm text-gray-900 text-xs font-black ${size === 'large' ? 'px-3 py-1.5' : 'px-2 py-1'} rounded-full shadow-2xl z-10 border-2 border-white/80`}>
            <span className="bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent">{card.rarity}</span>
          </div>

          {/* 卡牌名称 */}
          <div className={`absolute bottom-0 left-0 right-0 z-10 ${size === 'large' ? 'p-3' : 'p-1.5'}`}>
            <div className="bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1.5 border border-white/20">
              <p className={`text-white text-center font-black ${size === 'large' ? 'text-lg' : 'text-xs'} leading-tight drop-shadow-2xl tracking-wide truncate`}>
                {card.name}
              </p>
            </div>
          </div>

          {/* 光效粒子 */}
          {card.rarity === 'SSR' && (
            <>
              <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-yellow-200 rounded-full blur-sm animate-pulse"></div>
              <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-orange-200 rounded-full blur-sm animate-pulse delay-300"></div>
              <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-yellow-300 rounded-full blur-sm animate-pulse delay-500"></div>
            </>
          )}
        </div>

        {/* 翻开后的发光效果 - 增强 */}
        <motion.div
          className={`absolute -inset-3 rounded-2xl blur-2xl -z-10 ${
            card.rarity === 'SSR' ? 'bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400' :
            card.rarity === 'SR' ? 'bg-gradient-to-r from-red-500 via-rose-500 to-red-500' :
            card.rarity === 'R' ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500' :
            'bg-gradient-to-r from-gray-500 via-gray-600 to-gray-500'
          }`}
          animate={{ opacity: isFlipped ? [0.7, 1, 0.7] : 0 }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </div>
    </motion.div>
  );
}
