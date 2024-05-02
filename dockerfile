FROM oven/bun:1 as base

WORKDIR /app


COPY bun.lockb package.json ./


RUN bun install


COPY . .

ENV DISCORD_TOKEN=""
ENV GUILD_ID=""
ENV MODERATOR_ROLE_ID=""
ENV DONOR_CHANNEL_ID=""
ENV ACCEPTOR_CHANNEL_ID=""

CMD ["bun", "run", "."]
