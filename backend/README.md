# RealTalk Backend

## API Endpoints

### Authentication

| HTTP Method | Endpoint                | Description                                  |
| ----------- | ----------------------- | -------------------------------------------- |
| **POST**    | `/auth/register`        | Register a new user.                         |
| **POST**    | `/auth/login`           | Log in using username and password.          |
| **POST**    | `/auth/verify-email`    | Verify the email of a newly registered user. |
| **POST**    | `/auth/forgot-password` | Request password reset email.                |
| **POST**    | `/auth/reset-password`  | Reset user password.                         |

### Users

| HTTP Method | Endpoint                  | Description                    |
| ----------- | ------------------------- | ------------------------------ |
| **GET**     | `/api/users`              | Get list of all users.         |
| **GET**     | `/api/users?id=...`       | Query users by user ID.        |
| **GET**     | `/api/users?username=...` | Query users by username.       |
| **GET**     | `/api/users?email=...`    | Query users by email.          |
| **GET**     | `/api/users/:userid`      | Get user by user ID.           |
| **PATCH**   | `/api/users/:userid`      | Update a user with a given ID. |
| **DELETE**  | `/api/users/:userid`      | Delete a user with a given ID. |
