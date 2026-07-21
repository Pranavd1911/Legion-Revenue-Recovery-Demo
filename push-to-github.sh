#!/usr/bin/env bash
set -euo pipefail

USERNAME="Pranavd1911"
REMOTE_URL="$(git remote get-url origin)"
REPO_PATH="${REMOTE_URL#https://github.com/}"
REPO_PATH="${REPO_PATH#https://${USERNAME}@github.com/}"
REPO_PATH="${REPO_PATH#git@github.com:}"
REPO_PATH="${REPO_PATH%.git}.git"

echo "This will push the local Legion prototype to:"
echo "https://github.com/${REPO_PATH}"
echo
echo "Paste a GitHub token for ${USERNAME} with repo write access."
echo "The token will not be shown and will not be saved in git config."
read -r -s -p "GitHub token: " TOKEN
echo

if [[ -z "${TOKEN}" ]]; then
  echo "No token provided. Aborting."
  exit 1
fi

git branch -M main
git remote set-url origin "https://${USERNAME}:${TOKEN}@github.com/${REPO_PATH}"

cleanup() {
  git remote set-url origin "https://github.com/${REPO_PATH}" >/dev/null 2>&1 || true
}
trap cleanup EXIT

git push -u origin main
cleanup

echo
echo "Pushed successfully."
echo "Remote cleaned back to https://github.com/${REPO_PATH}"
