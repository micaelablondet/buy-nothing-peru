#!/usr/bin/env bash
# Upload seed feed photos into local R2 (wrangler). Run after db:seed.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DIR="$ROOT/scripts/seed-photos"
# wrangler dev uses preview_bucket_name; put to both for local tooling.
BUCKETS=("barrio-photos" "barrio-photos-preview")

if [[ ! -d "$DIR" ]]; then
  echo "Missing $DIR" >&2
  exit 1
fi

shopt -s nullglob
files=("$DIR"/*.{jpg,jpeg,png,webp})
if [[ ${#files[@]} -eq 0 ]]; then
  echo "No seed photos in $DIR" >&2
  exit 1
fi

for bucket in "${BUCKETS[@]}"; do
  for file in "${files[@]}"; do
    name="$(basename "$file")"
    echo "Putting seed/$name → local R2 ($bucket)"
    npx wrangler r2 object put "${bucket}/seed/${name}" \
      --file="$file" \
      --local \
      --content-type="image/jpeg"
  done
done
