# 🎵 Home Library Service

**Home Library Service** is a REST API for managing users, artists, tracks, albums, and favorites. This project is implemented using **Nest.js**, **TypeORM**, and **PostgreSQL** as the database. The project is containerized using **Docker** for seamless deployment in a multi-container environment.

---

## 📑 Features

The API allows you to:

- Manage users: create, read, update, and delete.
- Manage artists, tracks, and albums.
- Add/remove items (artists, tracks, albums) to/from favorites.

---

## 🚀 Technologies Used

- **Node.js** (v22.x.x)
- **Nest.js**: Framework for building REST APIs.
- **PostgreSQL**: Relational database for data storage.
- **TypeORM**: ORM for database interactions.
- **Docker**: Containerization for simplified deployment.
- **docker-compose**: For defining multi-container environments.

---

## 📂 Project Structure

```
src/
├── album/         # Module for albums
├── artist/        # Module for artists
├── track/         # Module for tracks
├── user/          # Module for users
├── favs/          # Module for managing favorites
├── migrations/    # Directory for database migrations
└── app.module.ts  # Main application module
```

---

## ⚙️ Installation and Setup

### 📋 Prerequisites

Ensure you have the following installed:

- **Node.js** (version 22.x.x or later)
- **npm** (Node.js package manager)
- **Docker** and **Docker Compose**

### 📥 Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/natanchik/nodejs2025Q2-service.git
   cd nodejs2025Q2-service
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` according to `.env.example` file.

---

### 🐳 Running with Docker

1. Build and start the containers:

   ```bash
   docker-compose up --build
   ```

2. The application will be available at:

   ```
   http://localhost:4000
   ```

3. To connect to the database, you can use the following settings:

   ```
   Host: localhost
   Port: 5432
   User: user
   Password: password
   Database: homelibrary
   ```

4. To stop the containers:
   ```bash
   docker-compose down
   ```

---

### 🚧 Manual Start

1. Apply database migrations:

   ```bash
   npm run migration:run
   ```

2. Start the development server:

   ```bash
   npm run start
   ```

3. Open the application at:
   ```
   http://localhost:4000
   ```

---

## 📦 Docker Hub

The Docker image for this application is available on Docker Hub:

- [Docker Hub Image](https://hub.docker.com/r/natanchik/nodejs2025q2-service)

---

## 🔒 Security Scan for Docker Images

To scan the built Docker image for vulnerabilities, run:

```bash
docker scan natanchik/nodejs2025Q2-service:latest
```

---

## 🧪 Testing

1. Run the following command:

   ```bash
   npm run test
   ```

2. A coverage summary:

   ```bash
   npm run test:cov
   ```

---

## 📏 Linting and Formatting

1. Check for linting issues:

   ```bash
   npm run lint
   ```

2. Format your code using Prettier:
   ```bash
   npm run format
   ```

---

## 📜 API Endpoints

### Users (`/user`)

| Method | URL         | Description            |
| ------ | ----------- | ---------------------- |
| GET    | `/user`     | Retrieve all users     |
| GET    | `/user/:id` | Retrieve a user by ID  |
| POST   | `/user`     | Create a new user      |
| PUT    | `/user/:id` | Update user's password |
| DELETE | `/user/:id` | Delete a user          |

---

### Artists (`/artist`)

| Method | URL           | Description              |
| ------ | ------------- | ------------------------ |
| GET    | `/artist`     | Retrieve all artists     |
| GET    | `/artist/:id` | Retrieve an artist by ID |
| POST   | `/artist`     | Create a new artist      |
| PUT    | `/artist/:id` | Update an artist         |
| DELETE | `/artist/:id` | Delete an artist         |

---

### Tracks (`/track`)

| Method | URL          | Description            |
| ------ | ------------ | ---------------------- |
| GET    | `/track`     | Retrieve all tracks    |
| GET    | `/track/:id` | Retrieve a track by ID |
| POST   | `/track`     | Create a new track     |
| PUT    | `/track/:id` | Update a track         |
| DELETE | `/track/:id` | Delete a track         |

---

### Albums (`/album`)

| Method | URL          | Description             |
| ------ | ------------ | ----------------------- |
| GET    | `/album`     | Retrieve all albums     |
| GET    | `/album/:id` | Retrieve an album by ID |
| POST   | `/album`     | Create a new album      |
| PUT    | `/album/:id` | Update an album         |
| DELETE | `/album/:id` | Delete an album         |

---

### Favorites (`/favs`)

| Method | URL                | Description                     |
| ------ | ------------------ | ------------------------------- |
| GET    | `/favs`            | Retrieve all favorites          |
| POST   | `/favs/artist/:id` | Add an artist to favorites      |
| DELETE | `/favs/artist/:id` | Remove an artist from favorites |
| POST   | `/favs/album/:id`  | Add an album to favorites       |
| DELETE | `/favs/album/:id`  | Remove an album from favorites  |
| POST   | `/favs/track/:id`  | Add a track to favorites        |
| DELETE | `/favs/track/:id`  | Remove a track from favorites   |

---
