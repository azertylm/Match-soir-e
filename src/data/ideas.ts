import { AmbianceType, BudgetLevel, CategoryId, ConstraintsState, FatigueLevel, IdeaCard } from '../types';

export const OFFLINE_IDEAS: IdeaCard[] = [
  // ==========================================
  // CATÉGORIE 1 : CE SOIR ON MANGE... (24 idées)
  // ==========================================
  {
    id: 'eat-1',
    category: 'eat',
    title: 'Ramen Maison Express & Œuf Mollet',
    subtitle: 'Bouillon umami au miso, nouilles & toppings',
    description: 'Un bol ultra-réconfortant prêt en 15 minutes avec bouillon parfumé au gingembre, œuf mollet coulant, oignons nouveaux et huile pimentée.',
    budget: '€',
    fatigue: ['canape', 'moyen'],
    ambiance: ['chill', 'decouverte'],
    durationOrPrep: '15 min en cuisine',
    practicalTip: 'Œuf plongé 6 min 15 dans l’eau frémissante + 1 c.à.s de beurre de cacahuète dans le bouillon.',
    keywords: ['oeufs', 'œufs', 'ramen', 'soupe', 'japonais', 'asiatique', 'rapide', 'chaud', 'nouilles'],
    emoji: '🍜'
  },
  {
    id: 'eat-2',
    category: 'eat',
    title: 'Shakshuka Courgettes, Feta & Œufs Pochés',
    subtitle: 'Poêlée méditerranéenne fondante à tremper au pain',
    description: 'Des courgettes rôties à l’ail et au cumin dans une sauce tomate mijotée, où l’on casse des œufs frais juste avant d’émietter de la feta.',
    budget: '€',
    fatigue: ['moyen', 'canape'],
    ambiance: ['chill', 'decouverte'],
    durationOrPrep: '20 min · 1 seule poêle',
    practicalTip: 'Prévois une belle baguette croustillante ou du pain pita grillé pour saucer jusqu’à la dernière goutte.',
    keywords: ['oeufs', 'œufs', 'courgettes', 'courgette', 'végétarien', 'feta', 'tomate', 'poêlée', 'maison'],
    emoji: '🍳'
  },
  {
    id: 'eat-3',
    category: 'eat',
    title: 'Frittata Dorée Courgettes & Parmesan',
    subtitle: 'Omelette épaisse à l’italienne dorée au four',
    description: 'Idéal pour vider le frigo avec style : courgettes finement tranchées, œufs battus au parmesan affiné et basilic frais.',
    budget: '€',
    fatigue: ['canape', 'moyen'],
    ambiance: ['chill', 'drole'],
    durationOrPrep: '18 min chrono',
    practicalTip: 'Sers-la coupée en parts comme une pizza avec une salade roquette-citron.',
    keywords: ['oeufs', 'œufs', 'courgettes', 'courgette', 'omelette', 'italien', 'fromage', 'rapide'],
    emoji: '🥧'
  },
  {
    id: 'eat-4',
    category: 'eat',
    title: 'Croque-Monsieur Truffé à la Poêle',
    subtitle: 'Pain de mie doré au beurre, comté 18 mois & jambon',
    description: 'Le grand classique du vendredi soir revisité à la poêle avec une béchamel minute à la moutarde à l’ancienne et une pointe d’huile de truffe.',
    budget: '€',
    fatigue: ['canape'],
    ambiance: ['chill', 'drole'],
    durationOrPrep: '12 min · Zéro prise de tête',
    practicalTip: 'Grille l’extérieur avec une fine couche de mayonnaise à la place du beurre : croustillant inégalable.',
    keywords: ['fromage', 'pain', 'croque', 'jambon', 'rapide', 'canapé', 'confort'],
    emoji: '🥪'
  },
  {
    id: 'eat-5',
    category: 'eat',
    title: 'Tacos Bar Maison & Guacamole Écrasé',
    subtitle: 'Chacun assemble ses tortillas directement à table',
    description: 'On pose tous les petits bols au milieu de la table : tortillas chaudes, haricots noirs épicés, poulet ou halloumi grillé, citron vert et coriandre.',
    budget: '€€',
    fatigue: ['moyen', 'motive'],
    ambiance: ['drole', 'chill'],
    durationOrPrep: '25 min · Ultra convivial',
    practicalTip: 'Chauffe les tortillas à sec 30 secondes par face dans une poêle brûlante.',
    keywords: ['mexicain', 'tacos', 'avocat', 'partage', 'poulet', 'épices', 'convivial'],
    emoji: '🌮'
  },
  {
    id: 'eat-6',
    category: 'eat',
    title: 'Pâtes Cacio e Pepe & Citron Zesté',
    subtitle: '3 ingrédients, émulsion crémeuse sans crème',
    description: 'Le secret des trattorias romaines : spaghetti al dente, pecorino romano fraîchement râpé, poivre noir concassé torréfié et eau de cuisson.',
    budget: '€',
    fatigue: ['canape', 'moyen'],
    ambiance: ['chill', 'decouverte'],
    durationOrPrep: '14 min',
    practicalTip: 'Mélange le fromage avec une louche d’eau de cuisson tiède hors du feu pour éviter les fils.',
    keywords: ['pâtes', 'italien', 'fromage', 'végétarien', 'rapide', 'simple'],
    emoji: '🍝'
  },
  {
    id: 'eat-7',
    category: 'eat',
    title: 'Pizza Napolitaine à Partager en Livraison',
    subtitle: 'Une Margherita Burrata + une Diavola piquante',
    description: 'Zéro vaisselle ce soir : on commande deux belles pizzas au levain avec croûte léopard et on mange à même le carton sur la table basse.',
    budget: '€€',
    fatigue: ['canape'],
    ambiance: ['chill', 'drole'],
    durationOrPrep: '30 min · Livraison ou à emporter',
    practicalTip: 'Passe les parts 90 secondes à la poêle chaude à l’arrivée pour redonner tout son croustillant à la pâte.',
    keywords: ['pizza', 'italien', 'livraison', 'fromage', 'canapé', 'sans cuisiner'],
    emoji: '🍕'
  },
  {
    id: 'eat-8',
    category: 'eat',
    title: 'Smash Burgers Maison & Potatoes Croustillantes',
    subtitle: 'Buns briochés toastés, cheddar fondu & sauce secrète',
    description: 'Steaks écrasés très fins sur fonte brûlante pour une croûte caramélisée, cornichons croquants, oignons fondants et sauce burger maison.',
    budget: '€€',
    fatigue: ['moyen', 'motive'],
    ambiance: ['drole', 'chill'],
    durationOrPrep: '25 min',
    practicalTip: 'Sauce secrète : 2 c.à.s mayo, 1 c.à.c ketchup, 1 c.à.c moutarde, cornichons hachés et paprika fumé.',
    keywords: ['burger', 'viande', 'frites', 'fromage', 'gourmand', 'américain'],
    emoji: '🍔'
  },
  {
    id: 'eat-9',
    category: 'eat',
    title: 'Planche Apéro Géante & Camembert Rôti au Miel',
    subtitle: 'On remplace le dîner par un festin à picorer',
    description: 'Un camembert entier quadrillé au four avec romarin, miel et noix, entouré de charcuteries, crudités croquantes, raisins et gressins.',
    budget: '€€',
    fatigue: ['canape'],
    ambiance: ['chill', 'drole'],
    durationOrPrep: '15 min au four',
    practicalTip: 'Ajoute une gousse d’ail en chemise plantée au cœur du camembert avant d’enfourner à 190°C.',
    keywords: ['fromage', 'apéro', 'planche', 'vin', 'camembert', 'sans cuisiner', 'canapé'],
    emoji: '🧀'
  },
  {
    id: 'eat-10',
    category: 'eat',
    title: 'Sortie Bistrot de Quartier & Plat du Jour',
    subtitle: 'Nappe à carreaux, lumière tamisée & dessert à deux',
    description: 'On pose les téléphones, on sort à pied jusqu’au bistrot du coin pour savourer une cuisine mijotée et refaire le monde.',
    budget: '€€€',
    fatigue: ['motive', 'moyen'],
    ambiance: ['decouverte', 'chill'],
    durationOrPrep: '1h30 · Sortie resto',
    practicalTip: 'Choisissez chacun un plat différent et échangez vos assiettes à mi-parcours.',
    keywords: ['resto', 'restaurant', 'sortie', 'français', 'bistrot', 'vin'],
    emoji: '🍷'
  },
  {
    id: 'eat-11',
    category: 'eat',
    title: 'Pad Thaï Express aux Crevettes ou Tofu Croustillant',
    subtitle: 'Nouilles de riz sautées, tamarin, citron vert & cacahuètes',
    description: 'L’équilibre parfait entre sucré, acidulé et salé avec des germes de soja croquants, de l’œuf brouillé au wok et des cacahuètes concassées.',
    budget: '€€',
    fatigue: ['moyen'],
    ambiance: ['decouverte', 'chill'],
    durationOrPrep: '20 min au wok',
    practicalTip: 'Trempe les nouilles de riz dans l’eau tiède 15 min au lieu de les bouillir : elles ne colleront jamais au wok.',
    keywords: ['thaï', 'asiatique', 'nouilles', 'oeufs', 'œufs', 'crevettes', 'tofu', 'wok'],
    emoji: '🥡'
  },
  {
    id: 'eat-12',
    category: 'eat',
    title: 'Dégustation à l’Aveugle : Mezze Libanais',
    subtitle: 'Houmous, moutabal, falafels chauds & taboulé vert',
    description: 'Une table remplie de petites assiettes parfumées à partager avec les doigts et du pain libanais tiède.',
    budget: '€€',
    fatigue: ['canape', 'moyen'],
    ambiance: ['decouverte', 'insolite'],
    durationOrPrep: 'À emporter ou 20 min',
    practicalTip: 'Chacun ferme les yeux pour deviner les épices de 3 bouchées servies par l’autre.',
    keywords: ['libanais', 'mezze', 'végétarien', 'houmous', 'partage', 'livraison'],
    emoji: '🧆'
  },
  {
    id: 'eat-13',
    category: 'eat',
    title: 'Risotto Crémeux Champignons & Noisettes Torréfiées',
    subtitle: 'On touille à deux un verre à la main en musique',
    description: 'Un vrai moment complice en cuisine : riz carnaroli nacré, bouillon fumant versé louche par louche, champignons poêlés et parmesan.',
    budget: '€€',
    fatigue: ['moyen', 'motive'],
    ambiance: ['chill', 'decouverte'],
    durationOrPrep: '30 min en duo',
    practicalTip: 'Les noisettes concassées grillées à sec ajoutées au dernier moment changent tout.',
    keywords: ['italien', 'risotto', 'champignons', 'végétarien', 'cuisine à deux'],
    emoji: '🍄'
  },
  {
    id: 'eat-14',
    category: 'eat',
    title: 'Crêpes Party Salées & Sucrées Improvisée',
    subtitle: 'Galettes complètes œuf-jambon-fromage & crêpes flambées',
    description: 'Même sans Chandeleur, rien ne bat une pile de crêpes chaudes garnies à la demande : œuf miroir, emmental, champignons ou chocolat noir.',
    budget: '€',
    fatigue: ['moyen'],
    ambiance: ['drole', 'chill'],
    durationOrPrep: '25 min',
    practicalTip: 'Défi : chacun doit réussir à faire sauter au moins une crêpe de la main gauche.',
    keywords: ['oeufs', 'œufs', 'crêpes', 'fromage', 'breton', 'drôle', 'économique'],
    emoji: '🥞'
  },
  {
    id: 'eat-15',
    category: 'eat',
    title: 'Izakaya Japonais ou Bar à Gyozas en Ville',
    subtitle: 'Raviolis grillés, edamame au sel fumé & brochettes yakitori',
    description: 'On sort découvrir un comptoir japonais animé pour enchaîner les petites assiettes brûlantes dans une ambiance néon tokyoïte.',
    budget: '€€€',
    fatigue: ['motive'],
    ambiance: ['insolite', 'decouverte'],
    durationOrPrep: '1h30 · Sortie resto',
    practicalTip: 'Demande à être installé au comptoir face à la cuisine ouverte pour le spectacle.',
    keywords: ['japonais', 'resto', 'sortie', 'gyoza', 'sushi', 'insolite'],
    emoji: '🥟'
  },
  {
    id: 'eat-16',
    category: 'eat',
    title: 'Gnocchis Rôtis au Four, Tomates Cerises & Burrata',
    subtitle: 'Tout sur une plaque de cuisson, zéro casserole à laver',
    description: 'Des gnocchis directement enfournés avec un filet d’huile d’olive, des tomates cerises qui éclatent, de l’ail et une burrata fraîche posée dessus.',
    budget: '€',
    fatigue: ['canape'],
    ambiance: ['chill'],
    durationOrPrep: '20 min au four · 0 effort',
    practicalTip: 'Ne fais pas bouillir les gnocchis avant : au four à 210°C ils deviennent croustillants dehors et fondants dedans.',
    keywords: ['gnocchis', 'italien', 'burrata', 'fromage', 'four', 'rapide', 'végétarien'],
    emoji: '🍅'
  },
  {
    id: 'eat-17',
    category: 'eat',
    title: 'Pique-Nique de Salon sur Tapis & Coussins',
    subtitle: 'On interdit la table : dîner aux bougies à même le tapis',
    description: 'Focaccia tiède, antipasti, olives marinées, houmous, fruits frais et bougies disposés sur un plaid au milieu du salon.',
    budget: '€€',
    fatigue: ['canape'],
    ambiance: ['insolite', 'chill'],
    durationOrPrep: '10 min de mise en place',
    practicalTip: 'Lance une playlist vinyle jazz ou bossa nova et éteins le plafonnier.',
    keywords: ['insolite', 'salon', 'apéro', 'focaccia', 'romantique', 'canapé'],
    emoji: '🕯️'
  },
  {
    id: 'eat-18',
    category: 'eat',
    title: 'Curry Vert Thaï Coco & Légumes Croquants',
    subtitle: 'Courgettes, poivrons, lait de coco & riz jasmin',
    description: 'Un curry parfumé à la citronnelle et au basilic thaï où les courgettes et légumes du frigo mijotent doucement dans le lait de coco.',
    budget: '€',
    fatigue: ['moyen'],
    ambiance: ['decouverte', 'chill'],
    durationOrPrep: '22 min',
    practicalTip: 'Fais revenir la pâte de curry 2 minutes dans la crème épaisse du haut de la boîte de lait de coco.',
    keywords: ['courgettes', 'courgette', 'curry', 'coco', 'riz', 'asiatique', 'végétarien'],
    emoji: '🍛'
  },
  {
    id: 'eat-19',
    category: 'eat',
    title: 'Festin Indien en Livraison : Naans Fromage & Tikka Masala',
    subtitle: 'Plats mijotés aux épices douces à partager au milieu',
    description: 'Un Palak Paneer aux épinards, un Poulet ou Chana Tikka Masala, du riz basmati au safran et des cheese naans brûlants.',
    budget: '€€',
    fatigue: ['canape'],
    ambiance: ['chill', 'decouverte'],
    durationOrPrep: '35 min · Livraison',
    practicalTip: 'Commande un naan supplémentaire pour le lendemain matin grillé au grille-pain.',
    keywords: ['indien', 'naan', 'curry', 'livraison', 'fromage', 'épices'],
    emoji: '🫓'
  },
  {
    id: 'eat-20',
    category: 'eat',
    title: 'Défi Top Chef Frigo : Boîte Mystère en 20 Minutes',
    subtitle: 'Chaque joueur choisit 2 ingrédients imposés dans le placard',
    description: 'Transformez les restes du frigo (œufs, légumes, épices, conserves) en assiette de restaurant avec dressage soigné et note sur 10.',
    budget: '€',
    fatigue: ['moyen', 'motive'],
    ambiance: ['drole', 'insolite'],
    durationOrPrep: '20 min chrono',
    practicalTip: 'Lance un minuteur de 20 minutes et commente la fin à voix haute comme à la télé.',
    keywords: ['oeufs', 'œufs', 'courgettes', 'frigo', 'défi', 'drôle', 'insolite', 'maison'],
    emoji: '👨‍🍳'
  },
  {
    id: 'eat-21',
    category: 'eat',
    title: 'Restaurant Gastronomique ou Menu Carte Blanche',
    subtitle: 'Accords mets & surprises sans regarder la carte avant',
    description: 'Une vraie grande soirée : vous réservez une table créative qui propose un menu surprise en 4 ou 5 temps.',
    budget: '€€€',
    fatigue: ['motive'],
    ambiance: ['insolite', 'decouverte'],
    durationOrPrep: '2h15 · Grande soirée',
    practicalTip: 'Signalez simplement vos éventuelles allergies et laissez le chef vous surprendre.',
    keywords: ['resto', 'gastronomique', 'surprise', 'chic', 'sortie'],
    emoji: '✨'
  },
  {
    id: 'eat-22',
    category: 'eat',
    title: 'Quesadillas Croustillantes Cheddar, Courgettes & Œuf',
    subtitle: 'Tortillas grillées à la poêle, cœur ultra-filant',
    description: 'On garnit des tortillas de fromage râpé, dés de courgettes sautés au paprika, haricots rouges ou œuf brouillé, puis on plie et on grille.',
    budget: '€',
    fatigue: ['canape', 'moyen'],
    ambiance: ['chill', 'drole'],
    durationOrPrep: '15 min',
    practicalTip: 'Coupe en triangles comme une tarte et sers avec du yaourt grec citronné.',
    keywords: ['courgettes', 'courgette', 'oeufs', 'œufs', 'fromage', 'mexicain', 'rapide'],
    emoji: '🧀'
  },
  {
    id: 'eat-23',
    category: 'eat',
    title: 'Poke Bowl Maison Saumon, Avocat & Mangue',
    subtitle: 'Riz vinaigré tiède, garnitures fraîches & sésame grillé',
    description: 'Fraîcheur maximale sans cuisson compliquée : riz à sushi, dés d’avocat, concombre, mangue, edamame et sauce soja-sésame.',
    budget: '€€',
    fatigue: ['canape', 'moyen'],
    ambiance: ['chill', 'decouverte'],
    durationOrPrep: '18 min',
    practicalTip: 'Ajoute des oignons frits croustillants au moment de servir pour le contraste de texture.',
    keywords: ['poke', 'saumon', 'frais', 'avocat', 'riz', 'léger'],
    emoji: '🥗'
  },
  {
    id: 'eat-24',
    category: 'eat',
    title: 'Bar à Tapas & Pintxos en Terrasse Couverte',
    subtitle: 'Tortilla fondante, patatas bravas & croquetas maison',
    description: 'Ambiance espagnole chaleureuse : on commande au fur et à mesure de la soirée sans s’engager sur un plat unique.',
    budget: '€€€',
    fatigue: ['motive', 'moyen'],
    ambiance: ['drole', 'decouverte'],
    durationOrPrep: '1h45 · Sortie animée',
    practicalTip: 'Commencez par 3 tapas seulement, puis recommandez ce qui vous fait de l’œil aux tables voisines.',
    keywords: ['tapas', 'espagnol', 'sortie', 'bar', 'partage', 'tortilla', 'oeufs'],
    emoji: '🇪🇸'
  },

  // ==========================================
  // CATÉGORIE 2 : CE SOIR ON REGARDE... (24 idées)
  // ==========================================
  {
    id: 'watch-1',
    category: 'watch',
    title: 'Comédie Culte Française des Années 90-2000',
    subtitle: 'Le Dîner de Cons, La Cité de la Peur ou OSS 117',
    description: 'Des répliques que l’on connaît par cœur mais qui font toujours rire aux éclats dès les dix premières minutes. Zéro risque de déception.',
    budget: '€',
    fatigue: ['canape'],
    ambiance: ['drole', 'chill'],
    durationOrPrep: '1h30 · Sans horreur',
    practicalTip: 'Format court (moins de 1h35), parfait quand on est fatigué et qu’on veut juste rire.',
    keywords: ['comédie', 'drôle', 'français', 'culte', '90s', 'court', 'sans horreur'],
    emoji: '🎬'
  },
  {
    id: 'watch-2',
    category: 'watch',
    title: 'Whodunit Moderne : À Couteaux Tirés (Knives Out)',
    subtitle: 'Enquête à tiroirs, manoir cosy, humour & casting 5 étoiles',
    description: 'Qui est le coupable ? Un jeu de Cluedo géant malin et rythmé où vous allez passer la soirée à parier sur le suspect idéal.',
    budget: '€',
    fatigue: ['canape', 'moyen'],
    ambiance: ['drole', 'decouverte'],
    durationOrPrep: '2h05 · Enquête ludique',
    practicalTip: 'À la 45e minute, mettez pause 30 secondes et notez chacun votre suspect sur un bout de papier.',
    keywords: ['enquête', 'policier', 'mystère', 'drôle', 'sans horreur', 'film'],
    emoji: '🕵️'
  },
  {
    id: 'watch-3',
    category: 'watch',
    title: 'Chef-d’œuvre Studio Ghibli (Chihiro ou Château Ambulant)',
    subtitle: 'Parenthèse enchantée, décors peints à la main & musique céleste',
    description: 'Une bulle de douceur visuelle et poétique qui fait instantanément oublier la semaine de travail.',
    budget: '€',
    fatigue: ['canape'],
    ambiance: ['chill', 'decouverte'],
    durationOrPrep: '2h00 · Douceur absolue',
    practicalTip: 'Idéal sous un plaid avec une tisane ou un chocolat chaud après un bon ramen.',
    keywords: ['animation', 'japonais', 'ghibli', 'doux', 'poétique', 'sans horreur', 'chill'],
    emoji: '🏯'
  },
  {
    id: 'watch-4',
    category: 'watch',
    title: 'Feel-Good Movie : The Grand Budapest Hotel',
    subtitle: 'Esthétique pastel signée Wes Anderson & aventure rocambolesque',
    description: 'Une cavale trépidante, drôle et visuellement millimétrée dans un grand hôtel imaginaire d’Europe de l’Est.',
    budget: '€',
    fatigue: ['canape', 'moyen'],
    ambiance: ['drole', 'insolite'],
    durationOrPrep: '1h39 · Rythme soutenu',
    practicalTip: 'Moins de 1h40 au compteur, pas une seule seconde d’ennui.',
    keywords: ['comédie', 'wes anderson', 'esthétique', 'court', 'sans horreur', 'original'],
    emoji: '🏨'
  },
  {
    id: 'watch-5',
    category: 'watch',
    title: 'Mini-Série à Suspense (2 Épisodes seulement)',
    subtitle: 'Severance, The White Lotus ou Lupin',
    description: 'Format 2 x 48 minutes : l’engagement parfait quand un film semble trop long mais qu’on veut une vraie claque scénaristique.',
    budget: '€',
    fatigue: ['canape', 'moyen'],
    ambiance: ['decouverte', 'insolite'],
    durationOrPrep: '2 x 45 min',
    practicalTip: 'Fixez la règle avant de lancer : maximum 2 épisodes ce soir pour garder le plaisir pour demain.',
    keywords: ['série', 'suspense', 'mystère', 'court', 'sans horreur'],
    emoji: '📺'
  },
  {
    id: 'watch-6',
    category: 'watch',
    title: 'Spectacle de Stand-Up Complet (1h de Fou Rire)',
    subtitle: 'Roman Frayssinet, Paul Mirabel, Haroun ou Florence Foresti',
    description: 'Pas besoin de suivre une intrigue complexe : 60 minutes de punchlines pures pour relâcher toute la pression de la semaine.',
    budget: '€',
    fatigue: ['canape'],
    ambiance: ['drole', 'chill'],
    durationOrPrep: '1h05 · Format ultra-court',
    practicalTip: 'Parfait si l’un de vous deux risque de s’endormir à 22h30.',
    keywords: ['stand-up', 'humour', 'drôle', 'court', 'spectacle', 'sans horreur'],
    emoji: '🎤'
  },
  {
    id: 'watch-7',
    category: 'watch',
    title: 'Comédie Romantique Intelligente : Il Était Temps (About Time)',
    subtitle: 'Voyage dans le temps doux-amer, humour britannique & émotion',
    description: 'Loin des clichés habituels : une histoire lumineuse sur le bonheur des petites journées ordinaires avec Bill Nighy et Rachel McAdams.',
    budget: '€',
    fatigue: ['canape'],
    ambiance: ['chill', 'drole'],
    durationOrPrep: '2h03 · Cœur chaud garanti',
    practicalTip: 'Préparez quand même un mouchoir pour les 15 dernières minutes (émotion positive garantie).',
    keywords: ['romance', 'comédie', 'couple', 'émotion', 'anglais', 'sans horreur'],
    emoji: '⏳'
  },
  {
    id: 'watch-8',
    category: 'watch',
    title: 'Film de Braquage Stylé : Ocean’s Eleven ou Baby Driver',
    subtitle: 'Plan millimétré, bande-son électrique & pur divertissement',
    description: 'Des personnages ultra-charismatiques, un casse impossible et un montage au cordeau qui maintient le sourire du début à la fin.',
    budget: '€',
    fatigue: ['canape', 'moyen'],
    ambiance: ['chill', 'drole'],
    durationOrPrep: '1h55 · Fun immédiat',
    practicalTip: 'Montez le son : la bande originale porte 50% du plaisir du film.',
    keywords: ['action', 'braquage', 'musique', 'fun', 'sans horreur', 'divertissement'],
    emoji: '🎰'
  },
  {
    id: 'watch-9',
    category: 'watch',
    title: 'Documentaire Fascinant : La Sagesse de la Pieuvre',
    subtitle: 'Ou Chef’s Table Pizza — images sublimes & histoire vraie',
    description: 'Une immersion hypnotique dans un univers réel raconté comme un grand récit d’aventure.',
    budget: '€',
    fatigue: ['canape'],
    ambiance: ['decouverte', 'chill'],
    durationOrPrep: '1h25 · Format court',
    practicalTip: 'Chef’s Table Pizza dure 45 minutes par épisode : idéal en mangeant vos propres pizzas.',
    keywords: ['documentaire', 'nature', 'cuisine', 'court', 'découverte', 'sans horreur'],
    emoji: '🐙'
  },
  {
    id: 'watch-10',
    category: 'watch',
    title: 'Sci-Fi Vertigineuse : Everything Everywhere All at Once',
    subtitle: 'Ou Premier Contact (Arrival) — grand cinéma créatif',
    description: 'Pour une soirée où l’on a envie d’être surpris par une idée de cinéma totalement hors normes et d’en discuter pendant une heure après.',
    budget: '€',
    fatigue: ['moyen', 'motive'],
    ambiance: ['insolite', 'decouverte'],
    durationOrPrep: '2h10 · Expérience totale',
    practicalTip: 'Ne lisez aucun résumé détaillé avant de lancer : la surprise fait toute la magie.',
    keywords: ['science-fiction', 'sci-fi', 'original', 'insolite', 'oscar', 'sans horreur'],
    emoji: '🪐'
  },
  {
    id: 'watch-11',
    category: 'watch',
    title: 'Animation Moderne Éblouissante : Spider-Man Across the Spider-Verse',
    subtitle: 'Ou Coco / Soul (Pixar) — claque graphique & émotionnelle',
    description: 'Chaque plan ressemble à une œuvre d’art vivante, avec un rythme effréné et une bande-son mémorable.',
    budget: '€',
    fatigue: ['canape', 'moyen'],
    ambiance: ['decouverte', 'drole'],
    durationOrPrep: '1h50',
    practicalTip: 'Même si vous n’êtes pas fans de super-héros, la créativité visuelle met tout le monde d’accord.',
    keywords: ['animation', 'pixar', 'visuel', 'musique', 'sans horreur'],
    emoji: '🎨'
  },
  {
    id: 'watch-12',
    category: 'watch',
    title: 'Thriller Coréen Haletant : Parasite',
    subtitle: 'Humour noir, rebondissements imprévisibles & mise en scène de génie',
    description: 'La Palme d’Or qui commence comme une comédie sociale malicieuse avant de basculer dans un suspense implacable.',
    budget: '€',
    fatigue: ['moyen', 'motive'],
    ambiance: ['decouverte', 'insolite'],
    durationOrPrep: '2h12 · Suspense',
    practicalTip: 'Regardez-le en VO sous-titrée pour profiter du jeu d’acteur exceptionnel.',
    keywords: ['thriller', 'coréen', 'suspense', 'palme', 'chef-d-oeuvre'],
    emoji: '🍑'
  },
  {
    id: 'watch-13',
    category: 'watch',
    title: 'Soirée Cinéma Indépendant en Salle + Pop-Corn',
    subtitle: 'On sort voir une séance de 20h45 dans le cinéma d’art & essai',
    description: 'Rien ne remplace le grand écran noir, le son enveloppant et le plaisir de débriefer le film en marchant au retour.',
    budget: '€€',
    fatigue: ['motive', 'moyen'],
    ambiance: ['decouverte', 'chill'],
    durationOrPrep: '2h30 · Sortie ciné',
    practicalTip: 'Mélangez pop-corn salé et sucré dans le même seau : le compromis ultime.',
    keywords: ['cinéma', 'sortie', 'salle', 'pop-corn', 'film'],
    emoji: '🍿'
  },
  {
    id: 'watch-14',
    category: 'watch',
    title: 'Série Courte & Ultra-Rythmée : The Bear (2 Épisodes)',
    subtitle: 'Immersion électrique dans les coulisses d’un restaurant de Chicago',
    description: 'Des épisodes de 28 minutes d’une intensité rare, portés par des personnages attachants et une passion contagieuse pour la cuisine.',
    budget: '€',
    fatigue: ['canape', 'moyen'],
    ambiance: ['decouverte', 'chill'],
    durationOrPrep: '2 x 28 min · Format court',
    practicalTip: 'Attention : ne regardez jamais The Bear le ventre vide !',
    keywords: ['série', 'cuisine', 'court', 'intense', 'sans horreur'],
    emoji: '🔪'
  },
  {
    id: 'watch-15',
    category: 'watch',
    title: 'Pépite Musicale Feel-Good : Sing Street ou La La Land',
    subtitle: 'Énergie contagieuse, humour & chansons qui restent en tête',
    description: 'Dans le Dublin des années 80, un ado monte un groupe de rock pour impressionner une fille : drôle, tendre et irrésistible.',
    budget: '€',
    fatigue: ['canape'],
    ambiance: ['chill', 'drole'],
    durationOrPrep: '1h46 · Bonne humeur pure',
    practicalTip: 'Impossible de ne pas taper du pied dès la deuxième chanson.',
    keywords: ['musique', 'feel-good', '80s', 'comédie', 'sans horreur'],
    emoji: '🎸'
  },
  {
    id: 'watch-16',
    category: 'watch',
    title: 'Jeu Télé / Détente : LOL Qui Rit Sort ou Burger Quiz',
    subtitle: 'Zéro concentration requise, fous rires en rafale',
    description: 'Quand les cerveaux sont à 5% de batterie : deux épisodes où le seul objectif est de ne pas éclater de rire en même temps que les candidats.',
    budget: '€',
    fatigue: ['canape'],
    ambiance: ['drole', 'chill'],
    durationOrPrep: '2 x 35 min',
    practicalTip: 'Jouez vous aussi : le premier de vous deux qui sourit pendant les phases de duel fait la vaisselle.',
    keywords: ['jeu', 'humour', 'drôle', 'canapé', 'court', 'sans horreur'],
    emoji: '😂'
  },
  {
    id: 'watch-17',
    category: 'watch',
    title: 'Aventure & Dépaysement : La Vie Rêvée de Walter Mitty',
    subtitle: 'Paysages d’Islande, bande-son indie & envie de grand air',
    description: 'Un employé discret quitte son bureau pour une aventure réelle aux quatre coins du monde. Une bouffée d’oxygène sur grand écran.',
    budget: '€',
    fatigue: ['canape'],
    ambiance: ['chill', 'decouverte'],
    durationOrPrep: '1h54 · Évasion garantie',
    practicalTip: 'Le film idéal pour donner des idées de prochain voyage à deux.',
    keywords: ['aventure', 'voyage', 'feel-good', 'paysages', 'sans horreur'],
    emoji: '🏔️'
  },
  {
    id: 'watch-18',
    category: 'watch',
    title: 'Soirée Nanar & Commentaires de Salon',
    subtitle: 'Un film d’action kitsch des années 90 où il est obligatoire de commenter',
    description: 'Ici on a le droit (et le devoir) de parler pendant le film, de doubler les dialogues absurdes et de compter les incohérences.',
    budget: '€',
    fatigue: ['canape', 'moyen'],
    ambiance: ['drole', 'insolite'],
    durationOrPrep: '1h30 de fous rires',
    practicalTip: 'Coupez le son pendant 2 minutes au milieu du film et improvisez les voix des personnages.',
    keywords: ['drôle', 'insolite', '90s', 'action', 'nanar', 'sans horreur'],
    emoji: '🦖'
  },
  {
    id: 'watch-19',
    category: 'watch',
    title: 'Classique du Suspense Hitchcokien : Fenêtre sur Cour',
    subtitle: 'Huis clos estival, jumelles, humour fin & tension élégante',
    description: 'Un photographe immobilisé observe ses voisins depuis son appartement : le maître absolu du suspense ludique, sans aucune violence graphique.',
    budget: '€',
    fatigue: ['canape'],
    ambiance: ['decouverte', 'chill'],
    durationOrPrep: '1h52 · Classique intemporel',
    practicalTip: 'Toujours aussi moderne et captivant 70 ans après sa sortie.',
    keywords: ['classique', 'suspense', 'enquête', 'hitchcock', 'sans horreur'],
    emoji: '🔭'
  },
  {
    id: 'watch-20',
    category: 'watch',
    title: 'Comédie d’Action Duo : The Nice Guys (Ryan Gosling & Russell Crowe)',
    subtitle: 'Détectives maladroits à Los Angeles dans les années 70',
    description: 'L’un des meilleurs buddy-movies modernes : gags visuels hilarants, enquête tordue et alchimie comique irrésistible.',
    budget: '€',
    fatigue: ['canape', 'moyen'],
    ambiance: ['drole', 'decouverte'],
    durationOrPrep: '1h56',
    practicalTip: 'Ryan Gosling en détective gaffeur offre l’une des performances les plus drôles de sa carrière.',
    keywords: ['comédie', 'action', 'enquête', 'drôle', '70s', 'sans horreur'],
    emoji: '🕶️'
  },
  {
    id: 'watch-21',
    category: 'watch',
    title: 'Voyage Culinaire au Cinéma : Chef (Jon Favreau)',
    subtitle: 'Road-trip en food-truck cubain, musique latine & joie de vivre',
    description: 'Un chef quitte son restaurant étoilé pour traverser l’Amérique en food-truck : zéro méchant, 100% bonne humeur et sandwichs grillés.',
    budget: '€',
    fatigue: ['canape'],
    ambiance: ['chill', 'drole'],
    durationOrPrep: '1h54 · Zéro stress',
    practicalTip: 'Préparez des croque-monsieur ou des sandwichs chauds avant de lancer le film !',
    keywords: ['cuisine', 'feel-good', 'musique', 'comédie', 'sans horreur'],
    emoji: '🚚'
  },
  {
    id: 'watch-22',
    category: 'watch',
    title: 'Projection Grand Format : Concert Live ou Boiler Room sur la Télé',
    subtitle: 'Lumière tamisée, son poussé & salon transformé en club privé',
    description: 'Un live mythique (Daft Punk Alive, Parcels Live, Tiny Desk Concert) projeté sur l’écran pendant qu’on papote ou qu’on danse.',
    budget: '€',
    fatigue: ['moyen', 'motive'],
    ambiance: ['insolite', 'chill'],
    durationOrPrep: '1h00 à la carte',
    practicalTip: 'Enchaînez chacun votre tour 2 sessions Tiny Desk de 15 minutes pour vous faire découvrir vos artistes.',
    keywords: ['musique', 'concert', 'live', 'court', 'insolite', 'sans horreur'],
    emoji: '🪩'
  },
  {
    id: 'watch-23',
    category: 'watch',
    title: 'Frisson Malin (Sans Gore) : Sans un Bruit ou Get Out',
    subtitle: 'Tension psychologique brillante pour se serrer sur le canapé',
    description: 'Un concept fort qui tient en haleine de la première à la dernière minute sans tomber dans l’horreur gratuite.',
    budget: '€',
    fatigue: ['moyen', 'motive'],
    ambiance: ['insolite', 'decouverte'],
    durationOrPrep: '1h30 · Ultra-tendu',
    practicalTip: 'Seulement 1h30 au compteur : efficacité maximale.',
    keywords: ['thriller', 'frisson', 'suspense', 'court'],
    emoji: '🤫'
  },
  {
    id: 'watch-24',
    category: 'watch',
    title: 'Animation Adulte Culte : Persepolis ou Le Sommet des Dieux',
    subtitle: 'Adaptation de roman graphique francophone saluée dans le monde entier',
    description: 'Humour mordant ou ascension himalayenne à couper le souffle : deux chefs-d’œuvre de l’animation française pour adultes.',
    budget: '€',
    fatigue: ['canape', 'moyen'],
    ambiance: ['decouverte', 'chill'],
    durationOrPrep: '1h35 · Pépite française',
    practicalTip: 'Le Sommet des Dieux donne le vertige même depuis un canapé moelleux.',
    keywords: ['animation', 'français', 'montagne', 'histoire', 'court', 'sans horreur'],
    emoji: '⛰️'
  },

  // ==========================================
  // CATÉGORIE 3 : CE WEEK-END ON FAIT... (24 idées)
  // ==========================================
  {
    id: 'weekend-1',
    category: 'weekend',
    title: 'Brocante & Vide-Grenier du Matin + Café Croissant',
    subtitle: 'Défi à 10 € : dénicher l’objet déco ou insolite le plus cool',
    description: 'On flâne entre les stands au soleil du matin avec un café chaud, chacun avec un billet de 10 € pour trouver une pépite ou un cadeau rigolo pour l’autre.',
    budget: '€',
    fatigue: ['moyen', 'motive'],
    ambiance: ['decouverte', 'insolite'],
    durationOrPrep: '2h00 · Dimanche matin',
    practicalTip: 'Arrivez vers 9h30 pour avoir à la fois de bonnes trouvailles et une ambiance détendue.',
    keywords: ['brocante', 'balade', 'extérieur', 'dimanche', 'insolite', 'café'],
    emoji: '🏺'
  },
  {
    id: 'weekend-2',
    category: 'weekend',
    title: 'Bar à Jeux de Société & Bières Artisanales / Mocktails',
    subtitle: 'Un sommelier du jeu vous explique les règles en 3 minutes',
    description: 'Pas besoin de lire un livret de 12 pages : on découvre 2 ou 3 jeux rapides à deux ou entre amis (Skyjo, 7 Wonders Duel, Code Names Duo).',
    budget: '€€',
    fatigue: ['moyen', 'canape'],
    ambiance: ['drole', 'decouverte'],
    durationOrPrep: '2h00 · Même s’il pleut',
    practicalTip: 'Demandez un jeu coopératif pour la première partie, puis un duel pour la revanche !',
    keywords: ['jeux', 'bar', 'pluie', 'intérieur', 'drôle', 'amis', 'couple'],
    emoji: '🎲'
  },
  {
    id: 'weekend-3',
    category: 'weekend',
    title: 'Rando Thermos & Point de Vue Panoramique au Coucher du Soleil',
    subtitle: 'Sentier accessible de 1h30 + goûter chaud au sommet',
    description: 'On prépare un thermos de chocolat chaud ou de thé épicé, des biscuits maison, et on grimpe jusqu’à un belvédère pour l’heure dorée.',
    budget: '€',
    fatigue: ['motive', 'moyen'],
    ambiance: ['chill', 'decouverte'],
    durationOrPrep: '2h30 · Grand air',
    practicalTip: 'Glissez deux lampes frontales ou vos téléphones chargés pour redescendre au crépuscule.',
    keywords: ['randonnée', 'nature', 'extérieur', 'balade', 'gratuit', 'coucher de soleil'],
    emoji: '🥾'
  },
  {
    id: 'weekend-4',
    category: 'weekend',
    title: 'Tournoi de Jeux de Société ou Mario Kart en Pyjama',
    subtitle: 'Grand Chelem en 3 manches dans le salon avec gage pour le perdant',
    description: 'Pour un week-end pluvieux ou zéro effort : on organise un vrai tableau de tournoi en 3 épreuves différentes sans quitter le salon.',
    budget: '€',
    fatigue: ['canape'],
    ambiance: ['drole', 'chill'],
    durationOrPrep: '1h30 · 100% cocooning',
    practicalTip: 'Le gagnant choisit le dessert ou a droit à un massage des épaules de 10 minutes.',
    keywords: ['jeux', 'canapé', 'pluie', 'maison', 'drôle', 'gratuit'],
    emoji: '🎮'
  },
  {
    id: 'weekend-5',
    category: 'weekend',
    title: 'Exploration « Touriste dans sa Propre Ville » sans GPS',
    subtitle: 'Pile ou face à chaque carrefour pendant 45 minutes',
    description: 'On descend à un arrêt de métro/tram où l’on ne va jamais, et on tire à pile ou face pour tourner à droite ou à gauche jusqu’à tomber sur un café inconnu.',
    budget: '€',
    fatigue: ['moyen', 'motive'],
    ambiance: ['insolite', 'decouverte'],
    durationOrPrep: '2h00 · Aventure urbaine',
    practicalTip: 'Prenez chacun 3 photos d’architectures ou de détails insolites croisés en chemin.',
    keywords: ['balade', 'ville', 'insolite', 'découverte', 'extérieur', 'gratuit'],
    emoji: '🧭'
  },
  {
    id: 'weekend-6',
    category: 'weekend',
    title: 'Atelier Céramique Café (Peinture sur Tasse ou Bol)',
    subtitle: 'On peint chacun une pièce en céramique autour d’un latte',
    description: 'Un moment ultra-apaisant et créatif : vous choisissez un mug ou un bol en biscuit de faïence et vous le décorez avant qu’il soit émaillé au four.',
    budget: '€€',
    fatigue: ['canape', 'moyen'],
    ambiance: ['chill', 'insolite'],
    durationOrPrep: '2h00 · Souvenir durable',
    practicalTip: 'Idée complice : peignez chacun le bol du petit-déjeuner de l’autre en surprise.',
    keywords: ['atelier', 'créatif', 'café', 'intérieur', 'pluie', 'couple'],
    emoji: '🎨'
  },
  {
    id: 'weekend-7',
    category: 'weekend',
    title: 'Brunch Maison Géant & Lecture Croisée au Lit',
    subtitle: 'Pancakes moelleux, œufs brouillés, fruits frais & matinée lente',
    description: 'On coupe les réveils : préparation à quatre mains d’un brunch digne d’un hôtel, dégusté tranquillement avec la presse ou un bon roman.',
    budget: '€',
    fatigue: ['canape'],
    ambiance: ['chill'],
    durationOrPrep: 'Matinée complète',
    practicalTip: 'Ajoutez une cuillère de ricotta ou de yaourt grec dans la pâte à pancakes pour un moelleux nuage.',
    keywords: ['brunch', 'oeufs', 'œufs', 'maison', 'canapé', 'dimanche', 'chill'],
    emoji: '🥐'
  },
  {
    id: 'weekend-8',
    category: 'weekend',
    title: 'Comedy Club en Cave Voûtée & Verre en Terrasse',
    subtitle: '5 humoristes surprise de 10 minutes chacun à 2 mètres de vous',
    description: 'L’ambiance électrique des petits comedy clubs : on découvre les futures stars du stand-up dans une salle intimiste.',
    budget: '€€',
    fatigue: ['moyen', 'motive'],
    ambiance: ['drole', 'decouverte'],
    durationOrPrep: '1h30 · Soirée du samedi',
    practicalTip: 'Ne vous mettez au premier rang que si vous êtes prêts à discuter avec les humoristes !',
    keywords: ['humour', 'spectacle', 'sortie', 'drôle', 'bar', 'stand-up'],
    emoji: '🎭'
  },
  {
    id: 'weekend-9',
    category: 'weekend',
    title: 'Escapade en Train à Moins de 45 Minutes',
    subtitle: 'Premier TER du matin vers un village, la mer ou une forêt voisine',
    description: 'L’impression de partir en vacances le temps d’une journée sans prendre la voiture : marché local, balade et déjeuner au soleil.',
    budget: '€€',
    fatigue: ['motive'],
    ambiance: ['decouverte', 'chill'],
    durationOrPrep: 'Demi-journée ou journée',
    practicalTip: 'Choisissez la destination en regardant les 3 prochains départs sur le panneau de la gare.',
    keywords: ['voyage', 'train', 'escapade', 'nature', 'extérieur', 'découverte'],
    emoji: '🚆'
  },
  {
    id: 'weekend-10',
    category: 'weekend',
    title: 'Visite Nocturne de Musée ou Expo Immersive',
    subtitle: 'Les salles presque pour vous seuls en fin de journée',
    description: 'Découvrir une exposition photo, d’art contemporain ou de sciences naturelles à l’heure où la foule est partie, suivi d’un débrief autour d’un verre.',
    budget: '€€',
    fatigue: ['moyen'],
    ambiance: ['decouverte', 'chill'],
    durationOrPrep: '1h45 · Culture sans foule',
    practicalTip: 'À la fin de chaque salle, désignez chacun l’œuvre que vous emporteriez chez vous.',
    keywords: ['musée', 'expo', 'culture', 'intérieur', 'pluie', 'découverte'],
    emoji: '🖼️'
  },
  {
    id: 'weekend-11',
    category: 'weekend',
    title: 'Session Karaoké Box Privatisée ou Blind-Test Géant',
    subtitle: 'Hurler les classiques des années 80 à 2000 sans aucun jugement',
    description: 'Qu’on soit en salle privée ou dans le salon avec deux micros, on enchaîne les duos improbables et les quiz musicaux par décennie.',
    budget: '€€',
    fatigue: ['motive', 'moyen'],
    ambiance: ['drole', 'insolite'],
    durationOrPrep: '1h30 · Énergie maximale',
    practicalTip: 'Commencez par un duo sur Céline Dion ou Queen pour briser la glace en 30 secondes.',
    keywords: ['karaoké', 'musique', 'drôle', 'amis', 'soirée', 'insolite'],
    emoji: '🎙️'
  },
  {
    id: 'weekend-12',
    category: 'weekend',
    title: 'Marché Gourmand + Cuisine d’un Plat Jamais Tenté',
    subtitle: 'On achète des produits frais de saison et on relève un défi recette',
    description: 'Raviolis frais maison, brioche tressée, gyoza pliés à la main ou tarte tatin : le plaisir de choisir les ingrédients au marché et de créer ensemble.',
    budget: '€€',
    fatigue: ['moyen', 'motive'],
    ambiance: ['decouverte', 'chill'],
    durationOrPrep: '2h30 · Marché + Cuisine',
    practicalTip: 'Prenez un bouquet de fleurs fraîches ou des herbes aromatiques en quittant le marché.',
    keywords: ['marché', 'cuisine', 'dimanche', 'gourmand', 'découverte'],
    emoji: '🧺'
  },
  {
    id: 'weekend-13',
    category: 'weekend',
    title: 'Spa Urbain, Hammam ou Bains Chauds en Fin d’Après-Midi',
    subtitle: 'Vapeur d’eucalyptus, eau à 38°C & déconnexion totale des écrans',
    description: 'Deux heures hors du temps pour dénouer toutes les tensions de la semaine dans le calme absolu.',
    budget: '€€€',
    fatigue: ['canape', 'moyen'],
    ambiance: ['chill'],
    durationOrPrep: '2h00 · Détente profonde',
    practicalTip: 'Prévoyez une soirée ultra-calme à la maison juste après pour prolonger l’effet nuage.',
    keywords: ['spa', 'détente', 'hammam', 'bien-être', 'chill', 'pluie'],
    emoji: '🧖'
  },
  {
    id: 'weekend-14',
    category: 'weekend',
    title: 'Escape Game à Deux ou Enquête Grandeur Nature',
    subtitle: '60 minutes enfermés dans un décor de cinéma pour résoudre l’énigme',
    description: 'Fouille, cadenas secrets, passages dérobés et coopération sous adrénaline : le meilleur test de complicité du week-end.',
    budget: '€€€',
    fatigue: ['motive', 'moyen'],
    ambiance: ['insolite', 'drole'],
    durationOrPrep: '1h15 · Adrénaline & réflexion',
    practicalTip: 'Règle d’or : annoncez toujours à voix haute tout objet ou chiffre que vous trouvez !',
    keywords: ['escape game', 'jeu', 'énigme', 'insolite', 'intérieur', 'pluie'],
    emoji: '🔐'
  },
  {
    id: 'weekend-15',
    category: 'weekend',
    title: 'Balade à Vélo le Long de l’Eau & Pause Glace / Crêpe',
    subtitle: 'Canal, bord de fleuve ou voie verte à rythme tranquille',
    description: 'On loue deux vélos (ou on sort les siens) pour longer l’eau sans circulation, les cheveux au vent, avec arrêt gourmand à mi-chemin.',
    budget: '€',
    fatigue: ['motive', 'moyen'],
    ambiance: ['chill', 'decouverte'],
    durationOrPrep: '2h00 · Bol d’air frais',
    practicalTip: 'Choisissez un itinéraire aller le long de l’eau et retour en train ou par l’autre rive.',
    keywords: ['vélo', 'balade', 'extérieur', 'sport doux', 'nature'],
    emoji: '🚲'
  },
  {
    id: 'weekend-16',
    category: 'weekend',
    title: 'Librairie Indépendante : On s’Offre un Livre Surprise',
    subtitle: '15 minutes chacun dans les rayons pour choisir un livre pour l’autre',
    description: 'Vous vous séparez dans une belle librairie, choisissez en secret un roman, une BD ou un beau livre pour l’autre, puis vous l’ouvrez au salon de thé voisin.',
    budget: '€€',
    fatigue: ['canape', 'moyen'],
    ambiance: ['decouverte', 'chill'],
    durationOrPrep: '1h30 · Doux & complice',
    practicalTip: 'Écrivez une petite dédicace datée sur la première page avant de l’offrir.',
    keywords: ['livre', 'librairie', 'café', 'calme', 'pluie', 'cadeau'],
    emoji: '📚'
  },
  {
    id: 'weekend-17',
    category: 'weekend',
    title: 'Duel Pétanque, Mölkky ou Ping-Pong au Parc',
    subtitle: 'Soleil d’après-midi, boissons fraîches & mauvaise foi autorisée',
    description: 'On sort le jeu de Mölkky, les boules de pétanque ou les raquettes de ping-pong sur les tables publiques du parc pour une revanche officielle.',
    budget: '€',
    fatigue: ['moyen'],
    ambiance: ['drole', 'chill'],
    durationOrPrep: '1h30 · Extérieur',
    practicalTip: 'Emportez une petite enceinte à volume discret et de quoi grignoter sur un banc.',
    keywords: ['parc', 'jeu', 'pétanque', 'extérieur', 'drôle', 'gratuit'],
    emoji: '🎳'
  },
  {
    id: 'weekend-18',
    category: 'weekend',
    title: 'Soirée Cocktail / Mocktail Lab à la Maison',
    subtitle: 'Chacun invente une création signature avec shaker, herbes & agrumes',
    description: 'Citron vert, basilic, gingembre frais, sirop maison, tonic et glace pilée : vous créez deux recettes inédites et leur donnez un nom officiel.',
    budget: '€€',
    fatigue: ['canape', 'moyen'],
    ambiance: ['insolite', 'drole'],
    durationOrPrep: '45 min · Créatif & festif',
    practicalTip: 'Givrez le bord des verres avec un quartier de citron puis du sucre roux ou du sel fin.',
    keywords: ['cocktail', 'maison', 'apéro', 'créatif', 'insolite'],
    emoji: '🍸'
  },
  {
    id: 'weekend-19',
    category: 'weekend',
    title: 'Serres Tropicales ou Jardin Botanique',
    subtitle: 'Jungle luxuriante, palmiers géants & dépaysement à 25°C',
    description: 'Traverser une forêt équatoriale humide, une serre de cactus désertiques et des bassins de nénuphars géants en plein cœur de la ville.',
    budget: '€',
    fatigue: ['moyen', 'canape'],
    ambiance: ['decouverte', 'chill'],
    durationOrPrep: '1h30 · Parfait même par temps gris',
    practicalTip: 'La lumière sous les grandes verrières anciennes est magique en fin de matinée.',
    keywords: ['nature', 'plantes', 'balade', 'jardin', 'photo', 'découverte'],
    emoji: '🌿'
  },
  {
    id: 'weekend-20',
    category: 'weekend',
    title: 'Enquête Maison « Cold Case » ou Puzzle 500 Pièces en Duo',
    subtitle: 'Dossier d’indices à décortiquer sur la table avec playlist jazz',
    description: 'Un dossier d’enquête criminelle réaliste (ou un grand puzzle illustré) étalé sur la table avec thé fumant et musique feutrée.',
    budget: '€',
    fatigue: ['canape'],
    ambiance: ['chill', 'decouverte'],
    durationOrPrep: '2h00 · Zéro écran',
    practicalTip: 'Étalez une grande feuille kraft pour trier les indices ou les pièces par couleur.',
    keywords: ['jeu', 'enquête', 'puzzle', 'maison', 'calme', 'pluie', 'canapé'],
    emoji: '🧩'
  },
  {
    id: 'weekend-21',
    category: 'weekend',
    title: 'Initiation Escalade de Bloc + Burger de Récupération',
    subtitle: 'Pas besoin de corde ni de baudrier : grimpe ludique sur tapis épais',
    description: 'On s’encourage pour trouver la méthode des blocs faciles (jaunes et verts), puis on file au sauna ou au coin snack de la salle.',
    budget: '€€',
    fatigue: ['motive'],
    ambiance: ['drole', 'decouverte'],
    durationOrPrep: '2h00 · Sport fun',
    practicalTip: 'Grimpez à tour de rôle en vous filmant pour analyser vos mouvements en rigolant.',
    keywords: ['sport', 'escalade', 'actif', 'intérieur', 'pluie', 'défi'],
    emoji: '🧗'
  },
  {
    id: 'weekend-22',
    category: 'weekend',
    title: 'Séance Photo Jetable / Polaroid en Flânant',
    subtitle: '12 clichés maximum autorisés : chaque photo compte vraiment',
    description: 'Avec un appareil jetable, un Polaroid ou une appli argentique sans aperçu, vous partez en balade avec le défi de capturer 12 scènes spontanées.',
    budget: '€',
    fatigue: ['moyen'],
    ambiance: ['insolite', 'decouverte'],
    durationOrPrep: '1h30 · Souvenirs tangibles',
    practicalTip: 'Interdiction de regarder les photos avant la fin de la journée autour d’un verre.',
    keywords: ['photo', 'balade', 'créatif', 'insolite', 'souvenir'],
    emoji: '📸'
  },
  {
    id: 'weekend-23',
    category: 'weekend',
    title: 'Concert Jazz, Jam Session ou Guitare Acoustique en Club',
    subtitle: 'Table éclairée à la bougie, cuivres feutrés & ambiance feutrée',
    description: 'Pousser la porte d’un petit club de jazz ou d’un bar à jam session où les musiciens improvisent à quelques mètres de votre table.',
    budget: '€€',
    fatigue: ['moyen', 'motive'],
    ambiance: ['chill', 'decouverte'],
    durationOrPrep: '2h00 · Soirée vibrante',
    practicalTip: 'Les deuxièmes sets (souvent vers 21h30) sont les plus libres et chaleureux.',
    keywords: ['musique', 'jazz', 'concert', 'bar', 'sortie', 'soirée'],
    emoji: '🎷'
  },
  {
    id: 'weekend-24',
    category: 'weekend',
    title: 'Nuit ou Dîner Insolite : Péniche, Rooftop ou Cabane Proche',
    subtitle: 'Changer d’horizon à moins de 30 minutes de chez soi',
    description: 'Prendre de la hauteur sur un toit-terrasse panoramique ou embarquer sur une péniche amarrée pour voir la ville sous un angle totalement neuf.',
    budget: '€€€',
    fatigue: ['motive', 'moyen'],
    ambiance: ['insolite', 'decouverte'],
    durationOrPrep: 'Soirée complète',
    practicalTip: 'Arrivez 20 minutes avant le coucher du soleil pour voir les lumières de la ville s’allumer.',
    keywords: ['insolite', 'vue', 'péniche', 'rooftop', 'sortie', 'exceptionnel'],
    emoji: '🛥️'
  }
];

