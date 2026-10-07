# syntax=docker/dockerfile:1
# docker build -t ghcr.io/code-assurance-initiative/quellbrook-web .
#
# Base images pinned by digest; Dependabot proposes the next digest. No HEALTHCHECK: the image runs only on
# Kubernetes, which ignores it; probes live in deploy/k8s/deployment.yaml.
FROM node:26-alpine@sha256:0b36e8c136b94cd4fcf02188228e76c31ad5872eef3fec8cbd2eee500cfd9e80 AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts
COPY index.html tsconfig.json vite.config.ts ./
COPY public/ public/
COPY src/ src/
RUN npm run build

FROM nginxinc/nginx-unprivileged:1.29-alpine@sha256:0c79d56aee561a1d81c63f00eee5fb5fe29279560cdc55e91425133104c7fbe6
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/ /usr/share/nginx/html/
EXPOSE 8080
# The image's unprivileged nginx user (UID 101) would also do; a UID above any host account range is used so the
# kubelet can verify runAsNonRoot by number.
USER 10001:10001
