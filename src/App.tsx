import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Check,
  Copy,
  Database,
  ExternalLink,
  Flame,
  HeartHandshake,
  Loader2,
  MessageCircle,
  Share2,
  Smartphone,
  Users,
  Wand2,
  X
} from 'lucide-react';
import { AlphabetteHeader, BigModeLevel } from './components/AlphabetteHeader';
import { SwipeDeck } from './components/SwipeDeck';
import { VetoAndWheel } from './components/VetoAndWheel';
import { TicketSoiree } from './components/TicketSoiree';
import {
  AMBIANCE_OPTIONS,
  BUDGET_OPTIONS,
  CATEGORY_LABELS,
  FATIGUE_OPTIONS,
  OFFLINE_IDEAS,
  selectTargetedIdeas
} from './data/ideas';
import {
  CategoryId,
  ConstraintsState,
  IdeaCard,
  SharedSessionPayload,
  ValidatedChoice
} from './types';
import { decodeSessionFromBase64, encodeSessionToBase64 } from './utils/sessionCodec';

type FlowStep =
  | 'setup'
  | 'incoming-invite'
  | 'swipe-p1'
  | 'transition-pass'
  | 'transition-link'
  | 'swipe-p2'
  | 'veto-wheel'
  | 'ticket';

const QUICK_NOTE_EXAMPLES: Record<CategoryId, string[]> = {
  eat: [
    'On a des œufs et des courgettes',
    'Un plat au fromage réconfortant',
    '100% végétarien ce soir',
    'Zéro vaisselle à laver'
  ],
  watch: [
    "Pas de film d'horreur",
    'Format court (moins de 1h40)',
    'Une enquête à rebondissements',
    'Un classique qui met de bonne humeur'
  ],
  weekend: [
    'Il pleut ce week-end',
    'En extérieur au grand air',
    'Une activité créative ou insolite',
    'Gratuit ou moins de 10 €'
  ]
};

