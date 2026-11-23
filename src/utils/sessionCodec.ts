import { SharedSessionPayload, ValidatedChoice } from '../types';
import { CATEGORY_LABELS } from '../data/ideas';

/**
 * Encode une session Joueur 1 en Base64 UTF-8 URL-safe pour le partage par lien WhatsApp sans serveur.
 */
export function encodeSessionToBase64(payload: SharedSessionPayload): string {
  try {
    const json = JSON.stringify(payload);
    const bytes = new TextEncoder().encode(json);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  } catch (err) {
    console.error('Erreur encodage session:', err);
    return '';
  }
}

/**
 * Décode une session Base64 URL-safe depuis le paramètre ?s=
 */
export function decodeSessionFromBase64(encoded: string): SharedSessionPayload | null {
  try {
    let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4 !== 0) {
      base64 += '=';
    }
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const json = new TextDecoder().decode(bytes);
    const parsed = JSON.parse(json) as SharedSessionPayload;
    if (!parsed || !Array.isArray(parsed.cards) || !Array.isArray(parsed.p1Likes)) {
      return null;
    }
    return parsed;
  } catch (err) {
    console.error('Erreur décodage session:', err);
    return null;
  }
}

/**
 * Génère et télécharge une vraie image PNG haute résolution du Ticket de Soirée via HTML5 Canvas
 */
export function downloadTicketAsPng(params: {
  player1Name: string;
  player2Name: string;
  choices: ValidatedChoice[];
  ticketCode: string;
}): void {
  const { player1Name, player2Name, choices, ticketCode } = params;
  const canvas = document.createElement('canvas');
  const width = 840;
  const height = choices.length > 1 ? 1160 : 940;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Fond général violet nuit profond ("Soirée / Néon doux")
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#130926');
  bgGrad.addColorStop(1, '#241142');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Halo décoratif doux
  const glowGrad = ctx.createRadialGradient(width / 2, 180, 30, width / 2, 180, 420);
  glowGrad.addColorStop(0, 'rgba(236, 72, 153, 0.22)');
  glowGrad.addColorStop(1, 'rgba(236, 72, 153, 0)');
  ctx.fillStyle = glowGrad;
  ctx.fillRect(0, 0, width, height);

  // Carte du Ticket
  const cardX = 60;
  const cardY = 60;
  const cardW = width - 120;
  const cardH = height - 120;

  ctx.save();
  ctx.fillStyle = '#1b1130';
  ctx.strokeStyle = '#ec4899';
  ctx.lineWidth = 3;
  roundRect(ctx, cardX, cardY, cardW, cardH, 28);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // Bandeau supérieur
  ctx.fillStyle = '#db2777';
  roundRect(ctx, cardX + 28, cardY + 28, cardW - 56, 74, 16);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 26px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('MATCHSOIRÉE · TICKET DE VALIDATION', width / 2, cardY + 74);

  // Duo & Date
  const dateStr = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });
  ctx.fillStyle = '#f472b6';
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText(`${player1Name}  ×  ${player2Name}`, width / 2, cardY + 148);

  ctx.fillStyle = '#cbd5e1';
  ctx.font = '18px sans-serif';
  ctx.fillText(`Validé le ${dateStr} · Fini le débat !`, width / 2, cardY + 180);

  // Ligne pointillée de ticket
  ctx.strokeStyle = 'rgba(255,255,255,0.18)';
  ctx.setLineDash([10, 8]);
  ctx.beginPath();
  ctx.moveTo(cardX + 36, cardY + 210);
  ctx.lineTo(cardX + cardW - 36, cardY + 210);
  ctx.stroke();
  ctx.setLineDash([]);

  // Affichage des choix validés
  let currentY = cardY + 250;
  choices.forEach((choice) => {
    const catMeta = CATEGORY_LABELS[choice.category];
    ctx.fillStyle = '#291a47';
    ctx.strokeStyle = 'rgba(244, 114, 182, 0.35)';
    ctx.lineWidth = 2;
    roundRect(ctx, cardX + 36, currentY, cardW - 72, 235, 20);
    ctx.fill();
    ctx.stroke();

    ctx.textAlign = 'left';
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 17px sans-serif';
    ctx.fillText(
      `${catMeta.emoji}  ${catMeta.title.toUpperCase()}  ·  BUDGET ${choice.card.budget}`,
      cardX + 62,
      currentY + 42
    );

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 27px sans-serif';
    const titleLines = wrapText(ctx, `${choice.card.emoji} ${choice.card.title}`, cardW - 124);
    titleLines.slice(0, 2).forEach((line, idx) => {
      ctx.fillText(line, cardX + 62, currentY + 84 + idx * 34);
    });

    const offsetAfterTitle = titleLines.length > 1 ? currentY + 150 : currentY + 122;
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '19px sans-serif';
    const subLines = wrapText(ctx, choice.card.subtitle, cardW - 124);
    subLines.slice(0, 2).forEach((line, idx) => {
      ctx.fillText(line, cardX + 62, offsetAfterTitle + idx * 26);
    });

    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 17px sans-serif';
    ctx.fillText(`⏱ ${choice.card.durationOrPrep}`, cardX + 62, currentY + 212);

    currentY += 260;
  });

  // Tampon officiel en bas
  ctx.textAlign = 'center';
  ctx.fillStyle = '#10b981';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText('✓ SOIRÉE VALIDÉE À L’UNANIMITÉ', width / 2, height - 150);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '16px monospace';
  ctx.fillText(`CODE TICKET : #${ticketCode}  ·  ALPHABETTE.FR`, width / 2, height - 110);

  // Déclenchement du téléchargement
  const dataUrl = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.download = `ticket-matchsoiree-${ticketCode.toLowerCase()}.png`;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (ctx.measureText(testLine).width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}
