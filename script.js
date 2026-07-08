/* ==========================================================================
   JAVASCRIPT INTERACTIONS FOR THÙY TRANG PORTFOLIO
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. DOM Elements
    // ==========================================
    const navbarContainer = document.querySelector('.navbar-container');
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const navLinksList = document.getElementById('nav-links');
    const mobileOverlay = document.getElementById('mobile-overlay');
    const mobileDrawerClose = document.getElementById('mobile-drawer-close');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    const backToTopBtn = document.getElementById('back-to-top');
    const scrollProgressBar = document.getElementById('scroll-progress');
    const contactForm = document.getElementById('contact-form');
    const skillProgressBars = document.querySelectorAll('.progress-bar-fill');
    
    // ==========================================
    // 2. Mobile Menu Navigation Toggle
    // ==========================================
    const toggleMobileMenu = () => {
        hamburgerMenu.classList.toggle('active');
        navLinksList.classList.toggle('active');
        mobileOverlay.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    };
    
    const closeMobileMenu = () => {
        hamburgerMenu.classList.remove('active');
        navLinksList.classList.remove('active');
        mobileOverlay.classList.remove('active');
        document.body.classList.remove('no-scroll');
    };
    
    if (hamburgerMenu) {
        hamburgerMenu.addEventListener('click', toggleMobileMenu);
    }
    
    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', closeMobileMenu);
    }
    
    if (mobileDrawerClose) {
        mobileDrawerClose.addEventListener('click', closeMobileMenu);
    }
    
    // Close menu when clicking link items
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });

    // ==========================================
    // 2b. Liquid Nav Indicator Slider (Horizontal)
    // ==========================================
    const navIndicator = document.getElementById('nav-indicator');
    
    function updateNavIndicator(targetElement) {
        if (!navIndicator || !targetElement) return;
        
        // Don't show indicator on mobile view where links are stacked vertically
        if (window.innerWidth <= 768) {
            navIndicator.style.opacity = '0';
            return;
        }
        
        const width = targetElement.offsetWidth;
        const height = targetElement.offsetHeight;
        const left = targetElement.offsetLeft;
        const top = targetElement.offsetTop;
        
        navIndicator.style.width = `${width}px`;
        navIndicator.style.height = `${height}px`;
        navIndicator.style.left = `${left}px`;
        navIndicator.style.top = `${top}px`;
        navIndicator.style.opacity = '1';
    }
    
    // Set initial position
    setTimeout(() => {
        const activeLink = document.querySelector('.nav-link.active');
        if (activeLink) updateNavIndicator(activeLink);
    }, 300); // short delay to ensure rendering completes
    
    // Recalculate position on window resize
    window.addEventListener('resize', () => {
        const activeLink = document.querySelector('.nav-link.active');
        if (activeLink) {
            updateNavIndicator(activeLink);
        } else {
            navIndicator.style.opacity = '0';
        }
    });
    
    // Hover event listeners
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', (e) => {
            updateNavIndicator(e.target);
        });
    });
    
    // When mouse leaves the whole navigation links container, return to active link
    if (navLinksList) {
        navLinksList.addEventListener('mouseleave', () => {
            const activeLink = document.querySelector('.nav-link.active');
            if (activeLink) {
                updateNavIndicator(activeLink);
            } else {
                navIndicator.style.opacity = '0';
            }
        });
    }

    // ==========================================
    // 3. Scroll Interactions (Navbar & Progress)
    // ==========================================
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        
        // Navbar scroll effect
        if (scrollTop > 50) {
            navbarContainer.classList.add('scrolled');
        } else {
            navbarContainer.classList.remove('scrolled');
        }
        
        // Progress bar width
        if (docHeight > 0) {
            const scrollPercent = (scrollTop / docHeight) * 100;
            scrollProgressBar.style.width = `${scrollPercent}%`;
        }
        
        // Back to top button visibility
        if (scrollTop > 500) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });
    
    // Smooth scroll back to top when button clicked
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ==========================================
    // 4. Scroll Reveal Animations (Intersection Observer)
    // ==========================================
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Trigger once
            }
        });
    };
    
    const revealObserverOption = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const revealObserver = new IntersectionObserver(revealCallback, revealObserverOption);
    
    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => revealObserver.observe(el));

    // ==========================================
    // 5. Skill Bars Animation on Scroll
    // ==========================================
    // Store target widths from inline style, set style width to 0 first
    const barTargets = [];
    skillProgressBars.forEach((bar, idx) => {
        const targetWidth = bar.style.width || '100%';
        barTargets[idx] = targetWidth;
        bar.style.width = '0'; // reset for transition effect
    });
    
    const animateSkills = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate progress bars in this category card
                const barsInCard = entry.target.querySelectorAll('.progress-bar-fill');
                barsInCard.forEach(bar => {
                    // Find original index
                    const index = Array.from(skillProgressBars).indexOf(bar);
                    if (index !== -1) {
                        bar.style.width = barTargets[index];
                    }
                });
                observer.unobserve(entry.target);
            }
        });
    };
    
    const skillsObserver = new IntersectionObserver(animateSkills, { threshold: 0.1 });
    const skillCards = document.querySelectorAll('.skill-category-card');
    skillCards.forEach(card => skillsObserver.observe(card));

    // ==========================================
    // 6. Navigation Link Highlighting on Scroll
    // ==========================================
    const navObserverCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                        // Also update liquid indicator
                        updateNavIndicator(link);
                    }
                });
            }
        });
    };
    
    const navObserverOption = {
        root: null,
        rootMargin: '-30% 0px -60% 0px', // Trigger when section occupies core display area
        threshold: 0
    };
    
    const navObserver = new IntersectionObserver(navObserverCallback, navObserverOption);
    sections.forEach(sec => navObserver.observe(sec));

    // ==========================================
    // 7. Interactive Contact Form Submission
    // ==========================================
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Gather info
            const nameInput = document.getElementById('form-name');
            const emailInput = document.getElementById('form-email');
            const messageInput = document.getElementById('form-message');
            
            // Basic validation check
            if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
                showNotification('Vui lòng điền đầy đủ các thông tin!', 'error');
                return;
            }
            
            // Disable button during mock sending animation
            const submitBtn = contactForm.querySelector('.btn-submit');
            const originalBtnContent = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Đang gửi... <i class="fa-solid fa-spinner fa-spin"></i>';
            
            // Mock server timeout
            setTimeout(() => {
                // Success message
                showNotification(`Cảm ơn ${nameInput.value}, lời nhắn của bạn đã được gửi thành công! ✨`, 'success');
                
                // Reset form
                contactForm.reset();
                
                // Restore button
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnContent;
            }, 1500);
        });
    }
    
    // Notification Helper function
    function showNotification(message, type = 'success') {
        // Remove existing notification if any
        const existingNotif = document.querySelector('.custom-notification');
        if (existingNotif) {
            existingNotif.remove();
        }
        
        // Create new element
        const notification = document.createElement('div');
        notification.className = `custom-notification ${type}`;
        
        const icon = type === 'success' 
            ? '<i class="fa-solid fa-circle-check"></i>' 
            : '<i class="fa-solid fa-circle-exclamation"></i>';
            
        notification.innerHTML = `
            ${icon}
            <div class="notification-text">${message}</div>
        `;
        
        document.body.appendChild(notification);
        
        // Trigger show animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Auto remove after 4 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 4000);
    }
    
});
