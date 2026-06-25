// Premium Gold Dust Particle System
        const canvas = document.getElementById('particle-canvas');
        const ctx = canvas.getContext('2d');
        let particles = [];
        let width, height;
        let mouseX = 0, mouseY = 0;
        let targetMouseX = 0, targetMouseY = 0;

        class Particle {
            constructor() {
                this.init();
            }

            init() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.baseSize = Math.random() * 1.8 + 0.2;
                this.size = this.baseSize;
                this.vx = (Math.random() - 0.5) * 0.3;
                this.vy = (Math.random() - 0.5) * 0.3;
                this.opacity = Math.random() * 0.6 + 0.1;
                this.twinkleSpeed = Math.random() * 0.02 + 0.005;
                this.twinkleDir = Math.random() > 0.5 ? 1 : -1;
                this.depth = Math.random() * 0.5 + 0.1;
            }

            update() {
                // Natural drifting
                this.x += this.vx;
                this.y += this.vy;

                // Twinkle effect
                this.opacity += this.twinkleSpeed * this.twinkleDir;
                if (this.opacity > 0.8 || this.opacity < 0.1) this.twinkleDir *= -1;

                // Mouse interaction (soft scatter/follow)
                const dx = this.x - mouseX;
                const dy = this.y - mouseY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 200) {
                    const force = (200 - dist) / 200;
                    this.x += dx * force * 0.03;
                    this.y += dy * force * 0.03;
                }

                // Wrapping
                if (this.x < 0) this.x = width;
                if (this.x > width) this.x = 0;
                if (this.y < 0) this.y = height;
                if (this.y > height) this.y = 0;
            }

            draw() {
                // Determine density factor based on location (Hero/Footer increase)
                let densityScale = 1;
                const heroBounds = document.getElementById('hero-section')?.getBoundingClientRect();
                const footerBounds = document.getElementById('footer-section')?.getBoundingClientRect();

                const screenY = this.y;
                if (heroBounds && screenY < heroBounds.bottom) densityScale = 2.5;
                if (footerBounds && screenY > footerBounds.top) densityScale = 2.5;

                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(242, 202, 80, ${this.opacity})`;
                ctx.fill();

                // Random bloom sparkle for extra luxury (disabled on mobile for performance)
                if (this.opacity > 0.7 && Math.random() > 0.99 && width > 768) {
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = '#f2ca50';
                    ctx.fill();
                    ctx.shadowBlur = 0;
                }
            }
        }

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            particles = [];

            // Adjust particle count and effects based on screen size (mobile performance)
            const isMobile = width < 768;
            const divisor = isMobile ? 12000 : 4000;
            const maxParticles = isMobile ? 30 : 400;

            const particleCount = Math.floor((width * height) / divisor);
            for (let i = 0; i < Math.min(particleCount, maxParticles); i++) {
                particles.push(new Particle());
            }
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);

            // Smooth mouse movement for wake effect
            mouseX += (targetMouseX - mouseX) * 0.1;
            mouseY += (targetMouseY - mouseY) * 0.1;

            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animate);
        }

        window.addEventListener('resize', resize);
        document.addEventListener('mousemove', (e) => {
            targetMouseX = e.clientX;
            targetMouseY = e.clientY;

            // Custom Cursor Movement
            const cursor = document.getElementById('cursor');
            const outline = document.getElementById('cursor-outline');
            if (cursor && outline) {
                cursor.style.left = e.clientX + 'px';
                cursor.style.top = e.clientY + 'px';
                outline.style.left = (e.clientX - 16) + 'px';
                outline.style.top = (e.clientY - 16) + 'px';
            }
        });

        // Hover effect: Burst particles on product hover
        document.querySelectorAll('.product-trigger').forEach(card => {
            card.addEventListener('mouseenter', () => {
                const rect = card.getBoundingClientRect();
                for (let i = 0; i < 15; i++) {
                    const p = new Particle();
                    p.x = rect.left + Math.random() * rect.width;
                    p.y = rect.top + Math.random() * rect.height;
                    p.vx = (Math.random() - 0.5) * 4;
                    p.vy = (Math.random() - 0.5) * 4;
                    p.size = Math.random() * 3 + 1;
                    particles.push(p);
                    // Remove extra particles later to keep performance stable
                    setTimeout(() => particles.shift(), 3000);
                }
            });
        });

        // Letter-by-letter reveal
        function revealTitle() {
            const title = "Welcome to RR BLOUSE BOUTIQUE";
            const container = document.getElementById('hero-title');
            if (!container) return;
            container.innerHTML = '';
            const words = title.split(' ');
            let delayIndex = 0;
            words.forEach((word, wordIdx) => {
                const wordSpan = document.createElement('span');
                wordSpan.style.display = 'inline-block';
                wordSpan.style.whiteSpace = 'nowrap';
                word.split('').forEach((char) => {
                    const span = document.createElement('span');
                    span.innerText = char;
                    span.className = 'reveal-char';
                    span.style.transitionDelay = `${delayIndex * 0.08}s`;
                    wordSpan.appendChild(span);
                    setTimeout(() => span.classList.add('active'), 200);
                    delayIndex++;
                });
                container.appendChild(wordSpan);
                if (wordIdx < words.length - 1) {
                    const spaceSpan = document.createElement('span');
                    spaceSpan.innerText = ' ';
                    container.appendChild(spaceSpan);
                    delayIndex++;
                }
            });
        }

        // Scroll Reveal Observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));

        // Initialization
        window.addEventListener('DOMContentLoaded', () => {
            // revealTitle(); // Disabled for instant premium feel
            resize();
            animate();
        });

        // Parallax Effect for Hero Image
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const heroImg = document.querySelector('header img');
            if (heroImg) {
                heroImg.style.transform = `translateY(${scrolled * 0.25}px) scale(1.05)`;
            }
        });

// Auto-playing Ezgif Header Animation with Mobile Performance Safeguard
        const headerCanvas = document.getElementById('animated-header-canvas');
        const isMobileDevice = window.innerWidth < 768 || navigator.hardwareConcurrency < 4 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        if (headerCanvas) {
            if (isMobileDevice) {
                // Safeguard: Do not load 81 frames on mobile/low-end devices. Use static fallback to save memory and CPU.
                headerCanvas.style.display = 'none';
                const heroSection = document.getElementById('hero-section');
                if (heroSection) {
                    heroSection.style.backgroundImage = "url('products/hero/ezgif-frame-001.jpg')";
                    heroSection.style.backgroundSize = "cover";
                    heroSection.style.backgroundPosition = "center";
                }
            } else {
                const headerCtx = headerCanvas.getContext('2d');
                const headerFrames = [];
                const totalHeaderFrames = 81;
                let loadedHeaderFrames = 0;
                let currentHeaderFrame = 1;
                let lastDrawTime = 0;
                const fps = 24;
                const frameInterval = 1000 / fps;

                for (let i = 1; i <= totalHeaderFrames; i++) {
                    const img = new Image();
                    img.src = `products/hero/ezgif-frame-${i.toString().padStart(3, '0')}.jpg`;
                    img.onload = () => {
                        loadedHeaderFrames++;
                        if (loadedHeaderFrames === totalHeaderFrames) {
                            requestAnimationFrame(loopHeaderAnimation);
                        }
                    };
                    headerFrames.push(img);
                }

                function loopHeaderAnimation(timestamp) {
                    if (!lastDrawTime) lastDrawTime = timestamp;
                    const elapsed = timestamp - lastDrawTime;

                    if (elapsed > frameInterval) {
                        lastDrawTime = timestamp - (elapsed % frameInterval);
                        const img = headerFrames[currentHeaderFrame - 1]; // arrays are 0-indexed
                        if (img && img.complete) {
                            headerCanvas.width = img.width;
                            headerCanvas.height = img.height;
                            headerCtx.clearRect(0, 0, headerCanvas.width, headerCanvas.height);
                            headerCtx.drawImage(img, 0, 0, headerCanvas.width, headerCanvas.height);
                        }
                        currentHeaderFrame++;
                        if (currentHeaderFrame > totalHeaderFrames) currentHeaderFrame = 1;
                    }
                    requestAnimationFrame(loopHeaderAnimation);
                }
            }
        }

async function renderProducts() {
            try {
                const response = await fetch('data/products.json');
                const products = await response.json();
                const container = document.getElementById('dynamic-product-grid');
                if (!container) return;

                container.innerHTML = `
                    <!-- ADD NEW PRODUCT HERE: /data/products.json -->
                    <!-- CHANGE PRICE HERE: /data/products.json -->
                    <!-- ADD IMAGES TO: /images/embroidery/ OR /images/maggam/ OR /images/bridal/ -->
                `;

                products.forEach(product => {
                    const card = document.createElement('div');
                    card.className = `${product.layout.colSpan} w-full scroll-reveal group luxury-card product-trigger visible flex flex-col h-full focus:outline-none`;
                    card.tabIndex = 0;

                    const fallbackImg = "https://lh3.googleusercontent.com/aida-public/AB6AXuAoJ8jtI-Pevy8bqilgratNI4Ii-A0T38fbhVWQhBZC_kYWZlDiGaVxOR7SAY6Fz9CvApq-yycVBdxvGkKuC_POWtXd4uDRoc9VgidHVvlLEZjuycMRweE16sfK4BKx8_X6mGZjVhYrGg5suEQ9Crivfaa069UfwJVyJsC20pQFZzhgvfNmvRefZdRUzL_NjZDs6YHP_6UIIhV1GCaG6SkdLypdpziH9ybNHvDSZ4-oBUKUwNLYXHd6MQdcaNMw8R0XzG8iYgZrFA";
                    const images = product.images || (product.image ? [product.image] : []);
                    let imageHtml = '';
                    
                    if (images.length <= 1) {
                        const img = images[0] || fallbackImg;
                        imageHtml = `
                        <div class="relative ${product.layout.aspectRatio || 'aspect-[4/5]'} overflow-hidden bg-surface-container mb-4 shadow-xl rounded-sm">
                            <a href="${product.whatsappLink}" target="_blank" class="block w-full h-full">
                                <img alt="${product.name}" loading="lazy" class="img-zoom w-full h-full object-cover object-center" src="${img}" onerror="this.src='${fallbackImg}'">
                            </a>
                        </div>`;
                    } else {
                        const cid = 'carousel-' + Math.random().toString(36).substr(2, 9);
                        let slidesHtml = images.map((img, i) => `
                            <div class="carousel-slide absolute inset-0 transition-transform duration-500 ease-in-out" style="transform: translate3d(${i === 0 ? '0' : '100%'}, 0, 0); will-change: transform;" data-index="${i}">
                                <a href="${product.whatsappLink}" target="_blank" class="block w-full h-full">
                                    <img alt="${product.name} - Image ${i+1}" loading="lazy" class="img-zoom w-full h-full object-cover object-center" src="${img}" onerror="this.src='${fallbackImg}'">
                                </a>
                            </div>
                        `).join('');
                        
                        let dotsHtml = images.map((_, i) => `
                            <div class="w-1.5 h-1.5 rounded-full transition-all duration-300 carousel-dot ${i === 0 ? 'bg-primary scale-110 opacity-100' : 'bg-primary/50 opacity-60'}" data-index="${i}"></div>
                        `).join('');

                        imageHtml = `
                        <div class="relative ${product.layout.aspectRatio || 'aspect-[4/5]'} overflow-hidden bg-surface-container mb-4 shadow-xl rounded-sm carousel-container" data-cid="${cid}" data-active="0" data-count="${images.length}">
                            <div class="carousel-track w-full h-full relative overflow-hidden" id="track-${cid}">
                                ${slidesHtml}
                            </div>
                            <div class="absolute bottom-3 left-0 right-0 flex justify-center gap-2 z-20 carousel-dots-container pointer-events-none">
                                ${dotsHtml}
                            </div>
                        </div>`;
                    }
                    
                    imageHtml += `
                        <div class="flex flex-col flex-grow w-full relative overflow-hidden">
                            <div class="flex-grow">
                                <h3 class="font-headline-md text-[clamp(1.1rem,2.5vw,1.3rem)] text-balance break-words text-on-surface mb-2 tracking-wide">${product.name || 'Signature Design'}</h3>
                                <div class="h-px bg-primary/20 w-12 mb-2"></div>
                                <span class="font-label-caps text-primary text-sm tracking-widest block mb-2">${product.price || 'Price on request'}</span>
                                <p class="font-body-md text-body-md text-on-surface-variant max-w-lg mb-4 opacity-80">${product.category || ''}</p>
                            </div>
                            
                            <!-- WhatsApp CTA: Hidden normally, revealed on desktop hover or mobile tap focus -->
                            <div class="mt-auto overflow-hidden">
                                <div class="max-h-0 group-hover:max-h-16 focus-within:max-h-16 transition-all duration-300 ease-in-out opacity-0 group-hover:opacity-100 focus-within:opacity-100">
                                    <a href="${product.whatsappLink}" target="_blank" class="bg-primary text-on-primary px-4 py-3 font-label-caps text-[clamp(0.65rem,1vw,0.75rem)] uppercase shimmer-gold flex items-center justify-center gap-2 transition-transform hover:scale-105 w-full rounded-sm mt-2 shadow-[0_0_15px_rgba(242,202,80,0.3)] pointer-events-auto">
                                        <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"></path></svg>
                                        Ask on WhatsApp
                                    </a>
                                </div>
                            </div>
                        </div>`;

                    card.innerHTML = imageHtml;
                    container.appendChild(card);
                });

                if (window.observer) {
                    document.querySelectorAll('.scroll-reveal').forEach(el => window.observer.observe(el));
                }
                setTimeout(initCarousels, 100);
            } catch (error) {
                console.error("Error loading products:", error);
            }
        }

        document.addEventListener('DOMContentLoaded', () => {
            renderProducts();
        });

        // Luxury Catalog Logic

        function generateCatalogHTML(products, containerId) {
            const container = document.getElementById(containerId);
            if (!container) return;

            const fallbackImg = "https://lh3.googleusercontent.com/aida-public/AB6AXuAoJ8jtI-Pevy8bqilgratNI4Ii-A0T38fbhVWQhBZC_kYWZlDiGaVxOR7SAY6Fz9CvApq-yycVBdxvGkKuC_POWtXd4uDRoc9VgidHVvlLEZjuycMRweE16sfK4BKx8_X6mGZjVhYrGg5suEQ9Crivfaa069UfwJVyJsC20pQFZzhgvfNmvRefZdRUzL_NjZDs6YHP_6UIIhV1GCaG6SkdLypdpziH9ybNHvDSZ4-oBUKUwNLYXHd6MQdcaNMw8R0XzG8iYgZrFA";

            let html = '';
            products.forEach((product, index) => {
                const images = product.images || (product.image ? [product.image] : []);
                let imageHtml = '';
                const link = `https://wa.me/919059582220?text=Interested in ${encodeURIComponent(product.name || 'product')}`;
                
                if (images.length <= 1) {
                    const img = images[0] || fallbackImg;
                    imageHtml = `
                        <div class="relative aspect-[4/5] overflow-hidden bg-surface-container mb-4 shadow-2xl rounded-sm">
                            <a href="${link}" target="_blank" class="block w-full h-full">
                                <img alt="${product.name}" loading="lazy" class="img-zoom w-full h-full object-cover object-center grayscale hover:grayscale-0 transition-all duration-1000" src="${img}" onerror="this.src='${fallbackImg}'">
                            </a>
                        </div>`;
                } else {
                    const cid = 'carousel-' + Math.random().toString(36).substr(2, 9);
                    let slidesHtml = images.map((img, i) => `
                        <div class="carousel-slide absolute inset-0 transition-transform duration-500 ease-in-out" style="transform: translate3d(${i === 0 ? '0' : '100%'}, 0, 0); will-change: transform;" data-index="${i}">
                            <a href="${link}" target="_blank" class="block w-full h-full">
                                <img alt="${product.name}" loading="lazy" class="img-zoom w-full h-full object-cover object-center grayscale hover:grayscale-0 transition-all duration-1000" src="${img}" onerror="this.src='${fallbackImg}'">
                            </a>
                        </div>
                    `).join('');
                    
                    let dotsHtml = images.map((_, i) => `
                        <div class="w-1.5 h-1.5 rounded-full transition-all duration-300 carousel-dot ${i === 0 ? 'bg-primary scale-110 opacity-100' : 'bg-primary/50 opacity-60'}" data-index="${i}"></div>
                    `).join('');

                    imageHtml = `
                        <div class="relative aspect-[4/5] overflow-hidden bg-surface-container mb-4 shadow-2xl rounded-sm carousel-container" data-cid="${cid}" data-active="0" data-count="${images.length}">
                            <div class="carousel-track w-full h-full relative overflow-hidden" id="track-${cid}">
                                ${slidesHtml}
                            </div>
                            <div class="absolute bottom-3 left-0 right-0 flex justify-center gap-2 z-20 carousel-dots-container pointer-events-none">
                                ${dotsHtml}
                            </div>
                        </div>`;
                }

                html += `
                    <div tabindex="0" class="w-full scroll-reveal group luxury-card product-trigger flex flex-col h-full focus:outline-none" style="transition-delay: ${index * 0.1}s">
                        ${imageHtml}
                        <div class="flex flex-col flex-grow w-full relative overflow-hidden">
                            <div class="flex-grow">
                                <h3 class="font-headline-md text-[clamp(1.1rem,2.5vw,1.25rem)] text-balance break-words text-on-surface mb-2 tracking-wide">${product.name || 'Signature Item'}</h3>
                                <div class="h-px bg-primary/20 w-12 mb-2"></div>
                                <span class="font-label-caps text-primary text-sm tracking-widest block">${product.price || 'Price on request'}</span>
                            </div>
                            
                            <!-- WhatsApp CTA -->
                            <div class="mt-auto overflow-hidden">
                                <div class="max-h-0 group-hover:max-h-16 focus-within:max-h-16 transition-all duration-300 ease-in-out opacity-0 group-hover:opacity-100 focus-within:opacity-100">
                                    <a href="https://wa.me/919059582220?text=Interested in ${encodeURIComponent(product.name || 'product')}" target="_blank" class="bg-primary text-on-primary px-4 py-3 font-label-caps text-[clamp(0.65rem,1vw,0.75rem)] uppercase shimmer-gold flex items-center justify-center gap-2 transition-transform hover:scale-105 w-full rounded-sm mt-3 shadow-[0_0_15px_rgba(242,202,80,0.3)]">
                                        <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"></path></svg>
                                        Ask on WhatsApp
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });
            container.innerHTML = html;
        }

        // Fetch products dynamically
        async function loadFullCatalog() {
            try {
                const response = await fetch('data/catalog.json');
                const catalogData = await response.json();

                generateCatalogHTML(catalogData.embroidery || [], 'embroidery-catalog-grid');
                generateCatalogHTML(catalogData.maggam || [], 'maggam-catalog-grid');
                setTimeout(initCarousels, 100);
            } catch (error) {
                console.error("Error loading full catalog:", error);
            }
        }

        loadFullCatalog();

        const exploreBtn = document.getElementById('explore-catalog-btn');
        const catalogSection = document.getElementById('full-catalog');

        if (exploreBtn && catalogSection) {
            exploreBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log("Explore button clicked!"); // Debug log
                catalogSection.classList.remove('hidden');

                // Small delay to allow CSS transition on opacity to work
                setTimeout(() => {
                    catalogSection.classList.remove('opacity-0');
                    catalogSection.classList.add('opacity-100');
                    catalogSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 50);

                // Re-observe new elements
                if (window.IntersectionObserver) {
                    const catalogObserver = new IntersectionObserver((entries) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                entry.target.classList.add('visible');
                            }
                        });
                    }, { threshold: 0.1 });
                    document.querySelectorAll('#full-catalog .scroll-reveal').forEach(el => catalogObserver.observe(el));
                }
            });
        }

        // Carousel Initialization
        function initCarousels() {
            const containers = document.querySelectorAll('.carousel-container');
            
            containers.forEach(container => {
                if (container.dataset.initialized) return;
                container.dataset.initialized = "true";
                
                const slides = Array.from(container.querySelectorAll('.carousel-slide'));
                const dots = Array.from(container.querySelectorAll('.carousel-dot'));
                const count = slides.length;
                if (count <= 1) return;

                let activeIdx = 0;
                let slideInterval;
                let touchStartX = 0;
                let touchEndX = 0;
                let isAnimating = false;

                function goToSlide(nextIdx, direction = 'right') {
                    if (isAnimating) return;
                    isAnimating = true;

                    const currentSlide = slides[activeIdx];
                    const nextSlide = slides[nextIdx];
                    
                    // Set up next slide position before transition
                    nextSlide.style.transition = 'none';
                    nextSlide.style.transform = direction === 'right' ? 'translate3d(100%, 0, 0)' : 'translate3d(-100%, 0, 0)';
                    
                    // Force reflow
                    void nextSlide.offsetWidth;
                    
                    // Apply transitions
                    currentSlide.style.transition = 'transform 500ms ease-in-out';
                    nextSlide.style.transition = 'transform 500ms ease-in-out';
                    
                    currentSlide.style.transform = direction === 'right' ? 'translate3d(-100%, 0, 0)' : 'translate3d(100%, 0, 0)';
                    nextSlide.style.transform = 'translate3d(0, 0, 0)';
                    
                    // Update dots
                    dots.forEach(d => {
                        d.className = 'w-1.5 h-1.5 rounded-full transition-all duration-300 carousel-dot bg-primary/50 opacity-60';
                    });
                    if (dots[nextIdx]) {
                        dots[nextIdx].className = 'w-1.5 h-1.5 rounded-full transition-all duration-300 carousel-dot bg-primary scale-110 opacity-100';
                    }
                    
                    activeIdx = nextIdx;
                    container.setAttribute('data-active', activeIdx);

                    setTimeout(() => {
                        isAnimating = false;
                    }, 500);
                }

                function nextSlide() {
                    const nextIdx = (activeIdx + 1) % count;
                    goToSlide(nextIdx, 'right');
                }

                function prevSlide() {
                    const nextIdx = (activeIdx - 1 + count) % count;
                    goToSlide(nextIdx, 'left');
                }

                function startAutoplay() {
                    stopAutoplay();
                    slideInterval = setInterval(nextSlide, 2000);
                }

                function stopAutoplay() {
                    if (slideInterval) clearInterval(slideInterval);
                }

                startAutoplay();

                // Pause on hover
                container.addEventListener('mouseenter', stopAutoplay);
                container.addEventListener('mouseleave', startAutoplay);

                // Swipe gestures
                container.addEventListener('touchstart', e => {
                    touchStartX = e.changedTouches[0].screenX;
                    stopAutoplay();
                }, {passive: true});

                container.addEventListener('touchend', e => {
                    touchEndX = e.changedTouches[0].screenX;
                    handleSwipe();
                    startAutoplay();
                }, {passive: true});

                function handleSwipe() {
                    const threshold = 50;
                    if (touchEndX < touchStartX - threshold) {
                        nextSlide(); // Swiped left
                    } else if (touchEndX > touchStartX + threshold) {
                        prevSlide(); // Swiped right
                    }
                }
            });
        }



