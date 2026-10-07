// ============ COMPTEUR DE TÉLÉCHARGEMENTS ============
async function fetchDownloadCount() {
    try {
        const response = await fetch('https://api.github.com/repos/bomokosolution-scrip/Apps/releases');
        const releases = await response.json();
        
        // ⚠️ Cibler EXPLICITEMENT la release v1.0.2
        const targetRelease = releases.find(r => r.tag_name === 'v1.0.2');
        
        let downloadCount = 0;
        if (targetRelease && targetRelease.assets) {
            targetRelease.assets.forEach(asset => {
                if (asset.name.endsWith('.apk')) {
                    downloadCount += asset.download_count;
                }
            });
        }
        
        const countElement = document.getElementById('downloadCount');
        if (countElement) {
            animateCount(countElement, 0, downloadCount, 1500);
        }
    } catch (error) {
        console.error('Erreur:', error);
        const countElement = document.getElementById('downloadCount');
        if (countElement) countElement.textContent = '10+';
    }
}

function animateCount(element, start, end, duration) {
    const startTime = performance.now();
    function updateCount(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = Math.floor(start + (end - start) * progress);
        element.textContent = current + '+';
        if (progress < 1) {
            requestAnimationFrame(updateCount);
        }
    }
    requestAnimationFrame(updateCount);
}

document.addEventListener('DOMContentLoaded', fetchDownloadCount);

// ============ NAVBAR SCROLL ============
const navbar = document.getElementById('navbar');
const navLinks = document.getElementById('navLinks');
const menuToggle = document.getElementById('menuToggle');

if (navbar) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// ============ MENU MOBILE ============
if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        if (navLinks) navLinks.classList.remove('active');
    });
});

// ============ SCROLL REVEAL ============
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.feature-card, .preview-item, .contact-item, .section-header').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `opacity 0.6s ease ${i * 0.05}s, transform 0.6s ease ${i * 0.05}s`;
    observer.observe(el);
});

// ============ FORMULAIRE ============
function handleSubmit(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    const originalText = btn.innerHTML;
    
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
    btn.disabled = true;
    
    setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-check"></i> Message envoyé !';
        btn.style.background = 'linear-gradient(135deg, #10b981, #06b6d4)';
        
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
            btn.disabled = false;
            e.target.reset();
        }, 2000);
    }, 1500);
}

// ============ SMOOTH SCROLL ============
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ============ APERÇU LIGHTBOX ============
document.querySelectorAll('.preview-item').forEach(item => {
    item.addEventListener('click', () => {
        const img = item.querySelector('img');
        const lightbox = document.createElement('div');
        lightbox.style.cssText = `
            position: fixed; inset: 0; background: rgba(0,0,0,0.9);
            display: flex; align-items: center; justify-content: center;
            z-index: 9999; cursor: zoom-out; padding: 20px;
            opacity: 0; transition: opacity 0.3s;
            backdrop-filter: blur(10px);
        `;
        const image = document.createElement('img');
        image.src = img.src;
        image.style.cssText = `
            max-width: 90%; max-height: 90%; border-radius: 16px;
            box-shadow: 0 30px 80px rgba(0,0,0,0.5);
            transform: scale(0.9); transition: transform 0.3s;
        `;
        lightbox.appendChild(image);
        document.body.appendChild(lightbox);
        document.body.style.overflow = 'hidden';
        
        requestAnimationFrame(() => {
            lightbox.style.opacity = '1';
            image.style.transform = 'scale(1)';
        });
        
        lightbox.addEventListener('click', () => {
            lightbox.style.opacity = '0';
            image.style.transform = 'scale(0.9)';
            document.body.style.overflow = '';
            setTimeout(() => lightbox.remove(), 300);
        });
    });
});
