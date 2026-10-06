# tests/

`smoke.mjs` — a minimal smoke gate for the mixer. The app itself is
zero-dependency; the test is dev-only tooling and ships nothing.

## Run

```sh
# 1. Chrome with a debugging port (any profile dir works)
chrome --remote-debugging-port=9222 --user-data-dir=/tmp/chrome-acro &

# 2. serve the repo
python3 -m http.server 8931 &

# 3. playwright is the only dev dependency
npm i playwright

# 4. run
node tests/smoke.mjs
```

Asserts the core contract — decode, engine nodes, play/pause,
crossfader law, hot-cue set/jump/clear, tempo sync — and exits
non-zero on any failure or page error. Override endpoints with
`CDP_URL` / `APP_URL`.
