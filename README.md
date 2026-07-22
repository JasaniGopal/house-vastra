# LOR - Architecture & Backend Guide

Welcome to the backend documentation for **LOR**, a premium luxury rental platform connecting high-end boutiques with customers. 

This file explains exactly how the platform works, the tools we are using, and where to find the code. It serves as a comprehensive developer guide and feature log.

---

## 1. The Technology Stack

We are using a modern, fast, and secure set of technologies:
- **Framework:** Next.js (App Router) - Handles both the frontend (UI) and the backend (APIs).
- **Database:** MySQL (Relational Database)
- **ORM:** Prisma - Allows us to talk to our database using clean, easy-to-read TypeScript code.
- **Authentication:** NextAuth.js (Auth.js) - Handles logging in securely.
- **Security:** `bcryptjs` - Secure password hashing.
- **Payment Gateway:** Razorpay - Manages checkout and order payments.
- **Styling:** Vanilla CSS & Tailwind CSS - Used to create a luxury, dynamic, and glassmorphic user interface.

---

## 2. Features Implemented So Far

### 🌟 Luxury Frontend Experience
- **Dynamic Aesthetic UI:** The platform features a high-end luxury aesthetic utilizing modern typography, glassmorphism, dynamic micro-animations (e.g. pulsing status badges, smooth transitions), and high-resolution imagery.
- **Homepage:** Complete with an immersive Hero section, dynamic "Trending Now" carousel, Occasions grid, Trust strips, "How it Works", and a dynamic Global Search overlay.
- **Collections & Search:** Dynamic product filtering by category, occasion, and sizes.
- **Product Detail Page:** Deeply immersive product view featuring image galleries (with mobile snap carousels), "Complete the Look" cross-sells, dynamic date-based rental calculation (enforcing a minimum 4-day rental), and detailed shipping & fit modals.
- **Global Contexts:** Completely functional and persistent `CartContext` and `WishlistContext`. Badges on the navbar update dynamically, and heart icons on product cards react instantly to user actions. State is persisted across reloads using `localStorage`.
- **Wishlist & Cart Pages:** Fully dynamic pages that pull from global state, allowing users to move wishlisted items directly into their shopping bag.

### 💳 Checkout & Payments Flow
- **Address & Payment Flow:** Clean, step-by-step UI allowing users to input delivery details and select payment methods.
- **Razorpay Integration:** Full backend to frontend Razorpay integration (`/api/checkout/create-order` & `/api/checkout/verify`).
- **Local Dev Mock:** Built-in Razorpay mock bypass to seamlessly test successful end-to-end checkouts locally without needing live credentials.
- **Order Processing:** Upon payment success, individual `Order` records are created in the database and linked to the Customer, the Product, and the Vendor with an initial status of `PREPARING`.
- **Profile Order History:** Users can navigate to their Profile -> Active Rentals and view their live orders dynamically fetched from the database, complete with precise status indicators.

### 👔 The Vendor Portal (`/vendor`)
- **Dashboard & Earnings:** Vendors can track their revenue, pending payouts, and historical orders.
- **Product Uploads:** Vendors upload their outfits, select categories, and specify an "Expected Rent". The system immediately forces newly uploaded products into a hidden `PENDING` state. Images are securely uploaded and linked to the product.
- **Security:** Strict guards block unauthorized access.

### 👑 The Admin Portal (`/admin`)
- **Pending Approvals Queue:** The Admin reviews every single dress uploaded by vendors. The Admin decides the final rental price that the customer will pay (adding LOR's profit margin) and hits "Approve", setting the status to `APPROVED` and pushing it live.
- **Live Inventory & Directory:** Admins can instantly take a specific dress offline, or completely "Suspend" an entire boutique.
- **Financial Analytics & Payouts:** The Admin can view the total platform revenue, platform profit margin, and pending balances owed to vendors. 
- **The Payout Button:** When it's time to pay a vendor, the Admin clicks "Mark as Paid" to zero out the pending balance and generate a permanent `Payout` receipt.
- **Category Management:** Admins can dynamically add or delete clothing categories from the UI.

---

## 3. How the Database Works (Prisma)

Instead of manually editing database tables, we use Prisma. 

### Key Files:
- **`prisma/schema.prisma`**: Defines our models: `User`, `Vendor`, `Product`, `Category`, `Order`, and `Payout`. 
- **`lib/prisma.ts`**: Connects our application to the database securely.
- **`prisma/seed.ts`**: Helper script to quickly populate the database with test categories and an initial admin account.

### Viewing the Database:
Open a terminal and run:
```bash
npx prisma studio
```

---

## 4. How to Run the Platform Locally

To start the platform on your own computer:

1. Open your terminal.
2. Run the development server:
   ```bash
   npm run dev
   ```
3. Open your browser and go to `http://localhost:3000`.

To log into the Admin portal, navigate to `http://localhost:3000/partner-login` and log in with an Admin account. To test as a vendor, log in with a Vendor account.
