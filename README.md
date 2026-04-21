# F1 Dashboard

A full-stack F1 dashboard application with a Next.js client and Rust/Axum server.

## Project Structure

```
f1-dashboard/
├── client/          # Next.js frontend
│   ├── src/         # React components
│   ├── package.json
│   └── ...
├── src/             # Rust source code
├── Cargo.toml       # Rust dependencies
└── README.md        # This file
```

## Getting Started

### Client (Next.js)

```bash
cd client
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Server (Rust/Axum)

```bash
cargo run
```

The server runs on [http://localhost:8080](http://localhost:8080)

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Rust, Axum, Tokio