// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('open');
    });
}

// Slider
const sliderTrack = document.querySelector('.slider-track');
const prevBtn = document.querySelector('.slider-prev');
const nextBtn = document.querySelector('.slider-next');

if (sliderTrack && prevBtn && nextBtn) {
    const scrollAmount = () => {
        const slide = sliderTrack.querySelector('.slide');
        return slide ? slide.offsetWidth + 24 : 400;
    };

    prevBtn.addEventListener('click', () => {
        sliderTrack.scrollBy({ left: -scrollAmount(), behavior: 'smooth' });
    });

    nextBtn.addEventListener('click', () => {
        sliderTrack.scrollBy({ left: scrollAmount(), behavior: 'smooth' });
    });
}

// Lightbox
const lightbox = document.querySelector('.lightbox');
const lightboxImg = lightbox?.querySelector('img');
const lightboxCaption = lightbox?.querySelector('.lightbox-caption');
const lightboxClose = lightbox?.querySelector('.lightbox-close');

document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
        const img = item.querySelector('img');
        const caption = item.querySelector('.caption');
        if (lightbox && lightboxImg) {
            // Use full-size image URL by removing size suffix
            const src = img.src.replace(/-\d+x\d+\./, '.');
            lightboxImg.src = src;
            if (lightboxCaption) {
                lightboxCaption.textContent = caption?.textContent || '';
            }
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    });
});

function closeLightbox() {
    if (lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
}

lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target === lightboxClose) {
        closeLightbox();
    }
});

lightboxClose?.addEventListener('click', closeLightbox);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
});
