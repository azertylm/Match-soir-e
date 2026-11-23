import React, { useMemo, useState } from 'react';
import {
  Check,
  Copy,
  Download,
  PlusCircle,
  RefreshCw,
  Share2,
  Sparkles,
  Ticket
} from 'lucide-react';
import { CategoryId, ValidatedChoice } from '../types';
import { CATEGORY_LABELS } from '../data/ideas';
import { downloadTicketAsPng } from '../utils/sessionCodec';

interface TicketSoireeProps {
  player1Name: string;
  player2Name: string;
  validatedChoices: ValidatedChoice[];
  onAddAnotherCategory: (nextCat: CategoryId) => void;
  onResetAll: () => void;
}

export const TicketSoiree: React.FC<TicketSoireeProps> = ({
  player1Name,
  player2Name,
  validatedChoices,
  onAddAnotherCategory,
  onResetAll
}) => {
  const [copied, setCopied] = useState(false);

  const ticketCode = useMemo(() => {
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `MS-${rand}`;
  }, []);

  const usedCategories = validatedChoices.map((c) => c.category);
  const remainingCategories = (['eat', 'watch', 'weekend'] as CategoryId[]).filter(
    (cat) => !usedCategories.includes(cat)
  );

  const summaryText = useMemo(() => {
    const lines = validatedChoices.map((c) => {
      const label = CATEGORY_LABELS[c.category].title;
      return `• ${label} ${c.card.emoji} *${c.card.title}* (${c.card.durationOrPrep})`;
    });
    return `🎟️ *TICKET MATCHSOIRÉE VALIDÉ* (${player1Name} × ${player2Name})\n\n${lines.join(
      '\n'
    )}\n\n✨ _Validé en 60 secondes sans débat sur MatchSoirée (Alphabette)_`;
  }, [player1Name, player2Name, validatedChoices]);

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(summaryText.replace(/\*/g, '').replace(/_/g, ''));
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // ignore
    }
  };

  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(summaryText)}`;

  const handleDownloadImage = () => {
    downloadTicketAsPng({
      player1Name,
      player2Name,
      choices: validatedChoices,
      ticketCode
    });
  };

  const dateFormatted = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Le Ticket de Soirée perforé */}
      <div className="relative rounded-3xl border-2 border-pink-500/60 bg-white dark:bg-[#1b1130] shadow-2xl overflow-hidden">
        {/* Bandeau supérieur */}
        <div className="bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Ticket className="w-6 h-6" />
            <span className="font-display font-extrabold tracking-tight text-lg">
              TICKET DE SOIRÉE OFFICIEL
            </span>
          </div>
          <span className="font-mono-num text-xs font-bold bg-black/25 px-2.5 py-1 rounded-md">
            #{ticketCode}
          </span>
        </div>

        {/* En-tête Joueurs & Date */}
        <div className="px-6 pt-5 pb-4 border-b border-dashed border-slate-300 dark:border-white/15 flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-pink-300/80 font-semibold">
              Duo / Équipe
            </p>
            <p className="font-display font-extrabold text-xl text-slate-900 dark:text-white">
              {player1Name} <span className="text-pink-500">×</span> {player2Name}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
              Date de séance
            </p>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 capitalize">
              {dateFormatted}
            </p>
          </div>
        </div>

        {/* Corps du Ticket : Cartes validées */}
        <div className="p-6 space-y-5">
          {validatedChoices.map((choice) => {
            const catMeta = CATEGORY_LABELS[choice.category];
            return (
              <div
                key={choice.category}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-[#251742] border border-slate-200/80 dark:border-pink-500/25"
              >
                <div className="flex items-center justify-between text-xs font-semibold text-pink-600 dark:text-amber-400 mb-2">
                  <span>
                    {catMeta.emoji} {catMeta.title}
                  </span>
                  <span>
                    Budget {choice.card.budget} · {choice.card.durationOrPrep}
                  </span>
                </div>

                <h3 className="font-display font-extrabold text-xl sm:text-2xl text-slate-900 dark:text-white mb-1 big-scale-title">
                  {choice.card.emoji} {choice.card.title}
                </h3>
                <p className="text-sm font-medium text-slate-600 dark:text-pink-200 mb-3">
                  {choice.card.subtitle}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                  {choice.card.description}
                </p>
                <div className="pt-2.5 border-t border-slate-200/70 dark:border-white/10 text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                  💡 <strong>Astuce :</strong> {choice.card.practicalTip}
                </div>
              </div>
            );
          })}

          {/* Tampon de validation */}
          <div className="pt-2 flex items-center justify-between">
            <div className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-display font-extrabold text-sm">
              <Sparkles className="w-4 h-4" />
              <span>VALIDÉ SANS DÉBAT · BONNE SOIRÉE !</span>
            </div>
            <span className="text-xs text-slate-400 font-mono-num">alphabette.fr</span>
          </div>
        </div>
      </div>

      {/* Boutons de partage WhatsApp & Export PNG */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 no-print">
        <a
          href={whatsappShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="h-12 px-4 rounded-2xl bg-[#25D366] hover:bg-[#1ebe5b] text-slate-950 font-display font-bold text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer transition-colors"
        >
          <Share2 className="w-4 h-4" />
          <span>Envoyer sur WhatsApp</span>
        </a>

        <button
          type="button"
          onClick={handleDownloadImage}
          className="h-12 px-4 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-500 hover:to-rose-400 text-white font-display font-bold text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Exporter en Image</span>
        </button>

        <button
          type="button"
          onClick={handleCopyText}
          className="h-12 px-4 rounded-2xl border border-slate-300 dark:border-white/15 bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-800 dark:text-white font-display font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-500" />
              <span>Copié !</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copier le Ticket</span>
            </>
          )}
        </button>
      </div>

      {/* Option Combo : Enchaîner sur une autre catégorie (ex: Repas validé -> On regarde quoi ?) */}
      {remainingCategories.length > 0 && (
        <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-[#180f2e] p-5 no-print">
          <p className="text-xs font-bold uppercase tracking-wider text-pink-600 dark:text-pink-400 mb-2">
            Compléter votre Ticket Combo
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
            Ajoutez une deuxième étape à ce même ticket (ex : maintenant que le repas est choisi, on
            regarde quoi ?) :
          </p>
          <div className="flex flex-wrap gap-2.5">
            {remainingCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => onAddAnotherCategory(cat)}
                className="px-4 py-2.5 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 text-pink-700 dark:text-pink-300 font-display font-bold text-sm flex items-center gap-2 cursor-pointer transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Ajouter « {CATEGORY_LABELS[cat].title} »</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Recommencer à zéro */}
      <div className="text-center no-print">
        <button
          type="button"
          onClick={onResetAll}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-pink-500 cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Recommencer une nouvelle session MatchSoirée</span>
        </button>
      </div>
    </div>
  );
};
