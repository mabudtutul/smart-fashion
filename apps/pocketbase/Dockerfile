FROM alpine:3.20

ARG PB_VERSION=0.38.0

RUN apk add --no-cache ca-certificates unzip curl \
  && curl -fsSL "https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip" -o /tmp/pb.zip \
  && unzip /tmp/pb.zip -d /pb \
  && rm /tmp/pb.zip \
  && chmod +x /pb/pocketbase

WORKDIR /pb

COPY pb_migrations ./pb_migrations
COPY pb_hooks ./pb_hooks

# Set a strong secret in Railway/Render (required for stable encryption).
ENV PB_ENCRYPTION_KEY=change-me-before-production

VOLUME ["/data"]
EXPOSE 8090

CMD ["/bin/sh", "-c", "exec ./pocketbase serve --http=0.0.0.0:${PORT:-8090} --dir=/data --migrationsDir=./pb_migrations --hooksDir=./pb_hooks --hooksWatch=false --encryptionEnv=PB_ENCRYPTION_KEY"]
