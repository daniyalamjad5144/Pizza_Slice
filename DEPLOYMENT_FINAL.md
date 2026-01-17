# Final Deployment Guide: Vercel (Frontend) + Koyeb (Backend)

Great choice! **Koyeb** is an excellent free alternative for hosting Node.js backends (unlike Vercel which converts them to serverless functions, Koyeb keeps them as a running server which is better for websockets/database connections).

## Part 1: Deploy Backend to Koyeb

1.  **Sign Up**: Go to [Koyeb.com](https://www.koyeb.com/) and sign up (you can use GitHub).
2.  **Create App**:
    *   Click **Create App** (or "Create Web Service").
    *   **Source**: Select **GitHub**.
    *   **Repository**: Choose `Pizza_Slice`.
3.  **Configure Service**:
    *   **Work Directory**: This is CRITICAL. Set it to `backend`.
        *   (There should be an option for "Root Directory" or "Work Directory" in the settings. If you miss this, the build will fail).
    *   **Builder**: Standard / Buildpack (Auto-detect usually works).
    *   **Run Command**: `npm start` (Should be auto-detected).
4.  **Environment Variables**:
    *   Add variable: `MONGO_URI`
    *   Value: (Your MongoDB Connection String)
5.  **Deploy**: Click **Deploy**.
    *   Wait for it to become "Healthy".
    *   **Copy the Public URL** (e.g., `https://pizza-slice-backend-yourname.koyeb.app`).

## Part 2: Deploy Frontend to Vercel

1.  **Sign Up/Login**: Go to [Vercel.com](https://vercel.com).
2.  **Add New Project**:
    *   Click **Add New...** -> **Project**.
    *   Import `Pizza_Slice`.
3.  **Configure**:
    *   **Root Directory**: Click "Edit" and select `frontend`.
    *   **Framework Preset**: Vite.
4.  **Environment Variables**:
    *   Add variable: `VITE_API_URL`
    *   Value: Your **Koyeb Backend URL** from Part 1 + `/api`.
        *   Example: `https://pizza-slice-backend-yourname.koyeb.app/api`
5.  **Deploy**: Click **Deploy**.

## Part 3: Test

1.  Open your Vercel App URL.
2.  The frontend should load instantly.
3.  It should fetch data from your Koyeb backend.
