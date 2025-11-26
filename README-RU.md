###### [Переключиться на английский](https://github.com/SDD-FAKE/purrweb-nest-test/blob/main/README.md)

# Nest.js Тестовый Проект

<hr />

## Окружение и Технологический стек 🧰 

**Приложение**
- Nest.js: 11.0.12  
- TypeScript: 5.7.3  

**База данных**
- PostgreSQL 15  

**ORM**
- Prisma ORM 6.19.0  

**Контейнеризация**
- Docker 28.1.1  
- Docker Compose 2.35.1  

<hr />

## 📄 Содержание

- [Окружение и Технологический стек](#окружение-и-технологический-стек-)
- [.env конфигурация](#env-конфигурация-)
- [Запуск проекта](#запуск-проекта-)
  - [Через Docker Compose](#через-docker-compose)
  - [Без Docker](#без-docker)
- [Swagger](#swagger-)
- [Доступные команды](#доступные-команды-)
- [FAQ](#faq-)
- [Ссылки и ресурсы](#ссылки-и-ресурсы-)

<hr />

## .env Конфигурация 🔧 

### База данных (для Docker)

```bash
DB_USER=postgres #Пользователь базы данных
DB_PASSWORD=postgres #Пароль базы данных
DB_NAME=purrweb #Название базы данных
```

### Режим работы приложения

```bash
NODE_ENV=development #Режим работы приложения
```

Режимы:
- `development` — debug-логи, авто-перезапуск, включён Swagger  
- `production` — собранный билд, Swagger выключен

### Порт приложения

```bash
PORT=3000 #Также используется в Docker
```

### Домена для cookie (refresh token)

```bash
COOKIE_DOMAIN=localhost #Используется для установки refresh-токенов и работы эндпоинта обновления токена
```

### URL базы данных (для Prisma)

```bash
DATABASE_URL=postgresql://postgres:postgres@nest-test-db:5432/purrweb #URL для миграций, сидов и работы Prisma Client
```

### Настройки JWT

```bash
JWT_SECRET=your-secret-key #Секретный ключ для JWT токенов
JWT_ACCESS_TOKEN_TTL=2h #Срок действия access-токена
JWT_REFRESH_TOKEN_TTL=7d #Срок действия refresh-токена
```

### Тема Swagger

```bash
SWAGGER_THEME=dark #Тема Swagger UI
```

Поддерживаемые темы:  
classic, dark-monokai, dark, dracula, feeling-blue, flattop, gruvbox, material, monokai, muted, newspaper, nord-dark, one-dark, outline.

<hr />

## Запуск проекта 🚀 

### Через Docker Compose

Запуск и подключение (foreground):

```bash
make up
# эквивалент: docker compose up
```

Запуск в фоне (detached):

```bash
make up-d
# эквивалент: docker compose up -d
```

### Без Docker

Генерация Prisma Client:

```bash
npx prisma generate
```

Применение миграций:

```bash
npx prisma migrate deploy
```

Запуск в режиме разработки:

```bash
npm run start:dev
```

<hr />

## Swagger 📗

Чтобы включить Swagger, переменная MODE_ENV должна быть установлена в значение `development`.  
Swagger доступен по адресу `/docs`.

<hr />

## Доступные команды 🔨 

Ниже приведены доступные команды и их описание.

- **Запуск (foreground)**

```bash
make up
# Запуск контейнеров через `docker compose up`
```

- **Запуск (detached/background)**

```bash
make up-d
# Запуск контейнеров через `docker compose up -d`
```

- **Перезапуск контейнеров**

```bash
make restart
# Выполняемая команда: docker compose down && docker compose up
```

- **Запуск модульных тестов**

```bash
make unit-test
# Выполняет: docker compose run --rm app npm run test
```

- **Logs**

```bash
make logs-error # Отслеживать лог ошибок
# Выполняет: docker exec -it nest-app tail -f /app/logs/error.log
```

```bash
make export-logs # Копирует логи из контейнера в директорию ./exported-logs/ 
# Выполняет: 
#  @echo "Exporting logs to ./exported-logs/..."
#  @mkdir -p ./exported-logs
#  @docker cp nest-app:/app/logs/. ./exported-logs/ 2>/dev/null || echo "Container not running or no logs yet"
#  @ls -la ./exported-logs/
```

- **Сид базы данных (внутри контейнера)**

```bash
make seed
# Выполняет: docker compose run --rm app npx prisma db seed
```

- **Сид базы данных (локально)**

```bash
npx prisma db seed
```

- **Генерация Prisma Client**

```bash
npx prisma generate
```

- **Применение миграций**

```bash
npx prisma migrate deploy
```

- **Запуск приложения локально (dev)**

```bash
npm run start:dev
```

<hr />

## FAQ ❓ 

### Почему GET /:id не защищён?

В тестовом задании требуется проверять права только при **изменении или удалении** сущностей.  
Для полной изоляции данных между пользователями нужна сущность вроде “workspace/team”.

---

### Почему эндпоинт refresh token не работает в Swagger?

Swagger UI **не умеет отправлять httpOnly cookie**, поэтому cookie `refresh_token` нельзя передать через интерфейс Swagger.  
Для проверки работы refresh-логики используйте внешние клиенты, например: Postman, Insomnia или curl.

<hr />

## Ссылки и ресурсы 🔗 

Диаграмма базы данных:
- [dbdocs](https://dbdocs.io/danilove.sergey2016/purrweb-nest-test?view=relationships): https://dbdocs.io/danilove.sergey2016/purrweb-nest-test?view=relationships
- [PDF/PNG export](https://github.com/SDD-FAKE/purrweb-nest-test/tree/main/diagrams): https://github.com/SDD-FAKE/purrweb-nest-test/tree/main/diagrams