/**
 * Sélectionne et adapte intelligemment 6 propositions ultra-ciblées à partir de la base locale
 * en tenant compte de la catégorie, du budget, de la fatigue, de l'ambiance et du champ libre.
 */
export function selectTargetedIdeas(constraints: ConstraintsState): IdeaCard[] {
  const { category, budget, fatigue, ambiance, customNote } = constraints;
  const pool = OFFLINE_IDEAS.filter((item) => item.category === category);

  const normalizedNote = customNote
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  // Détection d'exclusions du type "pas de...", "sans...", "no..."
  const excludeHorreur =
    normalizedNote.includes('horreur') ||
    normalizedNote.includes('peur') ||
    normalizedNote.includes('gore');

  const noteTokens = normalizedNote
    .split(/[\s,.;:!?'"()+-]+/)
    .filter((token) => token.length >= 3 && !['pas', 'sans', 'avec', 'pour', 'dans', 'mais', 'soir', 'on', 'des', 'les', 'une', 'est'].includes(token));

  const scored = pool
    .filter((card) => {
      if (excludeHorreur && (card.keywords.includes('frisson') || card.id === 'watch-23')) {
        return false;
      }
      return true;
    })
    .map((card) => {
      let score = 0;

      // Correspondance budget
      if (card.budget === budget) {
        score += 4;
      } else if (
        (budget === '€€' && card.budget === '€') ||
        (budget === '€€€' && card.budget === '€€')
      ) {
        score += 2;
      }

      // Correspondance niveau de fatigue
      if (card.fatigue.includes(fatigue)) {
        score += 5;
      }

      // Correspondance ambiance
      if (card.ambiance.includes(ambiance)) {
        score += 5;
      }

      // Correspondance avec le champ libre (ex: "œufs et courgettes", "italien", "court", "pluie")
      if (noteTokens.length > 0) {
        const cardSearchText = `${card.title} ${card.subtitle} ${card.description} ${card.keywords.join(' ')}`
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '');

        for (const token of noteTokens) {
          if (cardSearchText.includes(token)) {
            score += 6;
          }
        }
      }

      // Légère variation déterministe pour renouveler tout en gardant les meilleures en tête
      return { card, score };
    })
    .sort((a, b) => b.score - a.score);

  const topCards = scored.slice(0, 6).map((entry) => entry.card);

  // Si l'utilisateur a saisi une note libre très spécifique, on ajoute ou personnalise la 1ère carte
  // pour que sa contrainte exacte ("On a des œufs et des courgettes", etc.) soit honorée à 100% même hors-ligne.
  if (customNote.trim().length > 3) {
    const hasStrongKeywordMatch = scored[0] && scored[0].score >= 15;
    if (!hasStrongKeywordMatch) {
      const customCard = buildCustomAdaptationCard(constraints);
      return [customCard, ...topCards.slice(0, 5)];
    }
  }

  return topCards;
}

function buildCustomAdaptationCard(constraints: ConstraintsState): IdeaCard {
  const cleanNote = constraints.customNote.trim();
  const catMap: Record<CategoryId, { titlePrefix: string; emoji: string; prep: string }> = {
    eat: {
      titlePrefix: 'Création Maison Sur-Mesure',
      emoji: '✨',
      prep: '20 min · Adapté à votre note'
    },
    watch: {
      titlePrefix: 'Sélection Ciné Sur-Mesure',
      emoji: '🎞️',
      prep: '1h40 · Adapté à votre envie'
    },
    weekend: {
      titlePrefix: 'Plan Week-End Sur-Mesure',
      emoji: '🌟',
      prep: '2h00 · Adapté à votre envie'
    }
  };

  const meta = catMap[constraints.category];

  return {
    id: `custom-${Date.now()}`,
    category: constraints.category,
    title: `${meta.titlePrefix} : « ${cleanNote.slice(0, 42)} »`,
    subtitle: `Spécialement calibré pour votre ambiance ${constraints.ambiance} (${constraints.budget})`,
    description: `Une proposition taillée exactement autour de votre indication « ${cleanNote} », pensée pour un niveau d’énergie "${constraints.fatigue === 'canape' ? 'Canapé total' : constraints.fatigue === 'moyen' ? 'Moyen' : 'Motivé'}".`,
    budget: constraints.budget,
    fatigue: [constraints.fatigue],
    ambiance: [constraints.ambiance],
    durationOrPrep: meta.prep,
    practicalTip: `Astuce : combinez votre idée « ${cleanNote} » avec une ambiance ${constraints.ambiance} sans compromis.`,
    keywords: ['sur-mesure', 'personnalisé'],
    emoji: meta.emoji
  };
}

export const CATEGORY_LABELS: Record<CategoryId, { title: string; shortLabel: string; tag: string; emoji: string }> = {
  eat: {
    title: 'Ce soir on mange...',
    shortLabel: 'On mange quoi ?',
    tag: 'Repas · Livraison · Resto',
    emoji: '🍜'
  },
  watch: {
    title: 'Ce soir on regarde...',
    shortLabel: 'On regarde quoi ?',
    tag: 'Films · Séries · Stand-up',
    emoji: '🎬'
  },
  weekend: {
    title: 'Ce week-end on fait...',
    shortLabel: 'On fait quoi ?',
    tag: 'Sorties · Jeux · Escapades',
    emoji: '🎲'
  }
};

export const BUDGET_OPTIONS: { value: BudgetLevel; label: string; desc: string }[] = [
  { value: '€', label: '€', desc: 'Maison / Petit prix' },
  { value: '€€', label: '€€', desc: 'Plaisir raisonnable' },
  { value: '€€€', label: '€€€', desc: 'On se lâche' }
];

export const FATIGUE_OPTIONS: { value: FatigueLevel; label: string; desc: string; emoji: string }[] = [
  { value: 'canape', label: 'Canapé total', desc: 'Zéro effort requis', emoji: '🛋️' },
  { value: 'moyen', label: 'Moyen', desc: 'Un peu d’énergie', emoji: '⚡' },
  { value: 'motive', label: 'Motivé', desc: 'Prêt à bouger / cuisiner', emoji: '🔥' }
];

export const AMBIANCE_OPTIONS: { value: AmbianceType; label: string; emoji: string }[] = [
  { value: 'chill', label: 'Chill', emoji: '🌙' },
  { value: 'drole', label: 'Drôle', emoji: '😂' },
  { value: 'decouverte', label: 'Découverte', emoji: '🧭' },
  { value: 'insolite', label: 'Insolite', emoji: '✨' }
];
