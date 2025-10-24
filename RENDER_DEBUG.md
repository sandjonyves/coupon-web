# Configuration Render.com

## Variables d'environnement requises

```bash
NODE_ENV=production
SESSION_SECRET=votre-cle-secrete-tres-longue-et-securisee-ici
SENDGRID_API_KEY=votre-cle-sendgrid
SMTP_USER=votre-email@votre-domaine.com
```

## Scripts de démarrage disponibles

- `npm start` : Démarrage standard
- `npm run start:diagnostic` : Démarrage avec diagnostic
- `npm run start:simple` : Démarrage simplifié
- `npm run diagnostic` : Diagnostic uniquement

## Problèmes courants et solutions

### 1. Erreur SIGTERM
- Vérifiez que DATABASE_URL est configurée
- Vérifiez que toutes les variables d'environnement sont définies
- Utilisez `npm run diagnostic` pour identifier le problème

### 2. Page d'accueil différente
- Vérifiez que le fichier `views/home.ejs` existe
- Vérifiez que la route `/` pointe vers `getNewHomePage`
- Redéployez pour vider le cache

### 3. Base de données
- Assurez-vous que PostgreSQL est connecté
- Vérifiez les logs de connexion DB
- L'app peut fonctionner sans DB en mode dégradé

## Commandes de debug

```bash
# Diagnostic complet
npm run diagnostic

# Démarrage avec logs détaillés
npm run start:diagnostic

# Vérification des fichiers
ls -la views/
ls -la controllers/
ls -la routes/
```
