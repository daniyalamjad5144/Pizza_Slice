# Replit Deployment Guide (The Easiest Way)

I have automated everything for you. You do not need to run manual commands anymore.

## Step 1: Import to Replit
1.  Log in to [Replit.com](https://replit.com).
2.  Click **Create Repl** -> **Import from GitHub**.
3.  Choose your repository: `Pizza_Slice`.
4.  Language: **Node.js**.

## Step 2: Set Database Secret
Before you run it, you must connect your database.
1.  In your new Repl, verify the `Secrets` (Lock icon) in the Tools panel (left side usually).
2.  Click "New Secret":
    *   **Key**: `MONGO_URI`
    *   **Value**: Paste your MongoDB connection string.
3.  Click **Add Secret**.

## Step 3: Click Run
1.  Just hit the big green **Run** button at the top.
2.  **Wait**:
    *   The first time, it will take a few minutes because it will automatically:
        *   Install all libraries.
        *   Build your React Frontend.
        *   Start the Backend Server.
    *   You will see logs like "🎨 Frontend build not found. Building now...".
3.  Once finished, you will see "🚀 Starting Server..." and "Server running on port...".
4.  A "Webview" window will open showing your Pizza Website!

## Optional: Update Frontend
If you make changes to the frontend code in Replit:
1.  You need to rebuild it manually.
2.  In the Shell (Terminal), type:
    ```bash
    rm -rf frontend/dist && bash start.sh
    ```
    (This deletes the old build and forces a new one).

That's it! Your entire app (Frontend + Backend) is running in one place.
