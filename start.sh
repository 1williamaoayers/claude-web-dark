#!/usr/bin/env bash
set -e
DIR="$(cd "$(dirname "$0")" && pwd)"
PORT="${PORT:-8004}"
HOST="${HOST:-0.0.0.0}"
echo "Starting Claude Web on http://$HOST:$PORT"
exec node "$DIR/server/cli.js" start --port "$PORT" --hostname "$HOST"
