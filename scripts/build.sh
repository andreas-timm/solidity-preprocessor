#!/usr/bin/env bash

set -e

rm -rf dist
tsc -p tsconfig.json
tsc -p tsconfig-cjs.json

cp README.md dist/
mkdir dist/src
rsync -a src/ dist/src/
rsync -a shared/dist/ dist/

COPY_FIELDS=(
    name
    description
    version
    keywords
    author
    license
    homepage
    repository
    bugs
    publishConfig
)

cd dist
npm init -y > /dev/null

for field in "${COPY_FIELDS[@]}"; do
    npm pkg set --json "${field}"="$(npm --prefix=.. pkg get --json "${field}")"
done

npm pkg delete scripts
npm pkg delete directories
npm pkg set main=./lib/cjs/preprocessor.js
npm pkg set module=./lib/esm/preprocessor.js

cat package.json
