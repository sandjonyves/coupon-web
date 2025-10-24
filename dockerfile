# Dockerfile simple pour Render.com
FROM node:18-slim



# Créer le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install --production --silent

# Copier le code source
COPY . .

# Build CSS pour la production
RUN npm run build:css

# Variables d'environnement
ENV NODE_ENV=production
ENV PORT=3000

# Exposer le port
EXPOSE 3000

# Script de démarrage
CMD ["node", "./bin/www"]
