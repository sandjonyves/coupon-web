# Configuration pour Render.com

## Variables d'environnement requises

### Base de données
- `DATABASE_URL` : URL de connexion PostgreSQL (fournie automatiquement par Render)
- `NODE_ENV` : `production`

### Sessions
- `SESSION_SECRET` : Clé secrète pour les sessions (générez une clé forte)

### Email (SendGrid)
- `SENDGRID_API_KEY` : Clé API SendGrid
- `SMTP_USER` : Email d'expéditeur vérifié sur SendGrid

## Configuration recommandée

1. **Base de données** : Utilisez PostgreSQL (fourni par Render)
2. **Sessions** : Pour une vraie production, utilisez Redis ou désactivez les sessions
3. **Port** : Render utilise automatiquement le port via `process.env.PORT`

## Scripts de build

```bash
# Build CSS avant le déploiement
npm run build:css

# Démarrer l'application
npm start
```

## Optimisations pour Render

- ✅ Configuration des sessions améliorée
- ✅ Gestion d'erreur de DB robuste
- ✅ Variables d'environnement sécurisées
- ✅ Port dynamique supporté
