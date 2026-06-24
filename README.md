# MangaBridge Resources

This repository contains installable resource metadata packages consumed by the MangaBridge mobile app.

MangaBridge remains the client, library, and reader shell. Resource packages describe compatible source metadata, capabilities, safety constraints, and package paths. Runtime TypeScript adapters currently remain in the app under `features/resources/`; parser implementation is intentionally not included in these metadata packages yet.

Manga.in.ua is the first resource package.

## Repository layout

- `repo.json` describes the resources repository.
- `index.json` is the full resource index.
- `index.min.json` is the compact resource index for clients.
- `catalog/sources.json` is the catalog consumed by MangaBridge remote catalog checks.
- `sources/<resource-id>/source.json` contains package metadata.

## Safety model

Resource metadata declares allowed domains and capabilities. The app still owns request enforcement:

- fixed HTTPS endpoints only
- no cookies
- no auth
- no WebView
- no arbitrary user-entered request URLs
- no background requests

## Current resources

- Manga.in.ua (`manga-in-ua`), version 8
