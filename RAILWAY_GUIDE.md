# Deployment Guide for PizzaSlice Project (Railway)

Since you asked for **Railway** specifically, here is how to deploy everything there.

> **Note**: I cannot do the final click for you because I don't have access to your Railway account. But I have prepared the code so you just need to connect your GitHub.

## 1. Prepare (Done by me)
*   I added a `start` script to your frontend so it can run on a server.
*   I added a `railway.json` file to help Railway understand your project (it has two parts).

## 2. Deploy on Railway

1.  **Login**: Go to [Railway.app](https://railway.app) and login with GitHub.
2.  **New Project**: Click **New Project** -> **Deploy from GitHub repo**.
3.  **Select Repo**: Choose `Pizza_Slice`.
4.  **Configure**:
    *   Railway should detect two services (or you might need to add them).
    *   **Backend Service**:
        *   Root Directory: `backend`
        *   Variables: Add `MONGO_URI` (Paste your connection string).
    *   **Frontend Service**:
        *   Root Directory: `frontend`
        *   Variables: Add `VITE_API_URL`.
        *   **Value**: Paste the *Domain* of your Backend Service (Railway gives you one, e.g., `https://web-production-1234.up.railway.app`) + `/api`.
        *   Example: `https://web-production-1234.up.railway.app/api`

## 3. Important Note on Pricing
Railway is **NOT free** (they give you $5 trial credit). Once that runs out, the project will stop unless you pay.

*   If you want a **100% Free** solution that lasts forever, follow the **Vercel** guide I wrote in `DEPLOYMENT.md` earlier. It uses Vercel for Frontend and Backend (Serverless) which is free.

Good luck!
