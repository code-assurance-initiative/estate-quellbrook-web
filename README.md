# Quellbrook Operations Console

The web console of Quellbrook Freight's operations platform. Customer-service operators find and read orders;
dispatchers (from sprint 2) plan the day on the dispatch board. It is a React single-page application built with
Vite and served as static files by nginx; every call goes to the API gateway under `/api` on the same host, and the
session is the ingress authentication proxy's cookie — the console never handles a token.

**Owner:** the Edge team (`#team-edge`). **System:** Quellbrook operations platform (see `catalog-info.yaml`).

## Screens

| Path           | Screen                                 | Gateway routes         |
| -------------- | -------------------------------------- | ---------------------- |
| `/orders`      | Orders, newest first, a page at a time | `GET /api/orders`      |
| `/orders/{id}` | One order                              | `GET /api/orders/{id}` |

## Build and run

Requires Node.js 22 (`.nvmrc`). In development Vite proxies `/api` to a gateway on `http://localhost:8080`.

```sh
npm ci
npm run dev        # http://localhost:5173
npm run build      # type-check and build into dist/
```

## Testing

```sh
npm test               # component and unit tests (Vitest, Testing Library, jsdom)
npm run test:coverage  # with coverage thresholds
npm run lint && npm run typecheck
```

The tests render the real components and replace `fetch` with fixed answers per path; no test touches the network.

## Architecture

See [docs/architecture.md](docs/architecture.md) and [docs/adr](docs/adr).

## Deployment

A published GitHub release builds the nginx image (`.github/workflows/release.yml`); the manual `deploy.yml` workflow
rolls it out to the `quellbrook-edge` namespace (`deploy/k8s/`), behind the ingress and the authentication proxy.
nginx sends the security headers (`nginx/default.conf`).

## Contributing

Open a pull request against `main`. CI (format, lint, types, build, tests with coverage, npm audit) must be green and
CodeQL must report no new alerts. Record user-visible changes in `CHANGELOG.md`.

## Licence

MIT; see [LICENSE](LICENSE).
