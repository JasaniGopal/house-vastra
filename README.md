# House of Vastra - Architecture & Backend Guide

Welcome to the backend documentation for **House of Vastra**, a premium rental platform connecting high-end boutiques with customers. 

This file will explain exactly how the platform works, the tools we are using, and where to find the code. It is written in simple language so any developer or owner can easily understand it.

---

## 1. The Technology Stack

We are using a modern, fast, and secure set of technologies:
- **Framework:** Next.js (App Router) - Handles both the frontend (UI) and the backend (APIs).
- **Database:** MySQL (Relational Database) - Stores all our data safely.
- **ORM (Object-Relational Mapper):** Prisma - Allows us to talk to our database using clean, easy-to-read TypeScript code instead of writing raw SQL commands.
- **Authentication:** NextAuth.js (Auth.js) - Handles logging in securely.
- **Security:** `bcryptjs` - Used to securely scramble (hash) passwords.
- **Styling:** Vanilla CSS & Tailwind CSS - Used to make the platform look beautiful.

---

## 2. How the Database Works (Prisma)

Instead of manually editing database tables, we use Prisma. Prisma acts as the "blueprint" for our entire database.

### Key Files:
- **`prisma/schema.prisma`**: This is the most important database file. It defines our `User`, `Vendor`, `Product`, `Category`, `Order`, and `Payout` models. 
- **`lib/prisma.ts`**: This file connects our application to the database securely.
- **`prisma.config.ts`**: Connects Prisma to our specific MySQL database URL.

### Viewing the Database:
You can always view your live database tables in a clean, Excel-like web interface by opening a terminal and running:
```bash
npx prisma studio
```

---

## 3. The Three Portals

House of Vastra is split into three distinct "portals" based on who is logging in. Every single person who registers gets exactly one row in the main `User` table, which dictates what they can access.

### 1. The Customer Journey (Public Homepage)
- Customers browse the public homepage to view the clothing catalog.
- **Security Check:** The website only shows products to the public if the Admin has marked their `approvalStatus` as `APPROVED` and `isAvailable` as `true`.

### 2. The Vendor Portal (`/vendor`)
If a user registers as a "Boutique Owner", a second record is created in a separate `Vendor` table to hold their business information (Boutique Name, Bank Details). 
- **Security:** Strict guards block anyone who is not a Vendor from accessing `/vendor`.
- **Upload Flow:** Vendors upload their outfits and specify their "Expected Rent". The system immediately forces the newly uploaded product into a hidden `PENDING` state so the public cannot see it yet.
- **Earnings Tracker:** Vendors can track their exact revenue, pending payouts, and order history.

### 3. The Admin Portal (`/admin` & "God Mode")
This is the command center for the platform owners.
- **Security:** Strict guards block anyone who is not an `ADMIN` from accessing `/admin`.
- **Pending Approvals Queue:** The Admin reviews every single dress uploaded by vendors. The Admin decides the final rental price that the customer will pay (adding House of Vastra's profit margin) and hits "Approve". Only then does the dress go live on the site.
- **Live Inventory & Directory:** Admins can instantly take a specific dress offline, or completely "Suspend" an entire boutique (which cascades and takes all their dresses offline instantly).
- **Financial Analytics & Payouts:** The Admin can view the total platform revenue, exactly how much money the platform has kept (Profit), and how much is owed to vendors. 
- **The Payout Button:** When it's time to pay a vendor, the Admin clicks "Mark as Paid". This automatically zeroes out the vendor's pending balance and generates a permanent `Payout` receipt.
- **Category Management:** Admins can dynamically add or delete clothing categories (e.g. Sarees, Sherwanis) directly from the UI without needing to write any code.

---

## 4. File Uploads

When vendors upload photos of their dresses:
- The images are saved locally to `public/uploads/outfits/` using the `POST /api/upload` API.
- A public-facing URL is generated and saved into the `ProductImage` database table so the website can display the image anywhere.

---

## 5. How to Run the Platform Locally

To start the platform on your own computer:

1. Open your terminal.
2. Run the development server:
   ```bash
   npm run dev
   ```
3. Open your browser and go to `http://localhost:3000`.

To log into the Admin portal, navigate to `http://localhost:3000/partner-login` and log in with an Admin account. To test as a vendor, log in with a Vendor account.
