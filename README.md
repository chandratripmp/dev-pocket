# DevPocket

Quick dev tools for the stuff you Google way too often — right inside VS Code. JSON minifier, epoch converter, base64 encoder, and more. All the little utilities that make you think "there's gotta be a faster way to do this."

## Features

- **Convert ENV / JSON** — Convert between `.env` and JSON format. Select text to convert a portion, or run on the whole file.
- **Base64 Encode** — Encode selected text (or full file) to Base64. The encoded result is appended below the original content.
- **Base64 Decode** — Decode Base64 text back to its original form.
- **JSON Minify** — Minify pretty-printed or multi-object JSON into compact form. Handles both single objects/arrays and multiple concatenated JSON objects.
- **Unix Timestamp Convert** — Scan text for all 10- and 13-digit unix timestamps and display them converted to human-readable dates in a side-by-side view.
- **Unix Hover Provider** — Hover over any unix timestamp in the editor to see its converted date/time.
- **URL Encode** — Encode selected text (or full file) to URL-encoded format (e.g., spaces become `%20`).
- **URL Decode** — Decode URL-encoded text back to its original form.
- **SQL WHERE IN Quotes** — Wrap each selected line in single quotes with commas, enclosed in parentheses. Perfect for building SQL `WHERE IN` clauses from a list of values.

## Usage

Invoke any command from the **Command Palette** (`Cmd+Shift+P` / `Ctrl+Shift+P`) by typing `DevPocket` and selecting the desired tool. Commands are also available via the **right-click context menu** when you have text selected.

### Selection vs. Full File

Most commands behave differently depending on whether you have text selected:

- **With a selection**: Only the selected text is processed. The result replaces your selection.
- **Without a selection**: The entire file content is processed. The result replaces everything.

> **Exception**: Base64 Encode/Decode always appends the result below the original content rather than replacing it.

### ENV ↔ JSON Conversion

1. Open a `.env` file or a JSON file.
2. Run `DevPocket: Convert env/json`.
3. The format is auto-detected — `.env` becomes JSON, JSON becomes `.env`.

| Before (ENV) | After (JSON) |
|---|---|
| `API_KEY=abc123`<br>`PORT=3000` | `{ "API_KEY": "abc123", "PORT": "3000" }` |

### Base64 Encode

1. Select some text or open any file.
2. Run `DevPocket: Base64 Encode`.
3. The base64-encoded output is appended below the original content.

### Base64 Decode

1. Select a base64 string (e.g., `SGVsbG8gV29ybGQ=`).
2. Run `DevPocket: Base64 Decode`.
3. The decoded result is appended below the original content.

### JSON Minify

1. Open a file containing pretty-printed or multi-object JSON.
2. Run `DevPocket: JSON Minify`.
3. JSON is compacted to a single line per object. Handles both single objects/arrays and multiple concatenated JSON objects.

### Unix Timestamp Convert

1. Open any file containing unix timestamps (10-digit or 13-digit).
2. Run `DevPocket: Unix Timestamp Convert`.
3. All timestamps are detected and a side-by-side view opens showing each timestamp converted to GMT, your local timezone, and relative time.

Hover over any unix timestamp to see its converted value inline.

### URL Encode

1. Select text containing special characters (e.g., `hello world & more`).
2. Run `DevPocket: URL Encode`.
3. The text is replaced with its URL-encoded form (e.g., `hello%20world%20%26%20more`).

### URL Decode

1. Select URL-encoded text (e.g., `hello%20world`).
2. Run `DevPocket: URL Decode`.
3. The text is replaced with its decoded form (e.g., `hello world`).

### SQL WHERE IN Quotes

1. Select a list of values, one per line:
   ```
   a1
   b2
   c3
   ```
2. Run `DevPocket: Surround with quotes for SQL WHERE IN`.
3. Each line is wrapped in single quotes with commas, with opening/closing parentheses added:
   ```sql
   (
   	'a1',
   	'b2',
   	'c3'
   )
   ```

## Requirements

No additional dependencies or runtime requirements.

## Extension Settings

This extension contributes the following settings:

| Setting | Type | Default | Description |
|---|---|---|---|
| `dev-pocket.unixHoverEnabled` | `boolean` | `true` | Enable hover provider for unix timestamps |

## Known Issues

None at this time. If you find a bug, please [open an issue](https://github.com/chandratripmp/dev-pocket/issues).
