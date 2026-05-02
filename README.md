# Pinnawala Gems Mobile

This repository is a monorepo with two apps:

- `backend/` - Express + MongoDB API
- `frontend/` - Expo mobile app

## Prerequisites

- Node.js 18 or newer
- npm
- A MongoDB database connection string
- Expo Go on your phone, or an Android/iOS simulator

## Project Layout

```text
backend/
frontend/
```

## 1. Clone the repository

```bash
git clone https://github.com/teamcore38-droid/Pinnawala_Gems_mobile.git
cd Pinnawala_Gems_mobile
```

## 2. Set Up the Backend

Open a terminal in the `backend` folder:

```bash
cd backend
npm install
```

Create your local environment file from the example:

```bash
copy .env.example .env
```

Then edit `backend/.env` and set your values:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```

Start the backend server:

```bash
npm run dev
```

The API should run on `http://localhost:5000`.

## 3. Set Up the Frontend

Open a second terminal in the `frontend` folder:

```bash
cd frontend
npm install
```

Create your local environment file from the example:

```bash
copy .env.example .env
```

Then edit `frontend/.env` and set the API URL:

```env
EXPO_PUBLIC_API_URL=http://YOUR_COMPUTER_IP:5000
```

Use the correct address for your setup:

- `http://10.0.2.2:5000` if you are using the Android emulator
- `http://localhost:5000` only if the app and API can reach each other locally
- `http://YOUR_COMPUTER_IP:5000` for a physical device on the same Wi-Fi network

Start the Expo app:

```bash
npm run start
```

If you want LAN mode explicitly:

```bash
npm run start:lan
```

## 4. Run the App

Keep both terminals running:

1. Backend terminal: `npm run dev` inside `backend/`
2. Frontend terminal: `npm run start` inside `frontend/`

Then open the Expo app using:

- Expo Go on your phone, or
- an Android emulator, or
- an iOS simulator

## 5. Useful Commands

Frontend:

```bash
cd frontend
npm run lint
npm run android
npm run ios
npm run web
```

Backend:

```bash
cd backend
npm run dev
```

## Notes

- Do not commit your real `.env` files.
- The example env files are included so setup is easier for new contributors.
