# Deployment Guide for PizzaSlice Project (Free Tier)

You can host **BOTH** the Frontend and Backend on **Vercel** for free.

## 1. Deploying the Backend (Vercel)

1.  **Sign Up/Login**: Go to [Vercel.com](https://vercel.com) and log in with GitHub.
2.  **Add New Project**:
    *   Click **Add New...** -> **Project**.
    *   Import your `Pizza_Slice` repository.
3.  **Configure Project**:
    *   **Project Name**: `pizza-slice-backend` (It is best to separate them).
    *   **Root Directory**: Click "Edit" and select `backend`.
    *   **Environment Variables**:
        *   `MONGO_URI`: (Your MongoDB Connection String)
4.  **Deploy**: Click **Deploy**.
    *   Wait for it to finish.
    *   Once deployed, you will get a domain like `https://pizza-slice-backend.vercel.app`. **Copy this URL.**

## 2. Deploying the Frontend (Vercel)

1.  **Add New Project** (Again):
    *   Go back to the Vercel Dashboard.
    *   Click **Add New...** -> **Project**.
    *   Import the *same* `Pizza_Slice` repository again.
2.  **Configure Project**:
    *   **Project Name**: `pizza-slice-frontend`.
    *   **Root Directory**: Click "Edit" and select `frontend`.
    *   **Framework Preset**: Vite (should be auto-detected).
3.  **Environment Variables**:
    *   Expand "Environment Variables".
    *   **Key**: `VITE_API_URL`
    *   **Value**: Paste your *Backend* URL from Step 1 (e.g., `https://pizza-slice-backend.vercel.app/api`).
    *   **Important**: Ensure you add `/api` to the end.
4.  **Deploy**: Click **Deploy**.

## 3. Final Verification

1.  Open your new Frontend URL.
2.  The site should load and connect to the backend successfully.

**Why Vercel?**
*   It's free for hobby projects.
*   It doesn't "sleep" like Render's free tier sometimes does (though serverless functions have a "cold start", it's usually faster).
*   Everything is in one place.
