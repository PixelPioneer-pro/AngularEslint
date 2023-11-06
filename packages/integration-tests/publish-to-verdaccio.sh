#!/usr/bin/env bash

set -e

VERSION=$1
NPM_REGISTRY=$(npm config get registry)

echo

if [[ ! $NPM_REGISTRY == http://localhost* ]]; then
  echo "------------------"
  echo "💣  ERROR 💣 => $NPM_REGISTRY does not look like a local registry - exiting"
  echo "------------------"

  exit 1;
fi

# Change to the root of the monorepo
cd ../../

echo "Publishing to npm registry $NPM_REGISTRY"

echo ""

echo "Running yarn nx release version $VERSION"

yarn nx release version $VERSION

echo ""

echo "Publishing all relevant packages to $NPM_REGISTRY"

echo ""

output=$(yarn nx release publish --registry $NPM_REGISTRY 2>&1)   # Capture the command's output and errors
exit_code=$?

# Print command output regardless of success or error
echo "$output"

if [[ $exit_code -ne 0 ]]; then  # If command exits with an error
    if [[ $output == *"this package is already present"* ]]; then
        echo "Warning: KNOWN package conflict error encountered. Continuing script..."
        exit 0
    else
        exit 1  # Exit the script on unknown error
    fi
fi

echo ""

echo "Publishing complete"
