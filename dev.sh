#!/usr/bin/env bash
#
# Launch both the backend (FastAPI/uvicorn) and the frontend (Vite) dev servers.
# Both run concurrently; hitting Ctrl-C stops them together.
#
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"

BACKEND_PORT="${BACKEND_PORT:-8000}"
FRONTEND_PORT="${FRONTEND_PORT:-5173}"

pids=()

cleanup() {
    echo
    echo "Shutting down..."
    for pid in "${pids[@]}"; do
        kill "$pid" 2>/dev/null || true
    done
    wait 2>/dev/null || true
}
trap cleanup EXIT INT TERM

# --- Backend ---
if [ ! -d "$BACKEND_DIR/.venv" ]; then
    echo "Error: backend virtualenv not found at $BACKEND_DIR/.venv" >&2
    echo "Run the first-time setup from the README before using this script." >&2
    exit 1
fi

echo "Starting backend on http://localhost:$BACKEND_PORT ..."
(
    cd "$BACKEND_DIR"
    # shellcheck disable=SC1091
    source .venv/bin/activate
    exec uvicorn app.main:app --reload --port "$BACKEND_PORT"
) &
pids+=($!)

# --- Frontend ---
if [ ! -d "$FRONTEND_DIR/node_modules" ]; then
    echo "Error: frontend dependencies not found at $FRONTEND_DIR/node_modules" >&2
    echo "Run 'npm install' in $FRONTEND_DIR before using this script." >&2
    exit 1
fi

echo "Starting frontend on http://localhost:$FRONTEND_PORT ..."
(
    cd "$FRONTEND_DIR"
    exec npm run dev -- --port "$FRONTEND_PORT"
) &
pids+=($!)

echo
echo "Both servers are running. Press Ctrl-C to stop."

# Wait for either process; if one dies, cleanup (via trap) stops the other.
wait -n
