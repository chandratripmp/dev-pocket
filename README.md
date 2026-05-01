# DevPocket

Quick dev tools for the stuff you Google way too often — right inside VS Code. JSON minifier, epoch converter, base64 encoder, and more. All the little utilities that make you think "there's gotta be a faster way to do this."

## Features

- **Convert ENV / JSON** — Convert between `.env` and JSON format. Select text to convert a portion, or run on the whole file.
- **Base64 Encode** — Encode selected text (or full file) to Base64. The encoded result is appended below the original content.
- **Base64 Decode** — Decode Base64 text back to its original form.
- **JSON Minify** — Minify pretty-printed or multi-object JSON into compact form. Handles both single objects/arrays and multiple concatenated JSON objects.
- **Unix Timestamp Convert** — Scan text for all 10- and 13-digit unix timestamps and display them converted to human-readable dates in a side-by-side view.
- **Unix Hover Provider** — Hover over any unix timestamp in the editor to see its converted date/time.

## Requirements

No additional dependencies or runtime requirements.

## Extension Settings

This extension contributes the following settings:

| Setting | Type | Default | Description |
|---|---|---|---|
| `dev-pocket.unixHoverEnabled` | `boolean` | `true` | Enable hover provider for unix timestamps |

## Known Issues

None at this time. If you find a bug, please [open an issue](https://github.com/chandratripmp/dev-pocket/issues).

## Release Notes

### 0.0.1

Initial release with ENV/JSON conversion, Base64 encode/decode, JSON minify, and Unix timestamp tools.
