#!/bin/bash
# Tiny screen-timelapse for opentier work sessions.
# Usage:
#   scripts/timelapse.sh start <name>     # begin capture, writes PID to /tmp/timelapse-<name>.pid
#   scripts/timelapse.sh stop  <name>     # kill the loop
#   scripts/timelapse.sh build <name>     # compile frames to mp4 (24fps)
#   scripts/timelapse.sh status           # show running loops
#
# Output: local/timelapse/<name>/frame-NNNNN.png
# Captures the full screen via macOS `screencapture -x` every INTERVAL seconds.

INTERVAL="${INTERVAL:-2}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CMD="${1:-status}"
NAME="${2:-session}"
DIR="$ROOT/local/timelapse/$NAME"
PID_FILE="/tmp/timelapse-$NAME.pid"

case "$CMD" in
  start)
    if [ -f "$PID_FILE" ] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
      echo "already running: PID $(cat "$PID_FILE")"
      exit 1
    fi
    mkdir -p "$DIR"
    (
      n=$(ls "$DIR"/frame-*.png 2>/dev/null | wc -l | tr -d ' ')
      while true; do
        screencapture -x "$DIR/frame-$(printf '%05d' $n).png"
        n=$((n + 1))
        sleep "$INTERVAL"
      done
    ) </dev/null >/dev/null 2>&1 &
    echo $! > "$PID_FILE"
    echo "started: PID $(cat "$PID_FILE") · $DIR · ${INTERVAL}s interval"
    ;;
  stop)
    if [ -f "$PID_FILE" ]; then
      kill "$(cat "$PID_FILE")" 2>/dev/null && echo "stopped: PID $(cat "$PID_FILE")"
      rm -f "$PID_FILE"
    else
      echo "no PID file at $PID_FILE"
    fi
    ;;
  build)
    count=$(ls "$DIR"/frame-*.png 2>/dev/null | wc -l | tr -d ' ')
    if [ "$count" -eq 0 ]; then
      echo "no frames in $DIR"
      exit 1
    fi
    out="$DIR/timelapse-$NAME.mp4"
    ffmpeg -y -framerate 24 -pattern_type glob -i "$DIR/frame-*.png" \
      -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2,format=yuv420p" \
      -c:v libx264 -preset medium -crf 22 "$out"
    echo "built: $out ($count frames)"
    ;;
  status)
    for f in /tmp/timelapse-*.pid; do
      [ -e "$f" ] || continue
      pid=$(cat "$f")
      name=$(basename "$f" .pid | sed 's/^timelapse-//')
      if kill -0 "$pid" 2>/dev/null; then
        frames=$(ls "$ROOT/local/timelapse/$name"/frame-*.png 2>/dev/null | wc -l | tr -d ' ')
        echo "running: $name · PID $pid · $frames frames"
      else
        echo "stale PID file: $f"
      fi
    done
    ;;
  *)
    echo "usage: $0 {start|stop|build|status} [name]"
    exit 2
    ;;
esac
