# Data File Instructions

## ⚠️ Important: CSV File Not in Repository

The `truestate_assignment_dataset.csv` file (224MB) is **NOT included** in the GitHub repository because it exceeds GitHub's 100MB file size limit.

## 📥 How to Get the Data File

### Option 1: Use Your Local File
If you have the CSV file locally:
1. Place it in the project root directory
2. Use it for local development and data loading

### Option 2: Download from Original Source
The assignment mentioned a dataset link. Download it from:
- The original assignment PDF
- Or the Google Drive link provided in the assignment

### Option 3: For Deployment
When deploying, you'll need to:
1. Load the data directly to PostgreSQL from your local machine
2. Or upload the CSV to a cloud storage and load from there

## 🔧 Loading Data

Once you have the CSV file:

```bash
cd backend
source venv/bin/activate
export DATABASE_URL="your-postgresql-url"
python -m src.utils.loadData ../truestate_assignment_dataset.csv
```

## 📝 Note for Reviewers

The CSV file is excluded from the repository due to size limitations. Please:
1. Download the dataset from the assignment source
2. Place it in the project root
3. Follow the setup instructions in `SETUP.md` or `README.md`

## ✅ File Location

The CSV file should be placed at:
```
/Users/shreyansh_gupta/Desktop/truestate/truestate_assignment_dataset.csv
```

This location is referenced in:
- `backend/src/utils/loadData.py` (default path)
- Setup instructions
- Deployment guides

