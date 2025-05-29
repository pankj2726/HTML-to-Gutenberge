# HTML to Gutenberg CLI Tool

A Node.js command-line tool that converts standard HTML files into Gutenberg-compatible JSON block arrays for WordPress. Designed to work seamlessly in **Termux on Android** with full style and class preservation.

## 🚀 Features

- **Style Preservation**: All inline `style` attributes and CSS `class` names are maintained
- **Comprehensive Tag Support**: Converts common HTML elements to appropriate Gutenberg blocks
- **Nested Content**: Handles nested lists and inline formatting (strong, em, links)
- **Fallback Support**: Unsupported elements are converted to HTML blocks
- **Multiple Input Methods**: File input, stdin piping, or direct CLI usage
- **Termux Compatible**: Works out-of-the-box on Android via Termux

## 📦 Installation

### In Termux (Android)

1. Install Node.js:
```bash
pkg install nodejs
```

2. Create project directory:
```bash
mkdir html2gutenberg
cd html2gutenberg
```

3. Save the provided files (`cli.js`, `package.json`) to this directory

4. Install dependencies:
```bash
npm install
```

5. Make the CLI executable:
```bash
chmod +x cli.js
```

## 🔰 Complete Beginner Guide for Termux Android

### Step 1: Install Termux
1. Download **Termux** from F-Droid (recommended) or Google Play Store
2. Open Termux app

### Step 2: Set Up Your Environment
```bash
# Update package lists
pkg update && pkg upgrade

# Install Node.js
pkg install nodejs

# Check if installation worked
node --version
npm --version
```

### Step 3: Create Your Project
```bash
# Create a new folder for your project
mkdir html2gutenberg
cd html2gutenberg

# Create the main files (copy the content from the artifacts above)
nano package.json
# Paste the package.json content, then press Ctrl+X, Y, Enter to save

nano cli.js
# Paste the cli.js content, then press Ctrl+X, Y, Enter to save

# Make the script executable
chmod +x cli.js
```

### Step 4: Install Dependencies
```bash
npm install
```

### Step 5: Create Test Files
```bash
# Create a sample HTML file to test
nano example-input.html
# Paste the example HTML content, then save with Ctrl+X, Y, Enter
```

## 🎯 Usage Examples

### Basic Usage
```bash
# Convert HTML file to JSON
node cli.js -i example-input.html -o output.json

# View result in terminal instead of saving
node cli.js -i example-input.html --stdout
```

### Advanced Usage
```bash
# Pipe HTML content directly
echo "<h1 style='color: red;'>Hello World</h1>" | node cli.js --stdout

# Convert and save with custom names
node cli.js -i my-page.html -o gutenberg-blocks.json
```

### File Management in Termux
```bash
# List files in current directory
ls -la

# View file contents
cat output.json

# Edit files
nano my-file.html

# Copy files from Android storage to Termux
cp /storage/emulated/0/Download/myfile.html ./

# Copy results back to Android Downloads
cp output.json /storage/emulated/0/Download/
```

## 📱 Termux Tips for Beginners

### Essential Termux Commands
```bash
# Navigate directories
cd folder_name          # Enter folder
cd ..                   # Go back one level
cd ~                    # Go to home directory
pwd                     # Show current directory

# File operations
ls                      # List files
ls -la                  # List files with details
mkdir folder_name       # Create folder
rm filename             # Delete file
cp source destination   # Copy file
mv old_name new_name    # Rename/move file

# Text editing
nano filename           # Edit file (Ctrl+X to exit)
cat filename           # View file contents
```

### Accessing Android Files
```bash
# Allow Termux to access Android storage
termux-setup-storage

# Android folders will be available at:
ls ~/storage/shared/    # Main storage
ls ~/storage/shared/Download/    # Downloads folder
ls ~/storage/shared/Documents/   # Documents folder
```

### Keyboard Shortcuts in Termux
- **Volume Down + C**: Copy text
- **Volume Down + V**: Paste text  
- **Volume Down + K**: Toggle extra keys row
- **Ctrl + C**: Stop current command
- **Ctrl + L**: Clear screen
- **Tab**: Auto-complete commands/filenames

## 🔧 HTML Tag Support

| HTML Element | Gutenberg Block | Notes |
|--------------|-----------------|-------|
| `<p>` | `core/paragraph` | Preserves all inline styles |
| `<h1>`-`<h6>` | `core/heading` | Maps to appropriate level |
| `<ul>`, `<ol>` | `core/list` | Handles nested lists |
| `<img>` | `core/image` | Preserves src, alt, dimensions |
| `<strong>`, `<em>`, `<a>` | Inline markup | Preserved within blocks |
| Other tags | `core/html` | Fallback to preserve everything |

## 💡 Sample HTML Input
```html
<h1 class="title" style="color: #333;">My Blog Post</h1>
<p class="intro" style="font-size: 18px;">
  This is a <strong>sample paragraph</strong> with 
  <a href="https://example.com" style="color: blue;">a styled link</a>.
</p>
<ul style="list-style: disc;">
  <li>First item</li>
  <li>Second item with <em>emphasis</em></li>
</ul>
```

## 📋 Sample JSON Output
The tool generates Gutenberg-compatible JSON like this:
```json
[
  {
    "blockName": "core/heading",
    "attrs": {
      "level": 1,
      "style": "color: #333;",
      "className": "title",
      "content": "My Blog Post"
    },
    "innerHTML": "My Blog Post",
    "innerContent": ["My Blog Post"]
  }
]
```

## 🆘 Troubleshooting

### Common Issues

**"Command not found":**
```bash
# Make sure you're in the right directory
pwd
ls -la

# Try running with full path
./cli.js --help
```

**"Permission denied":**
```bash
# Make file executable
chmod +x cli.js
```

**"Module not found":**
```bash
# Install dependencies
npm install

# Check if package.json exists
cat package.json
```

**Can't access my HTML files:**
```bash
# Set up storage access
termux-setup-storage

# Copy file from Downloads
cp ~/storage/shared/Download/myfile.html ./
```

**Output file not visible in Android:**
```bash
# Copy to Downloads folder
cp output.json ~/storage/shared/Download/

# Or use termux-open to share
termux-open output.json
```

## 📖 Getting Help
```bash
# Show help message
node cli.js --help

# Check if files exist
ls -la

# Test with simple example
echo "<p>Test</p>" | node cli.js --stdout
```

## 🔄 Workflow Example

Complete workflow for converting an HTML file:

1. **Prepare your HTML file:**
```bash
# Copy from Android storage
cp ~/storage/shared/Download/webpage.html ./input.html
```

2. **Convert to Gutenberg blocks:**
```bash
node cli.js -i input.html -o blocks.json
```

3. **Check the result:**
```bash
# View first few lines
head -20 blocks.json

# Or view entire file
cat blocks.json
```

4. **Share the result:**
```bash
# Copy back to Downloads
cp blocks.json ~/storage/shared/Download/

# Or share directly
termux-open blocks.json
```

This tool preserves all your HTML styling and converts it into a format that WordPress Gutenberg can understand, making it perfect for importing styled content into WordPress sites!
