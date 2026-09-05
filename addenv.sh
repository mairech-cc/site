#!/usr/bin/env bash
VITE_GIT_COMMIT_HASH=$(git rev-parse HEAD)

export VITE_GIT_COMMIT_HASH
