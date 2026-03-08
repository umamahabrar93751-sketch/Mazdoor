document.addEventListener('DOMContentLoaded', () => {
    // --- Language Toggle Logic ---
    const langToggleBtn = document.getElementById('langToggle');
    const langText = document.getElementById('langText');
    const body = document.body;
    
    // Check saved language preference, default to English
    let currentLang = localStorage.getItem('mazdoor_lang') || 'en';
    
    // Function to apply translation
    const applyLanguage = (lang) => {
        const translatableElements = document.querySelectorAll('[data-en][data-ur]');
        
        translatableElements.forEach(el => {
            if (lang === 'ur') {
                el.innerText = el.getAttribute('data-ur');
                body.classList.add('lang-ur'); // For font styling in CSS
            } else {
                el.innerText = el.getAttribute('data-en');
                body.classList.remove('lang-ur');
            }
        });
        
        // Update the button text to show the OTHER language option
        if (langText) {
            langText.innerText = lang === 'en' ? 'اردو' : 'English';
        }
        
        // Save preference
        localStorage.setItem('mazdoor_lang', lang);
        currentLang = lang;
    };

    // Initialize with saved language
    applyLanguage(currentLang);

    // Toggle event listener
    if (langToggleBtn) {
        langToggleBtn.addEventListener('click', () => {
            const newLang = currentLang === 'en' ? 'ur' : 'en';
            applyLanguage(newLang);
        });
    }

    // --- End Language Toggle Logic ---

    // --- Theme Toggle Logic ---
    const themeToggleBtn = document.getElementById('themeToggle');
    let currentTheme = localStorage.getItem('mazdoor_theme') || 'light';
    
    // Function to apply theme
    const applyTheme = (theme) => {
        if (theme === 'dark') {
            body.classList.add('dark-mode');
            if (themeToggleBtn) {
                themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
            }
        } else {
            body.classList.remove('dark-mode');
            if (themeToggleBtn) {
                themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
            }
        }
        localStorage.setItem('mazdoor_theme', theme);
        currentTheme = theme;
    };

    // Initialize theme
    applyTheme(currentTheme);

    // Toggle event listener
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            applyTheme(newTheme);
        });
    }
    // --- End Theme Toggle Logic ---

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 10) {
            navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)';
        } else {
            navbar.style.boxShadow = 'none';
        }
    });

    // Smooth scrolling for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Mobile Menu Toggle (Placeholder)
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            const navLinks = document.querySelector('.nav-links');
            if (navLinks.style.display === 'flex') {
                navLinks.style.display = 'none';
            } else {
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.background = 'white';
                navLinks.style.padding = '20px';
                navLinks.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1)';
            }
        });
    }
});

// --- Modal Functions (Global for HTML onclick) ---
function openPaymentModal(title, amount, commission) {
    document.getElementById('payJobTitle').innerText = title;
    document.getElementById('payJobAmount').innerText = amount;
    document.getElementById('payCommissionFee').innerText = commission;
    document.getElementById('paymentModal').classList.add('active');
}

function openChatModal(employerName) {
    document.getElementById('chatEmployerName').innerText = employerName;
    document.getElementById('chatModal').classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function processPayment() {
    alert("Payment successful! You have accepted the job. The employer's details are now available.");
    closeModal('paymentModal');
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const msg = input.value.trim();
    if(msg) {
        const msgs = document.getElementById('chatMessages');
        msgs.innerHTML += `<div class="chat-msg worker">${msg}<div style="font-size: 0.75rem; color: rgba(255,255,255,0.8); text-align: right; margin-top: 4px;">Just now</div></div>`;
        input.value = '';
        msgs.scrollTop = msgs.scrollHeight;
    }
}

function rejectJob(btn) {
    if(confirm("Are you sure you want to reject this job?")) {
        const card = btn.closest('.job-card-worker');
        card.style.opacity = '0';
        card.style.transform = 'translateX(-20px)';
        setTimeout(() => {
            card.remove();
        }, 300);
    }
}

function selectPaymentMethod(btn) {
    // Remove active class from all buttons
    document.querySelectorAll('.payment-method-btn').forEach(b => b.classList.remove('active'));
    // Add active class to clicked button
    btn.classList.add('active');
    
    // Update input fields based on method
    const method = btn.querySelector('span').innerText;
    const fieldsContainer = document.getElementById('methodFields');
    
    if (method === 'Card') {
        fieldsContainer.innerHTML = `
            <div class="form-group">
                <label>Card Number</label>
                <div style="position: relative;">
                    <input type="text" class="form-input" placeholder="0000 0000 0000 0000">
                    <i class="fa-solid fa-credit-card" style="position: absolute; right: 16px; top: 16px; color: var(--text-muted);"></i>
                </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                <div class="form-group">
                    <label>Expiry (MM/YY)</label>
                    <input type="text" class="form-input" placeholder="MM/YY">
                </div>
                <div class="form-group">
                    <label>CVV</label>
                    <input type="password" class="form-input" placeholder="123">
                </div>
            </div>
        `;
    } else {
        fieldsContainer.innerHTML = `
            <div class="form-group">
                <label>${method} Number</label>
                <input type="text" class="form-input" placeholder="03XX XXXXXXX">
            </div>
        `;
    }
}
