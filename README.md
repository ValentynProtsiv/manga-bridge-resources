# MangaBridge Resources

This repository contains installable resource metadata packages consumed by the MangaBridge mobile app.

MangaBridge remains the client, library, and reader shell. Resource packages describe compatible source metadata, capabilities, safety constraints, and package paths. Runtime TypeScript adapters currently remain in the app under `features/resources/`; parser implementation is intentionally not included in these metadata packages yet.

Manga.in.ua is the first resource package.

## Repository layout

- `repo.json` describes the resources repository.
- `index.json` is the full resource index.
- `index.min.json` is the compact resource index for clients.
- `catalog/sources.json` is the catalog consumed by MangaBridge after a user adds this GitHub repository in Sources.
- `sources/<resource-id>/source.json` contains package metadata.
- `sources/_template/` is a starter package shape for future resources.
- `docs/ADDING_RESOURCE.md` explains the app + resources repo workflow.
- `docs/RESOURCE_CHECKLIST.md` is the release checklist for source packages.

## Safety model

Resource metadata declares allowed domains and capabilities. The app still owns request enforcement:

- fixed HTTPS endpoints only
- no cookies
- no auth
- no WebView
- no arbitrary user-entered request URLs
- no background requests

## Adding resources

New resources should be added through metadata packages in this repository and a matching app-side adapter in MangaBridge. Keep parser/request tests with the app adapter so resource behavior can be verified before publishing catalog metadata.

See:

- `docs/ADDING_RESOURCE.md`
- `docs/RESOURCE_CHECKLIST.md`
- `sources/_template/`

## Current resources

- Manga.in.ua (`manga-in-ua`), version 8
