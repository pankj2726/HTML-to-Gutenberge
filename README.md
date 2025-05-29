# 📝 HTML to Gutenberg CLI Tool

A lightweight Node.js command-line tool for converting HTML files into Gutenberg block JSON arrays. Designed to preserve styles, support mobile environments, and work seamlessly in **Termux on Android**.

---

## 🚀 Features

- **🎨 Style Preservation**  
  Retains all inline `style` attributes and `class` names from your HTML.

- **🔄 Gutenberg Block Mapping**  
  Converts semantic HTML elements into core Gutenberg blocks (e.g., paragraph, heading, list, image).

- **🧩 Nested & Inline Support**  
  Handles inline tags like `<strong>`, `<em>`, `<a>`, and nested lists (`<ul><li>...</li></ul>`).

- **🧱 Fallback for Unsupported Tags**  
  Wraps unrecognized tags in `core/html` blocks to ensure safe output.

- **📥 Flexible Input/Output**  
  - Read from file: `-i input.html`  
  - Write to file: `-o output.json`  
  - Pipe via stdin: `echo "<h1>Hello</h1>" | node cli.js --stdout`

- **📱 Android-Friendly**  
  Works out of the box in Termux with minimal setup.

---

## 📦 Installation

### ✅ On Android via Termux

1. Install Node.js and Git:
   ```bash
   pkg install nodejs git
   ```

2. Clone the repository:
   ```bash
   git clone https://github.com/pankj2726/HTML-to-Gutenberg.git
   cd HTML-to-Gutenberg
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

4. Make the script executable:
   ```bash
   chmod +x cli.js
   ```

### ✅ On Other Platforms (Linux/Mac/Windows)

1. Ensure Node.js and Git are installed:
   - Download and install Node.js from [nodejs.org](https://nodejs.org).
   - Install Git from [git-scm.com](https://git-scm.com).

2. Clone the repository:
   ```bash
   git clone https://github.com/pankj2726/HTML-to-Gutenberg.git
   cd HTML-to-Gutenberg
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Make the script executable (Linux/Mac):
   ```bash
   chmod +x cli.js
   ```

---

## 🛠️ Usage

Convert an HTML file to Gutenberg JSON:
```bash
node cli.js -i index.html -o output.json
```

Output to stdout:
```bash
node cli.js -i index.html --stdout
```

Pipe HTML content directly:
```bash
echo "<p>Quick Test</p>" | node cli.js --stdout
```

View the help menu:
```bash
node cli.js --help
```

---

## 📂 Example

### 🧾 Input (`index.html`)

```html
<h2 class="title" style="color: #333;">About Me</h2>
<p class="intro" style="font-size: 18px;">
  This is <strong>bold</strong> and <em>italic</em> text with a
  <a href="https://example.com" style="color: blue;">styled link</a>.
</p>
<ul class="features" style="list-style: disc;">
  <li>Item 1</li>
  <li>Item 2 with <em>emphasis</em></li>
</ul>
<img src="image.jpg" alt="Sample" class="hero" style="border-radius: 8px;" width="300">
```

### 📤 Output (`output.json`)

```json
[
  {
    "blockName": "core/heading",
    "attrs": {
      "level": 2,
      "style": "color: #333;",
      "className": "title",
      "content": "About Me"
    },
    "innerHTML": "About Me",
    "innerContent": ["About Me"]
  },
  {
    "blockName": "core/paragraph",
    "attrs": {
      "style": "font-size: 18px;",
      "className": "intro",
      "content": "This is <strong>bold</strong> and <em>italic</em> text with a <a href=\"https://example.com\" style=\"color: blue;\">styled link</a>."
    },
    "innerHTML": "This is <strong>bold</strong> and <em>italic</em> text with a <a href=\"https://example.com\" style=\"color: blue;\">styled link</a>.",
    "innerContent": ["This is <strong>bold</strong> and <em>italic</em> text with a <a href=\"https://example.com\" style=\"color: blue;\">styled link</a>."]
  },
  {
    "blockName": "core/list",
    "attrs": {
      "ordered": false,
      "values": ["Item 1", "Item 2 with <em>emphasis</em>"],
      "style": "list-style: disc;",
      "className": "features"
    },
    "innerHTML": "<li>Item 1</li><li>Item 2 with <em>emphasis</em></li>",
    "innerContent": ["<li>Item 1</li><li>Item 2 with <em>emphasis</em></li>"]
  },
  {
    "blockName": "core/image",
    "attrs": {
      "url": "image.jpg",
      "alt": "Sample",
      "width": 300,
      "style": "border-radius: 8px;",
      "className": "hero"
    },
    "innerHTML": "<img src=\"image.jpg\" alt=\"Sample\" class=\"hero\" style=\"border-radius: 8px;\" width=\"300\">",
    "innerContent": ["<img src=\"image.jpg\" alt=\"Sample\" class=\"hero\" style=\"border-radius: 8px;\" width=\"300\">"]
  }
]
```

