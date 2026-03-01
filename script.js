/**
 * Tequeños Don Horacio - Modern JavaScript
 * Vanilla JS - No dependencies
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initNavbar();
    initMobileMenu();
    initSmoothScroll();
    initScrollAnimations();
    initCounterAnimation();
    initVideoPlayer();
    initCarousel();
    initContactForm();
});

/**
 * Navbar scroll effect
 */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const scrollThreshold = 50;

    const handleScroll = () => {
        if (window.scrollY > scrollThreshold) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    // Initial check
    handleScroll();

    // Throttled scroll listener
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });
}

/**
 * Mobile menu toggle
 */
function initMobileMenu() {
    const toggle = document.getElementById('nav-toggle');
    const menu = document.getElementById('nav-menu');
    const links = menu.querySelectorAll('.nav-link');

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        menu.classList.toggle('active');
        document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking a link
    links.forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            menu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!menu.contains(e.target) && !toggle.contains(e.target)) {
            toggle.classList.remove('active');
            menu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navbarHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Scroll-triggered animations using Intersection Observer
 */
function initScrollAnimations() {
    // Add animation classes to elements
    const animatedElements = [
        { selector: '.section-header', class: 'fade-in' },
        { selector: '.value-card', class: 'fade-in' },
        { selector: '.stat-card', class: 'fade-in' },
        { selector: '.gallery-item', class: 'fade-in' },
        { selector: '.history-text', class: 'fade-in-left' },
        { selector: '.video-wrapper', class: 'fade-in-right' },
        { selector: '.contact-info', class: 'fade-in-left' },
        { selector: '.contact-image', class: 'fade-in-right' },
        { selector: '.store-card', class: 'fade-in' },
    ];

    animatedElements.forEach(({ selector, class: animClass }) => {
        document.querySelectorAll(selector).forEach((el, index) => {
            el.classList.add(animClass);
            // Add stagger delay for grid items
            if (index < 4) {
                el.classList.add(`stagger-${index + 1}`);
            }
        });
    });

    // Create Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe all animated elements
    document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right').forEach(el => {
        observer.observe(el);
    });
}

/**
 * Counter animation for statistics
 */
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number[data-count]');

    const animateCounter = (counter) => {
        const target = parseInt(counter.dataset.count);
        const duration = 2000; // 2 seconds
        const start = 0;
        const startTime = performance.now();

        const easeOutQuad = t => t * (2 - t);

        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutQuad(progress);
            const current = Math.floor(start + (target - start) * easedProgress);

            counter.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };

        requestAnimationFrame(updateCounter);
    };

    // Use Intersection Observer to trigger animation when visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });

    counters.forEach(counter => observer.observe(counter));
}

/**
 * Video player with custom play button
 */
function initVideoPlayer() {
    const video = document.querySelector('.video-wrapper video');
    const playBtn = document.getElementById('video-play');

    if (!video || !playBtn) return;

    playBtn.addEventListener('click', () => {
        video.play();
        playBtn.classList.add('hidden');
    });

    video.addEventListener('pause', () => {
        playBtn.classList.remove('hidden');
    });

    video.addEventListener('ended', () => {
        playBtn.classList.remove('hidden');
    });

    video.addEventListener('play', () => {
        playBtn.classList.add('hidden');
    });
}

/**
 * Infinite carousel for hotel logos
 */
function initCarousel() {
    const carousel = document.getElementById('hotels-carousel');
    if (!carousel) return;

    const track = carousel.querySelector('.carousel-track');
    const slides = track.querySelectorAll('.carousel-slide');

    // Clone slides for infinite effect
    slides.forEach(slide => {
        const clone = slide.cloneNode(true);
        track.appendChild(clone);
    });

    // Pause animation on hover
    carousel.addEventListener('mouseenter', () => {
        track.style.animationPlayState = 'paused';
    });

    carousel.addEventListener('mouseleave', () => {
        track.style.animationPlayState = 'running';
    });
}

/**
 * Debounce utility function
 */
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

/**
 * Throttle utility function
 */
function throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Contact form handler - sends to WhatsApp
 */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form values
        const nombre = document.getElementById('nombre').value.trim();
        const telefono = document.getElementById('telefono').value.trim();
        const email = document.getElementById('email').value.trim();
        const servicio = document.getElementById('servicio').value;
        const fecha = document.getElementById('fecha').value;
        const personas = document.getElementById('personas').value;
        const mensaje = document.getElementById('mensaje').value.trim();

        // Get service label
        const servicioSelect = document.getElementById('servicio');
        const servicioLabel = servicioSelect.options[servicioSelect.selectedIndex].text;

        // Build WhatsApp message
        let whatsappMessage = `*Nueva Consulta - Alimentos Don Horacio*\n\n`;
        whatsappMessage += `*Nombre:* ${nombre}\n`;
        whatsappMessage += `*Teléfono:* ${telefono}\n`;

        if (email) {
            whatsappMessage += `*Email:* ${email}\n`;
        }

        whatsappMessage += `*Interesado en:* ${servicioLabel}\n`;

        if (fecha) {
            const fechaFormateada = new Date(fecha).toLocaleDateString('es-CR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            whatsappMessage += `*Fecha del evento:* ${fechaFormateada}\n`;
        }

        if (personas) {
            whatsappMessage += `*Cantidad de personas:* ${personas}\n`;
        }

        whatsappMessage += `\n*Mensaje:*\n${mensaje}`;

        // Encode message for URL
        const encodedMessage = encodeURIComponent(whatsappMessage);

        // WhatsApp number (Costa Rica)
        const phoneNumber = '50688378366';

        // Open WhatsApp
        const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        window.open(whatsappURL, '_blank');

        // Show success feedback
        showFormSuccess(form);
    });
}

/**
 * Show success message after form submission
 */
function showFormSuccess(form) {
    const btn = form.querySelector('button[type="submit"]');
    const originalHTML = btn.innerHTML;

    btn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"/>
        </svg>
        ¡Mensaje Enviado!
    `;
    btn.style.background = '#25D366';
    btn.disabled = true;

    setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.style.background = '';
        btn.disabled = false;
        form.reset();
    }, 3000);
}
