import React, { useState } from 'react';
import { useBlog } from '../../context/BlogContext';
import { Lock, User, AlertCircle, ArrowLeft, KeyRound, Sparkles } from 'lucide-react';

export const AdminLoginModal: React.FC = () => {
  const { loginAdmin, setRoute } = useBlog();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginAdmin(username, password)) {
      setRoute({ type: 'admin', subview: 'dashboard' });
    } else {
      setError('Credenciales inválidas. Usa admin / admin123');
    }
  };

  const handleQuickLogin = () => {
    loginAdmin('admin', 'admin123');
    setRoute({ type: 'admin', subview: 'dashboard' });
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 bg-[#f0f0f1]">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-[#dcdcde] p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-[#1d2327] text-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-md border-2 border-[#2271b1]">
            <span className="font-serif font-black text-2xl tracking-tighter">W</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#1d2327]">
            WordPress Admin (WP-Admin)
          </h2>
          <p className="text-xs text-slate-500">
            Administración completa de GPSOTO (https://gpsoto.com): Noticias, Autores, Categorías, SEO y Exportación PHP.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>
        )}

        <button
          type="button"
          onClick={handleQuickLogin}
          className="w-full py-3 bg-[#2271b1] hover:bg-[#135e96] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 active:scale-98"
        >
          <Sparkles size={16} />
          <span>Acceder Inmediatamente (1 Clic)</span>
        </button>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink mx-4 text-[11px] font-bold text-slate-400 uppercase">o con credenciales</span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Nombre de usuario o correo
            </label>
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-[#f8fafc] border border-slate-300 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#2271b1] focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Contraseña
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-3 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-[#f8fafc] border border-slate-300 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#2271b1] focus:bg-white"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-[#1d2327] hover:bg-[#2c3338] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow"
          >
            Acceder al CMS
          </button>
        </form>

        <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-[11px] text-slate-600 flex items-start gap-2">
          <KeyRound size={16} className="text-[#2271b1] shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-[#1d2327]">Credenciales del Administrador:</p>
            <p>Usuario: <code className="text-[#2271b1] font-bold">admin</code> | Clave: <code className="text-[#2271b1] font-bold">admin123</code></p>
          </div>
        </div>

        <div className="text-center pt-2">
          <button
            onClick={() => setRoute({ type: 'home' })}
            className="text-xs font-bold text-slate-500 hover:text-slate-900 inline-flex items-center gap-1"
          >
            <ArrowLeft size={13} />
            ← Volver a gpsoto.com
          </button>
        </div>
      </div>
    </div>
  );
};

