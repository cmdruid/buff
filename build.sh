#!/bin/bash

# Clean the existing dist path.
rm -rf ./dist

## Build the current project source.
yarn tsc
yarn rollup -c rollup.config.ts --configPlugin typescript

# Define the directory to scan
DIR="./dist"

# Loop through each .js file in the directory.
for file in "$DIR"/*.{js,mjs}; do
    # Use sed to remove the string in-place.
    sed -i '/import { webcrypto } from '\''crypto'\'';/d' "$file"
done
