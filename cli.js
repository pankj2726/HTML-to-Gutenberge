#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { parseDocument } = require('htmlparser2');
const { DomHandler } = require('domhandler');
const { textContent, getAttributeValue } = require('domutils');

class HtmlToGutenbergConverter {
  constructor() {
    this.blockId = 0;
  }

  /**
   * Generate unique client ID for each block
   */
  generateClientId() {
    return `gutenberg-block-${Date.now()}-${++this.blockId}`;
  }

  /**
   * Preserve all attributes including style and class
   */
  preserveAttributes(element) {
    const attrs = {};
    const styleClasses = [];
    
    if (element.attribs) {
      // Preserve style attribute
      if (element.attribs.style) {
        attrs.style = element.attribs.style;
      }
      
      // Preserve class attribute
      if (element.attribs.class) {
        attrs.className = element.attribs.class;
        styleClasses.push(`class="${element.attribs.class}"`);
      }
      
      // Preserve other attributes
      Object.keys(element.attribs).forEach(key => {
        if (key !== 'style' && key !== 'class') {
          attrs[key] = element.attribs[key];
        }
      });
    }
    
    return { attrs, styleClasses };
  }

  /**
   * Convert DOM element to HTML string with all attributes preserved
   */
  elementToHtml(element, preserveTag = true) {
    if (element.type === 'text') {
      return element.data;
    }
    
    if (element.type !== 'tag') {
      return '';
    }
    
    let html = '';
    
    if (preserveTag) {
      // Build opening tag with all attributes
      const attribs = Object.keys(element.attribs || {})
        .map(key => `${key}="${element.attribs[key]}"`)
        .join(' ');
      
      html += `<${element.name}${attribs ? ' ' + attribs : ''}>`;
    }
    
    // Process children
    if (element.children) {
      element.children.forEach(child => {
        html += this.elementToHtml(child, true);
      });
    }
    
    if (preserveTag) {
      html += `</${element.name}>`;
    }
    
    return html;
  }

  /**
   * Convert paragraph element to Gutenberg paragraph block
   */
  convertParagraph(element) {
    const { attrs } = this.preserveAttributes(element);
    const innerHTML = this.elementToHtml(element, false);
    
    return {
      blockName: 'core/paragraph',
      attrs: {
        ...attrs,
        content: innerHTML
      },
      innerHTML: innerHTML,
      innerContent: [innerHTML]
    };
  }

  /**
   * Convert heading element to Gutenberg heading block
   */
  convertHeading(element) {
    const level = parseInt(element.name.substring(1)); // h1 -> 1, h2 -> 2, etc.
    const { attrs } = this.preserveAttributes(element);
    const innerHTML = this.elementToHtml(element, false);
    
    return {
      blockName: 'core/heading',
      attrs: {
        level,
        ...attrs,
        content: innerHTML
      },
      innerHTML: innerHTML,
      innerContent: [innerHTML]
    };
  }

  /**
   * Convert list element to Gutenberg list block
   */
  convertList(element) {
    const { attrs } = this.preserveAttributes(element);
    const isOrdered = element.name === 'ol';
    const innerHTML = this.elementToHtml(element, false);
    
    // Extract list items for values array
    const values = [];
    if (element.children) {
      element.children.forEach(child => {
        if (child.type === 'tag' && child.name === 'li') {
          values.push(this.elementToHtml(child, false));
        }
      });
    }
    
    return {
      blockName: 'core/list',
      attrs: {
        ordered: isOrdered,
        values,
        ...attrs
      },
      innerHTML: innerHTML,
      innerContent: [innerHTML]
    };
  }

  /**
   * Convert image element to Gutenberg image block
   */
  convertImage(element) {
    const { attrs } = this.preserveAttributes(element);
    const src = getAttributeValue(element, 'src') || '';
    const alt = getAttributeValue(element, 'alt') || '';
    const width = getAttributeValue(element, 'width');
    const height = getAttributeValue(element, 'height');
    
    const imageAttrs = {
      url: src,
      alt,
      ...attrs
    };
    
    if (width) imageAttrs.width = parseInt(width);
    if (height) imageAttrs.height = parseInt(height);
    
    const innerHTML = this.elementToHtml(element);
    
    return {
      blockName: 'core/image',
      attrs: imageAttrs,
      innerHTML: innerHTML,
      innerContent: [innerHTML]
    };
  }

  /**
   * Convert unsupported elements to HTML block (fallback)
   */
  convertHtmlBlock(element) {
    const innerHTML = this.elementToHtml(element);
    
    return {
      blockName: 'core/html',
      attrs: {
        content: innerHTML
      },
      innerHTML: innerHTML,
      innerContent: [innerHTML]
    };
  }

  /**
   * Convert DOM element to Gutenberg block
   */
  convertElement(element) {
    if (element.type !== 'tag') {
      return null;
    }
    
    switch (element.name.toLowerCase()) {
      case 'p':
        return this.convertParagraph(element);
      
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6':
        return this.convertHeading(element);
      
      case 'ul':
      case 'ol':
        return this.convertList(element);
      
      case 'img':
        return this.convertImage(element);
      
      // Skip these tags but process their children
      case 'body':
      case 'html':
      case 'div':
      case 'article':
      case 'section':
        return null; // Will process children separately
      
      default:
        // Fallback: convert to HTML block to preserve everything
        return this.convertHtmlBlock(element);
    }
  }

