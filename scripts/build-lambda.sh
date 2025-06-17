#!/bin/bash

set -ex

cd "$(dirname "$0")/.."

npx tsc

CURR_DIR="$(pwd)"
TEMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TEMP_DIR"' EXIT

cp -r package*.json dist/ "$TEMP_DIR"

cd -- "$TEMP_DIR"
npm ci --omit=dev

zip -r "$CURR_DIR/dist/lambda-package.zip" .
