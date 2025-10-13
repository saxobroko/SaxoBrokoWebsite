#!/bin/bash

# Deployment Script for Optimized Saxo_Broko Website
echo "🚀 Deploying Optimized Website"
echo "==============================="

# Create backup of original files
echo "📦 Creating backup..."
mkdir -p backup/$(date +%Y%m%d_%H%M%S)
cp index.html backup/$(date +%Y%m%d_%H%M%S)/index_original.html
cp assets/css/main.css backup/$(date +%Y%m%d_%H%M%S)/main_original.css
cp assets/js/main.js backup/$(date +%Y%m%d_%H%M%S)/main_original.js 2>/dev/null || echo "Original main.js not found"

# Replace index.html with optimized version
if [ -f "index-optimized.html" ]; then
    echo "🔄 Deploying optimized HTML..."
    cp index.html index_original_backup.html
    cp index-optimized.html index.html
    echo "✅ HTML optimized"
else
    echo "❌ index-optimized.html not found"
fi

# Use minified CSS
if [ -f "assets/css/main.min.css" ]; then
    echo "🎨 Deploying minified CSS..."
    # Update references in HTML files to use minified CSS
    find . -name "*.html" -type f -exec sed -i '' 's/assets\/css\/main\.css/assets\/css\/main.min.css/g' {} \;
    echo "✅ CSS minified and references updated"
else
    echo "❌ main.min.css not found, run 'npm run minify-css' first"
fi

# Deploy modern JavaScript
if [ -f "assets/js/modern.js" ]; then
    echo "🔧 Deploying modern JavaScript..."
    echo "✅ Modern JavaScript ready"
else
    echo "❌ modern.js not found"
fi

# Check service worker
if [ -f "sw.js" ]; then
    echo "⚙️  Service Worker ready for deployment"
else
    echo "❌ Service Worker not found"
fi

# Update manifest version
if [ -f "manifest.json" ]; then
    echo "📱 PWA Manifest ready"
else
    echo "❌ PWA Manifest not found"
fi

# Performance check
echo ""
echo "🔍 Pre-deployment Checks:"
echo "------------------------"

# Check file sizes
echo "CSS size: $(du -h assets/css/main.min.css 2>/dev/null | cut -f1 || echo 'N/A')"
echo "JS size: $(du -h assets/js/modern.js 2>/dev/null | cut -f1 || echo 'N/A')"

# Check for remaining issues
alexa_refs=$(grep -r "alexametrics" --include="*.html" . 2>/dev/null | wc -l | tr -d ' ')
if [ $alexa_refs -eq 0 ]; then
    echo "✅ Alexa Analytics completely removed"
else
    echo "⚠️  $alexa_refs Alexa references still found"
fi

http_refs=$(grep -r "http://" --include="*.html" . 2>/dev/null | wc -l | tr -d ' ')
if [ $http_refs -eq 0 ]; then
    echo "✅ All references use HTTPS"
else
    echo "⚠️  $http_refs HTTP references found"
fi

echo ""
echo "🎯 Deployment Summary:"
echo "---------------------"

if [ -f "index.html" ] && [ -f "assets/css/main.min.css" ] && [ -f "assets/js/modern.js" ] && [ -f "sw.js" ]; then
    echo "✅ All optimized files ready for deployment"
    echo ""
    echo "📋 Next Steps:"
    echo "1. Test the website locally: npm run serve"
    echo "2. Run performance audit: npm run lighthouse"
    echo "3. Upload files to your web server"
    echo "4. Test PWA installation on mobile"
    echo "5. Monitor Core Web Vitals in production"
    echo ""
    echo "🔗 Quick Test:"
    echo "Open http://localhost:8080 in your browser"
    echo "Check browser console for any errors"
    echo "Test offline functionality"
    echo "Verify dark mode toggle works"
else
    echo "❌ Some optimized files are missing"
    echo "Run the build process first:"
    echo "1. npm install"
    echo "2. npm run optimize"
    echo "3. npm run build"
    echo "4. ./deploy.sh"
fi

echo ""
echo "🏁 Deployment script complete!"
