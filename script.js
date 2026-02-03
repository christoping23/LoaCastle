/* ============================================
   LOA CASTLE - Modern Interactive Scripts
   ============================================ */

document.addEventListener("DOMContentLoaded", function () {
    // Initialize all modules
    initMobileNav();
    initHeaderScroll();
    initClassSlider();
    initDonateSlider();
    initPlayerOnline();
    initEventTimers();
    initDonateButtons();
    initScrollAnimations();
});

/* ====== Mobile Navigation Toggle ====== */

function initMobileNav() {
    const navToggle = document.querySelector(".nav-toggle");
    const navLinks = document.querySelector(".nav-links");
    
    if (!navToggle || !navLinks) return;
    
    navToggle.addEventListener("click", () => {
        navLinks.classList.toggle("is-open");
        navToggle.setAttribute('aria-expanded', navLinks.classList.contains('is-open'));
    });

    // Close menu when clicking a link
    navLinks.addEventListener("click", (e) => {
        if (e.target.tagName === "A") {
            navLinks.classList.remove("is-open");
            navToggle.setAttribute('aria-expanded', 'false');
        }
    });

    // Close menu on escape key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && navLinks.classList.contains("is-open")) {
            navLinks.classList.remove("is-open");
            navToggle.setAttribute('aria-expanded', 'false');
        }
    });
}

/* ====== Header Scroll Effect ====== */

function initHeaderScroll() {
    const header = document.querySelector(".site-header");
    if (!header) return;

    let lastScroll = 0;
    const scrollThreshold = 50;

    function handleScroll() {
        const currentScroll = window.scrollY;
        
        if (currentScroll > scrollThreshold) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
        
        lastScroll = currentScroll;
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check
}

/* ====== Class Slider Logic ====== */

function initClassSlider() {
    const track = document.querySelector("#classSliderTrack");
    const slides = track ? Array.from(track.querySelectorAll(".class-slide")) : [];
    const btnPrev = document.querySelector(".class-nav-btn.prev");
    const btnNext = document.querySelector(".class-nav-btn.next");
    const indicatorsContainer = document.querySelector("#classIndicators");
    
    if (!track || slides.length === 0 || !btnPrev || !btnNext) return;
    
    let currentIndex = 0;
    let autoTimer;
    const autoPlayDelay = 8000;

    // Create indicators
    if (indicatorsContainer) {
        slides.forEach((_, index) => {
            const indicator = document.createElement("span");
            indicator.addEventListener("click", () => goToSlide(index));
            indicatorsContainer.appendChild(indicator);
        });
    }

    function updateSlider() {
        const offset = -currentIndex * 100;
        track.style.transform = `translateX(${offset}%)`;
        
        // Update button states
        btnPrev.disabled = currentIndex === 0;
        btnNext.disabled = currentIndex === slides.length - 1;
        
        // Update indicators
        if (indicatorsContainer) {
            const indicators = indicatorsContainer.querySelectorAll("span");
            indicators.forEach((ind, i) => {
                ind.classList.toggle("active", i === currentIndex);
            });
        }

        // Trigger stat bar animations on current slide
        animateStatBars(slides[currentIndex]);
    }

    function goToSlide(index) {
        currentIndex = Math.max(0, Math.min(index, slides.length - 1));
        updateSlider();
        resetAutoPlay();
    }

    function nextSlide() {
        if (currentIndex < slides.length - 1) {
            currentIndex++;
        } else {
            currentIndex = 0;
        }
        updateSlider();
    }

    function prevSlide() {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlider();
        }
    }

    function animateStatBars(slide) {
        if (!slide) return;
        const bars = slide.querySelectorAll(".stat-bar-fill");
        bars.forEach(bar => {
            const fill = bar.style.getPropertyValue('--fill');
            bar.style.width = '0%';
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    bar.style.width = fill;
                });
            });
        });
    }

    function startAutoPlay() {
        autoTimer = setInterval(nextSlide, autoPlayDelay);
    }

    function resetAutoPlay() {
        clearInterval(autoTimer);
        startAutoPlay();
    }

    // Event listeners
    btnPrev.addEventListener("click", () => {
        prevSlide();
        resetAutoPlay();
    });

    btnNext.addEventListener("click", () => {
        nextSlide();
        resetAutoPlay();
    });

    // Touch support
    let touchStartX = 0;
    let touchEndX = 0;
    const swipeThreshold = 50;

    track.addEventListener("touchstart", (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener("touchend", (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0 && currentIndex < slides.length - 1) {
                nextSlide();
            } else if (diff < 0 && currentIndex > 0) {
                prevSlide();
            }
            resetAutoPlay();
        }
    }

    // Pause autoplay on hover
    track.addEventListener("mouseenter", () => clearInterval(autoTimer));
    track.addEventListener("mouseleave", startAutoPlay);

    // Initialize
    updateSlider();
    startAutoPlay();
}

/* ====== Donate Slider Logic ====== */

