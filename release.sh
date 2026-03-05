#!/usr/bin/env bash
set -euo pipefail

CURRENT_VERSION="2.0.0"

if [ $# -ge 1 ]; then
    NEW_VERSION="$1"
else
    echo "Current version: $CURRENT_VERSION"
    read -rp "New version: " NEW_VERSION
fi

if ! [[ "$NEW_VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    echo "Error: Version must be in semver format (e.g. 2.0.1)"
    exit 1
fi

TAG="v$NEW_VERSION"

if git rev-parse "$TAG" >/dev/null 2>&1; then
    echo "Error: Tag $TAG already exists"
    exit 1
fi

echo "Releasing $TAG ..."

# Update version in package.json
sed -i '' "s/\"version\": \".*\"/\"version\": \"$NEW_VERSION\"/" package.json

# Update version constants in source files
sed -i '' "s/const SDK_VERSION = '.*'/const SDK_VERSION = '$NEW_VERSION'/" src/BaseEmailitClient.js
sed -i '' "s/export const VERSION = '.*'/export const VERSION = '$NEW_VERSION'/" src/index.js

# Update version in test assertion
sed -i '' "s/expect(VERSION).toBe('.*')/expect(VERSION).toBe('$NEW_VERSION')/" tests/client.test.js

# Update CURRENT_VERSION in this script for next time
sed -i '' "s/^CURRENT_VERSION=\".*\"/CURRENT_VERSION=\"$NEW_VERSION\"/" release.sh

# Stage, commit, tag, push
git add package.json src/BaseEmailitClient.js src/index.js tests/client.test.js release.sh
git commit -m "release: $TAG"
git tag -a "$TAG" -m "Release $TAG"
git push origin HEAD
git push origin "$TAG"

echo ""
echo "Released $TAG successfully."
