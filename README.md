# Docker Tutorial: React Application with Single-Stage vs Multi-Stage Builds

This tutorial demonstrates the difference between single-stage and multi-stage Docker builds using a React application. You'll learn how to optimize Docker images for production deployment.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Structure](#project-structure)
3. [Understanding the React Application](#understanding-the-react-application)
4. [Single-Stage Build (Larger Image)](#single-stage-build-larger-image)
5. [Multi-Stage Build (Optimized Image)](#multi-stage-build-optimized-image)
6. [Comparing Image Sizes](#comparing-image-sizes)
7. [Best Practices](#best-practices)
8. [Commands Reference](#commands-reference)
9. [Troubleshooting](#troubleshooting)

## Prerequisites

Before starting this tutorial, ensure you have:

- **Docker Desktop** installed and running
- **Node.js** (version 16 or higher) - for local development
- **Git** (optional) - for version control
- Basic understanding of React and command line

### Verify Docker Installation

```bash
docker --version
docker-compose --version
```

Expected output:
```
Docker version 24.0.x, build xxxxx
Docker Compose version v2.20.x
```

## Project Structure

```
react-docker-tutorial/
├── public/
│   └── index.html              # HTML template
├── src/
│   ├── components/
│   │   ├── Header.js           # Header component
│   │   ├── Header.css          # Header styles
│   │   ├── Counter.js          # Interactive counter
│   │   ├── Counter.css         # Counter styles
│   │   ├── TodoList.js         # Todo list component
│   │   └── TodoList.css        # Todo styles
│   ├── App.js                  # Main React component
│   ├── App.css                 # App styles
│   ├── index.js                # React entry point
│   └── index.css               # Global styles
├── Dockerfile                  # Multi-stage Dockerfile (optimized)
├── Dockerfile.single-stage     # Single-stage Dockerfile (larger)
├── .dockerignore              # Files to ignore in Docker build
├── package.json               # Node.js dependencies
└── README.md                  # This file
```

## Understanding the React Application

This tutorial includes a fully functional React application with:

- **Interactive Counter**: Demonstrates React state management
- **Todo List**: Shows CRUD operations and local storage
- **Responsive Design**: Modern CSS with gradients and animations
- **Component Architecture**: Modular React components

### Key Features:

1. **Header Component**: Displays branding and navigation
2. **Counter Component**: Interactive counter with increment/decrement
3. **Todo List Component**: Task management with add/delete/toggle
4. **CSS Styling**: Professional styling with CSS Grid and Flexbox

## Single-Stage Build (Larger Image)

The single-stage approach builds and runs the application in a single Docker image, resulting in a larger final image.

### Dockerfile.single-stage Analysis

```dockerfile
# Single-Stage Dockerfile (Larger Image Size)
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install                    # Installs ALL dependencies
COPY . .
RUN npm run build                  # Builds the app
EXPOSE 3000
RUN npm install -g serve          # Additional runtime dependency
CMD ["serve", "-s", "build", "-l", "3000"]
```

### Issues with Single-Stage:

**Large Image Size** (~200-500MB): Contains all node_modules including dev dependencies
**Security Risk**: Includes build tools and source code in production
**Slow Deployment**: Larger images take longer to pull and deploy
**Higher Costs**: More storage and bandwidth usage
**Attack Surface**: Unnecessary packages increase vulnerability risk

### Build Single-Stage Image

```bash
# Build the single-stage image
docker build -f Dockerfile.single-stage -t react-app-single:latest .

# Check image size
docker images react-app-single

# Run the container
docker run -d -p 3001:3000 --name react-single react-app-single:latest

# View the application
open http://localhost:3001
```

## Multi-Stage Build (Optimized Image)

The multi-stage approach separates the build environment from the production runtime, creating a much smaller and more secure final image.

### Dockerfile Analysis (Multi-Stage)

```dockerfile
# ===================================
# STAGE 1: Build Stage
# ===================================
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production=false  # Install build dependencies
COPY . .
RUN npm run build                   # Create production build

# ===================================
# STAGE 2: Production Stage
# ===================================
FROM nginx:alpine AS production

# Copy ONLY the built files (not source code or node_modules)
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Advantages of Multi-Stage:

**Small Image Size** (~20-50MB): Only contains production assets
**Enhanced Security**: No build tools or source code in production
**Fast Deployment**: Smaller images deploy faster
**Production Ready**: Uses nginx for optimal static file serving
**Cost Effective**: Reduced storage and bandwidth costs
**Best Practices**: Follows Docker and security best practices

### Build Multi-Stage Image

```bash
# Build the multi-stage image
docker build -t react-app-multi:latest .

# Check image size
docker images react-app-multi

# Run the container
docker run -d -p 3000:80 --name react-multi react-app-multi:latest

# View the application
open http://localhost:3000
```

## Comparing Image Sizes

Run both builds and compare their sizes:

```bash
# Build both images
docker build -f Dockerfile.single-stage -t react-app-single:latest .
docker build -t react-app-multi:latest .

# Compare image sizes
docker images | grep react-app

# Expected output (approximate):
# react-app-single    latest    abc123    2 minutes ago    450MB
# react-app-multi     latest    def456    1 minute ago     45MB
```

### Size Comparison Analysis

| Approach | Image Size | Build Time | Deploy Time | Security |
|----------|------------|------------|-------------|----------|
| Single-Stage | ~450MB | Fast | Slow | Lower |
| Multi-Stage | ~45MB | Slower | Fast | Higher |

**Memory Usage Reduction**: ~90% smaller with multi-stage builds!

## Best Practices

### 1. Use .dockerignore

Always include a `.dockerignore` file to exclude unnecessary files:

```
node_modules
npm-debug.log
.git
.gitignore
README.md
.env
coverage
.nyc_output
```

### 2. Layer Caching Optimization

```dockerfile
# ✅ Good: Copy package.json first for better caching
COPY package*.json ./
RUN npm ci --only=production=false

# ❌ Bad: Copy everything first (breaks caching)
COPY . .
RUN npm install
```

### 3. Use Specific Base Images

```dockerfile
# ✅ Good: Specific version
FROM node:18-alpine AS builder

# ❌ Bad: Latest tag (unpredictable)
FROM node:latest AS builder
```

### 4. Security Considerations

```dockerfile
# ✅ Good: Non-root user (add if needed)
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs

# ✅ Good: Minimal base image
FROM nginx:alpine AS production
```

## Commands Reference

### Development Commands

```bash
# Install dependencies locally
npm install

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

### Docker Commands

```bash
# Basic Docker commands
docker build -t <image-name> .                    # Build image
docker run -p 3000:80 <image-name>               # Run container
docker ps                                         # List running containers
docker images                                     # List images
docker stop <container-id>                       # Stop container
docker rm <container-id>                         # Remove container
docker rmi <image-name>                          # Remove image

# Advanced Docker commands
docker build --no-cache -t <image-name> .        # Build without cache
docker run -d --name <container-name> <image>    # Run detached
docker logs <container-name>                     # View logs
docker exec -it <container-name> /bin/sh        # Enter container
docker system prune                             # Clean up unused resources
```

### Image Inspection

```bash
# Inspect image layers
docker history <image-name>

# Detailed image information
docker inspect <image-name>

# Check image size
docker images <image-name>

# Analyze image layers (if dive is installed)
dive <image-name>
```

### Container Management

```bash
# View container resource usage
docker stats

# Copy files from container
docker cp <container>:/path/to/file ./local/path

# Monitor container logs in real-time
docker logs -f <container-name>

# Restart container
docker restart <container-name>
```

## Troubleshooting

### Common Issues and Solutions

#### 1. **Build Fails with "npm install" Error**

```bash
# Solution: Clear npm cache and rebuild
docker build --no-cache -t react-app:latest .
```

#### 2. **Container Exits Immediately**

```bash
# Check container logs
docker logs <container-name>

# Run container interactively to debug
docker run -it <image-name> /bin/sh
```

#### 3. **Application Not Accessible**

```bash
# Check if container is running
docker ps

# Verify port mapping
docker port <container-name>

# Check firewall/port availability
netstat -tulpn | grep :3000
```

#### 4. **Build Context Too Large**

```bash
# Check .dockerignore file
cat .dockerignore

# Verify build context size
docker build --progress=plain .
```

#### 5. **Out of Disk Space**

```bash
# Clean up unused Docker resources
docker system prune -a

# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune
```

### Performance Tips

1. **Use Build Args for Configuration**
   ```dockerfile
   ARG NODE_ENV=production
   ENV NODE_ENV=${NODE_ENV}
   ```

2. **Multi-Platform Builds**
   ```bash
   docker buildx build --platform linux/amd64,linux/arm64 -t react-app .
   ```

3. **Health Checks**
   ```dockerfile
   HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
     CMD curl -f http://localhost/ || exit 1
   ```

## Conclusion

This tutorial demonstrated the significant advantages of multi-stage Docker builds:

- **90% smaller image size** (450MB → 45MB)
- **Enhanced security** through minimal production images
- **Faster deployments** and reduced costs
- **Production-ready** setup with nginx

# docker-tutorial
