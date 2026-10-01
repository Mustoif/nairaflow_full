# NairaFlow full-stack app

This package contains the React/TypeScript frontend and an Express + MongoDB backend. The browser-only mock authentication, mock dashboard, and mock wallet services have been removed.

## Stack

- Frontend: React + TypeScript + Vite
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- Authentication: JWT + bcrypt
- Transfers: atomic MongoDB transaction
- Currency: NGN

## 1. Start MongoDB

This backend is configured for the MongoDB replica set you already set up:

`mongodb://127.0.0.1:27017/nairaflow?replicaSet=rs0`

Make sure your MongoDB `rs0` instance is running.

## 2. Start the backend

Open a terminal in `backend`:

```bash
npm install
copy .env.example .env
npm run dev
```

On macOS/Linux use:

```bash
cp .env.example .env
```

The API runs on `http://localhost:5000`.

Health check:

`http://localhost:5000/api/health`

## 3. Start the frontend

Open another terminal in `frontend`:

```bash
npm install
npm run dev
```

The frontend defaults to:

`http://localhost:5173`

It calls:

`http://localhost:5000/api`

If your backend is elsewhere, create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

## What now works

- Registration creates a real MongoDB user and server-generated account number.
- Login verifies the hashed password and returns a JWT.
- The JWT is stored by the frontend and sent as `Authorization: Bearer <token>`.
- Session restoration calls `/api/users/me`.
- Profile changes persist to MongoDB.
- Dashboard balance and recent transactions come from MongoDB.
- Wallet funding persists a funding transaction and updates balance.
- Transfers validate the recipient, debit the sender, credit the recipient, and create transaction records for both accounts.
- Transactions page reads persistent transaction history.
- Logout removes the browser JWT.

### Important about "fund wallet"

The existing frontend has a "Fund wallet" feature, so this backend implements it as an internal development top-up. It is **not** a real bank/card/payment gateway.

### Password reset

The request endpoint exists and deliberately returns a generic response to avoid revealing whether an email exists. Actual email delivery/reset-token handling requires an SMTP/email provider and is not included because the frontend does not have a reset-token screen.

## API

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/forgot-password`
- `GET /api/users/me`
- `PATCH /api/users/me`
- `GET /api/dashboard`
- `GET /api/wallet`
- `POST /api/wallet/fund`
- `POST /api/transfers`
- `GET /api/transactions`
- `GET /api/transactions/:id`

Protected routes require:

`Authorization: Bearer <JWT>`
