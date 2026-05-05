import { useState } from 'react';
import { Button } from './ui/button';
import { Sparkles } from 'lucide-react';

interface LoginPageProps {
  onLogin: (username: string, password: string, isRegister: boolean) => Promise<void>;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (username.length < 3 || username.length > 20) {
      setError('用户名长度需在3-20个字符之间');
      return;
    }

    if (password.length < 6) {
      setError('密码长度至少6个字符');
      return;
    }

    setLoading(true);
    try {
      await onLogin(username, password, !isLogin);
    } catch (err: any) {
      setError(err.message || '操作失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIvPjwvZz48L3N2Zz4=')] opacity-30"></div>

      <div className="relative w-full max-w-md">
        <div className="absolute -inset-1 bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 rounded-3xl blur opacity-75 animate-pulse"></div>

        <div className="relative bg-gray-900/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-4 shadow-lg">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-black bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent mb-2">
              GACHA
            </h1>
            <p className="text-gray-400 uppercase tracking-wider text-sm">Enhanced Edition</p>
          </div>

          <div className="flex gap-2 mb-6 bg-gray-800/50 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => { setIsLogin(true); setError(''); }}
              className={`flex-1 py-2.5 px-4 rounded-lg transition-all ${
                isLogin
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-semibold shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              登录
            </button>
            <button
              type="button"
              onClick={() => { setIsLogin(false); setError(''); }}
              className={`flex-1 py-2.5 px-4 rounded-lg transition-all ${
                !isLogin
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-semibold shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              注册
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-300 mb-2 text-sm">用户名</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="3-20个字符"
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                minLength={3}
                maxLength={20}
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2 text-sm">密码</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="至少6个字符"
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                minLength={6}
                required
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-6 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all text-lg disabled:opacity-50"
            >
              {loading ? '处理中...' : (isLogin ? '登录' : '注册')}
            </Button>
          </form>

          {!isLogin && (
            <p className="text-center text-gray-400 text-sm mt-4">
              新用户注册即送 <span className="text-yellow-400 font-semibold">100积分</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
