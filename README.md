# URL Shortener API Documentation

## Overview

The URL Shortener API allows users to shorten long URLs, manage custom aliases, and access detailed analytics for each shortened URL.

---

## Features

1. **User Authentication**

    - Seamless authentication using Google Sign-In.

2. **Short URL Management**

    - Create short URLs with optional custom aliases.
    - Redirect users to the original URL using the alias.

3. **Analytics**
    - Access analytics for individual URLs, topics, and overall user activity.

---

## Technical Stack

-   **Backend Framework**: Node.js
-   **Framework**: Express.js
-   **Database**: PostgreSQL
-   **ORM**: Sequelize

---

## Environment Variables

The application requires the following environment variables:

-   `DB_URL`: Database connection URL
-   `GOOGLE_CLIENT_ID`: Google OAuth client ID
-   `GOOGLE_CLIENT_SECRET`: Google OAuth client secret
-   `JWT_SECRET`: Secret key for JWT token generation
-   `BASE_URL`: Base URL for the application
-   `REDIS_HOST`: Host URL for the Redis server
-   `REDIS_PORT`: Port on which the Redis server is running
-   `REDIS_PASSWORD`: Password for authenticating with the Redis server
-   `REDIS_USERNAME`: Username for authenticating with the Redis server

---

## Commands

-   **Start the application**: `npm start`
-   **Run migrations**: `npx sequelize-cli db:migrate`

---

## API Endpoints

### User Authentication

#### 1. Google Sign-In

-   **Endpoint**: `/google`
-   **Method**: `POST`
-   **Description**: Authenticates the user using Google OAuth.
-   **Sample Response**:
    ```json
    {
    	"status": true,
    	"message": "User authenticated successfully",
    	"token": "<JWT_TOKEN>"
    }
    ```

### Short URL Management

#### 1. Create Short URL

-   **Endpoint**: `/api/shorten`
-   **Method**: `POST`
-   **Description**: Create a new short URL.
-   **Request Body**:
    ```json
    {
    	"longUrl": "https://example.com",
    	"customAlias": "my-alias",
    	"topic": "marketing"
    }
    ```
-   **Sample Response**:
    ```json
    {
    	"status": true,
    	"shortUrl": "https://short.ly/my-alias",
    	"createdAt": "2024-01-01T12:00:00Z"
    }
    ```

#### 2. Redirect to Original URL

-   **Endpoint**: `/api/v1/shorten/:alias`
-   **Method**: `GET`
-   **Description**: Redirects to the original long URL.
-   **Sample Response**:
    -   HTTP 302 Redirect to the long URL.

### Analytics

#### 1. Get URL Analytics

-   **Endpoint**: `/api/v1/analytics/:alias`
-   **Method**: `GET`
-   **Description**: Retrieve analytics for a specific short URL.
-   **Sample Response**:
    ```json
    {
    	"totalClicks": 150,
    	"uniqueClicks": 120,
    	"clicksByDate": [
    		{ "date": "2024-01-01", "clicks": 30 },
    		{ "date": "2024-01-02", "clicks": 20 }
    	],
    	"osType": [
    		{ "osName": "Windows", "uniqueClicks": 50, "uniqueUsers": 45 },
    		{ "osName": "iOS", "uniqueClicks": 70, "uniqueUsers": 60 }
    	],
    	"deviceType": [
    		{ "deviceName": "Mobile", "uniqueClicks": 90, "uniqueUsers": 80 },
    		{ "deviceName": "Desktop", "uniqueClicks": 60, "uniqueUsers": 50 }
    	]
    }
    ```

#### 2. Get Topic-Based Analytics

-   **Endpoint**: `/api/v1/analytics/topic/:topic`
-   **Method**: `GET`
-   **Description**: Retrieve analytics for all URLs under a specific topic.
-   **Sample Response**:
    ```json
    {
    	"totalClicks": 500,
    	"uniqueClicks": 400,
    	"clicksByDate": [
    		{ "date": "2024-01-01", "clicks": 150 },
    		{ "date": "2024-01-02", "clicks": 120 }
    	],
    	"urls": [
    		{ "shortUrl": "https://short.ly/alias1", "totalClicks": 300, "uniqueClicks": 250 },
    		{ "shortUrl": "https://short.ly/alias2", "totalClicks": 200, "uniqueClicks": 150 }
    	]
    }
    ```

#### 3. Get Overall Analytics

-   **Endpoint**: `/api/v1/analytics/overall`
-   **Method**: `GET`
-   **Description**: Retrieve overall analytics for all short URLs created by the user.
-   **Sample Response**:
    ```json
    {
    	"totalUrls": 10,
    	"totalClicks": 1500,
    	"uniqueClicks": 1200,
    	"clicksByDate": [
    		{ "date": "2024-01-01", "clicks": 500 },
    		{ "date": "2024-01-02", "clicks": 400 }
    	],
    	"osType": [
    		{ "osName": "Windows", "uniqueClicks": 700, "uniqueUsers": 650 },
    		{ "osName": "Android", "uniqueClicks": 800, "uniqueUsers": 750 }
    	],
    	"deviceType": [
    		{ "deviceName": "Mobile", "uniqueClicks": 1000, "uniqueUsers": 900 },
    		{ "deviceName": "Desktop", "uniqueClicks": 500, "uniqueUsers": 450 }
    	]
    }
    ```

---
