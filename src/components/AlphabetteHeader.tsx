import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  Crown,
  Heart,
  LayoutGrid,
  Moon,
  MoreHorizontal,
  Star,
  Sun,
  Volume2,
  VolumeX,
  X
} from 'lucide-react';

export type BigModeLevel = 0 | 1 | 2;

interface AlphabetteAppItem {
  id: string;
  name: string;
  desc: string;
  url: string;
  isNew?: boolean;
}

const ALPHABETTE_APPS: AlphabetteAppItem[] = [
  { id: 'matchsoiree', name: 'MatchSoirée', desc: 'Mettre fin en 60s au débat "On mange/regarde/fait quoi ?"', url: '#matchsoiree', isNew: true },
  { id: 'infoperso', name: 'Info Perso', desc: 'Coffre-fort de mémos et informations personnelles utiles', url: 'https://alphabette.fr' },
  { id: 'proxilien', name: 'ProxiLien', desc: 'Idées locales, entraide et bons plans de quartier', url: 'https://alphabette.fr', isNew: true },
  { id: 'orbit', name: 'ORBIT', desc: 'Sélection de vidéos courtes, découvertes et culture', url: 'https://alphabette.fr', isNew: true },
  { id: 'budgetclair', name: 'BudgetClair', desc: 'Suivi simple des dépenses du foyer en 30 secondes', url: 'https://alphabette.fr' },
  { id: 'listemalin', name: 'ListeMalin', desc: 'Listes de courses partagées et triées par rayon', url: 'https://alphabette.fr' },
  { id: 'medimemo', name: 'MédiMémo', desc: 'Rappels de prises et ordonnances simplifiées', url: 'https://alphabette.fr' },
  { id: 'courrierfacile', name: 'CourrierFacile', desc: 'Modèles de lettres administratives prêtes à imprimer', url: 'https://alphabette.fr', isNew: true }
];

interface AlphabetteHeaderProps {
  isDark: boolean;
  onToggleDark: () => void;
  bigLevel: BigModeLevel;
  onCycleBigLevel: () => void;
  onSetBigLevel: (level: BigModeLevel) => void;
  showBackButton?: boolean;
  onBackHome: () => void;
}

