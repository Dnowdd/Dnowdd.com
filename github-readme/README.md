# GitHub profile README generator

Builds the animated README for [github.com/Dnowdd](https://github.com/Dnowdd) from the same content as the site (`messages/*.json`).

```bash
npm run readme              # pick a language interactively
npm run readme -- --lang en # one language
npm run readme -- --all     # every language in messages/
```

Output goes to `github-readme/dist/<locale>/` (git-ignored). Copy `README.md` and `assets/` from there into the root of the `Dnowdd/Dnowdd` repository.

## Where the content comes from

| README part | Source in `messages/<locale>.json` |
|---|---|
| Header | `hero.subtitle`, `hero.title`, `hero.tagline`, `readme.status` |
| About | `about.label`, `about.title`, `about.statement`, `about.facts` |
| Stack | `readme.stack` |
| Projects | `projects.title`, `projects.heading`, every item with `featured: true` (`title`, `summary`, `tags`, `image`, GitHub link) |
| Contact | `contact.label`, `contact.title`, `contact.links` |

A new language is a new `messages/<locale>.json` plus its code in `i18n/routing.ts`; the script lists it automatically.

All text is converted to vector paths with the Geist fonts from the `geist` package, so the SVGs render the same everywhere without loading a font.
