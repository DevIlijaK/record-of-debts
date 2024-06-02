FROM oven/bun:1.0.5-alpine
# Instalacija Pythona i povezanih paketa
RUN apk add python3 make gcc g++

WORKDIR /app

COPY package.json .
COPY bun.lockb .

RUN bun install

COPY src src
COPY tsconfig.json .
COPY public public

ENV NODE_ENV production
ENV DATABASE_URL libsql://igor-blog-devilijak.turso.io
ENV DATABASE_AUTH_TOKEN eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOiIyMDIzLTEwLTMxVDExOjM5OjQ3LjgyMjU0Nzg4N1oiLCJpZCI6IjAwN2ZjNTVmLTc3ZTItMTFlZS05MTI3LTU2Mjc5ZGZlNDJmMyJ9.eYlxSSQnNh0ydl8A9bRfXidlre1hTx_7J1zgthSzY4sVq5r5Be68UBdkWvsVF20345VmRc6NcNy4tJ9Tlj_TAw
ENV GITHUB_CLIENT_ID f30001b2cde7247567fa
ENV GITHUB_CLIENT_SECRET ca14e1d7d333dfe74f292983c760f64dfd6ea868
CMD ["bun", "src/index.tsx"]

EXPOSE 3000
