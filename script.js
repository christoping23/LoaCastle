/* ====== Mobile Navigation Toggle & Init ====== */

document.addEventListener("DOMContentLoaded", function () {
    const navToggle = document.querySelector(".nav-toggle");
    const navLinks = document.querySelector(".nav-links");
    
    if (navToggle && navLinks) {
        navToggle.addEventListener("click", () => {
            navLinks.classList.toggle("is-open");
        });

        navLinks.addEventListener("click", (e) => {
            if (e.target.tagName === "A") {
                navLinks.classList.remove("is-open");
            }
        });
    }

    initClassSlider();
    initPlayerOnline();
    initEventTimers();
    initDonateSlider();
});

/* ====== Class Slider Logic ====== */

function initClassSlider() {
    const track = document.querySelector(".slider-track");
    const slides = Array.from(document.querySelectorAll(".slide"));
    const btnPrev = document.querySelector(".slider-btn.prev");
    const btnNext = document.querySelector(".slider-btn.next");
    
    if (!track || slides.length === 0 || !btnPrev || !btnNext) return;
    
    let currentIndex = 0;

    function updateSlider() {
        const offset = -currentIndex * 100;
        track.style.transform = `translateX(${offset}%)`;
        btnPrev.disabled = currentIndex === 0;
        btnNext.disabled = currentIndex === slides.length - 1;
        btnPrev.style.opacity = btnPrev.disabled ? "0.4" : "1";
        btnNext.style.opacity = btnNext.disabled ? "0.4" : "1";
    }

    btnPrev.addEventListener("click", () => {
        if (currentIndex > 0) {
            currentIndex -= 1;
            updateSlider();
        }
    });

    btnNext.addEventListener("click", () => {
        if (currentIndex < slides.length - 1) {
            currentIndex += 1;
            updateSlider();
        }
    });

    let startX = null;
    track.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
    });

    track.addEventListener("touchend", (e) => {
        if (startX === null) return;
        const endX = e.changedTouches[0].clientX;
        const deltaX = endX - startX;
        const threshold = 40;

        if (deltaX > threshold && currentIndex > 0) {
            currentIndex -= 1;
            updateSlider();
        } else if (deltaX < -threshold && currentIndex < slides.length - 1) {
            currentIndex += 1;
            updateSlider();
        }
        startX = null;
    });

    let autoTimer = setInterval(() => {
        if (currentIndex < slides.length - 1) {
            currentIndex += 1;
        } else {
            currentIndex = 0;
        }
        updateSlider();
    }, 9000);

    track.addEventListener("mouseenter", () => {
        clearInterval(autoTimer);
    });

    track.addEventListener("mouseleave", () => {
        autoTimer = setInterval(() => {
            if (currentIndex < slides.length - 1) {
                currentIndex += 1;
            } else {
                currentIndex = 0;
            }
            updateSlider();
        }, 9000);
    });

    updateSlider();
}

/* ====== Donate Slider Logic ====== */

function initDonateSlider() {
    const track = document.querySelector(".donate-slider-track");
    const slides = Array.from(document.querySelectorAll(".donate-slide"));
    const btnPrev = document.querySelector(".donate-slider-btn.prev");
    const btnNext = document.querySelector(".donate-slider-btn.next");
    
    if (!track || slides.length === 0 || !btnPrev || !btnNext) return;
    
    let currentIndex = 0;
    let autoTimer;

    function updateSlider() {
        const offset = -currentIndex * 100;
        track.style.transform = `translateX(${offset}%)`;
        btnPrev.disabled = currentIndex === 0;
        btnNext.disabled = currentIndex === slides.length - 1;
        btnPrev.style.opacity = btnPrev.disabled ? "0.4" : "1";
        btnNext.style.opacity = btnNext.disabled ? "0.4" : "1";
    }

    function startAutoRotate() {
        autoTimer = setInterval(() => {
            if (currentIndex < slides.length - 1) {
                currentIndex += 1;
            } else {
                currentIndex = 0;
            }
            updateSlider();
        }, 9000);
    }

    btnPrev.addEventListener("click", () => {
        if (currentIndex > 0) {
            currentIndex -= 1;
            updateSlider();
        }
    });

    btnNext.addEventListener("click", () => {
        if (currentIndex < slides.length - 1) {
            currentIndex += 1;
            updateSlider();
        }
    });

    let startX = null;
    track.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
    });

    track.addEventListener("touchend", (e) => {
        if (startX === null) return;
        const endX = e.changedTouches[0].clientX;
        const deltaX = endX - startX;
        const threshold = 40;

        if (deltaX > threshold && currentIndex > 0) {
            currentIndex -= 1;
            updateSlider();
        } else if (deltaX < -threshold && currentIndex < slides.length - 1) {
            currentIndex += 1;
            updateSlider();
        }
        startX = null;
    });

    track.addEventListener("mouseenter", () => {
        clearInterval(autoTimer);
    });

    track.addEventListener("mouseleave", () => {
        startAutoRotate();
    });

    updateSlider();
    startAutoRotate();
}

/* ====== Players Online ====== */

function initPlayerOnline() {
    const el = document.getElementById("playersOnline");
    if (!el) return;

    let base = 236;
    
    function update() {
        const diff = Math.floor(Math.random() * 11) - 5;
        const value = Math.max(25, base + diff);
        el.textContent = value.toString();
    }

    update();
    setInterval(update, 15000);
}

/* ====== EVENT TIMERS (Deadfront, Party Match, Battle Royal) ====== */

const eventSchedules = {
    deadfront: {
        times: [0, 4, 8, 12, 16, 20],
        duration: 30 // minutes
    },
    partyMatch: {
        times: [2, 6, 10, 14, 18, 22],
        duration: 60 // minutes
    },
    battleRoyal: {
        times: [3, 7, 11, 15, 19, 23],
        duration: 60 // minutes
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

    // CHECK ONGOING FIRST (highest priority)
    if (isEventOngoing(schedule.times, schedule.duration, currentHour, currentMin, currentSec)) {
        el.textContent = "ONGOING";
        el.style.color = "#32B8C6";
        return;
    }

    // NOT ONGOING - show countdown (existing logic)
    const currentTotalMinutes = currentHour * 60 + currentMin;

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

        const displayHours = Math.floor(secondsUntilEvent / 3600);
        const displayMins = Math.floor((secondsUntilEvent % 3600) / 60);
        const displaySecs = secondsUntilEvent % 60;

        const timeString =
            String(displayHours).padStart(2, '0') + ':' +
            String(displayMins).padStart(2, '0') + ':' +
            String(displaySecs).padStart(2, '0');

        el.textContent = timeString;
        el.style.color = "#FF5459";
        return;
    }

    // Event is today
    const secondsUntilEvent = (nextHour - currentHour) * 3600 - currentMin * 60 - currentSec;

    const displayHours = Math.floor(secondsUntilEvent / 3600);
    const displayMins = Math.floor((secondsUntilEvent % 3600) / 60);
    const displaySecs = secondsUntilEvent % 60;

    const timeString =
        String(displayHours).padStart(2, '0') + ':' +
        String(displayMins).padStart(2, '0') + ':' +
        String(displaySecs).padStart(2, '0');

    el.textContent = timeString;
    el.style.color = "#FF5459";
}
