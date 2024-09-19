
# Task Management System

## Description

This Task Management System is designed to facilitate the creation, reading, updating, and deletion of tasks. Developed using NestJS, a progressive Node.js framework, this system provides a robust backend for task management.

## Project Setup

To get started with the project, follow these steps:

### Install Dependencies

Run the following command to install the required dependencies:

```bash
yarn install
```

### Compile and Run the Project

You can start the project in different modes:

- **Development Mode**: To start the project in development mode with automatic reloading, use:

  ```bash
  yarn run start:dev
  ```

- **Production Mode**: To start the project in production mode, use:

  ```bash
  yarn run start
  ```

## Docker Setup for PostgreSQL

If you need a PostgreSQL database for the project, you can use Docker to set up the container. Execute the following command to run the PostgreSQL container:

```bash
docker run --name postgres-nest -p 5432:5432 -e POSTGRES_PASSWORD=postgres -d postgres
```

## Docker Compose Full Setup

For a complete setup using Docker Compose, which includes both the application and PostgreSQL container, use the following command:

```bash
docker-compose up --build
```

This command will build and start all services defined in the `docker-compose.yml` file.

