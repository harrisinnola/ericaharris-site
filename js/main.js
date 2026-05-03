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

// Edit-request popup (hold E+R)
const heldKeys = new Set();

function isTypingTarget(el) {
    if (!el) return false;
    const tag = el.tagName;
    return tag === 'INPUT' || tag === 'TEXTAREA' || el.isContentEditable;
}

document.addEventListener('keydown', (e) => {
    if (isTypingTarget(e.target)) return;
    heldKeys.add(e.code);
    if (heldKeys.has('KeyE') && heldKeys.has('KeyR') && !document.querySelector('.edit-modal')) {
        openEditModal();
    }
});
document.addEventListener('keyup', (e) => heldKeys.delete(e.code));
window.addEventListener('blur', () => heldKeys.clear());

function openEditModal() {
    const overlay = document.createElement('div');
    overlay.className = 'edit-modal';
    overlay.innerHTML = `
        <div class="edit-modal-card">
            <h3 class="edit-modal-title">Site edit request</h3>
            <p class="edit-modal-help">Describe the change you want made to the site. It opens a GitHub issue you can submit with one click.</p>
            <textarea class="edit-modal-textarea" rows="6" placeholder="e.g. Change the homepage subtitle to..."></textarea>
            <div class="edit-modal-actions">
                <button type="button" class="edit-modal-btn edit-modal-btn-cancel">Cancel</button>
                <button type="button" class="edit-modal-btn edit-modal-btn-submit">Submit</button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const card = overlay.querySelector('.edit-modal-card');
    const textarea = overlay.querySelector('.edit-modal-textarea');
    const cancelBtn = overlay.querySelector('.edit-modal-btn-cancel');
    const submitBtn = overlay.querySelector('.edit-modal-btn-submit');

    requestAnimationFrame(() => overlay.classList.add('open'));
    setTimeout(() => textarea.focus(), 80);

    function close() {
        overlay.classList.remove('open');
        document.body.style.overflow = previousOverflow;
        document.removeEventListener('keydown', onKey);
        setTimeout(() => overlay.remove(), 200);
    }

    function onKey(e) {
        if (e.key === 'Escape') close();
    }
    document.addEventListener('keydown', onKey);

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) close();
    });
    cancelBtn.addEventListener('click', close);

    submitBtn.addEventListener('click', () => {
        const text = textarea.value.trim();
        if (!text) {
            card.classList.remove('edit-modal-shake');
            void card.offsetWidth;
            card.classList.add('edit-modal-shake');
            return;
        }
        const params = new URLSearchParams({
            title: 'Site edit request',
            body: text,
            labels: 'edit-request',
        });
        window.open(`https://github.com/harrisinnola/ericaharris-site/issues/new?${params}`, '_blank', 'noopener');
        close();
        showToast('Sent ↗');
    });
}

function showToast(text) {
    const toast = document.createElement('div');
    toast.className = 'edit-modal-toast';
    toast.textContent = text;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}
