# Image Node officielle
FROM node:18-slim

# Dossier de travail
WORKDIR /app

# Copier package.json et package-lock.json
COPY package*.json ./

# Installer TOUTES les dépendances pour pouvoir build Tailwind
RUN npm install --silent

# Copier tout le code
COPY . .

# Build Tailwind CSS
RUN npm run build:css

# Si tu veux, tu peux maintenant supprimer les devDependencies pour prod
RUN npm prune --production

# Exposer le port
EXPOSE 3000

# Lancer l'application
CMD ["node", "./bin/www"]
