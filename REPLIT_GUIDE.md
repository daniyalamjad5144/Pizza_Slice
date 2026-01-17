# Deploying on Replit

Since you want to deploy on Replit, I have optimized the project so you can run EVERYTHING (Frontend + Backend) in a **Single Repl**.

## Step 1: Import Project
1.  Go to [Replit.com](https://replit.com/new).
2.  Click **Import from GitHub**.
3.  Select your repo: `Pizza_Slice`.
4.  Language: **Node.js**.

## Step 2: Install & Build
Once the project is imported, you need to build the frontend so the backend can serve it.

1.  Open the **Shell** (Terminal) in Replit.
2.  Run this command to build the frontend:
    ```bash
    cd frontend && npm install && npm run build
    ```
    *(Wait for it to finish... it will create a `dist` folder)*

3.  Now go back to the root and install backend dependencies:
    ```bash
    cd ..
    cd backend && npm install
    ```

## Step 3: Configure Database
1.  In Replit, look for the **Secrets** (Lock icon) in the Tools panel.
2.  Add a new secret:
    *   Key: `MONGO_URI`
    *   Value: (Your MongoDB Connection String)

## Step 4: Run
1.  Click the **Run** button.
2.  Replit might ask "What command to run?".
3.  Configure `.replit` or just enter:
    ```bash
    cd backend && node server.js
    ```

## Why this works?
I modified your `backend/server.js`. Now, if it detects it is running on Replit, it will automatically look for the `frontend/dist` folder and show your website. You don't need two separate servers!
