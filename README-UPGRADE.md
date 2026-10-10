# ElectroCompare — full-stack upgrade

This is an upgrade of the uploaded React + TypeScript + Vite project. The existing product catalog, comparison components, wishlist, cart, product detail, reviews UI, recommendation modal, admin modal, and order modal have been retained. A separate Express + MongoDB API has been added, and authentication, product catalog loading, checkout initiation, server-side Razorpay signature verification, and server-backed order history now use that API.

## Features included

- Professional interaction layer: consistent focus states, reduced-motion support, responsive floating shopping assistant.
- MongoDB product catalog seeded from the project's bundled sample products.
- Server registration/login using bcrypt password hashing and short-lived JWTs.
- Server-side role authorization for admin product CRUD, stock changes, order status changes, and admin order listing.
- Server-authoritative checkout prices, coupon calculations, GST, delivery option, stock validation, and order creation.
- Razorpay order creation on the server and HMAC-SHA256 signature verification on the server. The browser no longer fabricates payment IDs/signatures or marks payments as verified.
- Server-backed order history, price points, price history API, target-price alert APIs, and catalog-based shopping assistant.
- Helmet security headers, CORS origin restriction, request-size limits, rate limiting, request validation, and safe error responses.

## Windows 11 setup

### Prerequisites
- Node.js 20 or newer (LTS recommended).
- MongoDB Community Server running locally, or a MongoDB Atlas database.
- Razorpay test-mode credentials for payment testing. Do not use live keys until the entire flow has been reviewed and tested.

### 1. Configure MongoDB + API
Open PowerShell in the extracted project folder:

```powershell
cd server
Copy-Item .env.example .env
notepad .env
```

Set at least:
- `MONGODB_URI=mongodb://127.0.0.1:27017/electrocompare`
- `JWT_SECRET` to a random value at least 32 characters long
- `CLIENT_ORIGIN=http://localhost:5173`
- `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` from your Razorpay test-mode dashboard

Keep `RAZORPAY_KEY_SECRET` and `JWT_SECRET` only in `server/.env`. Never put them in a `VITE_` variable, frontend file, Git repository, screenshot, or browser code.

Install backend packages and seed the catalog:

```powershell
npm install
npm run seed
npm run dev
```

The API listens at `http://localhost:5000`. Verify `http://localhost:5000/api/health`; the database field should report `connected`.

### 2. Create an administrator account
In `server/.env`, temporarily add:
- `ADMIN_EMAIL=your-admin-email@example.com`
- `ADMIN_PASSWORD=a-long-unique-password-of-at-least-12-characters`
- `ADMIN_NAME=ElectroCompare Admin`

In a second PowerShell terminal:

```powershell
cd path\to\E-commerce-Product-main\server
npm run create-admin
```

Use the created account to sign in. Registration always creates a customer account; clients cannot self-assign admin role. Remove the temporary admin password from `.env` after provisioning if you do not need to re-run the script.

### 3. Run the frontend
Open a second terminal in the project root (not `server`):

```powershell
Copy-Item .env.example .env
npm install
npm run dev
```

Open the Vite URL printed in the terminal, usually `http://localhost:5173`. The frontend API base defaults to `http://localhost:5000/api`. If you rename the extracted folder, adjust the `cd` path in the admin step to match your folder name.

## API overview

- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- `GET /api/products`, `GET /api/products/:id`
- Admin-only: `POST /api/products`, `PATCH /api/products/:id`, `DELETE /api/products/:id`
- `POST /api/orders/checkout` — creates a pending database order and Razorpay order using prices read from MongoDB
- `POST /api/orders/:id/verify-payment` — verifies the Razorpay callback signature and marks the order paid only on the server
- `GET /api/orders/mine` — authenticated user's order history
- Admin-only: `GET /api/orders`, `PATCH /api/orders/:id/status`
- `POST /api/insights/assistant` — catalog-based recommendations (not an external LLM)
- `GET /api/insights/prices/:productId`, `POST /api/insights/alerts`, `GET /api/insights/alerts/mine`, `DELETE /api/insights/alerts/:id`

## Important limits / what is not yet production-complete

- **Build verification:** Dependency installation timed out in this environment, so I could not run a successful frontend production build or a live integration test. Server JavaScript syntax checks passed, but this does not prove runtime correctness.
- **Price alerts:** Alert creation and triggered-state APIs are present. Automated email/SMS/push notifications and a dedicated alerts management UI are not implemented. Price history records seed-time prices and later admin price changes; it is not a third-party live price scraper.
- **AI assistant:** Recommendations use deterministic catalog matching. No external AI model is connected, and it must not be described as an LLM chatbot.
- **Wishlist/cart/reviews/comparison:** Existing UI features are preserved, but their client-side state and review flows are not all migrated to MongoDB. Do not treat browser localStorage as authoritative or use it for sensitive data.
- **Admin UI:** API admin routes enforce server-side roles, but some modal actions still need deeper end-to-end validation and clearer server-error handling.
- **Payments:** Only Razorpay callback signature verification is wired. Before live use, add and validate Razorpay webhooks, reconciliation/refund handling, inventory reservation/transaction semantics, idempotency, HTTPS, operational logging, and thorough test-mode scenarios. Never mark an order paid based solely on frontend state.
- **Sessions:** This implementation stores the short-lived bearer token in `sessionStorage`; this is better scoped than long-term localStorage but remains exposed to same-origin XSS. For a public production deployment, prefer secure, HttpOnly, SameSite cookies with CSRF protections and add a full XSS review.
- **Operations:** Add automated tests, backups, monitoring, deployment secrets, privacy/terms pages, accessibility testing, and a production build before deployment.

## Troubleshooting

- `MongoDB connection failed`: start MongoDB Community Server or verify the Atlas URI/network allowlist.
- `Razorpay is not configured`: check the two Razorpay variables in `server/.env`, then restart the API.
- `Authentication required`: sign in again; tokens expire after two hours.
- Catalog is empty: ensure MongoDB is connected, then run `npm run seed` from `server`.
- CORS error: set `CLIENT_ORIGIN` to the exact frontend origin, including port, and restart the API.