export default function App() {
  // Thème Nuit par défaut ("Soirée / Néon doux") avec persistance localStorage
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('alphabette_theme_dark');
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });

  // Mode BIG à 3 niveaux (0 = Normal Confort, 1 = BIG+ Grand, 2 = BIG++ Très Grand XXL)
  const [bigLevel, setBigLevel] = useState<BigModeLevel>(() => {
    try {
      const saved = localStorage.getItem('alphabette_big_level');
      if (saved === '1' || saved === '2') return Number(saved) as BigModeLevel;
      return 0;
    } catch {
      return 0;
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('alphabette_theme_dark', String(isDark));
    } catch {
      // ignore
    }
  }, [isDark]);

  // Applique le niveau BIG directement sur la balise <html> pour agrandir toutes les unités rem du site
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('big-level-1', 'big-level-2');
    if (bigLevel === 1) {
      root.classList.add('big-level-1');
    } else if (bigLevel === 2) {
      root.classList.add('big-level-2');
    }
    try {
      localStorage.setItem('alphabette_big_level', String(bigLevel));
    } catch {
      // ignore
    }
  }, [bigLevel]);

  const handleCycleBigLevel = () => {
    setBigLevel((prev) => ((prev + 1) % 3) as BigModeLevel);
  };

  // État des contraintes et préférences
  const [constraints, setConstraints] = useState<ConstraintsState>({
    category: 'eat',
    budget: '€€',
    fatigue: 'canape',
    ambiance: 'chill',
    customNote: '',
    playMode: 'same-phone',
    player1Name: 'Alex',
    player2Name: 'Sam',
    useAiGeneration: false
  });

  const [step, setStep] = useState<FlowStep>('setup');
  const [activeCards, setActiveCards] = useState<IdeaCard[]>([]);
  const [p1Likes, setP1Likes] = useState<string[]>([]);
  const [p2Likes, setP2Likes] = useState<string[]>([]);
  const [validatedChoices, setValidatedChoices] = useState<ValidatedChoice[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationNotice, setGenerationNotice] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string>('');
  const [linkCopied, setLinkCopied] = useState(false);
  const [showCatalogModal, setShowCatalogModal] = useState(false);
  const [catalogFilterCat, setCatalogFilterCat] = useState<CategoryId>('eat');

  // Détection au chargement d'un lien WhatsApp partagé (?s=...)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionParam = params.get('s');
    if (sessionParam) {
      const decoded = decodeSessionFromBase64(sessionParam);
      if (decoded) {
        setConstraints((prev) => ({
          ...prev,
          category: decoded.c,
          budget: decoded.b,
          fatigue: decoded.f,
          ambiance: decoded.a,
          customNote: decoded.n || '',
          playMode: 'whatsapp-link',
          player1Name: decoded.p1 || 'Joueur 1',
          player2Name: decoded.p2 || 'Joueur 2'
        }));
        setActiveCards(decoded.cards);
        setP1Likes(decoded.p1Likes);
        setStep('incoming-invite');
      }
    }
  }, []);

  // Lancement d'une session de 6 cartes (Moteur local 72+ idées ou IA sur-mesure)
  const handleStartSession = async () => {
    setIsGenerating(true);
    setGenerationNotice(null);

    const p1 = constraints.player1Name.trim() || 'Joueur 1';
    const p2 = constraints.player2Name.trim() || 'Joueur 2';
    setConstraints((prev) => ({ ...prev, player1Name: p1, player2Name: p2 }));

    if (constraints.useAiGeneration) {
      try {
        const res = await fetch('/api/suggest', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            category: constraints.category,
            budget: constraints.budget,
            fatigue: constraints.fatigue,
            ambiance: constraints.ambiance,
            customNote: constraints.customNote
          })
        });

        const data = await res.json();
        if (res.ok && Array.isArray(data.cards) && data.cards.length >= 4) {
          setActiveCards(data.cards.slice(0, 6));
          setP1Likes([]);
          setP2Likes([]);
          setIsGenerating(false);
          setStep('swipe-p1');
          return;
        }
        setGenerationNotice(
          'Mode hors-ligne activé automatiquement : 6 pépites sélectionnées dans la base locale.'
        );
      } catch {
        setGenerationNotice(
          'Mode hors-ligne activé : 6 propositions ciblées depuis la base locale.'
        );
      }
    }

    const targeted = selectTargetedIdeas(constraints);
    setActiveCards(targeted);
    setP1Likes([]);
    setP2Likes([]);
    setIsGenerating(false);
    setStep('swipe-p1');
  };

  // Fin du swipe de Joueur 1
  const handlePlayer1Complete = (likedIds: string[]) => {
    setP1Likes(likedIds);

    if (constraints.playMode === 'same-phone') {
      setStep('transition-pass');
    } else {
      const payload: SharedSessionPayload = {
        v: 1,
        c: constraints.category,
        b: constraints.budget,
        f: constraints.fatigue,
        a: constraints.ambiance,
        n: constraints.customNote,
        p1: constraints.player1Name || 'Joueur 1',
        p2: constraints.player2Name || 'Joueur 2',
        cards: activeCards,
        p1Likes: likedIds
      };
      const encoded = encodeSessionToBase64(payload);
      const url = `${window.location.origin}${window.location.pathname}?s=${encoded}`;
      setShareUrl(url);
      setStep('transition-link');
    }
  };

  // Fin du swipe de Joueur 2 -> Calcul des matchs communs
  const handlePlayer2Complete = (likedIds: string[]) => {
    setP2Likes(likedIds);

    const common = activeCards.filter(
      (card) => p1Likes.includes(card.id) && likedIds.includes(card.id)
    );

    if (common.length === 1) {
      finalizeWinner(common[0], 'match-direct');
    } else {
      setStep('veto-wheel');
    }
  };

  const finalizeWinner = (
    card: IdeaCard,
    method: 'match-direct' | 'roue-secours' | 'coup-de-coeur'
  ) => {
    const newChoice: ValidatedChoice = {
      category: constraints.category,
      card,
      validatedAt: new Date().toISOString(),
      method
    };

    setValidatedChoices((prev) => {
      const filtered = prev.filter((item) => item.category !== constraints.category);
      return [...filtered, newChoice];
    });

    if (window.location.search.includes('s=')) {
      window.history.replaceState({}, '', window.location.pathname);
    }

    setStep('ticket');
  };

  const handleAddAnotherCategory = (nextCat: CategoryId) => {
    setConstraints((prev) => ({
      ...prev,
      category: nextCat,
      customNote: ''
    }));
    setStep('setup');
  };

  const handleResetAll = () => {
    if (window.location.search.includes('s=')) {
      window.history.replaceState({}, '', window.location.pathname);
    }
    setValidatedChoices([]);
    setP1Likes([]);
    setP2Likes([]);
    setStep('setup');
  };

  const commonMatches = activeCards.filter(
    (card) => p1Likes.includes(card.id) && p2Likes.includes(card.id)
  );

  const unionLikes = activeCards.filter(
    (card) => p1Likes.includes(card.id) || p2Likes.includes(card.id)
  );
  const fallbackPool = unionLikes.length >= 2 ? unionLikes : activeCards.slice(0, 4);

  const currentCatMeta = CATEGORY_LABELS[constraints.category];

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8ff] dark:bg-[#110a22] text-slate-900 dark:text-[#f5f2ff] transition-colors">
      {/* DOUBLE BARRE OBLIGATOIRE ALPHABETTE (Dimensions fixes en px, isolées du zoom rem) */}
      <AlphabetteHeader
        isDark={isDark}
        onToggleDark={() => setIsDark((prev) => !prev)}
        bigLevel={bigLevel}
        onCycleBigLevel={handleCycleBigLevel}
        onSetBigLevel={setBigLevel}
        showBackButton={step !== 'setup'}
        onBackHome={() => setStep('setup')}
      />

      {/* CONTENU PRINCIPAL — S'agrandit intégralement sur les 3 niveaux BIG (Normal / BIG+ / BIG++) */}
      <main
        id="main-app-content"
        className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10"
      >
        {generationNotice && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-800 dark:text-amber-200 text-base font-medium flex items-center justify-between">
            <span>{generationNotice}</span>
            <button
              type="button"
              onClick={() => setGenerationNotice(null)}
              className="text-sm font-bold underline ml-3 cursor-pointer"
            >
              OK
            </button>
          </div>
        )}

        {/* =========================================================
            ÉTAPE 1 : CONFIGURATION & CHOIX DE LA CATÉGORIE
           ========================================================= */}
        {step === 'setup' && (
          <div className="space-y-8">
            {/* Hero éditorial agrandi + Sélecteur rapide des 3 modes de taille */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 border-b border-slate-200/80 dark:border-white/10 pb-6">
              <div className="max-w-3xl">
                <p className="text-sm sm:text-base font-bold uppercase tracking-wider text-pink-600 dark:text-pink-400 mb-2">
                  Micro-app sociale sans serveur · Coupe court à l’indécision
                </p>
                <h1
                  className="font-display font-extrabold text-3xl sm:text-5xl text-slate-900 dark:text-white tracking-tight leading-tight"
                  style={{ textWrap: 'balance' }}
                >
                  Fini le débat du vendredi soir. Tranchez à deux en 60 secondes.
                </h1>
              </div>

              <div className="flex flex-wrap items-center gap-3 self-start lg:self-end">
                {/* Sélecteur direct des 3 modes de taille (Normal / BIG+ / BIG++) */}
                <div
                  role="group"
                  aria-label="Choisir la taille d'affichage du site"
                  className="flex items-center gap-1 p-1.5 rounded-2xl border border-slate-300 dark:border-white/15 bg-white dark:bg-[#191030]"
                >
                  {(
                    [
                      { level: 0 as BigModeLevel, label: 'Normal' },
                      { level: 1 as BigModeLevel, label: 'BIG +' },
                      { level: 2 as BigModeLevel, label: 'BIG ++ (XXL)' }
                    ] as const
                  ).map((item) => (
                    <button
                      key={item.level}
                      type="button"
                      onClick={() => setBigLevel(item.level)}
                      className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer whitespace-nowrap ${
                        bigLevel === item.level
                          ? 'bg-pink-600 text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setCatalogFilterCat(constraints.category);
                    setShowCatalogModal(true);
                  }}
                  className="px-4 py-3 rounded-2xl border border-slate-300 dark:border-white/15 bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-pink-500" />
                  <span>Explorer les {OFFLINE_IDEAS.length} idées</span>
                </button>
              </div>
            </div>

            {/* Si l'utilisateur a déjà validé une 1ère étape du Ticket Combo */}
            {validatedChoices.length > 0 && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 text-base font-semibold text-emerald-800 dark:text-emerald-200">
                  <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span>
                    Déjà sur votre Ticket :{' '}
                    {validatedChoices.map((c) => `${c.card.emoji} ${c.card.title}`).join(' + ')}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep('ticket')}
                  className="text-sm font-bold underline text-emerald-700 dark:text-emerald-300 cursor-pointer"
                >
                  Revenir au Ticket
                </button>
              </div>
            )}

            {/* Grille principale 12 colonnes sur Desktop (s'adapte en BIG 2 XXL) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start big2-stack-cols">
              {/* Colonne gauche (7 cols) : Catégorie + Contraintes */}
              <div className="lg:col-span-7 space-y-8">
                {/* 1. Choix de la catégorie */}
                <section aria-labelledby="cat-heading">
                  <div className="flex items-center justify-between mb-3.5">
                    <h2
                      id="cat-heading"
                      className="font-display font-bold text-xl sm:text-2xl text-slate-900 dark:text-white"
                    >
                      1. Quelle est la question qui fâche ?
                    </h2>
                    <span className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
                      Étape 1 sur 3
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 big2-stack-cols">
                    {(['eat', 'watch', 'weekend'] as CategoryId[]).map((catId) => {
                      const meta = CATEGORY_LABELS[catId];
                      const active = constraints.category === catId;
                      return (
                        <button
                          key={catId}
                          type="button"
                          onClick={() =>
                            setConstraints((prev) => ({
                              ...prev,
                              category: catId
                            }))
                          }
                          className={`p-5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[8rem] ${
                            active
                              ? 'border-pink-500 bg-pink-500/10 dark:bg-pink-500/15 ring-2 ring-pink-500/40'
                              : 'border-slate-200 dark:border-white/10 bg-white dark:bg-[#191030] hover:border-pink-400/50'
                          }`}
                        >
                          <div className="text-3xl mb-2.5">{meta.emoji}</div>
                          <div>
                            <div className="font-display font-bold text-lg text-slate-900 dark:text-white leading-snug">
                              {meta.title}
                            </div>
                            <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                              {meta.tag}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </section>

                {/* 2. Réglage rapide des contraintes */}
                <section
                  aria-labelledby="constraints-heading"
                  className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#191030] space-y-7"
                >
                  <div className="flex items-center justify-between">
                    <h2
                      id="constraints-heading"
                      className="font-display font-bold text-xl sm:text-2xl text-slate-900 dark:text-white"
                    >
                      2. Vos contraintes de ce soir
                    </h2>
                    <span className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
                      Étape 2 sur 3
                    </span>
                  </div>

                  {/* Budget */}
                  <div>
                    <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                      Budget
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {BUDGET_OPTIONS.map((opt) => {
                        const active = constraints.budget === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() =>
                              setConstraints((prev) => ({ ...prev, budget: opt.value }))
                            }
                            className={`py-3.5 px-3 rounded-2xl border text-center transition-all cursor-pointer ${
                              active
                                ? 'border-pink-500 bg-pink-600 text-white font-bold shadow-md'
                                : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-slate-200 hover:border-pink-400/50'
                            }`}
                          >
                            <div className="font-display font-extrabold text-xl">{opt.label}</div>
                            <div
                              className={`text-xs sm:text-sm mt-0.5 truncate ${
                                active ? 'text-pink-100' : 'text-slate-500 dark:text-slate-400'
                              }`}
                            >
                              {opt.desc}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Niveau de fatigue */}
                  <div>
                    <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                      Niveau de batterie / fatigue
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 big2-stack-cols">
                      {FATIGUE_OPTIONS.map((opt) => {
                        const active = constraints.fatigue === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() =>
                              setConstraints((prev) => ({ ...prev, fatigue: opt.value }))
                            }
                            className={`py-3.5 px-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center sm:flex-col sm:items-start gap-3 sm:gap-1.5 ${
                              active
                                ? 'border-amber-500 bg-amber-500/15 text-slate-900 dark:text-white ring-2 ring-amber-500/40 font-bold'
                                : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-slate-200 hover:border-amber-400/50'
                            }`}
                          >
                            <span className="text-2xl">{opt.emoji}</span>
                            <div>
                              <div className="text-base font-bold">{opt.label}</div>
                              <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                                {opt.desc}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Ambiance */}
                  <div>
                    <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                      Ambiance recherchée
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 big2-two-cols">
                      {AMBIANCE_OPTIONS.map((opt) => {
                        const active = constraints.ambiance === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() =>
                              setConstraints((prev) => ({ ...prev, ambiance: opt.value }))
                            }
                            className={`py-3 px-3.5 rounded-2xl border font-semibold text-base flex items-center justify-center gap-2 transition-all cursor-pointer ${
                              active
                                ? 'border-pink-500 bg-pink-500/15 text-pink-700 dark:text-pink-300 ring-2 ring-pink-500/40 font-bold'
                                : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-slate-200 hover:border-pink-400/40'
                            }`}
                          >
                            <span className="text-lg">{opt.emoji}</span>
                            <span>{opt.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Champ libre optionnel */}
                  <div>
                    <label
                      htmlFor="custom-note-input"
                      className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5"
                    >
                      Contrainte libre ou restes du frigo (optionnel)
                    </label>
                    <input
                      id="custom-note-input"
                      type="text"
                      value={constraints.customNote}
                      onChange={(e) =>
                        setConstraints((prev) => ({ ...prev, customNote: e.target.value }))
                      }
                      placeholder={
                        constraints.category === 'eat'
                          ? 'Ex : On a des œufs et des courgettes...'
                          : constraints.category === 'watch'
                          ? "Ex : Pas de film d'horreur, moins de 1h45..."
                          : 'Ex : Il pleut, on préfère rester au sec...'
                      }
                      className="w-full py-3.5 px-4 rounded-2xl border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-[#120b24] text-slate-900 dark:text-white placeholder:text-slate-400 text-base focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />

                    {/* Suggestions rapides cliquables */}
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="text-xs sm:text-sm text-slate-400 mr-1">Exemples :</span>
                      {QUICK_NOTE_EXAMPLES[constraints.category].map((example) => (
                        <button
                          key={example}
                          type="button"
                          onClick={() =>
                            setConstraints((prev) => ({
                              ...prev,
                              customNote: prev.customNote === example ? '' : example
                            }))
                          }
                          className={`text-xs sm:text-sm px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
                            constraints.customNote === example
                              ? 'border-pink-500 bg-pink-500/15 text-pink-600 dark:text-pink-300 font-semibold'
                              : 'border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-pink-400/50'
                          }`}
                        >
                          {example}
                        </button>
                      ))}
                    </div>
                  </div>
                </section>
              </div>

              {/* Colonne droite (5 cols) : Mode Swipe à Deux & Lancement */}
              <div className="lg:col-span-5 space-y-6">
                <section
                  aria-labelledby="mode-heading"
                  className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-pink-500/30 bg-white dark:bg-[#191030] shadow-xl space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <h2
                      id="mode-heading"
                      className="font-display font-bold text-xl sm:text-2xl text-slate-900 dark:text-white"
                    >
                      3. Mode « Swipe à Deux »
                    </h2>
                    <span className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
                      Étape 3 sur 3
                    </span>
                  </div>

                  {/* Prénoms des 2 joueurs */}
                  <div className="grid grid-cols-2 gap-3.5">
                    <div>
                      <label
                        htmlFor="p1-name"
                        className="block text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1.5"
                      >
                        Joueur 1
                      </label>
                      <input
                        id="p1-name"
                        type="text"
                        maxLength={18}
                        value={constraints.player1Name}
                        onChange={(e) =>
                          setConstraints((prev) => ({ ...prev, player1Name: e.target.value }))
                        }
                        placeholder="Alex"
                        className="w-full py-3 px-3.5 rounded-xl border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-[#120b24] text-base font-semibold focus:outline-none focus:ring-2 focus:ring-pink-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="p2-name"
                        className="block text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1.5"
                      >
                        Joueur 2
                      </label>
                      <input
                        id="p2-name"
                        type="text"
                        maxLength={18}
                        value={constraints.player2Name}
                        onChange={(e) =>
                          setConstraints((prev) => ({ ...prev, player2Name: e.target.value }))
                        }
                        placeholder="Sam"
                        className="w-full py-3 px-3.5 rounded-xl border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-[#120b24] text-base font-semibold focus:outline-none focus:ring-2 focus:ring-pink-500"
                      />
                    </div>
                  </div>

                  {/* Sélection Même téléphone vs Lien WhatsApp */}
                  <div className="space-y-3">
                    <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Comment jouez-vous ?
                    </label>

                    <button
                      type="button"
                      onClick={() =>
                        setConstraints((prev) => ({ ...prev, playMode: 'same-phone' }))
                      }
                      className={`w-full p-4 rounded-2xl border text-left flex items-start gap-3.5 transition-all cursor-pointer ${
                        constraints.playMode === 'same-phone'
                          ? 'border-pink-500 bg-pink-500/10 dark:bg-pink-500/15 ring-2 ring-pink-500/40'
                          : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5'
                      }`}
                    >
                      <div className="w-11 h-11 rounded-xl bg-pink-500/15 text-pink-500 flex items-center justify-center shrink-0 mt-0.5">
                        <Smartphone className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="font-display font-bold text-base text-slate-900 dark:text-white">
                          Même téléphone (Pass & Play)
                        </div>
                        <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                          {constraints.player1Name || 'Joueur 1'} swipe les 6 cartes, puis passe le
                          téléphone à {constraints.player2Name || 'Joueur 2'}.
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setConstraints((prev) => ({ ...prev, playMode: 'whatsapp-link' }))
                      }
                      className={`w-full p-4 rounded-2xl border text-left flex items-start gap-3.5 transition-all cursor-pointer ${
                        constraints.playMode === 'whatsapp-link'
                          ? 'border-pink-500 bg-pink-500/10 dark:bg-pink-500/15 ring-2 ring-pink-500/40'
                          : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5'
                      }`}
                    >
                      <div className="w-11 h-11 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                        <MessageCircle className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="font-display font-bold text-base text-slate-900 dark:text-white">
                          Lien WhatsApp à distance (Sans serveur)
                        </div>
                        <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                          Génère un lien encodé en Base64 avec vos choix pour que{' '}
                          {constraints.player2Name || 'Joueur 2'} swipe sur son propre téléphone.
                        </div>
                      </div>
                    </button>
                  </div>

                  {/* Choix du moteur : Base Riche Locale vs Génération IA */}
                  <div className="pt-2 border-t border-slate-200 dark:border-white/10">
                    <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
                      Source des 6 propositions
                    </label>
                    <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-[#120b24] border border-slate-200 dark:border-white/10">
                      <button
                        type="button"
                        onClick={() =>
                          setConstraints((prev) => ({ ...prev, useAiGeneration: false }))
                        }
                        className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                          !constraints.useAiGeneration
                            ? 'bg-white dark:bg-[#251742] text-slate-900 dark:text-white shadow-xs'
                            : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        <Database className="w-4 h-4 text-pink-500 shrink-0" />
                        <span>Base Riche (72+)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setConstraints((prev) => ({ ...prev, useAiGeneration: true }))
                        }
                        className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                          constraints.useAiGeneration
                            ? 'bg-white dark:bg-[#251742] text-slate-900 dark:text-white shadow-xs'
                            : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        <Wand2 className="w-4 h-4 text-amber-500 shrink-0" />
                        <span>IA Sur-Mesure</span>
                      </button>
                    </div>
                  </div>

                  {/* Bouton de lancement */}
                  <button
                    type="button"
                    disabled={isGenerating}
                    onClick={handleStartSession}
                    className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 hover:from-pink-500 hover:to-amber-400 active:scale-[0.99] text-white font-display font-extrabold text-lg sm:text-xl flex items-center justify-center gap-3 shadow-lg shadow-pink-600/30 transition-all cursor-pointer disabled:opacity-60"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span>Préparation des 6 cartes...</span>
                      </>
                    ) : (
                      <>
                        <Flame className="w-6 h-6 fill-white shrink-0" />
                        <span>Lancer les 6 cartes ({currentCatMeta.shortLabel})</span>
                        <ArrowRight className="w-6 h-6 shrink-0" />
                      </>
                    )}
                  </button>
                </section>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            INVITATION ENTRANTE VIA LIEN WHATSAPP (?s=...)
           ========================================================= */}
        {step === 'incoming-invite' && (
          <div className="max-w-xl mx-auto rounded-3xl border-2 border-pink-500/50 bg-white dark:bg-[#191030] p-7 sm:p-9 shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-pink-500/15 text-pink-500 flex items-center justify-center mx-auto text-3xl">
              {currentCatMeta.emoji}
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-pink-500 mb-1">
                Invitation MatchSoirée reçue
              </p>
              <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white">
                {constraints.player1Name} a déjà fait ses choix !
              </h1>
              <p className="text-base text-slate-600 dark:text-slate-300 mt-2">
                Catégorie : <strong>{currentCatMeta.title}</strong> · Budget{' '}
                <strong>{constraints.budget}</strong>
                {constraints.customNote && ` · « ${constraints.customNote} »`}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 text-left">
              <label
                htmlFor="incoming-p2-name"
                className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5"
              >
                Confirme ton prénom (Joueur 2)
              </label>
              <input
                id="incoming-p2-name"
                type="text"
                value={constraints.player2Name}
                onChange={(e) =>
                  setConstraints((prev) => ({ ...prev, player2Name: e.target.value }))
                }
                className="w-full py-3 px-3.5 rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-[#120b24] font-semibold text-base"
              />
            </div>

            <button
              type="button"
              onClick={() => setStep('swipe-p2')}
              className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-pink-600 to-amber-500 text-white font-display font-extrabold text-lg flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              <span>Swiper les 6 mêmes cartes & voir nos matchs</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* =========================================================
            ÉTAPE 2 : SWIPE JOUEUR 1
           ========================================================= */}
        {step === 'swipe-p1' && (
          <SwipeDeck
            cards={activeCards}
            currentPlayerName={constraints.player1Name || 'Joueur 1'}
            playerBadgeColor="pink"
            onComplete={handlePlayer1Complete}
          />
        )}

        {/* =========================================================
            ÉTAPE 3A : TRANSITION "PASSE LE TÉLÉPHONE À JOUEUR 2"
           ========================================================= */}
        {step === 'transition-pass' && (
          <div className="max-w-xl mx-auto rounded-3xl border border-slate-200 dark:border-pink-500/30 bg-white dark:bg-[#1a1033] p-7 sm:p-9 shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/15 text-amber-500 flex items-center justify-center mx-auto">
              <Users className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-500">
                Choix de {constraints.player1Name} enregistrés & masqués
              </p>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white">
                Passe le téléphone à {constraints.player2Name} !
              </h2>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Aucun spoiler : les réponses de {constraints.player1Name} restent secrètes jusqu’au
                verdict final.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setStep('swipe-p2')}
              className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-amber-500 to-pink-600 hover:from-amber-400 hover:to-pink-500 text-white font-display font-extrabold text-lg flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              <span>C’est bon, je suis {constraints.player2Name} · À mon tour !</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* =========================================================
            ÉTAPE 3B : TRANSITION "LIEN WHATSAPP BASE64"
           ========================================================= */}
        {step === 'transition-link' && (
          <div className="max-w-xl mx-auto rounded-3xl border border-slate-200 dark:border-pink-500/30 bg-white dark:bg-[#1a1033] p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center shrink-0">
                <Share2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-500">
                  Lien sans serveur généré (Base64)
                </p>
                <h2 className="font-display font-extrabold text-2xl text-slate-900 dark:text-white">
                  Envoie ce lien à {constraints.player2Name}
                </h2>
              </div>
            </div>

            <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Ce lien contient les 6 propositions et tes choix chiffrés. Dès que{' '}
              <strong>{constraints.player2Name}</strong> l’ouvre et swipe, vos matchs communs
              s’affichent instantanément !
            </p>

            <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-[#110a22] border border-slate-200 dark:border-white/10 font-mono-num text-xs sm:text-sm text-slate-500 dark:text-slate-400 truncate">
              {shareUrl}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `Salut ${constraints.player2Name} ! J'ai fait mes choix sur MatchSoirée pour "${currentCatMeta.title}". Ouvre ce lien pour swiper à ton tour en 30 secondes :\n${shareUrl}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3.5 px-4 rounded-2xl bg-[#25D366] hover:bg-[#1ebe5b] text-slate-950 font-display font-bold text-base flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Envoyer sur WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(shareUrl);
                    setLinkCopied(true);
                    setTimeout(() => setLinkCopied(false), 2500);
                  } catch {
                    // ignore
                  }
                }}
                className="py-3.5 px-4 rounded-2xl border border-slate-300 dark:border-white/15 hover:bg-slate-100 dark:hover:bg-white/10 font-display font-bold text-base flex items-center justify-center gap-2 cursor-pointer"
              >
                {linkCopied ? (
                  <>
                    <Check className="w-5 h-5 text-emerald-500" />
                    <span>Lien copié !</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    <span>Copier le lien</span>
                  </>
                )}
              </button>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Vous êtes finalement côte à côte ?
              </span>
              <button
                type="button"
                onClick={() => setStep('swipe-p2')}
                className="text-xs sm:text-sm font-bold text-pink-600 dark:text-pink-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Simuler l’ouverture du lien par {constraints.player2Name} ici</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* =========================================================
            ÉTAPE 4 : SWIPE JOUEUR 2
           ========================================================= */}
        {step === 'swipe-p2' && (
          <SwipeDeck
            cards={activeCards}
            currentPlayerName={constraints.player2Name || 'Joueur 2'}
            playerBadgeColor="amber"
            onComplete={handlePlayer2Complete}
          />
        )}

        {/* =========================================================
            ÉTAPE 5 : LE VETO & LA ROUE DE SECOURS
           ========================================================= */}
        {step === 'veto-wheel' && (
          <VetoAndWheel
            commonMatches={commonMatches}
            fallbackPool={fallbackPool}
            player1Name={constraints.player1Name || 'Joueur 1'}
            player2Name={constraints.player2Name || 'Joueur 2'}
            onSelectFinalWinner={finalizeWinner}
          />
        )}

        {/* =========================================================
            ÉTAPE 6 : TICKET DE VALIDATION PARTAGEABLE
           ========================================================= */}
        {step === 'ticket' && (
          <div className="space-y-4">
            {commonMatches.length === 1 && (
              <div className="max-w-2xl mx-auto p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center gap-2 text-emerald-700 dark:text-emerald-300 font-display font-bold text-base">
                <HeartHandshake className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>
                  Coup de foudre mutuel ! Un seul match commun entre {constraints.player1Name} et{' '}
                  {constraints.player2Name}.
                </span>
              </div>
            )}

            <TicketSoiree
              player1Name={constraints.player1Name || 'Joueur 1'}
              player2Name={constraints.player2Name || 'Joueur 2'}
              validatedChoices={validatedChoices}
              onAddAnotherCategory={handleAddAnotherCategory}
              onResetAll={handleResetAll}
            />
          </div>
        )}
      </main>

      {/* MODALE : EXPLORATEUR DES 72 IDÉES HORS-LIGNE */}
      {showCatalogModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowCatalogModal(false)}
        >
          <div
            className="w-full max-w-4xl max-h-[85vh] flex flex-col rounded-3xl border border-slate-200 dark:border-pink-500/30 bg-white dark:bg-[#18102e] text-slate-900 dark:text-white shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
              <div>
                <h2 className="font-display font-bold text-xl sm:text-2xl">
                  Base Riche Hors-Ligne ({OFFLINE_IDEAS.length} idées classées)
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  100 % fonctionnel sans connexion · Cliquez sur une idée pour la valider directement
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCatalogModal(false)}
                aria-label="Fermer le catalogue"
                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-500/20 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Onglets de filtre par catégorie */}
            <div className="px-5 py-3 border-b border-slate-200 dark:border-white/10 flex items-center gap-2 overflow-x-auto">
              {(['eat', 'watch', 'weekend'] as CategoryId[]).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCatalogFilterCat(cat)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    catalogFilterCat === cat
                      ? 'bg-pink-600 text-white'
                      : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {CATEGORY_LABELS[cat].emoji} {CATEGORY_LABELS[cat].title} (
                  {OFFLINE_IDEAS.filter((i) => i.category === cat).length})
                </button>
              ))}
            </div>

            {/* Liste des idées */}
            <div className="p-5 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-4 big2-stack-cols">
              {OFFLINE_IDEAS.filter((i) => i.category === catalogFilterCat).map((idea) => (
                <div
                  key={idea.id}
                  className="p-5 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 flex flex-col justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs sm:text-sm text-slate-500 dark:text-pink-300/80 mb-1">
                      <span>Budget {idea.budget}</span>
                      <span>{idea.durationOrPrep}</span>
                    </div>
                    <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                      {idea.emoji} {idea.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                      {idea.subtitle}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setConstraints((prev) => ({ ...prev, category: idea.category }));
                      setShowCatalogModal(false);
                      finalizeWinner(idea, 'coup-de-coeur');
                    }}
                    className="w-full py-2.5 rounded-xl bg-pink-500/15 hover:bg-pink-600 hover:text-white text-pink-600 dark:text-pink-300 text-sm font-bold transition-colors cursor-pointer"
                  >
                    Choisir directement pour notre Ticket
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PIED DE PAGE DISCRET DEMANDÉ */}
      <footer className="w-full border-t border-slate-200/80 dark:border-white/10 py-6 px-4 text-center text-sm sm:text-base text-slate-500 dark:text-slate-400 no-print">
        <p className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-1.5">
          <span>Créé par</span>
          <a
            href="https://alphabette.fr"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-slate-800 dark:text-white hover:text-pink-500 underline-offset-4 hover:underline"
          >
            Alphabette
          </a>
          <span>— Envie d’idées locales ou de vidéos ? Découvre</span>
          <a
            href="https://alphabette.fr"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-pink-600 dark:text-pink-400 hover:underline inline-flex items-center gap-0.5"
          >
            <span>ProxiLien</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <span>et</span>
          <a
            href="https://alphabette.fr"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-amber-600 dark:text-amber-400 hover:underline inline-flex items-center gap-0.5"
          >
            <span>ORBIT</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <span>.</span>
        </p>
      </footer>
    </div>
  );
}
