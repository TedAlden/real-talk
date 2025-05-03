#!/bin/bash

# This script:
# - Updates the project from GitHub repository (cloning fresh if necessary)
# - Copies over .env files. These must be defined outside of the repo initially
# - Installs node dependencies fresh for frontend, backend, and load-balancer
# - Stops, rebuilds, and restarts the Docker containers

# Prerequisites:
# - Git installed
# - Docker and Docker Compose installed

# How to use:
# 1. Save this script as deploy.sh in the parent folder of the repository.
# 2. Configure this script's path variables as needed.
# 3. Make it executable: chmod a+x deploy.sh
# 4. Run it: ./deploy.sh

# Example directory structure:
#
# ~
# └── real-talk-app
#     ├── backend.env
#     ├── frontend.env
#     ├── deploy.sh
#     └── real-talk
#         ├── backend
#         │   └── ...
#         ├── balancer
#         │   └── ...
#         ├── frontend
#         │   └── ...
#         ├── docker-compose.yml
#         └── README.md
#
# Inside your home folder, the real-talk-app directory contains this deploy.sh
# script itself, and the .env files for the project, which will be copied in
# once the repo is cloned into the real-talk-app/real-talk directory.

# --------- #
# VARIABLES #
# --------- #

# GitHub repository URL and branch
REPO_URL="https://github.com/TedAlden/real-talk.git"
REPO_BRANCH="main"

# Directory where the repo will be cloned to
REPO_DIR="/home/user/real-talk-app/real-talk"

# Where the .env files are located (will be copied from here into the repo)
ENV_FRONTEND_SRC="/home/user/real-talk-app/frontend.env"
ENV_BACKEND_SRC="/home/user/real-talk-app/backend.env"

# ----------- #
# MAIN SCRIPT #
# ----------- #

# Clone if it doesn't exist
if [ ! -d "$REPO_DIR" ]; then
  echo "Cloning the repository..."
  git clone "$REPO_URL" "$REPO_DIR" || { echo "Failed to clone repository"; exit 1; }
# Otherwise, pull the latest changes
else
  echo "Repository already exists. Pulling latest changes..."
  cd "$REPO_DIR" || { echo "Failed to navigate to $REPO_DIR"; exit 1; }
  git pull --force origin $REPO_BRANCH || { echo "Failed to pull changes"; exit 1; }
fi

# Navigate to the repository
cd "$REPO_DIR" || { echo "Failed to navigate to $REPO_DIR"; exit 1; }

# Copy .env files to each node project
echo "Copying .env files..."
cp "$ENV_FRONTEND_SRC" "$REPO_DIR/frontend/.env" || { echo "Failed to copy $ENV_FRONTEND_SRC"; exit 1; }
cp "$ENV_BACKEND_SRC" "$REPO_DIR/backend/.env" || { echo "Failed to copy $ENV_BACKEND_SRC"; exit 1; }

# Stop, rebuild, and restart Docker containers
echo "Restarting Docker containers..."
cd "$REPO_DIR" || { echo "Failed to navigate to $REPO_DIR"; exit 1; }
docker compose -f down || { echo "Failed to bring down Docker containers"; exit 1; }
docker compose -f build || { echo "Failed to build Docker containers"; exit 1; }
docker compose -f up -d || { echo "Failed to start Docker containers"; exit 1; }

echo "Repository update and container restart complete!"
