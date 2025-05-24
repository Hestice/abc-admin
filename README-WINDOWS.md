# ABC Admin - Windows One-Click Setup

## 🚀 Quick Start (Zero Friction!)

### Prerequisites
Before running ABC Admin, make sure you have these installed:

1. **Node.js** (v18 or later)
   - Download from: https://nodejs.org/
   - Choose the LTS version

2. **Docker Desktop** 
   - Download from: https://www.docker.com/products/docker-desktop/
   - Make sure it's running before starting ABC Admin

### 🎯 One-Click Startup

1. **Double-click** `start-abc-admin.bat`
2. Wait for the setup to complete (about 1-2 minutes)
3. Your web browser will automatically open to the application
4. **That's it!** 🎉

### 🛑 Stopping the Application

**Option 1:** Close the command window that opened when you started the app

**Option 2:** Double-click `stop-abc-admin.bat`

## 📱 Application URLs

Once started, you can access:
- **Web Application**: http://localhost:3000
- **API Documentation**: http://localhost:8080/api-docs
- **Database**: localhost:5432

## 🔧 What Happens Behind the Scenes

The startup script automatically:
1. ✅ Checks if Node.js and Docker are installed
2. 📦 Installs npm dependencies (if needed)
3. 🐘 Starts PostgreSQL database in Docker
4. 🖥️ Starts the NestJS backend API
5. ⚛️ Starts the Next.js frontend
6. 🌐 Opens your web browser

## 🚨 Troubleshooting

### "Node.js is not installed"
- Install Node.js from https://nodejs.org/
- Restart your computer after installation

### "Docker is not installed or not running"
- Install Docker Desktop from https://docker.com/products/docker-desktop/
- Make sure Docker Desktop is running (look for the whale icon in your system tray)

### "Failed to start PostgreSQL"
- Make sure Docker Desktop is running
- Check if port 5432 is already in use by another application

### Ports already in use
- Frontend (3000): Close any other web development servers
- Backend (8080): Close any other applications using this port
- Database (5432): Close any other PostgreSQL instances

### Application won't load in browser
- Wait a few more minutes for all services to start
- Try refreshing the browser page
- Check that all three services are running in the command windows

## 💡 Tips

- **First run takes longer** - The script needs to download Docker images and install dependencies
- **Keep command windows open** - Closing them will stop the services
- **Use Chrome or Edge** - For the best experience
- **Bookmark localhost:3000** - For quick access next time

## 🆘 Need Help?

If you encounter any issues:
1. Try running `stop-abc-admin.bat` first
2. Restart Docker Desktop
3. Run `start-abc-admin.bat` again
4. Contact your development team if problems persist

---

**Enjoy using ABC Admin!** 🎊 