# Deployment Guide

This guide provides instructions for deploying your application using Docker Compose.

## Prerequisites

- Docker and Docker Compose installed on your server
- Git (to clone your repository)
- Basic knowledge of terminal commands

## Deployment Steps

### 1. Prepare Environment Variables

Create a `.env` file based on the provided `.env.example`:

```bash
cp .env.example .env
```

Edit the `.env` file with your actual settings:

```bash
nano .env
```

### 2. Build and Deploy

Build and start the application with Docker Compose:

```bash
# Build the images
docker compose build

# Start the services in detached mode
docker compose up -d
```

### 3. Verify Deployment

Check if the services are running correctly:

```bash
# View all running containers
docker compose ps

# Check logs
docker compose logs -f web
```

Visit your application at http://your-server-ip:3000 or the configured domain.

### 4. Common Operations

#### Restart services

```bash
docker compose restart
```

#### Stop all services

```bash
docker compose down
```

#### Update application (after code changes)

```bash
git pull
docker compose build web
docker compose up -d
```

#### View logs

```bash
# All services
docker compose logs

# Specific service
docker compose logs -f web
```

## Scaling

To scale services horizontally (if needed and if your application supports it):

```bash
docker compose up -d --scale web=3
```

Note: This requires additional setup with a load balancer.

## Production Considerations

For production environments, consider:

1. Using a proper reverse proxy like Nginx or Traefik
2. Setting up SSL certificates (Let's Encrypt)
3. Configuring proper database backups
4. Implementing monitoring (Prometheus, Grafana)
5. Setting up CI/CD pipelines for automated deployments

## Troubleshooting

### Container Won't Start

Check logs for errors:

```bash
docker compose logs web
```

### Database Connection Issues

Verify your database connection settings in the `.env` file. Ensure the database container is running:

```bash
docker compose ps db
```

### Port Conflicts

If port 3000 is already in use, modify the port mapping in `docker compose.yml`:

```yaml
ports:
  - "3001:3000" # Maps host port 3001 to container port 3000
```
