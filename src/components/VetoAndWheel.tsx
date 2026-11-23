import React, { useState } from 'react';
import { Ban, CheckCircle2, Disc, ShieldAlert, Sparkles } from 'lucide-react';
import { IdeaCard } from '../types';

interface VetoAndWheelProps {
  commonMatches: IdeaCard[];
  fallbackPool: IdeaCard[];
  player1Name: string;
  player2Name: string;
  onSelectFinalWinner: (winner: IdeaCard, method: 'match-direct' | 'roue-secours' | 'coup-de-coeur') => void;
}

const WHEEL_COLORS = ['#db2777', '#7c3aed', '#d97706', '#059669', '#2563eb', '#e11d48'];

export const VetoAndWheel: React.FC<VetoAndWheelProps> = ({
  commonMatches,
  fallbackPool,
  player1Name,
  player2Name,
  onSelectFinalWinner
}) => {
  const hasCommonMatch = commonMatches.length > 0;
  const initialCandidates = hasCommonMatch ? commonMatches : fallbackPool;

  const [candidates, setCandidates] = useState<IdeaCard[]>(initialCandidates);
  const [p1VetoUsed, setP1VetoUsed] = useState(false);
  const [p2VetoUsed, setP2VetoUsed] = useState(false);
  const [activeVetoPlayer, setActiveVetoPlayer] = useState<null | 'p1' | 'p2'>(null);
  const [vetoedHistory, setVetoedHistory] = useState<{ cardTitle: string; by: string }[]>([]);

  // État de la Roue de Secours
  const [wheelRotation, setWheelRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelWinner, setWheelWinner] = useState<IdeaCard | null>(null);

  const handleApplyVeto = (cardId: string) => {
    if (!activeVetoPlayer || candidates.length <= 1) return;
    const target = candidates.find((c) => c.id === cardId);
    if (!target) return;

    const remaining = candidates.filter((c) => c.id !== cardId);
    setCandidates(remaining);

    if (activeVetoPlayer === 'p1') {
      setP1VetoUsed(true);
      setVetoedHistory((prev) => [...prev, { cardTitle: target.title, by: player1Name }]);
    } else {
      setP2VetoUsed(true);
      setVetoedHistory((prev) => [...prev, { cardTitle: target.title, by: player2Name }]);
    }
    setActiveVetoPlayer(null);

    // S'il ne reste plus qu'une seule carte après les Vetos, elle l'emporte !
    if (remaining.length === 1) {
      setWheelWinner(remaining[0]);
    }
  };

  const handleSpinWheel = () => {
    if (isSpinning || candidates.length === 0) return;
    if (candidates.length === 1) {
      onSelectFinalWinner(candidates[0], hasCommonMatch ? 'match-direct' : 'roue-secours');
      return;
    }

    setIsSpinning(true);
    setWheelWinner(null);

    const winnerIndex = Math.floor(Math.random() * candidates.length);
    const sliceAngle = 360 / candidates.length;
    // La flèche est en haut (0 deg dans notre repère après décalage)
    const targetSliceCenter = winnerIndex * sliceAngle + sliceAngle / 2;
    const extraSpins = 360 * 6; // 6 tours complets
    const finalAngle = wheelRotation + extraSpins + (360 - (wheelRotation % 360)) + (360 - targetSliceCenter);

    setWheelRotation(finalAngle);

    setTimeout(() => {
      setIsSpinning(false);
      setWheelWinner(candidates[winnerIndex]);
    }, 3200);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* En-tête de verdict */}
      <div className="rounded-3xl border border-slate-200 dark:border-pink-500/30 bg-white dark:bg-[#1a1033] p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-white/10">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-pink-600 dark:text-pink-400 mb-1">
              {hasCommonMatch
                ? `${commonMatches.length} Matchs communs ex-aequo`
                : 'Aucun match direct · Phase de Repêchage'}
            </p>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white">
              {hasCommonMatch
                ? 'Départagez vos coups de cœur !'
                : 'Le Veto & la Roue de Secours'}
            </h2>
          </div>

          {/* Jetons de VETO (1 par joueur) */}
          {candidates.length > 1 && (
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                disabled={p1VetoUsed}
                onClick={() => setActiveVetoPlayer(activeVetoPlayer === 'p1' ? null : 'p1')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                  p1VetoUsed
                    ? 'opacity-40 border-slate-300 dark:border-slate-700 text-slate-400 cursor-not-allowed line-through'
                    : activeVetoPlayer === 'p1'
                    ? 'bg-rose-600 text-white border-rose-500 ring-2 ring-rose-400'
                    : 'bg-rose-500/10 border-rose-500/40 text-rose-600 dark:text-rose-300 hover:bg-rose-500/20'
                }`}
              >
                <Ban className="w-3.5 h-3.5" />
                <span>VETO {player1Name} {p1VetoUsed ? '(Utilisé)' : '(1 dispo)'}</span>
              </button>

              <button
                type="button"
                disabled={p2VetoUsed}
                onClick={() => setActiveVetoPlayer(activeVetoPlayer === 'p2' ? null : 'p2')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                  p2VetoUsed
                    ? 'opacity-40 border-slate-300 dark:border-slate-700 text-slate-400 cursor-not-allowed line-through'
                    : activeVetoPlayer === 'p2'
                    ? 'bg-rose-600 text-white border-rose-500 ring-2 ring-rose-400'
                    : 'bg-rose-500/10 border-rose-500/40 text-rose-600 dark:text-rose-300 hover:bg-rose-500/20'
                }`}
              >
                <Ban className="w-3.5 h-3.5" />
                <span>VETO {player2Name} {p2VetoUsed ? '(Utilisé)' : '(1 dispo)'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Instruction Veto actif */}
        {activeVetoPlayer && (
          <div className="mt-4 p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/40 flex items-center justify-between gap-3 text-sm text-rose-700 dark:text-rose-200">
            <div className="flex items-center gap-2 font-semibold">
              <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0" />
              <span>
                {activeVetoPlayer === 'p1' ? player1Name : player2Name}, clique sur l’option que tu
                veux éliminer définitivement :
              </span>
            </div>
            <button
              type="button"
              onClick={() => setActiveVetoPlayer(null)}
              className="text-xs underline font-bold cursor-pointer"
            >
              Annuler
            </button>
          </div>
        )}

        {/* Historique des Vetos */}
        {vetoedHistory.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500 dark:text-slate-400">
            {vetoedHistory.map((v, i) => (
              <span key={i}>
                ✕ <strong>{v.by}</strong> a mis son VETO sur <em>{v.cardTitle}</em>
              </span>
            ))}
          </div>
        )}

        {/* Grille des propositions restantes + Roue de Secours */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center big2-stack-cols">
          {/* Liste des options en lice (7 colonnes) */}
          <div className="lg:col-span-7 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Options en lice ({candidates.length})
            </p>
            {candidates.map((card, idx) => (
              <div
                key={card.id}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  wheelWinner?.id === card.id
                    ? 'border-emerald-500 bg-emerald-500/15 ring-2 ring-emerald-500/40'
                    : 'border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
                    style={{ backgroundColor: WHEEL_COLORS[idx % WHEEL_COLORS.length] }}
                  >
                    {idx + 1}
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-display font-bold text-base text-slate-900 dark:text-white truncate">
                      {card.emoji} {card.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {card.subtitle} · {card.durationOrPrep}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  {activeVetoPlayer && candidates.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => handleApplyVeto(card.id)}
                      className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1 cursor-pointer shadow-sm"
                    >
                      <Ban className="w-3.5 h-3.5" />
                      <span>Éliminer</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        onSelectFinalWinner(
                          card,
                          hasCommonMatch ? 'match-direct' : 'coup-de-coeur'
                        )
                      }
                      className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-white/15 hover:bg-pink-500 hover:text-white hover:border-pink-500 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Choisir
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* La Roue de Secours Animée (5 colonnes) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-5 rounded-3xl bg-slate-100/80 dark:bg-[#130a26] border border-slate-200 dark:border-white/10">
            <div className="relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center">
              {/* Pointeur fixe en haut */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[22px] border-t-amber-400 drop-shadow-md" />

              {/* Disque SVG rotatif */}
              <svg
                viewBox="0 0 200 200"
                className="w-full h-full rounded-full shadow-2xl border-4 border-white/20"
                style={{
                  transform: `rotate(${wheelRotation}deg)`,
                  transition: isSpinning
                    ? 'transform 3.2s cubic-bezier(0.12, 0.85, 0.18, 1)'
                    : 'none'
                }}
              >
                {candidates.length === 1 ? (
                  <circle cx="100" cy="100" r="98" fill={WHEEL_COLORS[0]} />
                ) : (
                  candidates.map((card, i) => {
                    const totalSlices = candidates.length;
                    const startAngle = (i * 360) / totalSlices - 90;
                    const endAngle = ((i + 1) * 360) / totalSlices - 90;
                    const startRad = (startAngle * Math.PI) / 180;
                    const endRad = (endAngle * Math.PI) / 180;
                    const x1 = 100 + 98 * Math.cos(startRad);
                    const y1 = 100 + 98 * Math.sin(startRad);
                    const x2 = 100 + 98 * Math.cos(endRad);
                    const y2 = 100 + 98 * Math.sin(endRad);
                    const largeArc = 360 / totalSlices > 180 ? 1 : 0;

                    const midAngle = ((startAngle + endAngle) / 2) * (Math.PI / 180);
                    const labelX = 100 + 60 * Math.cos(midAngle);
                    const labelY = 100 + 60 * Math.sin(midAngle);

                    return (
                      <g key={card.id}>
                        <path
                          d={`M 100 100 L ${x1} ${y1} A 98 98 0 ${largeArc} 1 ${x2} ${y2} Z`}
                          fill={WHEEL_COLORS[i % WHEEL_COLORS.length]}
                          stroke="#130a26"
                          strokeWidth="2"
                        />
                        <text
                          x={labelX}
                          y={labelY}
                          fill="#ffffff"
                          fontSize="14"
                          fontWeight="bold"
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          {i + 1} · {card.emoji}
                        </text>
                      </g>
                    );
                  })
                )}
                <circle cx="100" cy="100" r="22" fill="#130a26" stroke="#fbbf24" strokeWidth="3" />
              </svg>
            </div>

            <button
              type="button"
              disabled={isSpinning}
              onClick={handleSpinWheel}
              className="mt-5 w-full h-12 rounded-2xl bg-gradient-to-r from-amber-500 to-pink-600 hover:from-amber-400 hover:to-pink-500 text-white font-display font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-pink-600/25 cursor-pointer disabled:opacity-50"
            >
              <Disc className={`w-5 h-5 ${isSpinning ? 'animate-spin' : ''}`} />
              <span>
                {isSpinning
                  ? 'La roue tranche...'
                  : candidates.length === 1
                  ? 'Valider la dernière option !'
                  : 'Lancer la Roue de Secours'}
              </span>
            </button>
          </div>
        </div>

        {/* Révélation du gagnant de la roue */}
        {wheelWinner && (
          <div className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-teal-500/15 to-pink-500/15 border-2 border-emerald-500/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 text-center sm:text-left">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-2xl shrink-0">
                {wheelWinner.emoji}
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center justify-center sm:justify-start gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Le destin a tranché !</span>
                </div>
                <h3 className="font-display font-extrabold text-xl text-slate-900 dark:text-white">
                  {wheelWinner.title}
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onSelectFinalWinner(wheelWinner, 'roue-secours')}
              className="w-full sm:w-auto px-6 h-12 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-display font-bold text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer shrink-0"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>Générer notre Ticket de Soirée</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
