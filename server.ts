import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Route serveur pour générer 6 propositions sur-mesure avec Gemini
  app.post('/api/suggest', async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
        return res.status(503).json({
          error: 'Clé Gemini non configurée côté serveur. Bascule automatique sur le moteur riche local.',
          fallback: true
        });
      }

      const { category, budget, fatigue, ambiance, customNote } = req.body as {
        category: 'eat' | 'watch' | 'weekend';
        budget: '€' | '€€' | '€€€';
        fatigue: 'canape' | 'moyen' | 'motive';
        ambiance: 'chill' | 'drole' | 'decouverte' | 'insolite';
        customNote?: string;
      };

      const categoryText =
        category === 'eat'
          ? 'Ce soir on mange... (idées de repas maison rapides, plats à partager, livraisons ou sorties resto)'
          : category === 'watch'
          ? 'Ce soir on regarde... (films précis, mini-séries, spectacles de stand-up ou documentaires)'
          : 'Ce week-end on fait... (sorties, activités à deux ou entre amis, jeux, escapades)';

      const fatigueText =
        fatigue === 'canape'
          ? 'Canapé total (zéro effort, très rapide ou sans bouger)'
          : fatigue === 'moyen'
          ? 'Moyen (un peu d’énergie, prêt pour 20-30 min de cuisine ou une sortie simple)'
          : 'Motivé (prêt à sortir, cuisiner un vrai plat ou bouger)';

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });

      const prompt = `Tu es le moteur de recommandation de l'application française "MatchSoirée" (écosystème Alphabette).
Génère exactement 6 propositions ultra-ciblées, variées, concrètes et chaleureuses pour un couple ou un duo d'amis qui hésite ce soir.

Paramètres choisis :
- Catégorie : ${categoryText}
- Budget : ${budget}
- Niveau de fatigue : ${fatigueText}
- Ambiance souhaitée : ${ambiance}
- Contrainte ou note libre des joueurs : "${customNote && customNote.trim() ? customNote.trim() : 'Aucune contrainte particulière'}"

Règles strictes :
1. Respecte scrupuleusement la note libre (ex: si la note mentionne des ingrédients comme "œufs et courgettes", propose des recettes concrètes et gourmandes qui les utilisent ; si elle dit "pas de film d'horreur", exclus tout film angoissant).
2. Donne des titres précis, appétissants ou évocateurs en français.
3. Chaque proposition doit avoir un conseil pratique ("practicalTip") malin et concret.`;

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: prompt,
        config: {
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: {
                  type: Type.STRING,
                  description: 'Titre accrocheur et précis (max 55 caractères)'
                },
                subtitle: {
                  type: Type.STRING,
                  description: 'Sous-titre court et concret (max 70 caractères)'
                },
                description: {
                  type: Type.STRING,
                  description: 'Description vivante en 2 phrases courtes expliquant pourquoi c’est génial ce soir'
                },
                durationOrPrep: {
                  type: Type.STRING,
                  description: 'Durée ou temps de préparation (ex: "18 min en cuisine", "1h38 · Comédie", "2h00 · En ville")'
                },
                practicalTip: {
                  type: Type.STRING,
                  description: 'Une astuce concrète de réussite ou de mise en ambiance'
                },
                emoji: {
                  type: Type.STRING,
                  description: 'Un seul emoji représentatif'
                }
              },
              required: ['title', 'subtitle', 'description', 'durationOrPrep', 'practicalTip', 'emoji']
            }
          }
        }
      });

      const rawText = (response.text ?? '[]').trim();
      const parsed = JSON.parse(rawText);

      if (!Array.isArray(parsed) || parsed.length === 0) {
        return res.status(500).json({ error: 'Format IA invalide', fallback: true });
      }

      const cards = parsed.slice(0, 6).map((item, idx) => ({
        id: `ai-${Date.now()}-${idx}`,
        category,
        title: String(item.title || 'Idée Surprise'),
        subtitle: String(item.subtitle || ''),
        description: String(item.description || ''),
        budget,
        fatigue: [fatigue],
        ambiance: [ambiance],
        durationOrPrep: String(item.durationOrPrep || 'Ce soir'),
        practicalTip: String(item.practicalTip || ''),
        keywords: ['ia', 'sur-mesure'],
        emoji: String(item.emoji || '✨'),
        isAiGenerated: true
      }));

      return res.json({ cards });
    } catch (error) {
      console.error('Erreur /api/suggest:', error);
      return res.status(500).json({
        error: error instanceof Error ? error.message : 'Erreur lors de la génération IA',
        fallback: true
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MatchSoirée server running on http://localhost:${PORT}`);
  });
}

startServer();
