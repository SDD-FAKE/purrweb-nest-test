COMPOSE=docker compose

up:
	$(COMPOSE) up

up-d:
	$(COMPOSE) up -d

down:
	$(COMPOSE) down

restart: down up

seed:
	$(COMPOSE) run --rm app npx prisma db seed

unit-test:
	$(COMPOSE) run --rm app npm test

logs-error:
	docker exec -it nest-app tail -f /app/logs/error.log

export-logs:
	@echo "Exporting logs to ./exported-logs/..."
	@mkdir -p ./exported-logs
	@docker cp nest-app:/app/logs/. ./exported-logs/ 2>/dev/null || echo "Container not running or no logs yet"
	@ls -la ./exported-logs/