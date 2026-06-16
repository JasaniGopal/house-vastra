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

## 3. Database Architecture (The Tables)

To keep the database lightning-fast and clean, we split the user data across multiple tables.

### The Core `User` Table
Every single person who registers (Customer, Vendor, or Admin) gets exactly **one row** in the main `User` table. This table holds the universal data needed for logging in:
- `id`
- `email`
- `password`
- `name`
- `role` (This tells the system if they are a `CUSTOMER`, `VENDOR`, or `ADMIN`).

By keeping all logins in one single table, the security system works incredibly fast because it only ever has to search one place to see if an email exists and verify the password.

### The Extended `Vendor` Table
If a user is marked as a `VENDOR`, they get a second row created in a completely separate `Vendor` table. This table stores all the heavy business information that regular customers don't need:
- `boutiqueName`
- `gstin` (Tax ID)
- `bankAccount` details
- `logoUrl`

This `Vendor` table is mathematically linked back to the `User` table (a "1-to-1 relationship"). This keeps the database clean because regular Customers don't end up with empty columns for `gstin` or `boutiqueName`.

---

## 4. The Backend APIs

We have created exactly **2 Backend APIs** so far. Both are dedicated exclusively to handling Authentication and Security.

### 1. The Registration API (`POST /api/auth/register`)
- **What it does:** This is the custom endpoint we built for manual email/password signups. 
- **How it works:** It accepts a user's details, securely scrambles (hashes) their password with `bcrypt`, and writes the new user into the MySQL database using Prisma. 
- **Smart Provisioning:** If someone selects the "Vendor" role during signup, this API automatically provisions an empty `Vendor` profile (for their boutique details) connected to their new user account.

### 2. The NextAuth API (`GET / POST /api/auth/[...nextauth]`)
- **What it does:** This is the dynamic powerhouse endpoint provided by NextAuth.js. It acts as the "brain" of our login system.
- **Manual Logins:** It handles verifying passwords when users log in with their email.
- **Google Logins:** It manages the entire "Sign in with Google" flow (OAuth). It talks to Google, fetches the user's profile, creates an `Account` in our database if they are new, and securely merges them if they already registered with that email.
- **Session Management:** It generates encrypted session cookies and handles safe logouts (`/api/auth/signout`).

---

## 5. How the Flow Works Together

Here is what happens when a new user interacts with our authentication system:

1. **Frontend:** The user fills out the sign-up form and hits submit (or clicks the Google button).
2. **API Route:** The frontend sends a request to our backend APIs (`/api/auth/register` or the NextAuth Google handler).
3. **Database (Prisma):** The API calls `prisma.user.create()` to save the user in MySQL.
4. **Login:** The frontend uses `signIn()` from `next-auth/react` to request a secure session.
5. **Verification:** NextAuth looks up the user in the `User` table, verifies the identity, and creates a secure session token stored in the browser's cookies.
6. **Access Control:** The user tries to visit a protected page (like `/vendor`). Our `proxy.ts` file intercepts the request, checks the session token to ensure their `role` is correct, and either allows them in or kicks them back to the login page!
