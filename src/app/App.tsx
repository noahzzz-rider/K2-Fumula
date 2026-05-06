import { useState, useEffect } from 'react';
import { LoginPage } from './components/LoginPage';
import { MainPage } from './components/MainPage';
import { GachaAnimation } from './components/GachaAnimation';
import { ResultPage } from './components/ResultPage';

const API_BASE = '/api';

export interface Card {
  id: string;
  name: string;
  emoji: string;
  image?: string;
  rarity: 'N' | 'R' | 'SR' | 'SSR';
}

export interface User {
  username: string;
  points: number;
  cards: Card[];
}

type Page = 'login' | 'main' | 'gacha' | 'result';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [user, setUser] = useState<User | null>(null);
  const [gachaType, setGachaType] = useState<'single' | 'ten'>('single');
  const [pulledCards, setPulledCards] = useState<Card[]>([]);
  const [totalDraws, setTotalDraws] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (username: string, password: string, isRegister: boolean) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/${isRegister ? 'register' : 'login'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || '操作失败');
      }

      localStorage.setItem('token', data.token);
      setUser(data.user);
      setCurrentPage('main');
      await loadStats();
    } catch (error: any) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE}/game/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const stats = await res.json();
        setTotalDraws(stats.totalDraws);
      }
    } catch (error) {
      console.error('加载统计失败:', error);
    }
  };

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setCurrentPage('login');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
        setCurrentPage('main');
        await loadStats();
      } else {
        localStorage.removeItem('token');
        setCurrentPage('login');
      }
    } catch (error) {
      localStorage.removeItem('token');
      setCurrentPage('login');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const handleGacha = async (type: 'single' | 'ten') => {
    const token = localStorage.getItem('token');
    if (!token || !user) return;

    const count = type === 'single' ? 1 : 10;
    const cost = type === 'single' ? 10 : 90;

    if (user.points < cost) {
      alert('积分不足！');
      return;
    }

    setIsLoading(true);
    setGachaType(type);

    try {
      const res = await fetch(`${API_BASE}/game/draw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ count })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || '抽卡失败');
      }

      setPulledCards(data.cards);
      setTotalDraws(data.totalDraws);
      setUser({ ...user, points: data.remainingPoints });
      setCurrentPage('gacha');
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGachaComplete = () => {
    setCurrentPage('result');
  };

  const handleKeepAll = async () => {
    const token = localStorage.getItem('token');
    if (!token || !user || pulledCards.length === 0) return;

    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/game/keep`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ cards: pulledCards })
      });

      const data = await res.json();

      if (res.ok) {
        setUser({ ...user, cards: data.cards });
        setPulledCards([]);
        setCurrentPage('main');
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConvertAll = async () => {
    const token = localStorage.getItem('token');
    if (!token || !user || pulledCards.length === 0) return;

    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/game/convert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ cards: pulledCards })
      });

      const data = await res.json();

      if (res.ok) {
        setUser({ ...user, points: data.remainingPoints });
        setPulledCards([]);
        setCurrentPage('main');
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecharge = (amount: number) => {
    if (user) {
      setUser({ ...user, points: user.points + amount });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setPulledCards([]);
    setCurrentPage('login');
  };

  if (isLoading && currentPage === 'login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-950 flex items-center justify-center">
        <div className="text-white">加载中...</div>
      </div>
    );
  }

  if (currentPage === 'login') {
    return <LoginPage onLogin={handleLogin} />;
  }

  if (currentPage === 'gacha') {
    return (
      <GachaAnimation
        type={gachaType}
        cards={pulledCards}
        onComplete={handleGachaComplete}
      />
    );
  }

  if (currentPage === 'result') {
    return (
      <ResultPage
        type={gachaType}
        cards={pulledCards}
        onKeepAll={handleKeepAll}
        onConvertAll={handleConvertAll}
        onKeepCard={() => {}}
        onConvertCard={() => {}}
      />
    );
  }

  return (
    <MainPage
      user={user!}
      totalDraws={totalDraws}
      onGacha={handleGacha}
      onLogout={handleLogout}
      onRecharge={handleRecharge}
    />
  );
}