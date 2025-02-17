# API Endpoints

## Authentication Endpoints

| HTTP Method | Endpoint                    | Description                              |
| ----------- | --------------------------- | ---------------------------------------- |
| **POST**    | `/api/users/register`        | Register a new user                      |
| **POST**    | `/api/users/login`           | Log in using username/email and password |
| **POST**    | `/api/users/forgot-password` | Sending password reset link via email    |
| **POST**    | `/api/users/reset-password`  | Reset user password                      |

## User Endpoints

| HTTP Method | Endpoint                               | Description                     |
| ----------- | -------------------------------------- | ------------------------------- |
| **GET**     | `/api/users/:userId`                   | Get a user's details            |
| **PUT**     | `/api/users/:userId`                   | Update a user's details         |
| **GET**     | `/api/users/:userId/friends`           | List a user's friends           |
| **POST**    | `/api/users/:userId/friends`           | Send a friend request to a user |
| **DELETE**  | `/api/users/:userId/friends/:friendId` | Remove a user as a friend       |
| **POST**    | `/api/users/:userId/report`            | Report a user                   |

## Post Endpoints

| HTTP Method | Endpoint                                | Description                       |
| ----------- | --------------------------------------- | --------------------------------- |
| **GET**     | `/api/feed`                             | Retrieve the newsfeed             |
| **POST**    | `/api/posts`                            | Create a new post (text or image) |
| **GET**     | `/api/posts/:postId`                    | Retrieve a post                   |
| **PUT**     | `/api/posts/:postId`                    | Edit a published post             |
| **DELETE**  | `/api/posts/:postId`                    | Delete a post                     |
| **POST**    | `/api/posts/:postId/react `             | React to a post                   |
| **POST**    | `/api/posts/:postId/comment`            | Add comment to a post             |
| **PUT**     | `/api/posts/:postId/comment/:commentId` | Edit a comment on a post          |
| **DELETE**  | `/api/posts/:postId/comment/:commentId` | Delete a comment on a post        |
| **POST**    | `/api/posts/:postId/report`             | Report a post                     |

## Admin Endpoints

| HTTP Method | Endpoint                   | Description                               |
| ----------- | -------------------------- | ----------------------------------------- |
| **GET**     | `/api/admin/users`         | Retrieve a list of all users (admin only) |
| **DELETE**  | `/api/admin/users/:userId` | Delete a user account (admin only)        |
| **DELETE**  | `/api/admin/posts/:postId` | Delete a post (admin only)                |

## Settings & Notifications Endpoints

| HTTP Method | Endpoint                      | Description            |
| ----------- | ----------------------------- | ---------------------- |
| **GET**     | `/api/users/:userId/settings` | Retrieve user settings |
| **PUT**     | `/api/users/:userId/settings` | Update user settings   |
