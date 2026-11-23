import React, { useEffect, useState } from 'react';
import { Clock, Heart, Lightbulb, RotateCcw, Sparkles, X } from 'lucide-react';
import { IdeaCard } from '../types';

interface SwipeDeckProps {
  cards: IdeaCard[];
  currentPlayerName: string;
  playerBadgeColor: 'pink' | 'amber';
  onComplete: (likedIds: string[]) => void;
}

export const SwipeDeck: React.FC<SwipeDeckProps> = ({
  cards,
  currentPlayerName,
  playerBadgeColor,
  onComplete
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [history, setHistory] = useState<{ index: number; liked: boolean; cardId: string }[]>([]);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [exitDirection, setExitDirection] = useState<'left' | 'right' | null>(null);

  const currentCard = cards[currentIndex];
  const total = cards.length;

  const handleVote = (liked: boolean) => {
    if (!currentCard || exitDirection) return;

    setExitDirection(liked ? 'right' : 'left');

    setTimeout(() => {
      const nextLiked = liked ? [...likedIds, currentCard.id] : likedIds;
      setHistory((prev) => [...prev, { index: currentIndex, liked, cardId: currentCard.id }]);
      setLikedIds(nextLiked);
      setExitDirection(null);
      setDragOffset({ x: 0, y: 0 });

      if (currentIndex + 1 >= total) {
        onComplete(nextLiked);
      } else {
        setCurrentIndex((prev) => prev + 1);
      }
    }, 180);
  };

  const handleUndo = () => {
    if (history.length === 0 || exitDirection) return;
    const last = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    if (last.liked) {
      setLikedIds((prev) => prev.filter((id) => id !== last.cardId));
    }
    setCurrentIndex(last.index);
    setDragOffset({ x: 0, y: 0 });
  };

  // Support clavier Flèche Gauche (Non) / Flèche Droite (Oui)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleVote(false);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleVote(true);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (exitDirection) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !dragStart) return;
    const dx = e.clientX - dragStart.x;
    const dy = (e.clientY - dragStart.y) * 0.25;
    setDragOffset({ x: dx, y: dy });
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    setDragStart(null);

    if (dragOffset.x > 85) {
      handleVote(true);
    } else if (dragOffset.x < -85) {
      handleVote(false);
    } else {
      setDragOffset({ x: 0, y: 0 });
    }
  };

  if (!currentCard) {
    return null;
  }

  const translateX =
    exitDirection === 'right' ? 360 : exitDirection === 'left' ? -360 : dragOffset.x;
  const rotateDeg = translateX * 0.045;
  const opacity = exitDirection ? 0 : 1;

  const showYesStamp = translateX > 45;
  const showNoStamp = translateX < -45;

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col">
      {/* Barre supérieure du joueur et progression */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <span
            className={`w-3 h-3 rounded-full ${
              playerBadgeColor === 'pink' ? 'bg-pink-500' : 'bg-amber-400'
            }`}
          />
          <span className="font-display font-bold text-lg text-slate-900 dark:text-white">
            Au tour de {currentPlayerName}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {history.length > 0 && (
            <button
              type="button"
              onClick={handleUndo}
              aria-label="Annuler le choix précédent"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-300 dark:border-white/15 text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-white/10 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Annuler</span>
            </button>
          )}
          <span className="font-mono-num text-sm font-bold text-pink-600 dark:text-pink-400">
            Carte {currentIndex + 1} / {total}
          </span>
        </div>
      </div>

      {/* Jauge de progression */}
      <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden mb-5">
        <div
          className="h-full bg-gradient-to-r from-pink-500 to-amber-400 transition-transform duration-200 origin-left"
          style={{ transform: `scaleX(${(currentIndex + 1) / total})` }}
        />
      </div>

      {/* Zone de la carte tactile */}
      <div className="relative select-none touch-pan-y">
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          style={{
            transform: `translate3d(${translateX}px, ${dragOffset.y}px, 0) rotate(${rotateDeg}deg)`,
            opacity,
            transition: isDragging ? 'none' : 'transform 180ms cubic-bezier(0.16, 1, 0.3, 1), opacity 180ms ease'
          }}
          className="relative rounded-3xl border border-slate-200/90 dark:border-pink-500/30 bg-white dark:bg-[#1c1136] p-6 sm:p-8 shadow-xl dark:shadow-pink-950/30 cursor-grab active:cursor-grabbing"
        >
          {/* Tampon visuel lors du glissement */}
          {showYesStamp && (
            <div className="absolute top-6 right-6 z-10 px-4 py-1.5 rounded-xl border-2 border-emerald-500 bg-emerald-500/15 text-emerald-500 font-display font-extrabold text-base tracking-wide rotate-6">
              OUI ♥
            </div>
          )}
          {showNoStamp && (
            <div className="absolute top-6 left-6 z-10 px-4 py-1.5 rounded-xl border-2 border-rose-500 bg-rose-500/15 text-rose-500 font-display font-extrabold text-base tracking-wide -rotate-6">
              PASSER ✕
            </div>
          )}

          {/* Métadonnées sobres non-encapsulées (Zero-Pill Discipline) */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500 dark:text-pink-300/80 mb-4">
            <span>Budget {currentCard.budget}</span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {currentCard.durationOrPrep}
            </span>
            {currentCard.isAiGenerated && (
              <>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1 text-amber-500 dark:text-amber-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  Sur-mesure IA
                </span>
              </>
            )}
          </div>

          {/* Emoji + Titre principal */}
          <div className="flex items-start gap-4 mb-3">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-pink-500/10 dark:bg-pink-500/15 border border-pink-500/20 flex items-center justify-center text-3xl sm:text-4xl shrink-0">
              {currentCard.emoji}
            </div>
            <div className="min-w-0">
              <h2 className="font-display font-extrabold text-xl sm:text-2xl text-slate-900 dark:text-white leading-snug big-scale-title">
                {currentCard.title}
              </h2>
              <p className="text-sm sm:text-base font-medium text-pink-600 dark:text-pink-300 mt-1">
                {currentCard.subtitle}
              </p>
            </div>
          </div>

          {/* Description */}
          <p className="text-base text-slate-700 dark:text-slate-200 leading-relaxed my-5 big-scale-text">
            {currentCard.description}
          </p>

          {/* Conseil pratique */}
          <div className="pt-4 border-t border-slate-200/80 dark:border-white/10 flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
            <Lightbulb className="w-5 h-5 text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-900 dark:text-white">Le détail qui change tout : </span>
              <span>{currentCard.practicalTip}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Gros boutons accessibles X / Cœur (Zones tactiles >= 60px) */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => handleVote(false)}
          aria-label="Passer cette idée (Non)"
          className="h-16 rounded-2xl border-2 border-rose-500/40 bg-white dark:bg-[#1e1338] hover:bg-rose-500/10 active:scale-[0.98] flex items-center justify-center gap-3 text-rose-600 dark:text-rose-400 font-display font-bold text-lg shadow-md transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-rose-500"
        >
          <span className="w-10 h-10 rounded-full bg-rose-500/15 flex items-center justify-center">
            <X className="w-6 h-6 stroke-[2.5]" />
          </span>
          <span>Pas ce soir</span>
        </button>

        <button
          type="button"
          onClick={() => handleVote(true)}
          aria-label="Valider cette idée (Oui)"
          className="h-16 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-500 hover:to-rose-400 active:scale-[0.98] flex items-center justify-center gap-3 text-white font-display font-bold text-lg shadow-lg shadow-pink-600/25 transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-pink-400"
        >
          <span className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <Heart className="w-6 h-6 fill-white text-white" />
          </span>
          <span>Ça me tente !</span>
        </button>
      </div>

      <p className="mt-3 text-center text-xs text-slate-500 dark:text-slate-400">
        Glissez la carte à gauche/droite, appuyez sur les boutons ou utilisez les flèches ⬅ ➡ du clavier.
      </p>
    </div>
  );
};
