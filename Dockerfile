# https://bit.ly/node-docker-best-practice
# This is a multistage Dockerfile.
# In the first stage we install system build dependencies, copy project files and build them
# In the second stage, we start fresh and only copy necessary files. We also purge node_modules devDependencies.

#### --- Build stage --- ####
FROM node:16-alpine AS build

# Update npm to latest version
RUN npm i -g npm

# Only copy node dependency information and install all dependencies first
COPY --chown=node:node package.json package-lock.json ./

# Install packages using the lockfiles as source of truth ✅ See bullet point #8.5 about npm ci
# Don't use postinstall scripts to build the app. The source code files are not copied yet.
RUN npm ci

# Copy source code (and all other relevant files)
COPY --chown=node:node . .

# Build code (TypeScript)
RUN npm run build

#### --- Run-time stage --- ####

# ✅ See bullet point #8.10 about smaller docker base images
FROM node:16-alpine as app

# Update npm to latest version
RUN npm i -g npm

# Set non-root user
USER node

WORKDIR /home/node/app

# ✅ See bullet point #5.15 about Set NODE_ENV=production
ENV NODE_ENV production

# Copy dependency information and build output from previous stage
COPY --chown=node:node --from=build package.json package-lock.json ./
COPY --chown=node:node --from=build node_modules ./node_modules
COPY --chown=node:node --from=build dist ./dist

# Clean dev dependencies ✅ See bullet point #8.5
RUN npm prune --production && npm cache clean --force

# ✅ See bullet point #8.2 about avoiding npm start
CMD [ "node", "." ]
