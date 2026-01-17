# Complete Vercel Deployment Guide (Frontend + Backend)

Yes! You can deploy **EVERYTHING** on Vercel. It is free, fast, and very reliable.

Since we are deploying from one repository, we will create **Two Projects** in Vercel (one for backend, one for frontend).

## Step 1: Deploy Backend

1.  Go to [Vercel.com](https://vercel.com) and click **Add New** -> **Project**.
2.  Import `Pizza_Slice`.
3.  **Project Name**: `pizza-slice-backend`
4.  **Framework Preset**: Select **Other**.
5.  **Root Directory**: Click Edit -> Select `backend`.
6.  **Environment Variables**:
    *   Add `MONGO_URI` -> `(Paste your MongoDB Connection String)`
7.  Click **Deploy**.
8.  **Wait** for it to finish.
9.  **Copy domain**: You will get something like `https://pizza-slice-backend.vercel.app`. **COPY THIS.**

## Step 2: Deploy Frontend

1.  Go to Dashboard -> **Add New** -> **Project**.
2.  Import `Pizza_Slice` (Again!).
3.  **Project Name**: `pizza-slice-frontend`
4.  **Framework Preset**: **Vite** (It should auto-detect).
5.  **Root Directory**: Click Edit -> Select `frontend`.
6.  **Environment Variables**:
    *   Add `VITE_API_URL` -> Paste the Backend URL from Step 1 + `/api`.
    *   *Example*: `https://pizza-slice-backend.vercel.app/api`
7.  Click **Deploy**.

## Step 3: Success!

*   Open your Frontend URL.
*   The application is now 100% hosted on Vercel for free.

## Why is there no issue?
*   Vercel turns your Express backend into "Serverless Functions".
*   This is perfect for apps like this.
*   The only "limitation" is that if no one uses the app for a while, the *first* request might take 2-3 seconds to wake up. After that, it is lightning fast.
*   For a portfolio or startup project, this is the **best** solution.
