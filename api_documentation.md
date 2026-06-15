# WHED Backend API Documentation

This document describes the API endpoints, request schemas, authentication, and response formats for the World Higher Education Database (WHED) Backend.

---

## 1. General Conventions

### 1.1 Base URL
All API paths listed in this document are relative to the server host (e.g. `http://localhost:3000`).

### 1.2 Authentication & Authorization
- Public endpoints (e.g., `/health`, `/private/dataprovider/verify/:token`, etc.) do not require authentication headers.
- Private endpoints (paths starting with `/private/`) require an `Authorization` header with a valid Bearer JWT:
  ```http
  Authorization: Bearer <jwt_token>
  ```
- **Role Enforcement**: Certain actions are restricted by role code:
  - `1`: Admin (Full read/write permissions)
  - `0`: Editor (Read/write on assigned countries/institutions)

### 1.3 Response Structures
All API responses return JSON with a consistent top-level payload structure.

#### Success Response (List / Array)
> [!NOTE]
> All list endpoints return all matched records directly. Pagination metadata is not returned.

```json
{
  "success": true,
  "message": "Resource fetched successfully",
  "data": [
    { "id": 1, "name": "Example Resource" }
  ]
}
```

#### Success Response (Object / Single Record)
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Example Resource"
  }
}
```

#### Error Response
```json
{
  "success": false,
  "message": "Error description or validation failures"
}
```

---

## 2. API Endpoints

### 2.1 Authentication & Profile (`/private/auth`)

| Method | Endpoint | Auth | Role | Description |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/private/auth/register` | Yes | Admin (`1`) | Register a new user profile |
| `POST` | `/private/auth/login` | No | - | Authenticate user credentials and return JWT token |
| `POST` | `/private/auth/logout` | Yes | - | Invalidate user session |
| `POST` | `/private/auth/forgot-password` | No | - | Request OTP via email for password reset |
| `POST` | `/private/auth/verify-otp` | No | - | Verify OTP to allow password reset |
| `POST` | `/private/auth/reset-password` | No | - | Reset user password using verified session |

### 2.2 Users (`/private/user` / `/private/users`)

| Method | Endpoint | Auth | Role | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/private/users` | Yes | - | Get all registered users |
| `GET` | `/private/user/:id` | Yes | - | Get user details by ID |
| `PUT` | `/private/user/:id` | Yes | Admin/Owner | Update user profile details |
| `DELETE` | `/private/user/:id` | Yes | Admin (`1`) | Delete user profile |

### 2.3 States & Countries (`/private/state` / `/private/states`)

| Method | Endpoint | Auth | Role | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/private/states` | Yes | - | Fetch all states and regional divisions |
| `GET` | `/private/state/:stateId` | Yes | - | Fetch single state details |
| `GET` | `/private/state/my` | Yes | - | Fetch states assigned to the authenticated Editor |
| `GET` | `/private/state/:stateId/statistics` | Yes | - | Fetch statistics for a specific state |
| `POST` | `/private/state` | Yes | Admin (`1`) | Create a new state profile |
| `PUT` | `/private/state/:stateId` | Yes | Admin / Assigned Editor | Update state details |
| `DELETE` | `/private/state/:stateId` | Yes | Admin (`1`) | Delete state profile |

### 2.4 Countries (`/private/country` / `/private/countries`)

| Method | Endpoint | Auth | Role | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/private/countries` | Yes | - | Fetch all country profiles |
| `GET` | `/private/country/:id` | Yes | - | Fetch single country profile details |
| `POST` | `/private/country` | Yes | Admin / Editor | Create a country profile |
| `PUT` | `/private/country/:id` | Yes | Admin / Assigned Editor | Update country profile details |
| `DELETE` | `/private/country/:id` | Yes | Admin / Assigned Editor | Delete country profile |

### 2.5 Institution Types & Lexicons (`/private/inst-types`, `/private/languages`, etc.)

| Method | Endpoint | Auth | Role | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/private/inst-types` | Yes | - | Fetch institution types. Optional query filter: `stateId` |
| `GET` | `/private/inst-type/:id` | Yes | - | Fetch institution type details by ID |
| `POST` | `/private/inst-type` | Yes | Admin / Editor | Create a new institution type |
| `PUT` | `/private/inst-type/:id` | Yes | Admin / Editor | Update institution type details |
| `DELETE` | `/private/inst-type/:id` | Yes | Admin / Editor | Delete institution type |
| `GET` | `/private/languages` | Yes | - | Fetch all lexicographical languages |
| `POST` | `/private/language` | Yes | Admin / Editor | Create a lexicon language |
| `POST` | `/private/state/:stateId/languages` | Yes | Admin / Editor | Link language to a specific country |
| `GET` | `/private/stages` | Yes | - | Fetch system academic stages |
| `POST` | `/private/stage` | Yes | Admin / Editor | Create a system stage archetype |
| `POST` | `/private/state/:stateId/stages` | Yes | Admin / Editor | Link stage structure to a country |
| `GET` | `/private/fields-of-study` | Yes | - | Fetch all Fields of Study (FOS) |
| `POST` | `/private/field-of-study` | Yes | Admin / Editor | Create a new Field of Study |

