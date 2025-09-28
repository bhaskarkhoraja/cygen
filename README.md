# Project Setup

This project is divided into two main parts: **client** and **server**. Follow the instructions below to set up and run each part.

## Client (Frontend)

1. Navigate to the `client` folder.
2. Install dependencies:
   ```
   pnpm install
   ```
3. Build the project:
   ```
   pnpm run build
   ```
4. Start the project:
   ```
   pnpm start
   ```

In the `client` folder, create a `.env` file with the following variable:
```
API_URL=your_backend_api_url
```

## Server (Backend)

1. Navigate to the `server` folder.
2. Install dependencies:
   ```
   pnpm install
   ```
3. Build the project:
   ```
   pnpm run build
   ```
4. Start the project in production mode:
   ```
   pnpm run start:prod
   ```

In the `server` folder, create a `.env` file with the following variable:
```
DATABASE_URL=your_database_connection_string
```

To set up the database with Prisma:
```
npx prisma generate
npx prisma db push
npx prisma db seed
```
