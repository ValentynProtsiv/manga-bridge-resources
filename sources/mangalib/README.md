# MangaLib

MangaLib is a Russian-language MangaBridge resource package.

This package contains metadata only. The compatible runtime adapter is implemented in the MangaBridge app as `mangaLib`.

## Safety

- Uses fixed HTTPS JSON endpoints from `api.cdnlibs.org`.
- Uses fixed resource-owned headers required by the source: `Site-Id` for API requests and `Referer` for reader images.
- Does not use cookies, auth, WebView, redirects, or user-entered request URLs.
