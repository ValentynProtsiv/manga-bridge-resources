# Adding a MangaBridge resource

MangaBridge resources are metadata packages consumed by the MangaBridge app. A resource entry declares identity, adapter compatibility, user-facing metadata, capabilities, and safety constraints. Runtime parser code currently lives in the app under `features/resources/`; the resources repository does not ship executable code.

## Required app-side work

A new real resource needs both sides:

1. Add or update an app-side adapter under `features/resources/<adapter>/`.
2. Register that adapter in `features/resources/registry.ts`.
3. Add parser/request tests for the adapter in the app repository.
4. Add the metadata package in this resources repository.
5. Validate this repository with `node scripts/validate-catalog.js`.
6. Validate the app with lint, typecheck, parser tests, and network-safety checks.

## Metadata files to update

For a new resource, add:

- `sources/<resource-id>/README.md`
- `sources/<resource-id>/source.json`
- optional icon file

Then update:

- `catalog/sources.json`
- `index.json`
- `index.min.json`

The app downloads `catalog/sources.json` after the user adds this GitHub repository URL in Sources.

## Safety rules

Keep resource metadata strict:

- HTTPS domains only
- no cookies
- no auth
- no arbitrary user-entered request URLs
- no WebView requirement
- no redirects unless the app has explicit guarded support
- fixed headers only when required and adapter-scoped

If a source needs behavior outside the current guarded request model, document the gap instead of weakening global safety.
