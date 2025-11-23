# NGO Interface - Setup Instructions

## 🚀 Quick Start with VS Code and Live Server

### Prerequisites
- Visual Studio Code
- Live Server extension for VS Code

### Installation Steps

1. **Install VS Code Extensions**
   - Open VS Code
   - Go to Extensions (Ctrl+Shift+X)
   - Install the following extensions:
     - **Live Server** by Ritwick Dey
     - **Auto Rename Tag** by Jun Han
     - **Prettier** by Prettier
     - **HTML CSS Support** by ecmel

2. **Open the Project**
   - Open VS Code
   - File → Open Folder
   - Select the `NGO_Interface` folder

3. **Start Live Server**
   - Right-click on `index.html` in the file explorer
   - Select "Open with Live Server"
   - Or use the Live Server button in the status bar (bottom right)
   - The project will open in your default browser at `http://localhost:5500`

### 🎯 Project Structure

```
NGO_Interface/
├── index.html              # Main dashboard page
├── greenpeace.html         # Greenpeace NGO page (NGO 2)
├── greenpeace/             # Greenpeace subdirectory
│   ├── index.html          # Alternative Greenpeace page
│   ├── css/                # CSS files
│   ├── js/                 # JavaScript files
│   └── components/         # Additional components
├── wlf/                    # World Literacy Foundation
├── backend/                # Backend server files
├── .vscode/                # VS Code configuration
│   ├── settings.json       # Workspace settings
│   ├── launch.json         # Debug configurations
│   └── extensions.json     # Recommended extensions
└── SETUP_INSTRUCTIONS.md   # This file
```

### 🔧 VS Code Configuration

The project includes pre-configured VS Code settings:

- **Live Server**: Configured to run on port 5500
- **Auto-formatting**: HTML, CSS, and JavaScript formatting enabled
- **Debug configurations**: Ready-to-use Chrome debugging setups
- **File associations**: Proper syntax highlighting for all file types

### 🌐 Available Pages

1. **Main Dashboard**: `http://localhost:5500/index.html`
   - Overview of all NGOs
   - Navigation to individual NGO pages

2. **World Literacy Foundation (NGO 1)**: `http://localhost:5500/wlf/index.html`
   - Complete WLF information page
   - Success stories and impact data
   - Enhanced partners section
   - Contact information and forms

3. **Greenpeace (NGO 2)**: `http://localhost:5500/greenpeace.html`
   - Complete Greenpeace information page
   - Environmental data dashboard
   - Impact calculator
   - Partnership information

4. **Alternative Greenpeace**: `http://localhost:5500/greenpeace/index.html`
   - Alternative version of Greenpeace page

### 🛠️ Development Workflow

1. **Start Live Server**
   - Right-click on any HTML file → "Open with Live Server"
   - Changes will auto-reload in the browser

2. **Debug JavaScript**
   - Press F5 or go to Run → Start Debugging
   - Choose "Launch NGO Interface" or "Launch Greenpeace Page"
   - Set breakpoints in JavaScript files

3. **Edit Files**
   - All changes are automatically reflected in the browser
   - Use VS Code's built-in formatting (Shift+Alt+F)

### 📝 Recent Changes

- ✅ **Removed multilingual functionality** from Greenpeace pages
- ✅ **Cleaned up language switcher** from both greenpeace.html and greenpeace/index.html
- ✅ **Removed translation attributes** and JavaScript
- ✅ **Set up VS Code workspace** with Live Server integration

### 🐛 Troubleshooting

**Live Server not working?**
- Check if port 5500 is available
- Try a different port in VS Code settings
- Restart VS Code and try again

**Page not loading?**
- Ensure you're opening the correct HTML file
- Check the browser console for errors
- Verify all file paths are correct

**Styling issues?**
- Check if CSS files are properly linked
- Verify file paths in HTML files
- Clear browser cache (Ctrl+F5)

### 📞 Support

For issues or questions:
1. Check the browser console for JavaScript errors
2. Verify all file paths are correct
3. Ensure Live Server is running properly
4. Check VS Code output panel for any errors

---

**Happy coding! 🎉**