function initDonateSlider() {
    const track = document.querySelector("#donateSliderTrack");
    const slides = track ? Array.from(track.querySelectorAll(".donate-slide")) : [];
    const btnPrev = document.querySelector(".donate-nav-btn.prev");
    const btnNext = document.querySelector(".donate-nav-btn.next");
    const indicatorsContainer = document.querySelector("#donateIndicators");
    
    if (!track || slides.length === 0 || !btnPrev || !btnNext) return;
    
    let currentIndex = 0;
    let autoTimer;
    const autoPlayDelay = 6000;

    // Create indicators
    if (indicatorsContainer) {
        slides.forEach((_, index) => {
            const indicator = document.createElement("span");
            indicator.addEventListener("click", () => goToSlide(index));
            indicatorsContainer.appendChild(indicator);
        });
    }

    function updateSlider() {
        const offset = -currentIndex * 100;
        track.style.transform = `translateX(${offset}%)`;
        
        btnPrev.disabled = currentIndex === 0;
        btnNext.disabled = currentIndex === slides.length - 1;
        
        if (indicatorsContainer) {
            const indicators = indicatorsContainer.querySelectorAll("span");
            indicators.forEach((ind, i) => {
                ind.classList.toggle("active", i === currentIndex);
            });
        }
    }

    function goToSlide(index) {
        currentIndex = Math.max(0, Math.min(index, slides.length - 1));
        updateSlider();
        resetAutoPlay();
    }

    function nextSlide() {
        if (currentIndex < slides.length - 1) {
            currentIndex++;
        } else {
            currentIndex = 0;
        }
        updateSlider();
    }

    function prevSlide() {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlider();
        }
    }

    function startAutoPlay() {
        autoTimer = setInterval(nextSlide, autoPlayDelay);
    }

    function resetAutoPlay() {
        clearInterval(autoTimer);
        startAutoPlay();
    }

    btnPrev.addEventListener("click", () => {
        prevSlide();
        resetAutoPlay();
    });

    btnNext.addEventListener("click", () => {
        nextSlide();
        resetAutoPlay();
    });

    // Touch support
    let touchStartX = 0;
    const swipeThreshold = 50;

    track.addEventListener("touchstart", (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener("touchend", (e) => {
        const touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) nextSlide();
            else prevSlide();
            resetAutoPlay();
        }
    }, { passive: true });

    track.addEventListener("mouseenter", () => clearInterval(autoTimer));
    track.addEventListener("mouseleave", startAutoPlay);

    updateSlider();
    startAutoPlay();
}

/* ====== Players Online ====== */

function initPlayerOnline() {
    const el = document.getElementById("playersOnline");
    if (!el) return;

    let base = 236;
    
    function update() {
        const diff = Math.floor(Math.random() * 21) - 10;
        const value = Math.max(50, base + diff);
        
        // Animate the number change
        const currentValue = parseInt(el.textContent) || value;
        animateValue(el, currentValue, value, 500);
    }

    function animateValue(el, start, end, duration) {
        const range = end - start;
        const startTime = performance.now();
        
        function step(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(start + range * easeOut);
            
            el.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        }
        
        requestAnimationFrame(step);
    }

    update();
    setInterval(update, 15000);
}

/* ====== Scroll Animations ====== */

function initScrollAnimations() {
    const animatedElements = document.querySelectorAll("[data-animate]");
    
    if (!animatedElements.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add("is-visible");
                }, parseInt(delay));
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    animatedElements.forEach(el => observer.observe(el));
}

/* ====== EVENT TIMERS (Deadfront, Party Match, Battle Royal) ====== */

const eventSchedules = {
    deadfront: {
        times: [0, 4, 8, 12, 16, 20],
        duration: 30
    },
    partyMatch: {
        times: [2, 6, 10, 14, 18, 22],
        duration: 60
    },
    battleRoyal: {
        times: [3, 7, 11, 15, 19, 23],
        duration: 60
    }
};

function initEventTimers() {
    setInterval(updateAllTimers, 1000);
    updateAllTimers();
}

function updateAllTimers() {
    const now = new Date();
    const gmt8 = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Hong_Kong' }));
    const hours = gmt8.getHours();
    const mins = gmt8.getMinutes();
    const secs = gmt8.getSeconds();

    updateEventTimer('deadfrontCardTimer', eventSchedules.deadfront, hours, mins, secs);
    updateEventTimer('partyCardTimer', eventSchedules.partyMatch, hours, mins, secs);
    updateEventTimer('battleCardTimer', eventSchedules.battleRoyal, hours, mins, secs);
}

function isEventOngoing(eventTimes, duration, currentHour, currentMin, currentSec) {
    const currentTotalSeconds = currentHour * 3600 + currentMin * 60 + currentSec;

    for (let eventHour of eventTimes) {
        const eventStartSeconds = eventHour * 3600;
        const eventEndSeconds = eventStartSeconds + (duration * 60);

        if (currentTotalSeconds >= eventStartSeconds && currentTotalSeconds < eventEndSeconds) {
            return true;
        }
    }
    return false;
}

