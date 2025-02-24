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
