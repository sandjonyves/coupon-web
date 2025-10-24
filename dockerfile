FROM node:18-slim

WORKDIR /app

# Copier tout le code (package.json + le reste)
COPY . .

# Installer toutes les dépendances
RUN npm install --silent

# Build Tailwind CSS
RUN npm run build:css

# Optionnel : supprimer devDependencies
RUN npm prune --production

EXPOSE 3000

CMD ["node", "./bin/www"]