function updateEventTimer(elementId, schedule, currentHour, currentMin, currentSec) {
    const el = document.getElementById(elementId);
    if (!el) return;

    // Check if event is ongoing
    if (isEventOngoing(schedule.times, schedule.duration, currentHour, currentMin, currentSec)) {
        el.textContent = "ONGOING";
        el.style.color = "#00d4ff";
        el.style.textShadow = "0 0 20px rgba(0, 212, 255, 0.5)";
        return;
    }

    // Calculate countdown to next event
    let nextHour = null;
    for (let i = 0; i < schedule.times.length; i++) {
        if (schedule.times[i] > currentHour) {
            nextHour = schedule.times[i];
            break;
        }
    }

    // If no event found today, next is first event tomorrow
    if (nextHour === null) {
        nextHour = schedule.times[0];
        const secondsUntilEvent = (24 - currentHour + nextHour) * 3600 - currentMin * 60 - currentSec;
        displayTimer(el, secondsUntilEvent);
        return;
    }

    // Event is today
    const secondsUntilEvent = (nextHour - currentHour) * 3600 - currentMin * 60 - currentSec;
    displayTimer(el, secondsUntilEvent);
}

function displayTimer(el, seconds) {
    const displayHours = Math.floor(seconds / 3600);
    const displayMins = Math.floor((seconds % 3600) / 60);
    const displaySecs = seconds % 60;

    const timeString =
        String(displayHours).padStart(2, '0') + ':' +
        String(displayMins).padStart(2, '0') + ':' +
        String(displaySecs).padStart(2, '0');

    el.textContent = timeString;
    el.style.color = "#ff4d5a";
    el.style.textShadow = "0 0 20px rgba(255, 77, 90, 0.4)";
}

/* ====== DONATE BUTTON HANDLING ====== */

function initDonateButtons() {
    const donateButtons = document.querySelectorAll('.donate-btn');
    
    if (!donateButtons || donateButtons.length === 0) return;
    
    donateButtons.forEach(button => {
        button.addEventListener('click', async function(e) {
            e.preventDefault();
            
            if (button.disabled) return;
            button.disabled = true;
            button.classList.add('loading');
            
            const originalText = button.querySelector('.btn-text').textContent;
            button.querySelector('.btn-text').textContent = 'Processing...';
            
            const priceId = button.getAttribute('data-price-id');
            
            if (!priceId || priceId === 'price_XXXXX') {
                showNotification('Price ID not configured. Please contact support.', 'error');
                resetButton(button, originalText);
                return;
            }
            
            const payload = { priceId: priceId };
            
            try {
                const response = await fetch('http://162.120.71.62/create-checkout-session', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                    redirect: 'follow'
                });
                
                if (response.redirected && response.url) {
                    window.location.href = response.url;
                    return;
                }
                
                if (response.ok) {
                    const contentType = response.headers.get('content-type');
                    if (contentType && contentType.includes('application/json')) {
                        const data = await response.json();
                        
                        if (data.url) {
                            window.location.href = data.url;
                            return;
                        }
                    }
                }
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                resetButton(button, originalText);
                
            } catch (error) {
                console.error('Error creating checkout session:', error);
                showNotification('Failed to create checkout session. Please try again.', 'error');
                resetButton(button, originalText);
            }
        });
    });
}

function resetButton(button, text) {
    button.disabled = false;
    button.classList.remove('loading');
    const btnText = button.querySelector('.btn-text');
    if (btnText) btnText.textContent = text;
}

function showNotification(message, type = 'info') {
    // Simple notification - can be enhanced with a toast library
    alert(message);
}

initRegisterPopup();

/* ====== Register Popup Message ====== */

function initRegisterPopup() {
  const registerLink = document.querySelector('a[href="#classes"]');
  if (!registerLink) return;
  registerLink.addEventListener('click', (e) => {
    e.preventDefault();
    showRegisterPopup();
  });
}

function showRegisterPopup() {
  const modal = document.createElement('div');
  modal.className = 'register-popup-overlay';
  modal.id = 'registerPopupOverlay';
  const modalContent = document.createElement('div');
  modalContent.className = 'register-popup-modal';
  modalContent.innerHTML = `
    <div class="register-popup-header">
      <h2>Account Registration</h2>
    </div>
    <div class="register-popup-body">
      <p class="register-popup-message">Enter your desired username and password directly ingame to automatically create your account.</p>
    </div>
    <div class="register-popup-footer">
      <button class="btn btn-primary register-popup-confirm">Got it</button>
    </div>
  `;
  modal.appendChild(modalContent);
  document.body.appendChild(modal);
  setTimeout(() => modal.classList.add('is-open'), 10);
  const confirmBtn = modal.querySelector('.register-popup-confirm');
  const closePopup = () => {
    modal.classList.remove('is-open');
    setTimeout(() => modal.remove(), 300);
  };
  confirmBtn.addEventListener('click', closePopup);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closePopup();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.getElementById('registerPopupOverlay')) {
      closePopup();
    }
  });
}