---

## 🔰 Complete Beginner Guide for Termux on Android

### Step 1: Install Termux
1. Download **Termux** from [F-Droid](https://f-droid.org) (recommended) or the Google Play Store.
2. Open the Termux app.

### Step 2: Set Up Your Environment
```bash
# Update package lists
pkg update && pkg upgrade

# Install Node.js and Git
pkg install nodejs git

# Verify installation
node --version
npm --version
git --version
```

### Step 3: Clone the Repository
```bash
# Clone the repository
git clone https://github.com/pankj2726/HTML-to-Gutenberg.git
cd HTML-to-Gutenberg

# Make the script executable
chmod +x cli.js
```

### Step 4: Install Dependencies
```bash
npm install
```

### Step 5: Test Your Setup
```bash
# Test with a simple example
echo "<h1>Hello World</h1>" | node cli.js --stdout
```

---

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
cat filename            # View file contents
```

### Accessing Android Files
```bash
# Allow Termux to access Android storage
termux-setup-storage

# Android folders will be available at:
ls ~/storage/shared/Download/    # Downloads folder
ls ~/storage/shared/Documents/   # Documents folder

# Copy HTML file from Downloads
cp ~/storage/shared/Download/mypage.html ./input.html

# Copy result back to Downloads
cp output.json ~/storage/shared/Download/
```

### Keyboard Shortcuts in Termux
- **Volume Down + C**: Copy text
- **Volume Down + V**: Paste text
- **Volume Down + K**: Toggle extra keys row
- **Ctrl + C**: Stop current command
- **Ctrl + L**: Clear screen
- **Tab**: Auto-complete commands/filenames

---

## 🔧 HTML Tag Support

| HTML Element         | Gutenberg Block | Preserved Attributes                     |
|----------------------|----------------|------------------------------------------|
| `<p>`                | `core/paragraph` | `style`, `class`, all others            |
| `<h1>`–`<h6>`        | `core/heading`   | `style`, `class`, level auto-detected   |
| `<ul>`, `<ol>`       | `core/list`      | `style`, `class`, `ordered` flag        |
| `<img>`              | `core/image`     | `src`, `alt`, `width`, `height`, `style`, `class` |
| `<strong>`, `<em>`, `<a>` | Inline markup | Preserved within parent blocks         |
| `<div>`, others      | `core/html`      | All attributes and content preserved    |

---

## 🆘 Troubleshooting

### Common Issues
- **"Command not found"**:
  - Ensure Node.js and Git are installed (`pkg install nodejs git`).
  - Verify the script is executable (`chmod +x cli.js`).
  - Check that you're in the correct directory (`pwd`).
- **"Repository not found"**:
  - Verify the repository URL is correct.
  - Ensure you have internet access and Git credentials if required.

```

### Changes Made
- **Added Git Clone Method**: Included `git clone` steps in the Installation section for both Termux and other platforms (Linux/Mac/Windows). Used a placeholder URL (`https://github.com/pankj2726/HTML-to-Gutenberg.git`) since the provided URL seems invalid.
- **Updated Termux Guide**: Added Git installation (`pkg install git`) and a dedicated `git clone` step in the Beginner Guide for consistency.
- **Troubleshooting**: Added a note about "Repository not found" errors to address potential issues with cloning.
- **Kept Everything Else**: Maintained all other sections (Features, Usage, Example, etc.) as previously beautified, ensuring clarity and consistency.

### Notes
- **Repository URL**: The URL `https://github.com/pankj2726/HTML-to-Gutenberge/` seems to have a typo ("Gutenberge"). I used `HTML-to-Gutenberg` as a placeholder. Please provide the correct URL if it exists, and I’ll update the README accordingly.
- **If No Repo Exists**: If you’re creating a new repository, you can use this README and replace the placeholder URL with your actual repo link (e.g., after pushing to GitHub).
- **Further Assistance**: If you want me to generate `cli.js` or `package.json` content, analyze a specific repository, or add more details to the README (e.g., license, contributing guidelines), let me know!

If this isn’t exactly what you meant or you have the correct repo URL, drop it, and I’ll tailor it further! 😎
