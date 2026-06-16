# Rent Vastra - Architecture & Backend Guide

Welcome to the backend documentation for Rent Vastra. If you are new to databases and backend development in Next.js, this file will explain exactly what tools we are using, how they connect, and where to find the code.

## 1. The Technology Stack

We are using a modern, type-safe stack:
- **Framework:** Next.js (App Router)
- **Database:** MySQL (Relational Database)
- **ORM (Object-Relational Mapper):** Prisma
- **Authentication:** NextAuth.js (Auth.js)
- **Security:** `bcryptjs` (for hashing passwords)

---

## 2. The Database (Prisma + MySQL)

### What is Prisma?
Prisma is a tool that allows us to talk to our MySQL database using clean, easy-to-read TypeScript code instead of writing raw SQL commands (like `SELECT * FROM Users`). 

### Key Files:
- **`prisma/schema.prisma`**: This is the most important database file. It acts as the "blueprint". We define our `User`, `Vendor`, `Product`, and `Order` models here. 
- **`lib/prisma.ts`**: This is our database connection file. It ensures we only connect to the database once (preventing server crashes from too many connections) and exports a `prisma` object that we can use anywhere in our code.
- **`prisma.config.ts`**: Prisma 7 configuration file where the `DATABASE_URL` is parsed securely from the environment.

### The Driver Adapter (MariaDB)
Because Prisma 7 prevents hardcoding connection URLs inside `schema.prisma` directly, we use a "Driver Adapter" to securely connect to our MySQL database using an abstracted connection pool. 
- We use the `@prisma/adapter-mariadb` package alongside the `mariadb` Node.js driver. 
- MariaDB and MySQL share the exact same underlying protocol, making this the official and most performant way to connect Next.js securely to MySQL in Prisma 7.

### How it works:
Whenever you change `prisma/schema.prisma`, you run a command in your terminal:
```bash
npx prisma db push
```
This tells Prisma to look at your blueprint, go into the live MySQL database, and create or update the actual tables to match your blueprint. It also generates autocomplete types for your code.

### Viewing the Database:
You can always view your live database tables in a clean web interface by running:
```bash
npx prisma studio
```

---

## 3. Authentication (NextAuth.js)

We need a secure way to let Customers, Vendors, and Admins log in and maintain a "session" while they browse the site.

### What is NextAuth?
NextAuth is the standard authentication library for Next.js. It handles the complicated security parts of logging in, encrypting session tokens (JWTs), and checking if a user is logged in.

### Key Files:
- **`app/api/auth/[...nextauth]/route.ts`**: This is the "brain" of our login system. It contains the logic to take an email and password, look up the user in our MySQL database using Prisma, verify the encrypted password using `bcrypt`, and issue a secure session token containing their Role (`CUSTOMER`, `VENDOR`, or `ADMIN`).
- **`app/api/auth/register/route.ts`**: This is the endpoint we hit when a new user signs up. It hashes their password and creates a row in the `User` table. If they sign up as a Vendor, it automatically creates a linked `Vendor` profile for them too.
- **`middleware.ts`**: This file runs *before* every single page load. It checks if the user is trying to access a protected route (like `/admin` or `/vendor`). If they are, it checks their NextAuth session token. If they don't have the right role, it automatically kicks them back to the login page.
- **`types/next-auth.d.ts`**: A tiny helper file that tells TypeScript that our session tokens include a custom `role` and `id` property.

---

## 4. How the Flow Works Together

Here is what happens when a new Boutique Owner registers on the site:

1. **Frontend:** The user fills out the sign-up form and hits submit.
2. **API Route:** The frontend sends a `POST` request to `/api/auth/register`.
3. **Security:** The API uses `bcrypt` to scramble the password into an unreadable hash.
4. **Database (Prisma):** The API calls `prisma.user.create()` to save the user, and `prisma.vendor.create()` to create their boutique profile in MySQL.
5. **Login:** The user then logs in. The frontend sends the credentials to `app/api/auth/[...nextauth]/route.ts`.
6. **Verification:** NextAuth looks up the user, verifies the password, and creates a secure session token stored in the browser's cookies.
7. **Access:** The user tries to visit `/vendor/products`. `middleware.ts` intercepts the request, sees the secure token says `role: VENDOR`, and allows them onto the page!

---

## 5. Connecting Frontend to Backend

All login pages (`/login`, `/register`, `/partner-login`, `/admin-login`) use the `signIn` function provided by `next-auth/react`. This function automatically sends the credentials to our NextAuth API endpoint and handles the session creation behind the scenes. We also use a `<SessionProvider>` wrapper in the root `layout.tsx` so any client component can check if a user is currently logged in.
