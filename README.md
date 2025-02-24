# URL Health Monitor

URL Health Monitor is a web application that allows users to monitor the health and status of various URLs. The application periodically checks the URLs and provides detailed information about their status and response times.

## Features

- User authentication (sign up, login)
- Add, edit, and delete URL monitors
- View the status and response times of monitored URLs
- View historical data for each URL monitor

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Getting Started

Follow these steps to set up and run the application using Docker:

1. **Clone the repository:**

   ```sh
   git clone https://github.com/xNobody/URL-Health-Monitor.git
   cd URL-Health-Monitor
   ```

2. **Build and start the Docker containers:**

   ```sh
   docker compose down
   docker system prune --all --force --volumes
   docker compose up --build -d
   ```

3. **Access the application:**

   Open your web browser and navigate to:

   ```
   http://localhost:3001
   ```

4. **Sign up for a new account or log in with an existing account.**

5. **Start adding and monitoring URLs!**

## Stopping the Application

To stop the Docker containers, run:

```sh
docker compose down
```

## Cleaning Up

To remove all Docker containers, images, and volumes, run:

```sh
docker system prune --all --force --volumes
```
