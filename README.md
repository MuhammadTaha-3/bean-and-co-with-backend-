# Bean & Co — Coffee E-Commerce

```
coffee-ecommerce/
├── frontend/   Customer website + Admin Portal (Next.js, port 3000). No product data inside.
├── backend/    MongoDB + APIs: products, categories, inventory, orders, tracking, admin auth (port 4000)
├── 1-install.bat   (Windows) installs both
└── 2-start.bat     (Windows) starts both + opens the browser
```

## Run
Windows: double-click `1-install.bat` once, then `2-start.bat`.

Manual (any OS):
```sh
cd backend  && npm install && npm run dev      # terminal 1 -> http://localhost:4000
cd frontend && npm install && npm run dev      # terminal 2 -> http://localhost:3000
```

Check: http://localhost:4000/api/health must show `"db":"connected"`.

## Config (already filled in `backend/.env.local`)
`MONGODB_URI`, `ADMIN_EMAIL`, `AUTH_SECRET`. Never upload `.env.local` anywhere (it is git-ignored).
MongoDB Atlas: Network Access must allow your IP (or 0.0.0.0/0 for testing).
Admin login: `/admin/login` with the `ADMIN_EMAIL` (no password).
On the first run an empty database gets the starter menu automatically.
