#!/usr/bin/env bash
set -euo pipefail

DEFAULT_REPO="Legion-Revenue-Recovery-Engine"
OWNER="Pranavd1911"

echo "Create a fresh GitHub repo and push this local project."
echo "GitHub owner: ${OWNER}"
read -r -p "Repository name [${DEFAULT_REPO}]: " REPO_NAME
REPO_NAME="${REPO_NAME:-$DEFAULT_REPO}"

read -r -p "Visibility public/private [public]: " VISIBILITY
VISIBILITY="${VISIBILITY:-public}"
if [[ "${VISIBILITY}" != "public" && "${VISIBILITY}" != "private" ]]; then
  echo "Visibility must be public or private."
  exit 1
fi

echo
echo "Paste a GitHub classic token for ${OWNER} with the repo scope."
echo "The token will not be shown and will not be saved in git config."
read -r -s -p "GitHub token: " TOKEN
echo

if [[ -z "${TOKEN}" ]]; then
  echo "No token provided. Aborting."
  exit 1
fi

PRIVATE=false
if [[ "${VISIBILITY}" == "private" ]]; then
  PRIVATE=true
fi

echo "Creating https://github.com/${OWNER}/${REPO_NAME} ..."
HTTP_STATUS="$(
  curl -sS -o /tmp/github-create-repo-response.json -w "%{http_code}" \
    -H "Authorization: Bearer ${TOKEN}" \
    -H "Accept: application/vnd.github+json" \
    -H "X-GitHub-Api-Version: 2022-11-28" \
    https://api.github.com/user/repos \
    -d "{\"name\":\"${REPO_NAME}\",\"private\":${PRIVATE}}"
)"

if [[ "${HTTP_STATUS}" != "201" ]]; then
  echo "GitHub repo creation failed with HTTP ${HTTP_STATUS}."
  echo "Response:"
  cat /tmp/github-create-repo-response.json
  echo
  echo "Common fixes: use a classic token with repo scope, delete any existing repo with the same name, or choose a different repo name."
  exit 1
fi

git branch -M main
git remote set-url origin "https://${OWNER}:${TOKEN}@github.com/${OWNER}/${REPO_NAME}.git"

cleanup() {
  git remote set-url origin "https://github.com/${OWNER}/${REPO_NAME}.git" >/dev/null 2>&1 || true
}
trap cleanup EXIT

echo "Pushing main ..."
git push -u origin main
cleanup

echo
echo "Done: https://github.com/${OWNER}/${REPO_NAME}"
