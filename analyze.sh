#!/bin/bash

# Performance Analysis Script for Saxo_Broko Website
echo "🔍 Website Performance Analysis"
echo "==============================="

# Get file sizes
echo ""
echo "📊 File Size Analysis:"
echo "----------------------"

echo "Original CSS: $(du -h assets/css/main.css 2>/dev/null | cut -f1 || echo 'N/A')"
echo "Minified CSS: $(du -h assets/css/main.min.css 2>/dev/null | cut -f1 || echo 'N/A')"
echo "Modern JS: $(du -h assets/js/modern.js 2>/dev/null | cut -f1 || echo 'N/A')"
echo "Original JS: $(du -h assets/js/main.js 2>/dev/null | cut -f1 || echo 'N/A')"

# Count files that were optimized
echo ""
echo "🧹 Cleanup Results:"
echo "-------------------"

# Count remaining Alexa references (should be 0)
alexa_count=$(grep -r "alexametrics" --include="*.html" . 2>/dev/null | wc -l | tr -d ' ')
echo "Alexa Analytics references removed: $(echo $alexa_count | awk '{if($1==0) print "✅ All cleaned"; else print "❌ " $1 " remaining"}')"

# Count HTTP vs HTTPS
http_count=$(grep -r "http://" --include="*.html" --include="*.css" --include="*.js" . 2>/dev/null | wc -l | tr -d ' ')
echo "HTTP references: $(echo $http_count | awk '{if($1==0) print "✅ All HTTPS"; else print "⚠️  " $1 " HTTP found"}')"

# Check for modern features
echo ""
echo "🚀 Modern Features Added:"
echo "------------------------"

if [ -f "sw.js" ]; then
    echo "✅ Service Worker implemented"
else
    echo "❌ Service Worker missing"
fi

if [ -f "manifest.json" ]; then
    echo "✅ PWA Manifest present"
else
    echo "❌ PWA Manifest missing"
fi

if [ -f "_headers" ]; then
    echo "✅ Security headers configured"
else
    echo "❌ Security headers missing"
fi

if [ -f "assets/js/modern.js" ]; then
    echo "✅ Modern JavaScript created"
else
    echo "❌ Modern JavaScript missing"
fi

# Check for optimized images
echo ""
echo "🖼️  Image Optimization:"
echo "----------------------"

webp_count=$(find images -name "*.webp" 2>/dev/null | wc -l | tr -d ' ')
jpg_count=$(find images -name "*.jpg" 2>/dev/null | wc -l | tr -d ' ')
png_count=$(find images -name "*.png" 2>/dev/null | wc -l | tr -d ' ')

echo "WebP images: $webp_count"
echo "JPG images: $jpg_count" 
echo "PNG images: $png_count"

if [ $webp_count -gt 0 ]; then
    echo "✅ WebP format in use"
else
    echo "⚠️  Consider converting images to WebP"
fi

# Security analysis
echo ""
echo "🔒 Security Analysis:"
echo "--------------------"

if grep -q "unsafe-inline" _headers 2>/dev/null; then
    echo "⚠️  CSP allows unsafe-inline"
else
    echo "✅ CSP properly configured"
fi

if grep -q "X-Frame-Options" _headers 2>/dev/null; then
    echo "✅ X-Frame-Options header set"
else
    echo "❌ X-Frame-Options missing"
fi

# Performance recommendations
echo ""
echo "💡 Performance Recommendations:"
echo "-------------------------------"

# Check for large files
large_files=$(find . -name "*.js" -o -name "*.css" -o -name "*.html" | xargs du -k 2>/dev/null | awk '$1 > 100' | wc -l | tr -d ' ')
if [ $large_files -gt 0 ]; then
    echo "⚠️  $large_files files larger than 100KB found"
    find . -name "*.js" -o -name "*.css" -o -name "*.html" | xargs du -k 2>/dev/null | awk '$1 > 100 {print "   " $2 " (" $1 "KB)"}' | head -5
else
    echo "✅ All text files under 100KB"
fi

# Check jQuery usage
jquery_files=$(grep -r "jquery" --include="*.html" . 2>/dev/null | wc -l | tr -d ' ')
if [ $jquery_files -gt 0 ]; then
    echo "⚠️  jQuery still in use in $jquery_files files"
    echo "   Consider replacing with vanilla JavaScript"
else
    echo "✅ No jQuery dependencies found"
fi

# Overall score
echo ""
echo "📈 Optimization Score:"
echo "---------------------"

score=0
total=10

# Scoring criteria
[ $alexa_count -eq 0 ] && score=$((score + 1))
[ $http_count -eq 0 ] && score=$((score + 1))
[ -f "sw.js" ] && score=$((score + 1))
[ -f "manifest.json" ] && score=$((score + 1))
[ -f "_headers" ] && score=$((score + 1))
[ -f "assets/js/modern.js" ] && score=$((score + 1))
[ $webp_count -gt 0 ] && score=$((score + 1))
[ $large_files -eq 0 ] && score=$((score + 1))
[ $jquery_files -eq 0 ] && score=$((score + 1))
[ -f "assets/css/main.min.css" ] && score=$((score + 1))

percentage=$((score * 100 / total))

echo "Score: $score/$total ($percentage%)"

if [ $percentage -ge 80 ]; then
    echo "🎉 Excellent optimization!"
elif [ $percentage -ge 60 ]; then
    echo "👍 Good optimization level"
elif [ $percentage -ge 40 ]; then
    echo "👌 Moderate optimization"
else
    echo "⚠️  Needs more optimization"
fi

echo ""
echo "🏁 Analysis Complete!"
echo "View detailed performance metrics by running:"
echo "npm run lighthouse"
