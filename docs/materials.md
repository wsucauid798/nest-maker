# Adding or editing materials

All stages and choices live in [src/lib/stages.ts](../src/lib/stages.ts).

## Choice fields

Each choice is an object with:

- `id`, stable identifier and also the filename of its reference image
- `name`, what the user sees in the choice card
- `description`, one-line flavour text shown under the name
- `prompt`, the fragment injected into the AI prompt for that material
- `imageSrc`, path under `public/`, derived from the id by a small helper

## Adding a choice to an existing stage

Append a new entry to the `choices` array of that stage. Drop a matching PNG at `public/images/choices/<id>.png`. No other code changes needed.

## Adding a stage

Append a new entry to the `STAGES` array with its own id, name, subtitle, description, and at least two choices. The stage flow picks up the new stage automatically. The progress dots, "stage N of M" indicator, and the API route all derive from `STAGES.length`.

## Reference images

If a choice's PNG is missing from `public/images/choices/`, the preview pane shows a placeholder and the image generation step falls back to text-only. The app still works. Drop the PNG in and the next run picks it up.

## Naming rules

The `id` must be a stable kebab-case slug. It is used as the filename, the selection key, and the React key. Renaming an id breaks any reference image already on disk, so move or rename the PNG to match.
