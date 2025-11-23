# Quick MongoDB Setup - MongoDB Atlas (Cloud)

Since local MongoDB installation has compatibility issues, here's the FASTEST way to get running:

## Step 1: Create Free MongoDB Atlas Account (2 minutes)

1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up with Google/GitHub (fastest)
3. Create a FREE cluster (M0 - Free tier)
4. Choose any cloud provider/region
5. Create a database user:
   - Username: `aurapply`
   - Password: `aurapply123` (or any password you want)
6. Add IP Address: Click "Add My Current IP Address"
7. Get your connection string - it will look like:
   ```
   mongodb+srv://aurapply:aurapply123@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

## Step 2: Update Backend Configuration

I'll create a .env file for you with the connection string once you have it.

## Step 3: Test Connection

Once you have the connection string, I'll help you:
1. Create the .env file
2. Test the connection
3. Create test users

---

**OR** if you want to try fixing the local installation:

```bash
# Update Command Line Tools
sudo rm -rf /Library/Developer/CommandLineTools
sudo xcode-select --install
```

Then try installing MongoDB again.



