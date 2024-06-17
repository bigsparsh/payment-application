# What is this project?

---

This is a project made using the MERN stack, well not exactly MERN, but PostgreSQL as database, Express as backend, React.js / Next.js as frontend and Node.js as server. This is a payment application which means dealing with money, so security is a must. This project is made with security in mind, so you can trust it.

# How to setup the project?

---

1. Clone the repository
2. Run `npm install` in the root directory to install all the dependencies
3. Find all the `.env.example` files and rename them to `.env`
4. Fill in the `.env` files with your own values
5. Run `npx prisma migrate dev` in the `packages/db/` directory to migrate the database
6. Run `npm run dev` in the root directory
7. Go to `http://localhost:3000` in your browser to see the user-app (User Frontend)
8. Go to `http://localhost:3001` in your browser to see the bank-sim (Bank Simulating Frontend)
9. Go to `http://localhost:3002` in your browser to see the webhook (A Server which will not vulnerable to attacks beacuse no frontend access it and it directly talks to the banking API)
10. Signup using github, google or create an account using email at `http://localhost:3000/auth/signup`

# What technologies are used in this project?

---

- Turborepo
- Prisma
- PostgreSQL
- Next.js
- Express
- Node.js
