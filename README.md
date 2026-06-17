# Rent Vastra - Architecture & Backend Guide

Welcome to the backend documentation for Rent Vastra. If you are new to databases and backend development in Next.js, this file will explain exactly what tools we are using, how they connect, and where to find the code.

## 1. The Technology Stack

We are using a modern, type-safe stack:
- **Framework:** Next.js (App Router)
- **Database:** MySQL (Relational Database)
- **ORM (Object-Relational Mapper):** Prisma
- **Authentication:** NextAuth.js (Auth.js)
- **Security:** `bcryptjs` (for hashing passwords)
- **Styling:** Vanilla CSS & Tailwind CSS

---

## 2. The Database (Prisma + MySQL)

### What is Prisma?
Prisma is a tool that allows us to talk to our MySQL database using clean, easy-to-read TypeScript code instead of writing raw SQL commands (like `SELECT * FROM Users`). 

### Key Files:
- **`prisma/schema.prisma`**: This is the most important database file. It acts as the "blueprint". We define our `User`, `Vendor`, `Product`, `ProductImage`, `Category`, and `Order` models here. 
- **`lib/prisma.ts`**: This is our database connection file. It ensures we only connect to the database once (preventing server crashes from too many connections) and exports a `prisma` object that we can use anywhere in our code.
- **`prisma.config.ts`**: Prisma 7 configuration file where the `DATABASE_URL` is parsed securely from the environment.

### The Driver Adapter (MariaDB)
Because Prisma 7 prevents hardcoding connection URLs inside `schema.prisma` directly, we use a "Driver Adapter" to securely connect to our MySQL database using an abstracted connection pool. 
- We use the `@prisma/adapter-mariadb` package alongside the `mariadb` Node.js driver. 
- MariaDB and MySQL share the exact same underlying protocol, making this the official and most performant way to connect Next.js securely to MySQL in Prisma 7.

### Viewing the Database:
You can always view your live database tables in a clean web interface by running:
```bash
npx prisma studio
```

---

## 3. Security & Portals Architecture

We have built a completely secure, multi-portal architecture.

### The Core `User` Table
Every single person who registers (Customer, Vendor, or Admin) gets exactly **one row** in the main `User` table. This table holds the universal data needed for logging in.
The `role` column dictates which portal the user can enter: `CUSTOMER`, `VENDOR`, or `ADMIN`.

### The Extended `Vendor` Table
If a user is marked as a `VENDOR`, they get a second row created in a completely separate `Vendor` table. This table stores all the heavy business information (Boutique Name, GSTIN, Bank Account). This `Vendor` table is mathematically linked back to the `User` table.

### 1. The Vendor Portal (`/vendor`)
- **Security Guard:** `app/(vendor)/layout.tsx` blocks anyone who is not a `VENDOR`.
- **Dashboard:** Real-time analytics showing live inventory, active orders, and earnings.
- **Product Management:** Full CRUD (Create, Read, Update, Delete) capability.
  - **Upload API (`POST /api/vendor/products`):** Vendors upload their outfits along with an expected rental price. The API forces the new product into a hidden `PENDING` state.
  - **Advanced Image Gallery:** Allows vendors to upload new photos or delete specific photos seamlessly.
- **Orders & Earnings:** Live trackers pulling from the database so vendors can track their rentals and payouts.

### 2. The Admin Portal (`/admin`)
- **Security Guard:** `app/(admin)/layout.tsx` strictly blocks anyone who is not an `ADMIN`.
- **Overview Dashboard:** Tracks total platform inventory, total vendors, and flags pending approvals.
- **Pending Approvals Queue (`/admin/approvals`):** Aggregates every single product across the globe that is waiting for approval.
- **Review & Pricing Engine (`/admin/approvals/[id]`):** 
  - Allows the Admin to review the vendor's uploaded photos and expected rent.
  - Features an automated **Margin Calculator** to calculate house profit.
  - Admin inputs the final `rentalPrice4Day` that customers will see.
  - **Approval API (`PUT /api/admin/products/[id]/approve`):** Saves the final price, flips status to `APPROVED`, sets `isAvailable = true`, and pushes the dress to the live customer homepage.

---

## 4. The Customer APIs

### 1. The Registration & Auth APIs (`/api/auth/*`)
- **`POST /api/auth/register`:** Custom endpoint for manual email/password signups. Smart provisioning creates an empty `Vendor` profile if "Vendor" role is selected.
- **NextAuth (`/api/auth/[...nextauth]`):** Handles verifying passwords and managing the entire "Sign in with Google" OAuth flow.

### 2. Public Product APIs (`/api/products`)
- **`GET /api/products` & `GET /api/products/[id]`:** These public APIs are used by the homepage and product detail pages to fetch the clothing catalog.
- **Security Check:** They act as a strict bouncer. They will *only* return products to the public if the database marks their `approvalStatus` as `APPROVED` and `isAvailable` as `true`.

## 5. File Uploads
- Local media uploads are handled via `POST /api/upload`.
- Images are written directly to `public/uploads/outfits/` returning a public-facing URL string that is stored in the `ProductImage` database table.
