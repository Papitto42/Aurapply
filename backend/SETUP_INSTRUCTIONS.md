# Quick Start - Run Everything at Once

```bash
cd backend
./setup-and-start.sh
```

That's it! This single command will:
1. ✅ Set up MongoDB (install if needed)
2. ✅ Start MongoDB
3. ✅ Test the connection
4. ✅ Create test users
5. ✅ Start your server

---

## Alternative: Step by Step

If you prefer to run commands individually:

```bash
cd backend

# 1. Run the setup script
./setup-minimal-db.sh

# 2. Start MongoDB
./start-minimal-mongodb.sh

# 3. Test connection
node setupMongoDB.js

# 4. Create test users (optional)
node createTestUsers.js

# 5. Start your server
node server.js
```