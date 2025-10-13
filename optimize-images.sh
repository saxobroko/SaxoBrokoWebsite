#!/bin/bash

# Image Optimization Script for SaxoBroko Website
# Converts images to WebP format for better performance

echo "🖼️  Starting image optimization..."

# Create optimized images directory
mkdir -p images/optimized

# Function to convert image to WebP with quality optimization
convert_to_webp() {
    local input_file="$1"
    local output_file="$2"
    local quality="$3"
    
    if command -v cwebp >/dev/null 2>&1; then
        echo "Converting $input_file to WebP..."
        cwebp -q "$quality" "$input_file" -o "$output_file"
    else
        echo "⚠️  cwebp not found. Installing webp tools..."
        if [[ "$OSTYPE" == "darwin"* ]]; then
            brew install webp
        elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
            sudo apt-get install webp
        fi
        cwebp -q "$quality" "$input_file" -o "$output_file"
    fi
}

# Convert key images to WebP
cd images

# High quality for main banner (already WebP, but optimize)
if [ -f "banner.webp" ]; then
    convert_to_webp "banner.webp" "optimized/banner.webp" 85
fi

# Medium quality for avatars
if [ -f "avatar.png" ]; then
    convert_to_webp "avatar.png" "optimized/avatar.webp" 80
fi

if [ -f "avatar2.png" ]; then
    convert_to_webp "avatar2.png" "optimized/avatar2.webp" 80
fi

# Lower quality for icons and sprites
if [ -f "sprite.png" ]; then
    convert_to_webp "sprite.png" "optimized/sprite.webp" 75
fi

# Convert game screenshots
for game_img in chess1.png pig1.png snake.png; do
    if [ -f "$game_img" ]; then
        basename="${game_img%.*}"
        convert_to_webp "$game_img" "optimized/${basename}.webp" 75
    fi
done

# Generate different sizes for responsive images
generate_responsive() {
    local input="$1"
    local output_base="$2"
    
    if command -v convert >/dev/null 2>&1; then
        # Generate 400px, 800px, 1200px versions
        convert "$input" -resize 400x300^ "optimized/${output_base}-400.webp"
        convert "$input" -resize 800x600^ "optimized/${output_base}-800.webp"
        convert "$input" -resize 1200x900^ "optimized/${output_base}-1200.webp"
    fi
}

# Generate responsive versions of banner
if [ -f "banner.webp" ]; then
    generate_responsive "banner.webp" "banner"
fi

cd ..

# Create lazy loading image optimization
cat > assets/js/image-optimizer.js << 'EOF'
// Lazy Loading Image Optimizer
class ImageOptimizer {
    constructor() {
        this.observer = null;
        this.init();
    }
    
    init() {
        // Check for Intersection Observer support
        if ('IntersectionObserver' in window) {
            this.setupLazyLoading();
        }
        
        // Setup responsive image loading
        this.setupResponsiveImages();
        
        // Setup WebP detection
        this.setupWebPDetection();
    }
    
    setupLazyLoading() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                    this.observer.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });
        
        // Observe all images with data-src
        document.querySelectorAll('img[data-src]').forEach(img => {
            this.observer.observe(img);
        });
    }
    
    setupResponsiveImages() {
        // Update image sources based on viewport width
        const updateImageSources = () => {
            const width = window.innerWidth;
            const images = document.querySelectorAll('img[data-responsive]');
            
            images.forEach(img => {
                const baseSrc = img.dataset.responsive;
                let size = '400';
                
                if (width > 1200) size = '1200';
                else if (width > 800) size = '800';
                
                const newSrc = baseSrc.replace('{size}', size);
                if (img.src !== newSrc) {
                    img.src = newSrc;
                }
            });
        };
        
        // Update on load and resize
        updateImageSources();
        window.addEventListener('resize', debounce(updateImageSources, 250));
    }
    
    setupWebPDetection() {
        // Check WebP support
        const webP = new Image();
        webP.onload = webP.onerror = () => {
            const isWebPSupported = webP.height === 2;
            document.documentElement.classList.toggle('webp', isWebPSupported);
            document.documentElement.classList.toggle('no-webp', !isWebPSupported);
        };
        webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    }
    
    loadImage(img) {
        // Fade in effect
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
        
        img.onload = () => {
            img.style.opacity = '1';
            img.classList.add('loaded');
        };
        
        // Load the actual image
        if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        }
    }
}

// Utility function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new ImageOptimizer());
} else {
    new ImageOptimizer();
}
EOF

echo "✅ Image optimization setup complete!"
echo "📊 Image optimization features:"
echo "   • WebP conversion with quality optimization"
echo "   • Responsive image generation (400px, 800px, 1200px)"
echo "   • Lazy loading with Intersection Observer"
echo "   • WebP support detection"
echo "   • Smooth fade-in loading effects"
echo ""
echo "💡 To use:"
echo "   • Run this script to convert images"
echo "   • Include image-optimizer.js in your pages"
echo "   • Use data-src for lazy loading"
echo "   • Use data-responsive='{base-path}/{size}' for responsive images"