### 2.6 Institutions (`/private/institutes`)

| Method | Endpoint | Auth | Role | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/private/institutes` | Yes | - | Fetch institutions. Query filters: `stateId`, `countryCode`, `fundingType`, `search` |
| `GET` | `/private/state/:stateId/institutes` | Yes | - | Fetch institutions for a specific state. Query filters: `countryCode`, `fundingType`, `search` |

### 2.7 Divisions & Faculties (`/division` / `/divisions`)

| Method | Endpoint | Auth | Role | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/divisions` | No | - | Fetch divisions. Query filter: `orgId` |
| `GET` | `/division/:id` | No | - | Fetch single division details by ID |
| `POST` | `/division` | Yes | Admin / Editor | Create a division profile |
| `PUT` | `/division/:id` | Yes | Admin / Editor | Update division details |
| `DELETE` | `/division/:id` | Yes | Admin / Editor | Delete division profile |
| `POST` | `/division/:id/fos` | Yes | Admin / Editor | Associate FOS (Fields of Study) codes to division |

### 2.8 Degrees (`/private/degree` / `/private/degrees`)

| Method | Endpoint | Auth | Role | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/private/degrees` | Yes | - | Fetch degrees. Query filters: `orgId`, `credId` |
| `GET` | `/private/degree/:id` | Yes | - | Fetch degree details by ID |
| `POST` | `/private/degree` | Yes | Admin / Editor | Create degree listing |
| `PUT` | `/private/degree/:id` | Yes | Admin / Editor | Update degree details |
| `DELETE` | `/private/degree/:id` | Yes | Admin / Editor | Delete degree listing |
| `POST` | `/private/degree/:id/fos` | Yes | Admin / Editor | Associate FOS (Fields of Study) codes to degree |

### 2.9 Credentials (`/private/credentials`)

| Method | Endpoint | Auth | Role | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/private/credentials` | Yes | Editor/Admin | Fetch all credential archetypes. Query filters: `stateId`, `levelCode` |
| `GET` | `/private/state/:stateId/credentials` | Yes | Editor/Admin | Fetch credential types defined for a state |
| `GET` | `/private/state/:stateId/credential/:id` | Yes | Editor/Admin | Fetch credential profile details by ID |

### 2.10 Data Providers & Public Workflows (`/private/dataprovider`)

| Method | Endpoint | Auth | Role | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/private/dataproviders` | Yes | - | Fetch all data providers. Query filter: `status` |
| `GET` | `/private/dataprovider/:id` | Yes | - | Fetch single data provider details |
| `POST` | `/private/dataprovider` | Yes | Admin / Editor | Create data provider profile |
| `PUT` | `/private/dataprovider/:id` | Yes | Admin / Editor | Update data provider details |
| `DELETE` | `/private/dataprovider/:id` | Yes | Admin / Editor | Delete data provider |
| `POST` | `/private/dataprovider/generate-token`| No | - | Generate unique security access token for workflow updates |
| `GET` | `/private/dataprovider/verify/:token` | No | - | Verify token and initialize provider session |
| `PUT` | `/private/dataprovider/submit/:token` | No | - | Submit profile updates from data provider (sets status to review) |

### 2.11 Contacts (`/private/contact` / `/private/contacts`)

| Method | Endpoint | Auth | Role | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/private/contacts` | Yes | - | Fetch contacts. Query filter: `orgId` |
| `GET` | `/private/contact/:id` | Yes | - | Fetch single contact details |
| `POST` | `/private/contact` | Yes | Admin / Editor | Create a contact profile |
| `PUT` | `/private/contact/:id` | Yes | Admin / Editor | Update contact details |
| `DELETE` | `/private/contact/:id` | Yes | Admin / Editor | Delete contact profile |

### 2.12 Editor Assignments (`/private/assignments`)

| Method | Endpoint | Auth | Role | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/private/assignments/countries` | Yes | - | Fetch country editor assignments |
| `GET` | `/private/assignments/institutions` | Yes| - | Fetch institution editor assignments |
| `POST` | `/private/assignments/country` | Yes | Admin (`1`) | Assign state editor |
| `POST` | `/private/assignments/institution` | Yes | Admin (`1`) | Assign institution editor |
| `DELETE` | `/private/assignments/country` | Yes | Admin (`1`) | Remove state editor assignment |
| `DELETE` | `/private/assignments/institution` | Yes| Admin (`1`) | Remove institution editor assignment |

### 2.13 Education Systems (`/private/educationsystem`)

| Method | Endpoint | Auth | Role | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/private/educationsystem` | Yes | Editor/Admin | Fetch education systems overview list |
| `GET` | `/private/state/:stateId/educationsystem` | Yes | Editor/Admin | Fetch comprehensive education system detail for country |
| `POST` | `/private/state/:stateId/educationsystem` | Yes | Admin / Editor | Create state education system profile |
| `PUT` | `/private/state/:stateId/educationsystem` | Yes | Admin / Editor | Update state education system details |
| `DELETE` | `/private/state/:stateId/educationsystem`| Yes| Admin / Editor | Delete education system profile |

### 2.14 Health Check (`/health`)

| Method | Endpoint | Auth | Role | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/health` | No | - | Check application uptime status |
