# Cinema Ticket Purchasing API

A NestJS-based REST API for managing cinema ticket bookings with concurrent request handling and atomic transactions.

## Features

- Create cinemas with customizable rows and seats per row
- Book specific seats with row and seat number
- Book first two consecutive available seats
- Atomic transactions for concurrent bookings
- Input validation with detailed error messages

## Tech Stack

- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Validation**: class-validator & class-transformer
- **Transaction Handling**: Prisma transactions
- **Environment**: Configurable through .env

## API Endpoints

### 1. Create Cinema

**Success Response:**

```json
{
  "success": true,
  "message": "Cinema created successfully!",
  "data": {
    "cinemaId": "uuid"
  }
}
```

### 2. Book Specific Seat

```http
POST /api/seat/book
```

Book a specific seat in a cinema.

**Request Body:**

```json
{
  "cinemaId": "uuid",
  "row": 1,
  "seatNumber": 5
}
```

**Success Response:**

```json
{
  "success": true,
  "message": "Seat booked successfully!",
  "data": {
    "cinemaId": "uuid",
    "row": 1,
    "seatNumber": 5,
    "status": "Booked"
  }
}
```

### 3. Book Consecutive Seats

```http
POST /api/seat/:cinemaId/book-consecutive-seats
```

Book first two available consecutive seats in a cinema.

**Success Response:**

```json
{
  "success": true,
  "message": "Seat booked successfully!",
  "data": [
    {
      "cinemaId": "uuid",
      "row": 1,
      "seatNumber": 3,
      "status": "Booked"
    },
    {
      "cinemaId": "uuid",
      "row": 1,
      "seatNumber": 4,
      "status": "Booked"
    }
  ]
}
```

## Setup & Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd cinema-ticket-api
```

2. **Install dependencies**

```bash
yarn install
```

3. **Environment Setup**
   Create `.env` file:

```env:README.md
PORT=4040
DB_USER=postgres
DB_PASSWORD=12345678
DB_HOST=localhost
DB_PORT=5433
DB_SCHEMA=CinemaSeatManager
DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_SCHEMA}"
```

4. **Database Setup**

```bash
npx prisma migrate dev
```

5. **Start the application**

```bash
yarn run start:dev
```

## Error Handling

The API implements comprehensive error handling with detailed messages:

```json
{
  "success": false,
  "message": ["Error description"],
  "error": "Bad Request"
}
```

Common error scenarios:

- Seat already booked
- Cinema not found
- Invalid seat number
- No consecutive seats available
- Validation errors for input data
