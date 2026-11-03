# 🚀 Complete GitHub Setup Guide for Hackathon Submission

Follow these simple steps to push the PredictX project into your GitHub repository so your hackathon faculty and judges can access, clone, and test it.

---

### Step 1: Create a New Repository on GitHub

1. Open your browser and go to [https://github.com/new](https://github.com/new).
2. Set **Repository name** to:
   ```
   predictx-ai-predictive-maintenance
   ```
   *(or any repository name you prefer)*.
3. Choose **Public** (so your faculty and hackathon evaluators can view and grade it).
4. **IMPORTANT:** Do **NOT** check "Add a README file", "Add .gitignore", or choose a license (we already created professional versions for you).
5. Click **"Create repository"**.
6. Copy your repository HTTPS URL (e.g., `https://github.com/YOUR_USERNAME/predictx-ai-predictive-maintenance.git`).

---

### Step 2: Unzip and Initialize Git

If you downloaded the `predictx-ai-predictive-maintenance.zip` file:

```bash
# 1. Unzip the file
unzip predictx-ai-predictive-maintenance.zip -d predictx-ai
cd predictx-ai

# 2. Initialize git repository
git init

# 3. Add all project files
git add .

# 4. Commit files
git commit -m "feat: complete PredictX AI predictive maintenance platform for hackathon"

# 5. Rename branch to main
git branch -M main

# 6. Link to your GitHub repository (replace with your actual GitHub URL)
git remote add origin https://github.com/YOUR_USERNAME/predictx-ai-predictive-maintenance.git

# 7. Push to GitHub!
git push -u origin main
```

---

### Step 3: Verify Your GitHub Repository

Once pushed, open your GitHub link in the browser:
- You will see the complete project with badges, system architecture diagram, and full documentation.
- The `README.md` will display the 3-Minute Faculty Evaluation Walkthrough.
- Faculty members can run `git clone`, `npm install`, and `npm run dev` to evaluate your working project in under 60 seconds!

---

### 💡 Quick Tips for Hackathon Presentation

1. **Add Project Description on GitHub:**
   - In your GitHub repo page, click the ⚙️ gear icon next to "About".
   - Description: `AI-Powered Predictive Maintenance for Industry 4.0 with IoT telemetry, ISO 10816-3 vibration spectrum analysis, and ML failure prediction.`
   - Topics: `predictive-maintenance`, `iot`, `machine-learning`, `react19`, `hackathon`, `iso-10816-3`, `digital-twin`.

2. **Faculty Live Demo:**
   - Mention the ISO 10816-3 standard compliance (Zones A, B, C, D).
   - Use the **"Inject Anomaly"** button in the top navigation to demonstrate live failure detection in front of your faculty!