  /**
   * Process DOM tree and convert to Gutenberg blocks
   */
  processElements(elements) {
    const blocks = [];
    
    elements.forEach(element => {
      const block = this.convertElement(element);
      
      if (block) {
        blocks.push(block);
      } else if (element.children) {
        // Process children for container elements
        blocks.push(...this.processElements(element.children));
      }
    });
    
    return blocks;
  }

  /**
   * Convert HTML string to Gutenberg blocks
   */
  convert(html) {
    const dom = parseDocument(html, {
      withStartIndices: false,
      withEndIndices: false
    });
    
    return this.processElements(dom.children);
  }
}

/**
 * CLI functionality
 */
class CLI {
  constructor() {
    this.converter = new HtmlToGutenbergConverter();
  }

  showHelp() {
    console.log(`
HTML to Gutenberg CLI Tool
=========================

Convert HTML files to Gutenberg-compatible JSON block arrays.

Usage:
  node cli.js -i <input.html> -o <output.json>
  node cli.js -i <input.html> --stdout
  echo "<h2>Test</h2>" | node cli.js --stdout

Options:
  -i, --input <file>    Input HTML file
  -o, --output <file>   Output JSON file
  --stdout              Print result to stdout instead of saving
  -h, --help            Show this help message

Examples:
  node cli.js -i example.html -o blocks.json
  node cli.js -i page.html --stdout
  echo "<p class='highlight' style='color: red;'>Hello</p>" | node cli.js --stdout

Features:
  • Converts HTML tags to Gutenberg blocks (paragraph, heading, list, image)
  • Preserves all inline styles and CSS classes
  • Supports nested lists and inline formatting
  • Fallback to HTML blocks for unsupported elements
  • Works in Termux on Android

Supported HTML → Gutenberg mappings:
  <p>           → core/paragraph
  <h1>-<h6>     → core/heading (with level)
  <ul>, <ol>    → core/list (with nesting)
  <img>         → core/image (with src, alt, dimensions)
  <strong>, <em>, <a> → preserved as inline markup
  Other tags    → core/html (fallback)
`);
  }

  parseArgs(args) {
    const options = {
      input: null,
      output: null,
      stdout: false,
      help: false
    };

    for (let i = 0; i < args.length; i++) {
      switch (args[i]) {
        case '-i':
        case '--input':
          options.input = args[++i];
          break;
        case '-o':
        case '--output':
          options.output = args[++i];
          break;
        case '--stdout':
          options.stdout = true;
          break;
        case '-h':
        case '--help':
          options.help = true;
          break;
      }
    }

    return options;
  }

  async readStdin() {
    return new Promise((resolve) => {
      let data = '';
      process.stdin.setEncoding('utf8');
      
      process.stdin.on('readable', () => {
        let chunk;
        while ((chunk = process.stdin.read()) !== null) {
          data += chunk;
        }
      });
      
      process.stdin.on('end', () => {
        resolve(data.trim());
      });
    });
  }

  async run() {
    const args = process.argv.slice(2);
    const options = this.parseArgs(args);

    if (options.help) {
      this.showHelp();
      return;
    }

    let htmlContent = '';

    // Check if we're reading from stdin (pipe)
    if (!process.stdin.isTTY) {
      htmlContent = await this.readStdin();
    } else if (options.input) {
      if (!fs.existsSync(options.input)) {
        console.error(`Error: Input file '${options.input}' not found.`);
        process.exit(1);
      }
      htmlContent = fs.readFileSync(options.input, 'utf8');
    } else {
      console.error('Error: No input provided. Use -i <file> or pipe HTML content.');
      console.error('Run with --help for usage information.');
      process.exit(1);
    }

    if (!htmlContent.trim()) {
      console.error('Error: No HTML content to process.');
      process.exit(1);
    }

    try {
      const blocks = this.converter.convert(htmlContent);
      const jsonOutput = JSON.stringify(blocks, null, 2);

      if (options.stdout) {
        console.log(jsonOutput);
      } else if (options.output) {
        fs.writeFileSync(options.output, jsonOutput, 'utf8');
        console.log(`✅ Converted HTML to Gutenberg blocks: ${options.output}`);
        console.log(`📊 Generated ${blocks.length} block(s)`);
      } else {
        console.error('Error: No output method specified. Use -o <file> or --stdout.');
        process.exit(1);
      }
    } catch (error) {
      console.error('Error converting HTML:', error.message);
      process.exit(1);
    }
  }
}

// Run CLI if this file is executed directly
if (require.main === module) {
  const cli = new CLI();
  cli.run().catch(error => {
    console.error('Fatal error:', error.message);
    process.exit(1);
  });
}

module.exports = { HtmlToGutenbergConverter, CLI };
