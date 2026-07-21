#!/usr/bin/env bash
set -euo pipefail

REPO_URL="github.com/Pranavd1911/Legion-Revenue-Recovery-Engine.git"
USERNAME="Pranavd1911"

echo "This will push the local Legion prototype to:"
echo "https://${REPO_URL}"
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
git remote set-url origin "https://${USERNAME}:${TOKEN}@${REPO_URL}"

cleanup() {
  git remote set-url origin "https://${REPO_URL}" >/dev/null 2>&1 || true
}
trap cleanup EXIT

git push -u origin main
cleanup

echo
echo "Pushed successfully."
echo "Remote cleaned back to https://${REPO_URL}"
