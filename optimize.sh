#!/bin/bash

# Website Optimization Cleanup Script
# This script removes outdated tracking codes and optimizes the website

echo "🚀 Starting website optimization..."

# Remove Alexa Analytics (discontinued service)
echo "🧹 Removing Alexa Analytics tracking code..."
find . -name "*.html" -type f -exec sed -i '' '/alexametrics/d' {} \;
find . -name "*.html" -type f -exec sed -i '' '/atrk_opts/d' {} \;
find . -name "*.html" -type f -exec sed -i '' '/<!-- Start Alexa Certify Javascript -->/,/<!-- End Alexa Certify Javascript -->/d' {} \;

# Remove outdated jQuery versions from games
echo "🔄 Updating jQuery references..."
find ./games -name "*.html" -type f -exec sed -i '' 's/jquery-1\.[0-9]\+\.[0-9]\+/jquery-3.7.1/g' {} \;

# Convert HTTP to HTTPS references
echo "🔒 Converting HTTP to HTTPS..."
find . -name "*.html" -name "*.css" -name "*.js" -type f -exec sed -i '' 's/http:\/\//https:\/\//g' {} \;

# Remove inline styles (move to CSS)
echo "🎨 Cleaning up inline styles..."
# This would need more specific patterns based on your files

# Optimize manifest.json
echo "📱 Optimizing PWA manifest..."
cat > manifest.json << 'EOF'
{
  "name": "Saxo_Broko - Personal Website",
  "short_name": "SaxoBroko",
  "description": "Personal website and portfolio of Saxo_Broko",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "background_color": "#000000",
  "theme_color": "#19b5fe",
  "orientation": "portrait-primary",
  "lang": "en",
  "dir": "ltr",
  "icons": [
    {
      "src": "/android-chrome-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/android-chrome-384x384.png", 
      "sizes": "384x384",
      "type": "image/png"
    },
    {
      "src": "/apple-touch-icon.png",
      "sizes": "180x180", 
      "type": "image/png"
    }
  ],
  "categories": ["entertainment", "games", "lifestyle"],
  "screenshots": [
    {
      "src": "/images/banner.webp",
      "sizes": "1280x720",
      "type": "image/webp",
      "form_factor": "wide"
    }
  ]
}
EOF

# Update robots.txt for better SEO
echo "🤖 Updating robots.txt..."
cat > robots.txt << 'EOF'
User-agent: *
Allow: /

# Sitemap
Sitemap: https://saxobroko.com/sitemap.xml

# Disallow admin/private areas
Disallow: /admin/
Disallow: /private/
Disallow: /.git/
Disallow: /node_modules/

# Allow crawling of important resources
Allow: /assets/
Allow: /images/
Allow: /games/
Allow: /tools/
EOF

# Create optimized .htaccess for Apache servers
echo "⚡ Creating performance optimizations..."
cat > .htaccess << 'EOF'
# Enable GZIP compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Leverage browser caching
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>

# Security headers
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options SAMEORIGIN
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>
EOF

echo "✅ Optimization complete!"
echo ""
echo "Next steps:"
echo "1. Run 'npm install' to install build dependencies"
echo "2. Run 'npm run build' to build optimized assets"
echo "3. Test the website locally with 'npm run dev'"
echo "4. Run Lighthouse audit with 'npm run lighthouse'"
echo ""
echo "Performance improvements made:"
echo "• Removed Alexa Analytics (discontinued service)"
echo "• Updated jQuery references"
echo "• Converted HTTP to HTTPS"
echo "• Added modern PWA manifest"
echo "• Optimized robots.txt for SEO"
echo "• Added caching and compression rules"
