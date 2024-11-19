## **Social Media Backend API Documentation**

Welcome to the Social Media Backend! This documentation includes a complete guide to set up and run the project, as well as a detailed API reference for authentication, user management, and post features.

---

## **How to Run the Project**

### **Prerequisites**

Ensure you have the following installed on your system:
- **Node.js** (v14 or later)
- **MongoDB** (Local or cloud instance like [MongoDB Atlas](https://www.mongodb.com/atlas))
- **Redis** (Local or cloud instance like [Redis Enterprise](https://redis.com/))
- **Git**

---

### **Project Setup**

1. **Clone the Repository**
   ```bash
   git clone https://github.com/RiteshDhapate/Social-Media-Backend.git
   cd Social-Media-Backend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**

   Create a `.env` file in the project root with the following variables:
   ```
   MONGO_URI=mongodb://localhost:27017/social-media-db
   REDIS_URL=redis://localhost:6379
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

4. **Run the Application**

   Start both the backend server and your MongoDB/Redis instances.

   ```bash
   npm start
   ```

   The server will run on `http://localhost:5000`.

5. **Testing APIs**

   Use tools like [Postman](https://www.postman.com/) or [cURL](https://curl.se/) to test the endpoints.

---

### **Folder Structure**

```
backend/
├── config/
│   ├── db.js                 # MongoDB and Redis connection
├── controllers/
│   ├── authController.js     # Handles user authentication
│   ├── postController.js     # Handles posts and feed logic
│   └── userController.js     # Handles friend requests
├── middleware/
│   ├── authMiddleware.js     # Authentication middleware
├── models/
│   ├── postModel.js          # MongoDB schema for posts
│   ├── userModel.js          # MongoDB schema for users
├── routes/
│   ├── authRoutes.js         # Routes for auth APIs
│   ├── postRoutes.js         # Routes for post APIs
│   └── userRoutes.js         # Routes for user APIs
├── utils/
│   ├── cacheUtils.js         # Redis caching utilities
├── .env                      # Environment variables
├── app.js                    # Main app initialization
├── server.js                 # Server entry point
```

---

## **API Documentation**

This section details all available endpoints with example requests and responses using sample users:
- **Ritesh**: ritesh@example.com

---

## **Authentication APIs**

### 1. **Register a New User**

**Endpoint:**  
`POST /api/auth/register`

**Description:**  
Registers a new user with a unique email address and password.

**Request Body:**
```json
{
  "username": "ritesh",
  "email": "ritesh@example.com",
  "password": "ritesh123"
}
```

**Response:**
```json
{
  "id": "6372e5c9eb1342f529e2345a",
  "username": "ritesh",
  "email": "ritesh@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 2. **Log in a User**

**Endpoint:**  
`POST /api/auth/login`

**Description:**  
Authenticates a user and provides a JWT for subsequent requests.

**Request Body:**
```json
{
  "email": "ritesh@example.com",
  "password": "ritesh123"
}
```

**Response:**
```json
{
  "id": "6372e5c9eb1342f529e2345a",
  "username": "ritesh",
  "email": "ritesh@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## **User Management APIs**

### 1. **Send a Friend Request**

**Endpoint:**  
`POST /api/users/friend-request`

**Description:**  
Sends a friend request to another user.

**Headers:**
```json
{
  "Authorization": "Bearer <JWT_TOKEN>"
}
```

**Request Body:**
```json
{
  "to": "6372e6c9eb1342f529e2347b"
}
```

**Response:**
```json
{
  "message": "Friend request sent successfully"
}
```

---

### 2. **Respond to a Friend Request**

**Endpoint:**  
`POST /api/users/friend-request/response`

**Description:**  
Allows a user to accept or reject a friend request.

**Headers:**
```json
{
  "Authorization": "Bearer <JWT_TOKEN>"
}
```

**Request Body:**
```json
{
  "requestId": "6372f7c9eb1342f529e2348a",
  "response": "accepted"
}
```

**Response:**
```json
{
  "message": "Friend request accepted"
}
```

---

### 3. **Get Friend List**

**Endpoint:**  
`GET /api/users/friends`

**Description:**  
Fetches the list of friends for the authenticated user.

**Headers:**
```json
{
  "Authorization": "Bearer <JWT_TOKEN>"
}
```

**Response:**
```json
[
  {
    "_id": "6372e6c9eb1342f529e2347b",
    "username": "aryan",
    "email": "aryan@example.com"
  },
  {
    "_id": "6372e8c9eb1342f529e2349c",
    "username": "ganesh",
    "email": "ganesh@example.com"
  }
]
```

---

### 4. **Get Pending Friend Requests**

**Endpoint:**  
`GET /api/users/friend-requests`

**Description:**  
Fetches all pending friend requests for the authenticated user.

**Headers:**
```json
{
  "Authorization": "Bearer <JWT_TOKEN>"
}
```

**Response:**
```json
[
  {
    "_id": "6372f7c9eb1342f529e2348a",
    "from": {
      "_id": "6372e6c9eb1342f529e2347b",
      "username": "aryan",
      "email": "aryan@example.com"
    },
    "status": "pending"
  }
]
```

---

## **Post APIs**

### 1. **Create a New Post**

**Endpoint:**  
`POST /api/posts`

**Description:**  
Creates a new post for the authenticated user.

**Headers:**
```json
{
  "Authorization": "Bearer <JWT_TOKEN>"
}
```

**Request Body:**
```json
{
  "text": "This is Ritesh's first post!"
}
```

**Response:**
```json
{
  "_id": "6372e5d1eb1342f529e2345c",
  "author": "6372e5c9eb1342f529e2345a",
  "text": "This is Ritesh's first post!",
  "comments": [],
  "createdAt": "2024-11-19T10:05:00Z",
  "updatedAt": "2024-11-19T10:05:00Z"
}
```

---

### 2. **Get User Feed**

**Endpoint:**  
`GET /api/posts/feed`

**Description:**  
Retrieves the user's feed, including posts by friends and posts commented on by friends.

**Headers:**
```json
{
  "Authorization": "Bearer <JWT_TOKEN>"
}
```

**Response:**
```json
[
  {
    "_id": "6372e5d1eb1342f529e2345c",
    "author": {
      "_id": "6372e5c9eb1342f529e2345a",
      "username": "ritesh"
    },
    "text": "This is Ritesh's first post!",
    "comments": [
      {
        "commenter": {
          "_id": "6372e6c9eb1342f529e2347b",
          "username": "aryan"
        },
        "text": "Great post!",
        "createdAt": "2024-11-19T10:10:00Z"
      }
    ],
    "createdAt": "2024-11-19T10:05:00Z",
    "updatedAt": "2024-11-19T10:05:00Z"
  }
]
```

---

### **Table of Routes**

| **HTTP Method** | **Endpoint**                    | **Description**                          | **Protected** | **Controller Function**          |
|------------------|---------------------------------|------------------------------------------|---------------|-----------------------------------|
| POST             | `/api/auth/register`           | Register a new user                      | No            | `register`                       |
| POST             | `/api/auth/login`              | Log in a user                            | No            | `login`                          |
| POST             | `/api/users/friend-request`    | Send a friend request                   | Yes           | `sendFriendRequest`              |
| POST             | `/api/users/friend-request/response` | Respond to a friend request             | Yes           | `respondFriendRequest`           |
| GET              | `/api/users/friends`           | Get the user's list of friends          | Yes           | `getFriends`                     |
| GET              | `/api/users/friend-requests`   | Get all pending friend requests          | Yes           | `getPendingRequests`             |
| POST             | `/api/posts`                   | Create a new post                        | Yes           | `createPost`                     |
| GET              | `/api/posts/feed`              | Fetch the user's feed                    | Yes           | `getFeed`                        |
| POST             | `/api/posts/:id/comment`       | Add a comment to a post                  | Yes           | `addComment`                     |
| GET              | `/api/posts/:id`               | Get a specific post by its ID            | Yes           | `getPostById`                    |

---
