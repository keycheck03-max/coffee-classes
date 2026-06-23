# Upload to Google Drive

Upload any file from this repo to Google Drive as a Google Doc in one step.

## How to use

Say: `/upload-to-gdrive <filename>`

Example: `/upload-to-gdrive Coffee Influencer Research — 30 Post Content Plan.md`

---

## Instructions for Claude

When this skill is invoked:

1. **Find the file** — search the repo for the filename the user mentioned. If no filename given, ask which file to upload.

2. **Read the file** — use the Read tool to get the full content.

3. **Upload to Google Drive** — call `mcp__00fefd2b-061f-42e5-bf6c-bb885dea5cad__create_file` with:
   - `title`: the filename (without the .md extension, cleaned up)
   - `contentMimeType`: `text/plain`
   - `textContent`: the full file content as plain text (convert markdown to readable plain text — replace # headers with ALL CAPS, replace ** with nothing, keep bullet points as •)

4. **Report back** — tell the user the file was uploaded and share the Google Doc ID/link from the response.

## Conversion rules (markdown → plain text for Google Docs)

- `# Title` → `TITLE` (all caps, no #)
- `## Section` → section name in ALL CAPS
- `### Subsection` → subsection name
- `**bold**` → just the word (no asterisks)
- `*italic*` → just the word (no asterisks)
- `---` → a line of dashes `━━━━━━━━━━━━━━━`
- `| table |` → keep as-is (Google Docs handles plain text tables)
- `> blockquote` → remove the `>` prefix

## Notes

- The Google Drive MCP server auto-converts `text/plain` uploads to Google Docs format
- No approval prompts should appear (permissions are pre-configured in settings)
- If you get a permission error, the user needs to start a new session (settings were updated and take effect on next session start)
