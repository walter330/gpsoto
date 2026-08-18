import React, { useState } from 'react';
import { useBlog } from '../../context/BlogContext';
import { Settings, Save, RotateCcw, CheckCircle2 } from 'lucide-react';

export const SettingsAdminView: React.FC = () => {
  const { settings, updateSettings, resetToDefaults } = useBlog();
  const [formData, setFormData] = useState({ ...settings });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleChange = (field: keyof typeof settings, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#111111]">
            Configuración General del Medio
          </h1>
          <p className="text-xs text-[#888888] mt-1">
            Parámetros globales del sitio, identidad de marca, redes sociales y analítica.
          </p>
        </div>

        {savedSuccess && (
          <div className="px-3 py-1.5 bg-[#f0f7ef] text-[#2d5a27] border border-[#2d5a27]/20 rounded-lg text-xs font-extrabold flex items-center gap-1">
            <CheckCircle2 size={14} />
            ¡Ajustes guardados correctamente!
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-[#e8e8e8] shadow-sm space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-[#111111] mb-1">Nombre del Portal Editorial</label>
            <input
              type="text"
              value={formData.site_name}
              onChange={e => handleChange('site_name', e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-[#f7f7f7] border border-[#e8e8e8] rounded-xl text-xs font-bold text-[#111111] focus:outline-none focus:border-[#2d5a27] focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#111111] mb-1">Lema / Slogan</label>
            <input
              type="text"
              value={formData.site_tagline}
              onChange={e => handleChange('site_tagline', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#f7f7f7] border border-[#e8e8e8] rounded-xl text-xs text-[#111111] focus:outline-none focus:border-[#2d5a27] focus:bg-white"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-[#111111] mb-1">Descripción General (Meta Description Portada)</label>
            <textarea
              value={formData.site_description}
              onChange={e => handleChange('site_description', e.target.value)}
              rows={2}
              className="w-full px-3.5 py-2.5 bg-[#f7f7f7] border border-[#e8e8e8] rounded-xl text-xs text-[#111111] focus:outline-none focus:border-[#2d5a27] focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#111111] mb-1">URL Base Canónica (Dominio)</label>
            <input
              type="url"
              value={formData.site_url}
              onChange={e => handleChange('site_url', e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-[#f7f7f7] border border-[#e8e8e8] rounded-xl text-xs text-[#111111] focus:outline-none focus:border-[#2d5a27] focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#111111] mb-1">Artículos por Página (Paginación)</label>
            <input
              type="number"
              min={3}
              max={24}
              value={formData.posts_per_page}
              onChange={e => handleChange('posts_per_page', Number(e.target.value))}
              required
              className="w-full px-3.5 py-2.5 bg-[#f7f7f7] border border-[#e8e8e8] rounded-xl text-xs text-[#111111] focus:outline-none focus:border-[#2d5a27] focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#111111] mb-1">Correo de Contacto Editorial</label>
            <input
              type="email"
              value={formData.contact_email}
              onChange={e => handleChange('contact_email', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#f7f7f7] border border-[#e8e8e8] rounded-xl text-xs text-[#111111] focus:outline-none focus:border-[#2d5a27] focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#111111] mb-1">Google Analytics ID (G-XXXXX)</label>
            <input
              type="text"
              value={formData.google_analytics_id}
              onChange={e => handleChange('google_analytics_id', e.target.value)}
              placeholder="G-..."
              className="w-full px-3.5 py-2.5 bg-[#f7f7f7] border border-[#e8e8e8] rounded-xl text-xs text-[#111111] focus:outline-none focus:border-[#2d5a27] focus:bg-white"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-[#e8e8e8] flex items-center justify-between">
          <button
            type="button"
            onClick={resetToDefaults}
            className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw size={14} />
            Restaurar Datos Iniciales
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 bg-[#2d5a27] hover:bg-[#23491f] text-white text-xs font-extrabold rounded-xl shadow transition-colors flex items-center gap-1.5"
          >
            <Save size={15} />
            Guardar Configuración
          </button>
        </div>
      </form>
    </div>
  );
};
