# Resource release checklist

Use this checklist for each new or updated source package.

## Metadata

- [ ] Resource id is stable and lowercase kebab-case.
- [ ] `adapterKey` matches an app-side registered adapter.
- [ ] Version is incremented for user-visible behavior changes.
- [ ] Language, description, capabilities, and safety metadata are accurate.
- [ ] `catalog/sources.json`, `index.json`, `index.min.json`, and `sources/<id>/source.json` agree.
- [ ] `node scripts/validate-catalog.js` passes.

## App adapter

- [ ] Home browsing works if declared.
- [ ] Search works if declared.
- [ ] Covers and source URLs resolve safely.
- [ ] Title details and chapters work if declared.
- [ ] Reader pages work if declared.
- [ ] Parser tests cover real fixture shapes.
- [ ] Network calls go only through the guarded helper.
- [ ] No cookies, auth, WebView, or unrestricted custom headers are introduced.

## User flow

- [ ] Add repository URL in Sources -> Available.
- [ ] Install or update the resource.
- [ ] Open the source.
- [ ] Search and open a title.
- [ ] Add a title to Library.
- [ ] Open a chapter in Reader.
- [ ] Run manual Library update.
- [ ] Verify disabled/uninstalled states fail defensively.
