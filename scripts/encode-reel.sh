#!/usr/bin/env bash
#
# Turns a camera/editor export into a file a browser can actually stream, and
# writes the poster frame beside it.
#
#   ./scripts/encode-reel.sh <input> <slug> [out-dir]
#   ./scripts/encode-reel.sh ~/Desktop/Edits_16_Torrijos.MP4 torrijos
#
# The source reels for this project were HEVC (H.265), 2160x3840, ~37 Mbps,
# 120-280 MB each. Three separate problems, all fatal on the web:
#
#   HEVC      Chrome on Windows and Firefox generally will not decode it, so
#             the film simply fails for a large share of desktop visitors.
#   4K        The player is never wider than ~700 CSS px. 2160 wide is ~9x
#             more pixels than anything on screen.
#   37 Mbps   R2 serves one file to everyone with no adaptive bitrate, so a
#             viewer on mobile data has no lower rendition to fall back to.
#
# This outputs H.264 High at 1080x1920, capped at 4 Mbps, with faststart so
# playback begins before the file has finished downloading.

set -euo pipefail

IN="${1:?usage: encode-reel.sh <input> <slug> [out-dir]}"
SLUG="${2:?usage: encode-reel.sh <input> <slug> [out-dir]}"
OUT_DIR="${3:-./web}"

mkdir -p "$OUT_DIR"
OUT="$OUT_DIR/$SLUG.mp4"
POSTER="$OUT_DIR/$SLUG.jpg"

ffmpeg -y -i "$IN" \
  -vf "scale=1080:1920:flags=lanczos" \
  -c:v libx264 -crf 25 -preset medium -profile:v high -level 4.0 \
  -pix_fmt yuv420p -maxrate 4000k -bufsize 8000k -g 60 \
  -c:a aac -b:a 128k -ac 2 \
  -movflags +faststart \
  "$OUT" -loglevel error

# Two seconds in: the opening frame of a walk-through is often a doorway or
# a fade, which makes a poor still.
ffmpeg -y -ss 2 -i "$OUT" -frames:v 1 -q:v 4 "$POSTER" -loglevel error

before=$(stat -c%s "$IN" 2>/dev/null || stat -f%z "$IN")
after=$(stat -c%s "$OUT" 2>/dev/null || stat -f%z "$OUT")

printf '%s: %.0f MB -> %.1f MB (%.1fx smaller)\n' \
  "$SLUG" \
  "$(echo "$before/1048576" | bc -l)" \
  "$(echo "$after/1048576" | bc -l)" \
  "$(echo "$before/$after" | bc -l)"

# faststart puts moov at the front; without it the browser must download the
# whole file before showing a frame.
if ! head -c 1000 "$OUT" | grep -q moov; then
  echo "  WARNING: moov atom not at the front — faststart did not apply" >&2
fi
