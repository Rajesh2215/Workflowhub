## Docker Commands We Used

### Build a single service image

```bash
docker build -t api-gateway -f ./apps/api-gateway/Dockerfile .
docker build -t auth-service -f ./apps/auth-service/Dockerfile .
docker build -t task-service -f ./apps/task-service/Dockerfile .
docker build -t notification-service -f ./apps/notification-service/Dockerfile .
```

---

### Start entire project

```bash
docker compose up -d
```

Build and start:

```bash
docker compose up -d --build
```

---

### Rebuild only one service

```bash
docker compose up -d --build api-gateway
docker compose up -d --build auth-service
docker compose up -d --build task-service
docker compose up -d --build notification-service
```

Recommended (avoid touching dependencies):

```bash
docker compose up -d --build --no-deps api-gateway
docker compose up -d --build --no-deps auth-service
docker compose up -d --build --no-deps task-service
docker compose up -d --build --no-deps notification-service
```

---

### Build only

```bash
docker compose build
```

Single service:

```bash
docker compose build api-gateway
```

---

### Start existing containers

```bash
docker compose start
```

Single service:

```bash
docker compose start task-service
```

---

### Stop containers

```bash
docker compose stop
```

Single service:

```bash
docker compose stop task-service
```

---

### Restart

```bash
docker compose restart
```

Single service:

```bash
docker compose restart api-gateway
```

---

### Shutdown project

```bash
docker compose down
```

Remove volumes also:

```bash
docker compose down -v
```

---

### Check running containers

```bash
docker compose ps
```

or

```bash
docker ps
```

---

### View logs

All services:

```bash
docker compose logs
```

Follow logs:

```bash
docker compose logs -f
```

Specific service:

```bash
docker compose logs -f api-gateway
docker compose logs -f auth-service
docker compose logs -f task-service
docker compose logs -f notification-service
```

Multiple services:

```bash
docker compose logs -f api-gateway task-service
```

---

### Enter a container

```bash
docker exec -it api-gateway sh
docker exec -it auth-service sh
docker exec -it task-service sh
docker exec -it notification-service sh
```

---

### Check environment variables

Inside container:

```bash
printenv
```

JWT:

```bash
printenv | grep JWT
```

RabbitMQ:

```bash
printenv | grep RABBIT
```

Mongo:

```bash
printenv | grep MONGO
```

---

### MongoDB access

Auth DB:

```bash
docker exec -it mongo-auth mongosh
```

Task DB:

```bash
docker exec -it mongo-task mongosh
```

Notification DB:

```bash
docker exec -it mongo-notification mongosh
```

Useful Mongo commands:

```javascript
show dbs
use auth_db
show collections
db.users.find().pretty()
```

---

### Networks

```bash
docker network ls
```

Inspect:

```bash
docker network inspect workflowhub_backend
```

---

### Volumes

```bash
docker volume ls
```

Inspect:

```bash
docker volume inspect workflowhub_mongo_auth_data
```

---

### Images

```bash
docker images
```

Remove image:

```bash
docker rmi workflowhub-api-gateway
```

---

### Container status

```bash
docker stats
```

---

## RabbitMQ Commands

RabbitMQ UI:

```text
http://localhost:15672
```

Default:

```text
username: guest
password: guest
```

Useful checks:

```bash
docker compose logs -f rabbitmq
```

---

# Current Architecture

```text
                        ┌─────────────────┐
                        │     Client      │
                        │ Postman / React │
                        └────────┬────────┘
                                 │ HTTP
                                 ▼
                    ┌─────────────────────────┐
                    │       API Gateway       │
                    │ NestJS + JwtAuthGuard   │
                    └───────────┬─────────────┘
                                │
                ┌───────────────┼────────────────┐
                │               │                │
                ▼               ▼                ▼
         RabbitMQ         RabbitMQ         RabbitMQ
         auth_queue       task_queue       notification_queue
                │               │                │
                ▼               ▼                ▼

      ┌────────────────┐ ┌────────────────┐ ┌──────────────────┐
      │  Auth Service  │ │  Task Service  │ │ Notification Svc │
      └───────┬────────┘ └───────┬────────┘ └─────────┬────────┘
              │                  │                    │
              │                  │ emit(task.created) │
              │                  └──────────┬─────────┘
              │                             │
              └─────────────────────────────┘
                            RabbitMQ
                       notification_queue

```

---

## Database Architecture (Recommended)

```text
┌──────────────────┐
│   Auth Service   │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  mongo-auth      │
│  auth_db         │
└──────────────────┘


┌──────────────────┐
│   Task Service   │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  mongo-task      │
│  task_db         │
└──────────────────┘


┌──────────────────────┐
│ Notification Service │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ mongo-notification   │
│ notification_db      │
└──────────────────────┘
```

---

## End-to-End Flow

```text
1. POST /auth/login
        │
        ▼
API Gateway
        │ send()
        ▼
Auth Service
        │
        ▼
JWT Token


2. POST /task/create
        │
Authorization: Bearer xxx
        │
        ▼
JwtAuthGuard
        │
        ▼
Task Service
        │
        ▼
Task Created
        │
        │ emit('task.created')
        ▼
notification_queue
        │
        ▼
Notification Service
        │
        ▼
Save Notification Log
```

This is now a proper event-driven NestJS microservices architecture with:

* API Gateway
* Auth Service
* Task Service
* Notification Service
* RabbitMQ
* Separate MongoDBs
* Shared JWT library
* Dockerized services
* Docker Compose orchestration.