export const AlphabetteHeader: React.FC<AlphabetteHeaderProps> = ({
  isDark,
  onToggleDark,
  bigLevel,
  onCycleBigLevel,
  onSetBigLevel,
  showBackButton,
  onBackHome
}) => {
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('alphabette_fav_apps');
      return saved ? JSON.parse(saved) : ['matchsoiree'];
    } catch {
      return ['matchsoiree'];
    }
  });

  const [isPinned, setIsPinned] = useState<boolean>(() => {
    try {
      return localStorage.getItem('alphabette_pinned_matchsoiree') === 'true';
    } catch {
      return true;
    }
  });

  const [activeModal, setActiveModal] = useState<
    null | 'all-apps' | 'new-apps' | 'subscription' | 'donate' | 'install' | 'feedback' | 'language'
  >(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [simpleModeToast, setSimpleModeToast] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [selectedLang, setSelectedLang] = useState<'FR' | 'EN' | 'ES'>('FR');

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const showToast = (msg: string) => {
    setSimpleModeToast(msg);
    setTimeout(() => setSimpleModeToast(null), 2800);
  };

  const toggleFavoriteApp = (id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem('alphabette_fav_apps', JSON.stringify(next));
      } catch {
        // ignore storage restrictions
      }
      return next;
    });
  };

  const togglePinCurrentApp = () => {
    setIsPinned((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('alphabette_pinned_matchsoiree', String(next));
      } catch {
        // ignore
      }
      return next;
    });
    setMenuOpen(false);
  };

  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      showToast('La synthèse vocale n’est pas disponible sur ce navigateur.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const mainEl = document.getElementById('main-app-content');
    const textToRead = mainEl
      ? mainEl.innerText.replace(/\s+/g, ' ').trim()
      : 'MatchSoirée : mettez fin en 60 secondes au débat de la soirée en couple ou entre amis.';

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = 'fr-FR';
    utterance.rate = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleBigButtonClick = () => {
    const nextLevel = ((bigLevel + 1) % 3) as BigModeLevel;
    onCycleBigLevel();
    if (nextLevel === 0) {
      showToast('Taille d’affichage : Normal (Confort 100%)');
    } else if (nextLevel === 1) {
      showToast('Taille d’affichage : BIG 1 — Grand (+20%)');
    } else {
      showToast('Taille d’affichage : BIG 2 — Très Grand XXL (+40%)');
    }
  };

  const handleActivateSimpleMode = () => {
    const nextLevel: BigModeLevel = bigLevel === 2 ? 0 : 2;
    onSetBigLevel(nextLevel);
    setMenuOpen(false);
    showToast(
      nextLevel === 2
        ? 'Mode simple XXL activé : tout le site est en taille maximale.'
        : 'Mode d’affichage standard rétabli.'
    );
  };

  const handlePrint = () => {
    setMenuOpen(false);
    window.print();
  };

  const bigLabel = bigLevel === 0 ? 'BIG' : bigLevel === 1 ? 'BIG+' : 'BIG++';
  const bigTitle =
    bigLevel === 0
      ? 'Taille Standard (Cliquer pour passer en BIG+)'
      : bigLevel === 1
      ? 'Mode BIG+ Grand actif (Cliquer pour passer en BIG++ XXL)'
      : 'Mode BIG++ Très Grand XXL actif (Cliquer pour revenir en taille Standard)';

  return (
    <>
      <header className="sticky top-0 z-40 w-full select-none no-print shadow-sm">
        {/* 1. BARRE SUPÉRIEURE (Top Bar Écosystème) — Dimensions fixes en px */}
        <div
          className={`w-full h-[46px] sm:h-[50px] px-[10px] sm:px-[16px] flex items-center justify-between gap-[6px] flex-nowrap text-white transition-colors ${
            isDark ? 'bg-[#0b1220]' : 'bg-[#182334]'
          }`}
        >
          {/* Bloc de gauche */}
          <div className="flex items-center gap-[6px] sm:gap-[10px] min-w-0 flex-nowrap">
            {/* 1. Logo + Nom alphabette */}
            <a
              href="https://alphabette.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-[6px] shrink-0 focus-visible:outline-2 focus-visible:outline-amber-400 rounded-[8px] py-[2px]"
              aria-label="Aller sur le portail Alphabette.fr"
            >
              <span className="w-[26px] h-[26px] sm:w-[28px] sm:h-[28px] rounded-full bg-[#3355d1] flex items-center justify-center text-white font-bold text-[15px] sm:text-[16px] leading-none shrink-0 shadow-inner">
                a
              </span>
              <span className="font-bold lowercase text-[15px] sm:text-[17px] tracking-tight text-white whitespace-nowrap">
                alphabette
              </span>
            </a>

            {/* 2. Bouton .eu */}
            <a
              href="https://alphabette.eu"
              target="_blank"
              rel="noopener noreferrer"
              className="w-[34px] h-[34px] sm:w-[36px] sm:h-[36px] rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-[12px] sm:text-[13px] font-semibold text-white shrink-0 transition-colors focus-visible:outline-2 focus-visible:outline-amber-400"
              aria-label="Laboratoire Alphabette.eu"
            >
              .eu
            </a>

            {/* 3. Bouton Toutes les applis */}
            <button
              type="button"
              onClick={() => setActiveModal('all-apps')}
              aria-label="Toutes les applis de la suite Alphabette"
              className="w-[34px] h-[34px] sm:w-auto sm:h-[36px] sm:px-[10px] rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center gap-[6px] text-white shrink-0 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-amber-400"
            >
              <LayoutGrid className="w-[17px] h-[17px] shrink-0" />
              <span className="hidden sm:inline text-[12.5px] font-medium whitespace-nowrap">
                Toutes les applis
              </span>
            </button>

            {/* 4. Bouton NEW */}
            <button
              type="button"
              onClick={() => setActiveModal('new-apps')}
              aria-label="Voir les nouveautés Alphabette"
              className="w-[34px] h-[34px] sm:w-[36px] sm:h-[36px] rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center shrink-0 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-amber-400"
            >
              <span className="px-[4px] py-[1.5px] rounded-[4px] bg-gradient-to-br from-sky-200 to-sky-400 text-[#0f172a] text-[9px] font-extrabold uppercase leading-none tracking-tight">
                NEW
              </span>
            </button>
          </div>

          {/* Bloc de droite : 5. Bouton Abonnement */}
          <div className="shrink-0">
            <button
              type="button"
              onClick={() => setActiveModal('subscription')}
              aria-label="Informations sur l'abonnement Alphabette"
              className="h-[34px] sm:h-[36px] px-[10px] sm:px-[14px] rounded-full bg-white/10 hover:bg-white/15 border-[1.5px] border-[#f59e0b] flex items-center gap-[5px] shrink-0 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-amber-400"
            >
              <Crown className="w-[14px] h-[14px] text-[#f59e0b] shrink-0" />
              <span className="text-[12.5px] sm:text-[13.5px] font-bold text-[#fbbf24] whitespace-nowrap">
                Abonnement
              </span>
            </button>
          </div>
        </div>

        {/* 2. BARRE INFÉRIEURE (Barre d'Application & Accessibilité) — Dimensions fixes en px */}
        <div
          className={`w-full h-[54px] sm:h-[58px] px-[10px] sm:px-[16px] flex items-center justify-between gap-[6px] flex-nowrap border-b transition-colors ${
            isDark
              ? 'bg-[#0f172a] border-[#334155] text-white'
              : 'bg-[#ffffff] border-[#e2e8f0] text-slate-900'
          }`}
        >
          {/* Bloc de gauche : Titre & Sous-titre */}
          <div className="min-w-0 flex-1 flex items-center gap-[6px]">
            {showBackButton && (
              <button
                type="button"
                onClick={onBackHome}
                aria-label="Retour à l'accueil de MatchSoirée"
                className={`w-[34px] h-[34px] rounded-full flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                  isDark
                    ? 'bg-[#1e293b] text-slate-200 hover:bg-slate-700'
                    : 'bg-[#f1f5f9] text-slate-700 hover:bg-slate-200'
                }`}
              >
                <ArrowLeft className="w-[16px] h-[16px]" />
              </button>
            )}
            <button
              type="button"
              onClick={onBackHome}
              className="min-w-0 text-left flex flex-col justify-center cursor-pointer focus-visible:outline-2 focus-visible:outline-indigo-500 rounded-[4px]"
              aria-label="MatchSoirée — Retour à l'accueil"
            >
              <div className="flex items-center gap-[5px] min-w-0">
                <span
                  className={`font-bold text-[14.5px] sm:text-[20px] tracking-tight truncate leading-tight ${
                    isDark ? 'text-white' : 'text-[#3f51b5]'
                  }`}
                >
                  MatchSoirée
                </span>
                {isPinned && (
                  <Star
                    className="w-[13px] h-[13px] text-[#f59e0b] fill-[#f59e0b] shrink-0"
                    aria-label="Application épinglée"
                  />
                )}
              </div>
              <span className="text-[9px] sm:text-[10.5px] uppercase tracking-[0.04em] text-[#64748b] dark:text-slate-400 truncate leading-tight">
                FINI LE DÉBAT EN 60 SEC
              </span>
            </button>
          </div>

          {/* Bloc de droite : 5 boutons stricts alignés */}
          <div className="flex items-center gap-[4px] sm:gap-[7px] shrink-0">
            {/* 1. Bouton Don */}
            <button
              type="button"
              onClick={() => setActiveModal('donate')}
              aria-label="Soutenir Alphabette par un don"
              className="w-[34px] h-[34px] sm:w-[38px] sm:h-[38px] rounded-[10px] sm:rounded-[11px] bg-[#db2777] hover:bg-[#be185d] flex items-center justify-center text-white shrink-0 transition-colors cursor-pointer shadow-xs focus-visible:outline-2 focus-visible:outline-pink-400"
            >
              <Heart className="w-[17px] h-[17px] sm:w-[18px] sm:h-[18px] fill-white text-white" />
            </button>

            {/* 2. Bouton BIG à 3 niveaux (Normal -> BIG+ -> BIG++) avec 3 barres progressives */}
            <button
              type="button"
              onClick={handleBigButtonClick}
              aria-pressed={bigLevel > 0}
              title={bigTitle}
              aria-label={bigTitle}
              className={`h-[34px] sm:h-[38px] px-[8px] sm:px-[11px] rounded-[10px] sm:rounded-[11px] flex items-center justify-center gap-[5px] text-white font-bold text-[12px] sm:text-[13.5px] shrink-0 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-indigo-400 ${
                bigLevel === 2
                  ? 'bg-[#e11d48] ring-2 ring-pink-300'
                  : bigLevel === 1
                  ? 'bg-[#d97706] ring-2 ring-amber-300'
                  : 'bg-[#4338ca] hover:bg-[#3730a3]'
              }`}
            >
              <span className="whitespace-nowrap">{bigLabel}</span>
              {/* Icône 3 barres progressives indiquant visuellement le niveau 1, 2 ou 3 */}
              <span className="flex items-end gap-[2px] h-[14px]" aria-hidden="true">
                <span
                  className={`w-[3px] h-[6px] rounded-[1px] ${
                    bigLevel >= 0 ? 'bg-white' : 'bg-white/40'
                  }`}
                />
                <span
                  className={`w-[3px] h-[10px] rounded-[1px] ${
                    bigLevel >= 1 ? 'bg-white' : 'bg-white/35'
                  }`}
                />
                <span
                  className={`w-[3px] h-[14px] rounded-[1px] ${
                    bigLevel === 2 ? 'bg-white' : 'bg-white/35'
                  }`}
                />
              </span>
            </button>

            {/* 3. Bouton Mode Nuit / Jour */}
            <button
              type="button"
              onClick={onToggleDark}
              aria-label={isDark ? 'Passer en mode jour' : 'Passer en mode nuit'}
              className={`w-[34px] h-[34px] sm:w-[38px] sm:h-[38px] rounded-full border flex items-center justify-center shrink-0 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-indigo-400 ${
                isDark
                  ? 'bg-[#1e293b] border-[#334155] text-[#fbbf24] hover:bg-slate-800'
                  : 'bg-[#f1f5f9] border-[#e2e8f0] text-[#334155] hover:bg-slate-200'
              }`}
            >
              {isDark ? (
                <Sun className="w-[17px] h-[17px] sm:w-[18px] sm:h-[18px]" />
              ) : (
                <Moon className="w-[17px] h-[17px] sm:w-[18px] sm:h-[18px]" />
              )}
            </button>

            {/* 4. Bouton Lecture à haute voix */}
            <button
              type="button"
              onClick={handleToggleSpeech}
              aria-pressed={isSpeaking}
              aria-label={
                isSpeaking ? 'Arrêter la lecture à haute voix' : 'Lire la page à haute voix'
              }
              className={`w-[34px] h-[34px] sm:w-[38px] sm:h-[38px] rounded-full border flex items-center justify-center shrink-0 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-emerald-400 ${
                isSpeaking
                  ? 'bg-[#047857] border-emerald-500 text-white'
                  : isDark
                  ? 'bg-[#1e293b] border-[#334155] text-slate-200 hover:bg-slate-800'
                  : 'bg-[#f1f5f9] border-[#e2e8f0] text-[#334155] hover:bg-slate-200'
              }`}
            >
              {isSpeaking ? (
                <VolumeX className="w-[17px] h-[17px] sm:w-[18px] sm:h-[18px]" />
              ) : (
                <Volume2 className="w-[17px] h-[17px] sm:w-[18px] sm:h-[18px]" />
              )}
            </button>

            {/* 5. Bouton Plus d'options (...) */}
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((prev) => !prev)}
                aria-expanded={menuOpen}
                aria-haspopup="menu"
                aria-label="Plus d'options"
                className={`w-[34px] h-[34px] sm:w-[38px] sm:h-[38px] rounded-full border flex items-center justify-center shrink-0 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-indigo-400 ${
                  isDark
                    ? 'bg-[#1e293b] border-[#334155] text-slate-200 hover:bg-slate-800'
                    : 'bg-[#f1f5f9] border-[#e2e8f0] text-[#334155] hover:bg-slate-200'
                }`}
              >
                <MoreHorizontal className="w-[17px] h-[17px] sm:w-[18px] sm:h-[18px]" />
              </button>

              {/* Menu déroulant strict : exactement les 7 entrées dans l'ordre demandé */}
              {menuOpen && (
                <div
                  role="menu"
                  aria-label="Options de l'application"
                  className={`absolute right-0 mt-[8px] w-[260px] rounded-[14px] border shadow-xl py-[6px] z-50 text-[14px] ${
                    isDark
                      ? 'bg-[#1e293b] border-[#334155] text-slate-100'
                      : 'bg-white border-slate-200 text-slate-800'
                  }`}
                >
                  <button
                    type="button"
                    role="menuitem"
                    onClick={togglePinCurrentApp}
                    className="w-full px-[14px] py-[10px] text-left flex items-center justify-between hover:bg-indigo-500/10 transition-colors cursor-pointer"
                  >
                    <span>⭐ Épingler cette appli</span>
                    <span className="text-[12px] text-amber-500 font-semibold">
                      {isPinned ? 'Épinglée' : 'Ajouter'}
                    </span>
                  </button>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setMenuOpen(false);
                      setActiveModal('subscription');
                    }}
                    className="w-full px-[14px] py-[10px] text-left flex items-center justify-between hover:bg-indigo-500/10 transition-colors cursor-pointer"
                  >
                    <span>👤 Mon inscription</span>
                  </button>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleActivateSimpleMode}
                    className="w-full px-[14px] py-[10px] text-left flex items-center justify-between hover:bg-indigo-500/10 transition-colors cursor-pointer"
                  >
                    <span>🧘 Mode simple</span>
                    {bigLevel > 0 && (
                      <span className="text-[11px] text-emerald-500 font-semibold">
                        {bigLevel === 2 ? 'XXL' : 'Grand'}
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setMenuOpen(false);
                      setActiveModal('install');
                    }}
                    className="w-full px-[14px] py-[10px] text-left flex items-center justify-between hover:bg-indigo-500/10 transition-colors cursor-pointer"
                  >
                    <span>📱 Installer sur mon téléphone</span>
                  </button>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setMenuOpen(false);
                      setFeedbackSent(false);
                      setActiveModal('feedback');
                    }}
                    className="w-full px-[14px] py-[10px] text-left flex items-center justify-between hover:bg-indigo-500/10 transition-colors cursor-pointer"
                  >
                    <span>💬 Donner mon avis</span>
                  </button>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={handlePrint}
                    className="w-full px-[14px] py-[10px] text-left flex items-center justify-between hover:bg-indigo-500/10 transition-colors cursor-pointer"
                  >
                    <span>🖨️ Imprimer</span>
                  </button>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setMenuOpen(false);
                      setActiveModal('language');
                    }}
                    className="w-full px-[14px] py-[10px] text-left flex items-center justify-between hover:bg-indigo-500/10 transition-colors cursor-pointer"
                  >
                    <span>🌐 Langue</span>
                    <span className="text-[12px] font-bold text-indigo-400">{selectedLang}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Notification discrète Mode BIG / Mode Simple / Audio */}
      {simpleModeToast && (
        <div
          role="status"
          className="fixed bottom-[16px] left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white border border-pink-500/50 px-[18px] py-[12px] rounded-[14px] shadow-2xl text-[15px] font-bold max-w-[92vw] text-center"
        >
          {simpleModeToast}
        </div>
      )}

      {/* MODALES AUTONOMES DE LA DOUBLE BARRE */}
      {activeModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-[16px]"
          onClick={() => setActiveModal(null)}
        >
          <div
            className={`w-full max-w-[460px] rounded-[20px] border p-[20px] shadow-2xl ${
              isDark
                ? 'bg-[#17112b] border-[#312552] text-white'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modale : Toutes les applis */}
            {activeModal === 'all-apps' && (
              <div>
                <div className="flex items-center justify-between mb-[14px]">
                  <h2 className="text-[18px] font-bold">Toutes les applis Alphabette</h2>
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    aria-label="Fermer la fenêtre"
                    className="w-[34px] h-[34px] rounded-full flex items-center justify-center hover:bg-slate-500/20 cursor-pointer"
                  >
                    <X className="w-[18px] h-[18px]" />
                  </button>
                </div>
                <p className="text-[13px] text-slate-500 dark:text-slate-300 mb-[14px]">
                  Cliquez sur l’étoile à droite pour mettre vos applications préférées en favori.
                </p>
                <div className="max-h-[320px] overflow-y-auto divide-y divide-slate-200 dark:divide-slate-800">
                  {ALPHABETTE_APPS.map((app) => {
                    const isFav = favorites.includes(app.id);
                    return (
                      <div
                        key={app.id}
                        className="py-[10px] flex items-center justify-between gap-[10px]"
                      >
                        <a
                          href={app.url}
                          onClick={() => {
                            if (app.id === 'matchsoiree') setActiveModal(null);
                          }}
                          className="min-w-0 flex-1 group"
                        >
                          <div className="font-semibold text-[14.5px] group-hover:text-indigo-400 transition-colors flex items-center gap-[6px]">
                            <span>{app.name}</span>
                            {app.isNew && (
                              <span className="text-[10px] font-bold uppercase text-sky-400">
                                · Nouveau
                              </span>
                            )}
                          </div>
                          <div className="text-[12.5px] text-slate-500 dark:text-slate-400 truncate">
                            {app.desc}
                          </div>
                        </a>
                        <button
                          type="button"
                          onClick={() => toggleFavoriteApp(app.id)}
                          aria-label={`Mettre ${app.name} en favori`}
                          className="w-[36px] h-[36px] rounded-full flex items-center justify-center hover:bg-amber-500/10 text-[18px] shrink-0 cursor-pointer"
                        >
                          {isFav ? '⭐' : '☆'}
                        </button>
                      </div>
                    );
                  })}
                </div>
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="mt-[16px] w-full h-[42px] rounded-[12px] bg-[#3355d1] hover:bg-[#2945b0] text-white font-semibold text-[14px] cursor-pointer"
                >
                  Fermer
                </button>
              </div>
            )}

            {/* Modale : Nouveautés (NEW) */}
            {activeModal === 'new-apps' && (
              <div>
                <div className="flex items-center justify-between mb-[14px]">
                  <h2 className="text-[18px] font-bold">Nouveautés Alphabette</h2>
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    aria-label="Fermer la fenêtre"
                    className="w-[34px] h-[34px] rounded-full flex items-center justify-center hover:bg-slate-500/20 cursor-pointer"
                  >
                    <X className="w-[18px] h-[18px]" />
                  </button>
                </div>
                <div className="divide-y divide-slate-200 dark:divide-slate-800">
                  {ALPHABETTE_APPS.filter((a) => a.isNew).map((app) => {
                    const isFav = favorites.includes(app.id);
                    return (
                      <div
                        key={app.id}
                        className="py-[10px] flex items-center justify-between gap-[10px]"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-[14.5px]">{app.name}</div>
                          <div className="text-[12.5px] text-slate-500 dark:text-slate-400">
                            {app.desc}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleFavoriteApp(app.id)}
                          aria-label={`Mettre ${app.name} en favori`}
                          className="w-[36px] h-[36px] rounded-full flex items-center justify-center hover:bg-amber-500/10 text-[18px] shrink-0 cursor-pointer"
                        >
                          {isFav ? '⭐' : '☆'}
                        </button>
                      </div>
                    );
                  })}
                </div>
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="mt-[16px] w-full h-[42px] rounded-[12px] bg-[#3355d1] hover:bg-[#2945b0] text-white font-semibold text-[14px] cursor-pointer"
                >
                  Fermer
                </button>
              </div>
            )}

            {/* Modale : Abonnement */}
            {activeModal === 'subscription' && (
              <div>
                <div className="flex items-center justify-between mb-[12px]">
                  <div className="flex items-center gap-[8px]">
                    <Crown className="w-[20px] h-[20px] text-[#f59e0b]" />
                    <h2 className="text-[18px] font-bold">Abonnement Alphabette</h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    aria-label="Fermer la fenêtre"
                    className="w-[34px] h-[34px] rounded-full flex items-center justify-center hover:bg-slate-500/20 cursor-pointer"
                  >
                    <X className="w-[18px] h-[18px]" />
                  </button>
                </div>
                <div className="p-[14px] rounded-[14px] bg-amber-500/10 border border-amber-500/30 mb-[14px]">
                  <p className="text-[14.5px] leading-relaxed font-medium">
                    Lancement de l’abonnement payant le{' '}
                    <strong className="text-amber-500 font-bold">7 mai</strong> au tarif de{' '}
                    <strong className="text-amber-500 font-bold">15 € / an pour une appli</strong>, ou{' '}
                    <strong className="text-amber-500 font-bold">
                      40 € / an pour toutes les applis
                    </strong>{' '}
                    de la suite Alphabette.
                  </p>
                </div>
                <p className="text-[13px] text-slate-500 dark:text-slate-300 mb-[16px]">
                  Un compte unique sans publicité ni revente de données pour soutenir un écosystème
                  d’applications utiles, accessibles et indépendantes.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="w-full h-[42px] rounded-[12px] bg-[#f59e0b] hover:bg-[#d97706] text-slate-950 font-bold text-[14px] cursor-pointer"
                >
                  J’ai compris · Fermer
                </button>
              </div>
            )}

            {/* Modale : Don */}
            {activeModal === 'donate' && (
              <div>
                <div className="flex items-center justify-between mb-[12px]">
                  <div className="flex items-center gap-[8px]">
                    <Heart className="w-[20px] h-[20px] text-[#db2777] fill-[#db2777]" />
                    <h2 className="text-[18px] font-bold">Soutenir Alphabette</h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    aria-label="Fermer la fenêtre"
                    className="w-[34px] h-[34px] rounded-full flex items-center justify-center hover:bg-slate-500/20 cursor-pointer"
                  >
                    <X className="w-[18px] h-[18px]" />
                  </button>
                </div>
                <p className="text-[14px] text-slate-600 dark:text-slate-300 mb-[16px] leading-relaxed">
                  MatchSoirée et les outils Alphabette sont conçus sans traqueurs publicitaires. Votre
                  soutien aide à financer l’hébergement et les nouvelles micro-applications.
                </p>
                <div className="flex gap-[10px]">
                  <a
                    href="https://alphabette.fr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 h-[42px] rounded-[12px] bg-[#db2777] hover:bg-[#be185d] text-white font-bold text-[14px] flex items-center justify-center"
                  >
                    Faire un don sur Alphabette.fr
                  </a>
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="px-[16px] h-[42px] rounded-[12px] border border-slate-300 dark:border-slate-700 font-semibold text-[14px] cursor-pointer"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            )}

            {/* Modale : Installer sur mon téléphone */}
            {activeModal === 'install' && (
              <div>
                <div className="flex items-center justify-between mb-[12px]">
                  <h2 className="text-[18px] font-bold">Installer MatchSoirée</h2>
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    aria-label="Fermer la fenêtre"
                    className="w-[34px] h-[34px] rounded-full flex items-center justify-center hover:bg-slate-500/20 cursor-pointer"
                  >
                    <X className="w-[18px] h-[18px]" />
                  </button>
                </div>
                <div className="space-y-[10px] text-[13.5px] text-slate-600 dark:text-slate-300 mb-[16px]">
                  <p>
                    <strong>Sur Android (Chrome) :</strong> appuyez sur le menu <strong>⋮</strong> en
                    haut à droite puis sur <em>« Ajouter à l’écran d’accueil »</em>.
                  </p>
                  <p>
                    <strong>Sur iPhone (Safari) :</strong> appuyez sur le bouton{' '}
                    <strong>Partager</strong> en bas puis sur <em>« Sur l’écran d’accueil »</em>.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="w-full h-[42px] rounded-[12px] bg-[#3355d1] text-white font-semibold text-[14px] cursor-pointer"
                >
                  Fermer
                </button>
              </div>
            )}

            {/* Modale : Donner mon avis */}
            {activeModal === 'feedback' && (
              <div>
                <div className="flex items-center justify-between mb-[12px]">
                  <h2 className="text-[18px] font-bold">Donner mon avis</h2>
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    aria-label="Fermer la fenêtre"
                    className="w-[34px] h-[34px] rounded-full flex items-center justify-center hover:bg-slate-500/20 cursor-pointer"
                  >
                    <X className="w-[18px] h-[18px]" />
                  </button>
                </div>
                {feedbackSent ? (
                  <div className="py-[16px] text-center">
                    <p className="text-[15px] font-semibold text-emerald-500 mb-[12px]">
                      Merci ! Votre suggestion a bien été enregistrée pour l’équipe Alphabette.
                    </p>
                    <button
                      type="button"
                      onClick={() => setActiveModal(null)}
                      className="w-full h-[42px] rounded-[12px] bg-[#3355d1] text-white font-semibold text-[14px] cursor-pointer"
                    >
                      Fermer
                    </button>
                  </div>
                ) : (
                  <div>
                    <textarea
                      rows={3}
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      placeholder="Une idée de soirée à ajouter ? Une remarque sur MatchSoirée ?"
                      className={`w-full rounded-[12px] border p-[12px] text-[14px] mb-[12px] ${
                        isDark
                          ? 'bg-[#0f0a1e] border-[#312552] text-white'
                          : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    />
                    <div className="flex gap-[10px]">
                      <button
                        type="button"
                        onClick={() => {
                          setFeedbackSent(true);
                          setFeedbackText('');
                        }}
                        className="flex-1 h-[42px] rounded-[12px] bg-[#3355d1] text-white font-semibold text-[14px] cursor-pointer"
                      >
                        Envoyer mon avis
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveModal(null)}
                        className="px-[16px] h-[42px] rounded-[12px] border border-slate-300 dark:border-slate-700 font-semibold text-[14px] cursor-pointer"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Modale : Langue */}
            {activeModal === 'language' && (
              <div>
                <div className="flex items-center justify-between mb-[12px]">
                  <h2 className="text-[18px] font-bold">Langue de l’interface</h2>
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    aria-label="Fermer la fenêtre"
                    className="w-[34px] h-[34px] rounded-full flex items-center justify-center hover:bg-slate-500/20 cursor-pointer"
                  >
                    <X className="w-[18px] h-[18px]" />
                  </button>
                </div>
                <div className="space-y-[8px] mb-[16px]">
                  {(
                    [
                      { code: 'FR', label: 'Français (Recommandé)' },
                      { code: 'EN', label: 'English (Europe)' },
                      { code: 'ES', label: 'Español' }
                    ] as const
                  ).map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => {
                        setSelectedLang(lang.code);
                        setActiveModal(null);
                      }}
                      className={`w-full px-[14px] py-[10px] rounded-[12px] border text-left flex items-center justify-between cursor-pointer ${
                        selectedLang === lang.code
                          ? 'border-indigo-500 bg-indigo-500/15 font-bold'
                          : 'border-slate-300 dark:border-slate-700'
                      }`}
                    >
                      <span>{lang.label}</span>
                      <span className="text-[12px] font-mono-num">{lang.code}</span>
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="w-full h-[42px] rounded-[12px] bg-[#3355d1] text-white font-semibold text-[14px] cursor-pointer"
                >
                  Fermer
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
