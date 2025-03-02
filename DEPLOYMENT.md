# Deployment Guide

This guide provides instructions for deploying your BetterHomepage application using Docker Compose with Traefik for HTTPS support.

## Prerequisites

- Docker and Docker Compose installed on your server
- A domain name pointed to your server's IP address
- Basic knowledge of terminal commands

## Deployment Steps

### 1. Prepare Environment Variables

Edit the `.env` file with your actual settings:

```bash
# Update with your actual domain and email
DOMAIN=yourdomain.com
ACME_EMAIL=your-email@example.com
```

### 2. Build and Deploy

Build and start the application with Docker Compose:

```bash
# Build the images
docker-compose build

# Start the services in detached mode
docker-compose up -d
```

### 3. Verify Deployment

Check if the services are running correctly:

```bash
# View all running containers
docker-compose ps

# Check logs
docker-compose logs -f traefik
docker-compose logs -f web
```

Visit your application at https://yourdomain.com

### 4. Common Operations

#### Restart services

```bash
docker-compose restart
```

#### Stop all services

```bash
docker-compose down
```

#### Update application (after code changes)

```bash
git pull
docker-compose build web
docker-compose up -d
```

#### View logs

```bash
# All services
docker-compose logs

# Specific service
docker-compose logs -f web
docker-compose logs -f traefik
```

## SSL Certificates

Traefik automatically handles SSL certificate issuance and renewal through Let's Encrypt. The certificates are stored in the `./letsencrypt` directory.

If you need to force certificate renewal:

```bash
docker-compose restart traefik
```

## Troubleshooting

### Certificate Issues

If you're having trouble with SSL certificates:

1. Make sure your domain is correctly pointed to your server's IP address
2. Check that ports 80 and 443 are open on your firewall
3. Examine Traefik logs for specific errors:

```bash
docker-compose logs -f traefik
```

### Container Won't Start

Check logs for errors:

```bash
docker-compose logs web
```

### DNS Configuration

To verify your domain is correctly pointing to your server:

```bash
dig +short yourdomain.com
```

This should return your server's IP address.

## Security Considerations

For production environments:

1. Use strong passwords for any admin interfaces
2. Regularly update your containers (Watchtower helps with this)
3. Consider setting up a backup system for your data
4. Monitor your server for unusual activity

## Scaling

To scale services horizontally (if needed and if your application supports it):

```bash
docker-compose up -d --scale web=3
```

Note: This requires additional setup with a load balancer.

## Production Considerations

For production environments, consider:

1. Using a proper reverse proxy like Nginx or Traefik
2. Setting up SSL certificates (Let's Encrypt)
3. Configuring proper database backups
4. Implementing monitoring (Prometheus, Grafana)
5. Setting up CI/CD pipelines for automated deployments
