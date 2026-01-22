// ===== Professional Loader =====
function initLoader() {
    const loader = document.getElementById('loader');
    const progressFill = document.querySelector('.progress-fill');
    const progressPercentage = document.querySelector('.progress-percentage');
    const techItems = document.querySelectorAll('.tech-item');
    
    // Check if loader has been shown before
    const loaderShown = sessionStorage.getItem('loaderShown');
    
    if (loaderShown) {
        loader.style.display = 'none';
        document.body.classList.add('loaded');
        initAllAnimations();
        updateAllCounters();
        return;
    }
    
    document.body.style.overflow = 'hidden';
    
    let progress = 0;
    const duration = 2000;
    const interval = 50;
    const increment = 100 / (duration / interval);
    
    const updateProgress = setInterval(() => {
        progress += increment;
        const easedProgress = easeOutQuad(progress / 100) * 100;
        
        if (progressFill) {
            progressFill.style.width = `${easedProgress}%`;
        }
        
        if (progressPercentage) {
            progressPercentage.textContent = `${Math.min(100, Math.floor(easedProgress))}%`;
        }
        
        // Animate tech items as progress increases
        techItems.forEach((item, index) => {
            if (easedProgress > (index + 1) * 20) {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }
        });
        
        if (progress >= 100) {
            clearInterval(updateProgress);
            
            setTimeout(() => {
                loader.style.opacity = '0';
                loader.style.visibility = 'hidden';
                document.body.style.overflow = 'auto';
                document.body.classList.add('loaded');
                
                sessionStorage.setItem('loaderShown', 'true');
                
                setTimeout(() => {
                    initAllAnimations();
                    updateAllCounters();
                }, 300);
            }, 500);
        }
    }, interval);
}

function easeOutQuad(t) {
    return t * (2 - t);
}

// ===== Theme Toggle =====
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;
    
    // Check for saved theme preference or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Add animation effect
            themeToggle.classList.add('clicked');
            setTimeout(() => {
                themeToggle.classList.remove('clicked');
            }, 300);
        });
    }
}

// ===== Typing Animation =====
function initTyping() {
    const typingElement = document.querySelector('.typing-text');
    if (!typingElement) return;
    
    // Check if Typed.js is available
    if (typeof Typed !== 'undefined') {
        try {
            const typed = new Typed('.typing-text', {
                strings: [
                    'Full Stack Developer',
                    'Web Developer',
                    'Frontend Developer',
                    'Backend Developer',
                    'Problem Solver'
                ],
                typeSpeed: 50,
                backSpeed: 30,
                backDelay: 1500,
                loop: true,
                showCursor: false,
                smartBackspace: true
            });
        } catch (error) {
            console.warn('Typed.js error:', error);
            typingElement.textContent = 'Full Stack Developer';
        }
    } else {
        typingElement.textContent = 'Full Stack Developer';
    }
}

// ===== Mobile Navigation =====
function initMobileNav() {
    const mobileToggle = document.getElementById('mobile-toggle');
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!mobileToggle || !navbar) return;
    
    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        navbar.classList.toggle('active');
        document.body.style.overflow = navbar.classList.contains('active') ? 'hidden' : 'auto';
    });
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            navbar.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navbar.classList.contains('active') && 
            !navbar.contains(e.target) && 
            !mobileToggle.contains(e.target)) {
            mobileToggle.classList.remove('active');
            navbar.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
}

// ===== Smooth Scrolling =====
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('.nav-link');
    const header = document.querySelector('.header');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href.startsWith('#')) {
                e.preventDefault();
                
                // Close mobile menu if open
                const mobileToggle = document.getElementById('mobile-toggle');
                const navbar = document.querySelector('.navbar');
                if (mobileToggle && navbar && navbar.classList.contains('active')) {
                    mobileToggle.classList.remove('active');
                    navbar.classList.remove('active');
                    document.body.style.overflow = 'auto';
                }
                
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const headerHeight = header ? header.offsetHeight : 0;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    // Update active nav link
                    navLinks.forEach(l => l.classList.remove('active'));
                    this.classList.add('active');
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Update URL hash
                    history.pushState(null, null, href);
                }
            }
        });
    });
}

// ===== Active Navigation on Scroll =====
function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const header = document.querySelector('.header');
    const headerHeight = header ? header.offsetHeight : 0;
    
    let current = '';
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - headerHeight;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            current = sectionId;
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// ===== Back to Top Button =====
function initBackToTop() {
    const backToTop = document.getElementById('backToTop');
    
    if (!backToTop) return;
    
    const toggleVisibility = () => {
        if (window.scrollY > 300) {
            backToTop.classList.add('visible');
            backToTop.style.opacity = '1';
            backToTop.style.visibility = 'visible';
        } else {
            backToTop.classList.remove('visible');
            backToTop.style.opacity = '0';
            backToTop.style.visibility = 'hidden';
        }
    };
    
    window.addEventListener('scroll', toggleVisibility);
    toggleVisibility();
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // Update active nav link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => link.classList.remove('active'));
        const homeLink = document.querySelector('a[href="#home"]');
        if (homeLink) homeLink.classList.add('active');
    });
}

// ===== Animate Statistics Counter =====
function updateStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-count')) || 0;
        const duration = 2000;
        const interval = 50;
        const increment = target / (duration / interval);
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
                stat.textContent = Math.floor(current);
                stat.parentElement.classList.add('counter-complete');
            } else {
                stat.textContent = Math.floor(current);
            }
        }, interval);
    });
    
    // Update project count in stats
    const projectsStat = document.querySelector('.stat-item:nth-child(1) .stat-number');
    if (projectsStat) {
        const totalProjects = document.querySelectorAll('.project-card').length;
        projectsStat.setAttribute('data-count', totalProjects);
    }
}

// ===== Update Total Counts =====
function updateTotalCounts() {
    // Update project count
    const projectElements = document.querySelectorAll('.project-card');
    const projectsTotal = document.getElementById('projectsTotal');
    if (projectsTotal) projectsTotal.textContent = projectElements.length;
    
    // Update skill count
    const skillElements = document.querySelectorAll('.skill-icon-card');
    const softSkillElements = document.querySelectorAll('.soft-skill-card');
    const skillsTotal = document.getElementById('skillsTotal');
    if (skillsTotal) {
        skillsTotal.textContent = skillElements.length + softSkillElements.length;
    }
    
    // Update footer stats
    updateFooterStats();
}

// ===== Update Showing Counts =====
function updateShowingCounts() {
    // Update projects showing
    const hiddenProjects = document.querySelectorAll('.project-card.hidden-project');
    const showingProjectsSpan = document.getElementById('showingProjects');
    const projectsTotalSpan = document.getElementById('projectsTotal');
    
    if (showingProjectsSpan && projectsTotalSpan) {
        const totalProjects = document.querySelectorAll('.project-card').length;
        const showingProjects = totalProjects - hiddenProjects.length;
        showingProjectsSpan.textContent = showingProjects;
        projectsTotalSpan.textContent = totalProjects;
    }
}

// ===== Update Footer Stats =====
function updateFooterStats() {
    const footerProjects = document.getElementById('footerProjects');
    const footerCerts = document.getElementById('footerCerts');
    
    if (footerProjects) footerProjects.textContent = document.querySelectorAll('.project-card').length;
    if (footerCerts) {
        const totalCertsSpan = document.getElementById('totalCerts');
        if (totalCertsSpan) {
            footerCerts.textContent = totalCertsSpan.textContent;
        }
    }
}

// ===== Initialize Education Timeline Animation =====
function initEducationAnimation() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const checkScroll = () => {
        timelineItems.forEach(item => {
            const itemTop = item.getBoundingClientRect().top;
            const itemVisible = 150;
            
            if (itemTop < window.innerHeight - itemVisible) {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }
        });
    };
    
    window.addEventListener('scroll', checkScroll);
    checkScroll();
}

// ===== Initialize All Animations =====
function initAllAnimations() {
    // Add scroll event listener for active nav
    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav();
    
    // Initialize scroll animations
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    const checkScroll = () => {
        animateElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('visible');
            }
        });
    };
    
    window.addEventListener('scroll', checkScroll);
    checkScroll();
}

// ===== Load Skills Data =====
function loadSkillsData() {
    const skillsData = {
        programming: [
            { skill: "C", level: 75, desc: "System Programming", icon: "fas fa-terminal" },
            { skill: "C++", level: 72, desc: "OOP & Algorithms", icon: "fas fa-cogs" },
            { skill: "Java", level: 78, desc: "Enterprise Applications", icon: "fab fa-java" },
            { skill: "Python", level: 75, desc: "Scripting & Automation", icon: "fab fa-python" },
            { skill: "JavaScript", level: 85, desc: "ES6+ & DOM", icon: "fab fa-js" }
        ],
        frontend: [
            { skill: "HTML5", level: 95, desc: "Semantic Markup", icon: "fab fa-html5" },
            { skill: "CSS3", level: 90, desc: "Styling & Layouts", icon: "fab fa-css3-alt" },
            { skill: "React", level: 80, desc: "Components & Hooks", icon: "fab fa-react" },
            { skill: "JSP", level: 85, desc: "Dynamic Web Pages", icon: "fas fa-file-code" },
            { skill: "Bootstrap", level: 85, desc: "Responsive Design", icon: "fab fa-bootstrap" }
        ],
        backend: [
            { skill: "Node.js", level: 82, desc: "Runtime & APIs", icon: "fab fa-node-js" },
            { skill: "MySQL", level: 80, desc: "Database Management", icon: "fas fa-database" },
            { skill: "MongoDB", level: 70, desc: "NoSQL Database", icon: "fas fa-leaf" },
            { skill: "Express.js", level: 78, desc: "Web Framework", icon: "fas fa-rocket" },
            { skill: "Servlet", level: 83, desc: "Java Web Components", icon: "fas fa-cogs" }
        ],
        tools: [
            { skill: "Git", level: 88, desc: "Version Control", icon: "fab fa-git-alt" },
            { skill: "GitHub", level: 90, desc: "Code Hosting", icon: "fab fa-github" },
            { skill: "VS Code", level: 92, desc: "Code Editor", icon: "fas fa-code" },
            { skill: "IntelliJ", level: 80, desc: "Java IDE", icon: "fas fa-lightbulb" },
            { skill: "Eclipse", level: 75, desc: "Development IDE", icon: "fas fa-sun" }
        ]
    };

    // Load programming skills
    const programmingGrid = document.getElementById('programmingGrid');
    if (programmingGrid) {
        programmingGrid.innerHTML = skillsData.programming.map((skill, index) => `
            <div class="skill-icon-card animate-on-scroll" data-skill="${skill.skill}" data-level="${skill.level}">
                <div class="skill-icon-wrapper">
                    <div class="skill-icon-bg">
                        <i class="${skill.icon}"></i>
                    </div>
                </div>
                <div class="skill-info">
                    <h4 class="skill-name">${skill.skill}</h4>
                    <p class="skill-description">${skill.desc}</p>
                </div>
            </div>
                
        `).join('');
    }

    // Load frontend skills
    const frontendGrid = document.getElementById('frontendGrid');
    if (frontendGrid) {
        frontendGrid.innerHTML = skillsData.frontend.map((skill, index) => `
            <div class="skill-icon-card animate-on-scroll" data-skill="${skill.skill}" data-level="${skill.level}">
                <div class="skill-icon-wrapper">
                    <div class="skill-icon-bg">
                        <i class="${skill.icon}"></i>
                    </div>
                </div>
                <div class="skill-info">
                    <h4 class="skill-name">${skill.skill}</h4>
                    <p class="skill-description">${skill.desc}</p>
                </div>
                
            </div>
        `).join('');
    }

    // Load backend skills
    const backendGrid = document.getElementById('backendGrid');
    if (backendGrid) {
        backendGrid.innerHTML = skillsData.backend.map((skill, index) => `
            <div class="skill-icon-card animate-on-scroll" data-skill="${skill.skill}" data-level="${skill.level}">
                <div class="skill-icon-wrapper">
                    <div class="skill-icon-bg">
                        <i class="${skill.icon}"></i>
                    </div>
                </div>
                <div class="skill-info">
                    <h4 class="skill-name">${skill.skill}</h4>
                    <p class="skill-description">${skill.desc}</p>
                </div>
                
            </div>
        `).join('');
    }

    // Load tools skills
    const toolsGrid = document.getElementById('toolsGrid');
    if (toolsGrid) {
        toolsGrid.innerHTML = skillsData.tools.map((skill, index) => `
            <div class="skill-icon-card animate-on-scroll" data-skill="${skill.skill}" data-level="${skill.level}">
                <div class="skill-icon-wrapper">
                    <div class="skill-icon-bg">
                        <i class="${skill.icon}"></i>
                    </div>
                </div>
                <div class="skill-info">
                    <h4 class="skill-name">${skill.skill}</h4>
                    <p class="skill-description">${skill.desc}</p>
                </div>
                
            </div>
        `).join('');
    }
}

// ===== Enhanced Certifications Functions =====
function initEnhancedCertifications() {
    loadEnhancedCertificates();
    initCertificateFilters();
    initCertificateHoverEffects();
}

function loadEnhancedCertificates() {
    const certificatesData = [
        {
            id: 1,
            title: "Programming in Python",
            issuer: "Dibrugarh University Conducted by NPTEL",
            date: "Dec 2023",
            description: "Successfully completed the 4-credit course in December 2023 with an excellent consolidated score of 84%, demonstrating strong proficiency in Python programming fundamentals through online assignments and a proctored exam.",
            skills: ["Python Syntax", "Data Types", "Control Structures", "Functions", "OOP Principles", "File Handling"],
            score: 84,
            category: "technical",
            featured: true,
            icon: "fab fa-python",
            image: "Certificates/Py.png",
            download: "Certificates/Python.pdf",
            fileType: "pdf"
        },
        {
            id: 2,
            title: "Getting Started with Enterprise Data Science",
            issuer: "IBM",
            date: "Jun 2024",
            description: "Earned this IBM credential in June 2024, validating foundational knowledge and commitment to understanding cloud solution design principles and their business application.",
            skills: ["Cloud Computing", "IaaS/PaaS/SaaS", "Cloud Deployment", "Business Solutions"],
            score: 100,
            category: "professional",
            featured: true,
            icon: "fas fa-chart-line",
            image: "Certificates/ibm2.png",
            download: "Certificates/ibm2.png",
            fileType: "png"
        },
        {
            id: 3,
            title: "Programming in Java",
            issuer: "IIT Kharagpur Conducted by NPTEL",
            date: "Dec 2024",
            description: "Concluded this 12-week Java programming course in Jul-Oct 2024 with a consolidated score of 64% with 'Elite Batch', showcasing strong practical skills through assignments and exams certified by IIT Kharagpur.",
            skills: ["Java Syntax", "OOP Concepts", "Exception Handling", "Multithreading", "Collections Framework"],
            score: 64,
            category: "technical",
            featured: false,
            icon: "fab fa-java",
            image: "Certificates/Java.png",
            download: "Certificates/Programming in Java.pdf",
            fileType: "pdf"
        },
        {
            id: 4,
            title: "Database Management System",
            issuer: "IIT Kharagpur Conducted by NPTEL",
            date: "Nov 2024",
            description: "Completed this 8-week core course in the Jul-Sep 2024 session with a consolidated score of 56%, covering fundamental DBMS concepts and practices certified by IIT Kharagpur.",
            skills: ["Database Systems", "ER Modeling", "Relational Model", "SQL", "Normalization"],
            score: 56,
            category: "technical",
            featured: false,
            icon: "fas fa-database",
            image: "Certificates/DBMS.png",
            download: "Certificates/Data Base Management System (1).pdf",
            fileType: "pdf"
        },
        {
            id: 5,
            title: "Data Structure & Algorithms Using Java",
            issuer: "IIT Kharagpur Conducted by NPTEL",
            date: "Dec 2024",
            description: "Completed this 8-week core course in the Jul-Oct 2024 session with a consolidated score of 61% with 'Elite Batch', covering fundamental DBMS concepts and practices certified by IIT Kharagpur.",
            skills: ["Data Structures", "Algorithms", "Time Complexity", "Space Complexity", "Java Implementation"],
            score: 61,
            category: "technical",
            featured: false,
            icon: "fas fa-sitemap",
            image: "Certificates/DSA.png",
            download: "Certificates/Data Structure and Algorithms using Java.pdf",
            fileType: "pdf"
        },
        {
            id: 6,
            title: "Journey to Cloud Envisioning Your Solution",
            issuer: "IBM",
            date: "Jun 2024",
            description: "Achieved in June 2024, this IBM badge signifies the acquisition of essential concepts for applying data science methodologies within an enterprise environment.",
            skills: ["Data Science Lifecycle", "Enterprise Context", "Data Governance", "Model Management"],
            score: 100,
            category: "professional",
            featured: true,
            icon: "fas fa-cloud",
            image: "Certificates/ibm.png",
            download: "Certificates/ibm.png",
            fileType: "png"
        },
        {
            id: 7,
            title: "Frontend Web Development",
            issuer: "Lakshya IT Solution",
            date: "Dec 2023",
            description: "Successfully completed a Frontend Web Development certification course, significantly enhancing skills in HTML5, CSS3, and JavaScript. Through hands-on projects, mastered modern techniques like responsive design, CSS animations, and API integration.",
            skills: ["HTML5", "CSS3", "JavaScript", "Responsive Design", "CSS Animations", "API Integration"],
            score: 100,
            category: "technical",
            featured: true,
            icon: "fas fa-laptop-code",
            image: "Certificates/Front.jpg",
            download: "Certificates/Front.jpg",
            fileType: "jpg"
        },
        {
            id: 8,
            title: "Industrial Training Institute (ITI)",
            issuer: "Ministry of Skill Development and Entrepreneurship",
            date: "Aug 2017",
            description: "Upon completing the ITI COPA trade, gained comprehensive proficiency in computer fundamentals and troubleshooting, and operating systems. Developed strong skills in office productivity software.",
            skills: ["Computer Fundamentals", "Troubleshooting", "MS Office", "C/C++ Programming", "HTML/CSS", "Database Concepts"],
            score: 100,
            category: "university",
            featured: false,
            icon: "fas fa-graduation-cap",
            image: "Certificates/ITI.png",
            download: "Certificates/ITI.png",
            fileType: "png"
        },
        {
            id: 9,
            title: "AWS Cloud Practitioner Essentials",
            issuer: "Amazon Web Services (AWS)",
            date: "Sep 2025",
            description: "Achieved in September 2025, this AWS certificate validates a foundational understanding of Amazon Web Services cloud concepts and services.",
            skills: ["AWS Services", "Cloud Security", "Billing & Pricing", "Cloud Economics", "AWS Navigation"],
            score: 100,
            category: "professional",
            featured: true,
            icon: "fab fa-aws",
            image: "Certificates/AW.png",
            download: "Certificates/AWS.pdf",
            fileType: "pdf"
        },
        {
            id: 10,
            title: "Apprenticeship in HPCL",
            issuer: "Ministry of Skill Development and Entrepreneurship",
            date: "Jan 2019",
            description: "Successfully completed the COPA Trade Apprenticeship Certificate Course, a government-recognized program certified by NCVT.",
            skills: ["Computer Operations", "Software Installation", "Python/C++ Programming", "Database Management", "Networking"],
            score: 100,
            category: "professional",
            featured: false,
            icon: "fas fa-briefcase",
            image: "Certificates/App.png",
            download: "Certificates/Apprenticeship_Certificate.pdf",
            fileType: "pdf"
        }
    ];

    const certificationsGrid = document.getElementById('certificationsGrid');
    const totalCerts = document.getElementById('totalCerts');
    const certTotal = document.getElementById('certTotal');
    
    if (!certificationsGrid) return;
    
    // Update total counts
    if (totalCerts) totalCerts.textContent = certificatesData.length;
    if (certTotal) certTotal.textContent = certificatesData.length;
    
    // Clear container
    certificationsGrid.innerHTML = '';
    
    // Create certificate cards
    certificatesData.forEach((cert, index) => {
        const isHidden = index >= 3;
        const certCard = document.createElement('div');
        certCard.className = `cert-card ${isHidden ? 'hidden-cert' : ''} ${cert.featured ? 'featured' : ''}`;
        certCard.setAttribute('data-id', cert.id);
        certCard.setAttribute('data-category', cert.category);
        certCard.setAttribute('data-score', cert.score);
        
        // Determine score class
        let scoreClass = 'medium-score';
        if (cert.score >= 90) scoreClass = 'high-score';
        else if (cert.score < 70) scoreClass = 'low-score';
        
        // Create certificate card HTML
        certCard.innerHTML = `
            ${cert.featured ? '<div class="cert-ribbon"><i class="fas fa-star"></i> Featured</div>' : ''}
            
            <div class="cert-header">
                <div class="cert-badge">
                    <i class="${cert.icon}"></i>
                </div>
                <div class="cert-title-wrapper">
                    <div class="cert-icon">
                        <i class="${cert.icon}"></i>
                    </div>
                    <h3 class="cert-title">${cert.title}</h3>
                </div>
                <p class="cert-subtitle">${cert.category.toUpperCase()} CERTIFICATION</p>
            </div>
            
            <div class="cert-image" onclick="viewEnhancedCertificate(${cert.id})">
                <img src="${cert.image}" alt="${cert.title}" loading="lazy">
                <div class="cert-image-overlay">
                    <button class="view-cert-btn" onclick="viewEnhancedCertificate(${cert.id})">
                        <i class="fas fa-expand-alt"></i>
                    </button>
                </div>
            </div>
            
            <div class="cert-content">
                <div class="cert-meta">
                    <div class="cert-issuer">
                        <i class="fas fa-university"></i>
                        <span>${cert.issuer}</span>
                    </div>
                    <span class="cert-date">${cert.date}</span>
                </div>
                
                <div class="cert-description">
                    <p>${cert.description}</p>
                    
                    <div class="skills-gained">
                        <div class="skills-title">
                            <i class="fas fa-tools"></i>
                            <span>Skills Gained</span>
                        </div>
                        <div class="skills-list">
                            ${cert.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                        </div>
                    </div>
                </div>
                
                <div class="cert-score">
                    <div class="score-header">
                        <span class="score-label">Achievement Score</span>
                        <span class="score-value">${cert.score}%</span>
                    </div>
                    <div class="score-bar-container">
                        <div class="score-bar-fill ${scoreClass}" style="width: ${cert.score}%"></div>
                    </div>
                </div>
                
                <div class="cert-actions">
                    <button class="btn-view" onclick="viewEnhancedCertificate(${cert.id})">
                        <i class="fas fa-eye"></i>
                        View Certificate
                    </button>
                    <button class="btn-download" onclick="downloadEnhancedCertificate(${cert.id}, this)">
                        <i class="fas fa-download"></i>
                        Download
                    </button>
                </div>
            </div>
        `;
        
        certificationsGrid.appendChild(certCard);
    });
    
    // Animate score bars
    setTimeout(() => {
        document.querySelectorAll('.score-bar-fill').forEach(bar => {
            const width = bar.style.width;
            bar.style.transition = 'none';
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.transition = 'width 1.5s ease-out';
                bar.style.width = width;
            }, 100);
        });
    }, 500);
    
    // Update showing count
    updateEnhancedCounts();
    
    // Setup event listeners
    setupEnhancedCertificateEvents();
}

function initCertificateFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            const filter = button.getAttribute('data-filter');
            filterCertificates(filter);
        });
    });
}

function filterCertificates(filter) {
    const allCertificates = document.querySelectorAll('.cert-card');
    
    allCertificates.forEach(cert => {
        const category = cert.getAttribute('data-category');
        const score = parseInt(cert.getAttribute('data-score'));
        
        let shouldShow = false;
        
        switch(filter) {
            case 'all':
                shouldShow = true;
                break;
            case 'university':
                shouldShow = category === 'university';
                break;
            case 'professional':
                shouldShow = category === 'professional';
                break;
            case 'technical':
                shouldShow = category === 'technical';
                break;
            case 'top-rated':
                shouldShow = score >= 85;
                break;
            default:
                shouldShow = true;
        }
        
        if (shouldShow) {
            cert.style.display = 'flex';
            cert.classList.add('show');
        } else {
            cert.style.display = 'none';
            cert.classList.remove('show');
        }
    });
    
    // Update counts after filtering
    setTimeout(updateEnhancedCounts, 300);
}

function initCertificateHoverEffects() {
    const certCards = document.querySelectorAll('.cert-card');
    
    certCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.classList.add('hover-active');
            const score = parseInt(card.getAttribute('data-score'));
            const scoreBar = card.querySelector('.score-bar-fill');
            
            if (scoreBar) {
                scoreBar.style.transform = 'scaleY(1.2)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            card.classList.remove('hover-active');
            const scoreBar = card.querySelector('.score-bar-fill');
            
            if (scoreBar) {
                scoreBar.style.transform = 'scaleY(1)';
            }
        });
    });
}

function setupEnhancedCertificateEvents() {
    // Load more certificates button
    const loadMoreCertsBtn = document.getElementById('loadMoreCerts');
    const showLessCertsBtn = document.getElementById('showLessCerts');
    
    if (loadMoreCertsBtn) {
        loadMoreCertsBtn.addEventListener('click', loadMoreEnhancedCertificates);
    }
    
    if (showLessCertsBtn) {
        showLessCertsBtn.addEventListener('click', showLessEnhancedCertificates);
    }
    
    // View certificate buttons
    const viewButtons = document.querySelectorAll('.view-cert-btn, .btn-view');
    viewButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const certId = btn.closest('.cert-card')?.getAttribute('data-id');
            if (certId) viewEnhancedCertificate(certId);
        });
    });
    
    // Download certificate buttons are handled via onclick attribute
}

function loadMoreEnhancedCertificates() {
    const hiddenCerts = document.querySelectorAll('.hidden-cert');
    const loadMoreCertsBtn = document.getElementById('loadMoreCerts');
    const showLessCertsBtn = document.getElementById('showLessCerts');
    
    if (!hiddenCerts.length) return;
    
    // Show all hidden certificates with staggered animation
    hiddenCerts.forEach((cert, index) => {
        setTimeout(() => {
            cert.classList.remove('hidden-cert');
            cert.style.opacity = '0';
            cert.style.transform = 'translateY(30px)';
            
            // Trigger reflow
            cert.offsetHeight;
            
            cert.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            cert.style.opacity = '1';
            cert.style.transform = 'translateY(0)';
        }, index * 100);
    });
    
    // Update button visibility
    if (loadMoreCertsBtn) loadMoreCertsBtn.style.display = 'none';
    if (showLessCertsBtn) showLessCertsBtn.style.display = 'inline-flex';
    
    // Update showing count
    updateEnhancedCounts();
    
    // Show success toast
    showToast('All certificates loaded successfully!', 'success');
}

function showLessEnhancedCertificates() {
    const allCerts = document.querySelectorAll('.cert-card');
    const loadMoreCertsBtn = document.getElementById('loadMoreCerts');
    const showLessCertsBtn = document.getElementById('showLessCerts');
    
    // Hide certificates beyond first 3 with animation
    allCerts.forEach((cert, index) => {
        if (index >= 3) {
            cert.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            cert.style.opacity = '0';
            cert.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                cert.classList.add('hidden-cert');
                cert.style.transition = '';
            }, 300);
        }
    });
    
    // Update button visibility
    if (loadMoreCertsBtn) loadMoreCertsBtn.style.display = 'inline-flex';
    if (showLessCertsBtn) showLessCertsBtn.style.display = 'none';
    
    // Update showing count
    updateEnhancedCounts();
    
    // Show info toast
    showToast('Showing first 3 certificates', 'info');
}

function updateEnhancedCounts() {
    const hiddenCerts = document.querySelectorAll('.hidden-cert');
    const showingCertsSpan = document.getElementById('showingCerts');
    const totalCertsSpan = document.getElementById('totalCerts');
    const loadMoreCertsBtn = document.getElementById('loadMoreCerts');
    
    if (showingCertsSpan && totalCertsSpan) {
        const totalVisibleCerts = document.querySelectorAll('.cert-card').length;
        const hiddenCount = hiddenCerts.length;
        const showingCount = totalVisibleCerts - hiddenCount;
        
        showingCertsSpan.textContent = showingCount;
        totalCertsSpan.textContent = totalVisibleCerts;
        
        // Update load more button text
        if (loadMoreCertsBtn && hiddenCount > 0) {
            const loadMoreText = loadMoreCertsBtn.querySelector('span');
            if (loadMoreText) {
                loadMoreText.textContent = `Load More (${hiddenCount} remaining)`;
            }
        }
    }
}

function viewEnhancedCertificate(certId) {
    const certificateCard = document.querySelector(`.cert-card[data-id="${certId}"]`);
    if (!certificateCard) {
        showToast('Certificate not found!', 'error');
        return;
    }
    
    const modal = document.getElementById('certificateModal');
    const modalTitle = document.getElementById('modalTitle');
    const certificateImage = document.getElementById('certificateImage');
    
    if (!modal || !modalTitle || !certificateImage) {
        // Create modal if it doesn't exist
        createCertificateModal();
        setTimeout(() => viewEnhancedCertificate(certId), 100);
        return;
    }
    
    const title = certificateCard.querySelector('.cert-title').textContent;
    const imageSrc = certificateCard.querySelector('.cert-image img').src;
    
    // Set modal content
    modalTitle.textContent = title;
    certificateImage.src = imageSrc;
    certificateImage.alt = `${title} Certificate`;
    
    // Show modal with animation
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Add loading animation
    certificateImage.onload = () => {
        certificateImage.style.opacity = '1';
        certificateImage.classList.add('loaded');
    };
    
    certificateImage.style.opacity = '0.3';
    certificateImage.classList.remove('loaded');
}

// FIXED: Download certificate function with proper button reset
function downloadEnhancedCertificate(certId, buttonElement) {
    const certificateCard = document.querySelector(`.cert-card[data-id="${certId}"]`);
    if (!certificateCard) {
        showToast('Certificate not found!', 'error');
        return;
    }
    
    const title = certificateCard.querySelector('.cert-title').textContent;
    const downloadUrl = certificateCard.querySelector('.cert-image img').src;
    
    // Save original button content
    const originalHTML = buttonElement.innerHTML;
    const originalText = buttonElement.querySelector('span')?.textContent || 'Download';
    
    // Show downloading animation
    buttonElement.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Downloading...';
    buttonElement.disabled = true;
    
    // Create download link
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `Certificate_${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.png`;
    document.body.appendChild(link);
    
    // Trigger download
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    
    // Reset button after a short delay (simulating download time)
    setTimeout(() => {
        buttonElement.innerHTML = originalHTML;
        buttonElement.disabled = false;
        showToast(`"${title}" downloaded successfully!`, 'success');
    }, 1000);
}

function createCertificateModal() {
    const modalHTML = `
        <div class="modal" id="certificateModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3 id="modalTitle">Certificate Preview</h3>
                    <button class="modal-close" id="modalClose">&times;</button>
                </div>
                <div class="modal-body">
                    <img id="certificateImage" src="" alt="Certificate">
                    <div class="modal-actions">
                        <button class="btn btn-secondary" onclick="document.getElementById('certificateModal').classList.remove('active'); document.body.style.overflow = 'auto';">
                            <i class="fas fa-times"></i> Close
                        </button>
                        <button class="btn btn-primary" onclick="downloadCurrentCertificate()">
                            <i class="fas fa-download"></i> Download
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add event listener for close button
    const modalClose = document.getElementById('modalClose');
    if (modalClose) {
        modalClose.addEventListener('click', () => {
            document.getElementById('certificateModal').classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    }
}

function downloadCurrentCertificate() {
    const certificateImage = document.getElementById('certificateImage');
    const modalTitle = document.getElementById('modalTitle');
    
    if (!certificateImage || !modalTitle) return;
    
    const link = document.createElement('a');
    link.href = certificateImage.src;
    link.download = `certificate_${modalTitle.textContent.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast('Certificate download started!', 'success');
}

// ===== Enhanced Projects Functions =====
function initEnhancedProjects() {
    loadEnhancedProjects();
    initProjectsViewMore();
    initProjectVideoModal();
}

function loadEnhancedProjects() {
    const projectsData = [
        {
            id: 1,
            title: "Library Management System",
            description: "A comprehensive library management system built with Java Swing for GUI and MySQL for database management. Features include book issuing, return tracking, fine calculation, and user management.",
            technologies: ["Java", "Swing", "MySQL", "JDBC"],
            features: ["Book Management", "User Authentication", "Fine Calculation", "Search Functionality"],
            date: "2023",
            image: "Images/L.png",
            demoLink: "Videoes/Library.mp4",
            codeLink: "https://github.com/Adishiv9494/Library_Management_System",
            status: "completed",
            complexity: 3,
            featured: true
        },
        {
            id: 2,
            title: "Code Editor",
            description: "A web-based code editor with syntax highlighting for multiple programming languages. Features real-time preview, code formatting, and file management capabilities.",
            technologies: ["HTML5", "CSS3", "JavaScript", "Monaco Editor"],
            features: ["Syntax Highlighting", "Multiple Languages", "Real-time Preview", "File Management"],
            date: "2024",
            image: "Images/Code.png",
            demoLink: "Videoes/Code.mp4",
            codeLink: "https://github.com/Adishiv9494/CodeEditor",
            status: "completed",
            complexity: 2,
            featured: false
        },
        // {
        //     id: 3,
        //     title: "Calculator App",
        //     description: "A responsive calculator application with basic arithmetic operations, scientific functions, and memory features. Built with clean UI and keyboard support.",
        //     technologies: ["HTML5", "CSS3", "JavaScript", "Responsive Design"],
        //     features: ["Basic Operations", "Scientific Functions", "Memory Storage", "Keyboard Support"],
        //     date: "2023",
        //     image: "Images/Cal.png",
        //     demoLink: "Videoes/Calulator.mp4",
        //     codeLink: "https://github.com/Adishiv9494/Calculator",
        //     status: "completed",
        //     complexity: 1,
        //     featured: false
        // },
        {
            id: 4,
            title: "To-Do List Application",
            description: "A productivity application for managing daily tasks with features like priority setting, due dates, task categorization, and progress tracking.",
            technologies: ["HTML5", "CSS3", "JavaScript", "LocalStorage"],
            features: ["Task Management", "Priority Setting", "Due Dates", "Progress Tracking"],
            date: "2023",
            image: "Images/Todo.png",
            demoLink: "Videoes/Todo.mp4",
            codeLink: "https://github.com/Adishiv9494/TODO-List",
            status: "completed",
            complexity: 2,
            featured: false
        },
        // {
        //     id: 5,
        //     title: "Stop Watch Application",
        //     description: "A precise stopwatch with lap time tracking, countdown timer, and multiple display modes. Features include time formatting and export functionality.",
        //     technologies: ["HTML5", "CSS3", "JavaScript", "CSS Animations"],
        //     features: ["Lap Timing", "Countdown Timer", "Multiple Displays", "Time Export"],
        //     date: "2023",
        //     image: "Images/SWatch.jpg",
        //     demoLink: "Videoes/SWatch.mp4",
        //     codeLink: "https://github.com/Adishiv9494/Stop-Watch",
        //     status: "completed",
        //     complexity: 1,
        //     featured: false
        // },
        {
            id: 6,
            title: "Portfolio Website",
            description: "This responsive portfolio website showcasing skills, projects, and certifications. Features dark/light mode, animations, and contact form.",
            technologies: ["HTML5", "CSS3", "JavaScript", "Responsive Design"],
            features: ["Responsive Design", "Dark/Light Mode", "Animations", "Contact Form"],
            date: "2024",
            image: "Images/Port.png",
            demoLink: "Videoes/Port.mp4",
            codeLink: "https://github.com/Adishiv9494/Portfolio",
            status: "completed",
            complexity: 2,
            featured: true
        },
        {
            id: 7,
            title: "Job & Internship Portal Web Application",
            description: "A MERN stack Job and Internship Portal is a full-stack web application designed to bridge the gap between companies (Recruiters) and job seekers (Applicants).",
            technologies: ["React", "Express.js", "Node.js", "MongoDB", "Postman"],
            features: ["User Authentication", "Recruiter Dashboard", "Applicant Dashboard", "Advanced Filtering"],
            date: "Oct 2023 - Mar 2024",
            image: "Images/Job.jpg",
            demoLink: "Videoes/J.mp4",
            codeLink: "https://github.com/Adishiv9494/Job_Portal",
            status: "completed",
            complexity: 3,
            featured: true
        },
        {
            id: 8,
            title: "Weather Web Application",
            description: "This Weather Web Application is a dynamic and interactive front-end project that provides real-time weather information for any location worldwide.",
            technologies: ["HTML", "CSS", "JavaScript", "Weather API"],
            features: ["API Integration", "Search Functionality", "Responsive Design", "Dynamic DOM Updates"],
            date: "Dec 2022",
            image: "Images/Weather.png",
            demoLink: "Videoes/Weather.mp4",
            codeLink: "https://github.com/Adishiv9494/weather",
            status: "completed",
            complexity: 2,
            featured: false
        }
    ];

    const projectsGrid = document.getElementById('projectsGrid');
    const projectsTotal = document.getElementById('projectsTotal');
    
    if (!projectsGrid) return;
    
    // Update total counts
    if (projectsTotal) projectsTotal.textContent = projectsData.length;
    
    // Clear container
    projectsGrid.innerHTML = '';
    
    // Create project cards
    projectsData.forEach((project, index) => {
        const isHidden = index >= 3;
        const projectCard = document.createElement('div');
        projectCard.className = `project-card ${isHidden ? 'hidden-project' : ''} ${project.featured ? 'featured' : ''}`;
        projectCard.setAttribute('data-id', project.id);
        projectCard.setAttribute('data-status', project.status);
        projectCard.setAttribute('data-complexity', project.complexity);
        
        // Create project card HTML
        projectCard.innerHTML = `
            ${project.featured ? '<div class="project-ribbon"><i class="fas fa-star"></i> Featured</div>' : ''}
            
            <div class="project-image">
                <img src="${project.image}" alt="${project.title}" loading="lazy">
                <div class="project-overlay">
                    <div class="overlay-content">
                        <h3>${project.title}</h3>
                        <p>${project.description.substring(0, 100)}...</p>
                        <div class="tech-stack">
                            ${project.technologies.map(tech => `<span>${tech}</span>`).join('')}
                        </div>
                    </div>
                </div>
                <span class="project-status ${project.status}">${project.status.charAt(0).toUpperCase() + project.status.slice(1)}</span>
            </div>
            
            <div class="project-info">
                <div class="project-header">
                    <h3>${project.title}</h3>
                    <span class="project-date">${project.date}</span>
                </div>
                <p class="project-description">${project.description}</p>
                <div class="project-features">
                    ${project.features.map(feature => `
                        <div class="feature">
                            <i class="fas fa-check-circle"></i>
                            <span>${feature}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="project-actions">
                    <button class="demo-btn live-demo-btn" data-video="${project.demoLink}" data-title="${project.title} Demo">
                        <i class="fas fa-external-link-alt"></i> Live Demo
                    </button>
                    <a href="${project.codeLink}" class="code-btn" target="_blank">
                        <i class="fab fa-github"></i> Source Code
                    </a>
                </div>
            </div>
        `;
        
        projectsGrid.appendChild(projectCard);
    });
    
    // Update showing count
    updateProjectsCount();
    
    // Setup event listeners
    setupEnhancedProjectsEvents();
}

function initProjectsViewMore() {
    // Load more projects button
    const loadMoreProjectsBtn = document.getElementById('loadMoreProjects');
    const showLessProjectsBtn = document.getElementById('showLessProjects');
    
    if (loadMoreProjectsBtn) {
        loadMoreProjectsBtn.addEventListener('click', loadMoreProjects);
    }
    
    if (showLessProjectsBtn) {
        showLessProjectsBtn.addEventListener('click', showLessProjects);
    }
}

function loadMoreProjects() {
    const hiddenProjects = document.querySelectorAll('.hidden-project');
    const loadMoreProjectsBtn = document.getElementById('loadMoreProjects');
    const showLessProjectsBtn = document.getElementById('showLessProjects');
    
    if (!hiddenProjects.length) return;
    
    // Show all hidden projects with staggered animation
    hiddenProjects.forEach((project, index) => {
        setTimeout(() => {
            project.classList.remove('hidden-project');
            project.style.opacity = '0';
            project.style.transform = 'translateY(30px)';
            
            // Trigger reflow
            project.offsetHeight;
            
            project.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            project.style.opacity = '1';
            project.style.transform = 'translateY(0)';
        }, index * 100);
    });
    
    // Update button visibility
    if (loadMoreProjectsBtn) loadMoreProjectsBtn.style.display = 'none';
    if (showLessProjectsBtn) showLessProjectsBtn.style.display = 'flex';
    
    // Update showing count
    updateProjectsCount();
    
    // Show success toast
    showToast('All projects loaded successfully!', 'success');
}

function showLessProjects() {
    const allProjects = document.querySelectorAll('.project-card');
    const loadMoreProjectsBtn = document.getElementById('loadMoreProjects');
    const showLessProjectsBtn = document.getElementById('showLessProjects');
    
    // Hide projects beyond first 3 with animation
    allProjects.forEach((project, index) => {
        if (index >= 3) {
            project.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            project.style.opacity = '0';
            project.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                project.classList.add('hidden-project');
                project.style.transition = '';
            }, 300);
        }
    });
    
    // Update button visibility
    if (loadMoreProjectsBtn) loadMoreProjectsBtn.style.display = 'flex';
    if (showLessProjectsBtn) showLessProjectsBtn.style.display = 'none';
    
    // Update showing count
    updateProjectsCount();
    
    // Show info toast
    showToast('Showing first 3 projects', 'info');
}

function updateProjectsCount() {
    const hiddenProjects = document.querySelectorAll('.hidden-project');
    const showingProjectsSpan = document.getElementById('showingProjects');
    const projectsTotalSpan = document.getElementById('projectsTotal');
    const loadMoreProjectsBtn = document.getElementById('loadMoreProjects');
    
    if (showingProjectsSpan && projectsTotalSpan) {
        const totalVisibleProjects = document.querySelectorAll('.project-card').length;
        const hiddenCount = hiddenProjects.length;
        const showingCount = totalVisibleProjects - hiddenCount;
        
        showingProjectsSpan.textContent = showingCount;
        projectsTotalSpan.textContent = totalVisibleProjects;
        
        // Update load more button text
        if (loadMoreProjectsBtn && hiddenCount > 0) {
            const loadMoreText = loadMoreProjectsBtn.querySelector('span');
            if (loadMoreText) {
                loadMoreText.textContent = `View More Projects (${hiddenCount} remaining)`;
            }
        }
    }
    
    // Update footer stats
    updateFooterStats();
}

function setupEnhancedProjectsEvents() {
    // View project demo buttons
    const demoButtons = document.querySelectorAll('.live-demo-btn');
    demoButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const videoSrc = btn.getAttribute('data-video');
            const title = btn.getAttribute('data-title');
            
            if (videoSrc && videoSrc.endsWith('.mp4')) {
                // Open video modal
                const videoModal = document.getElementById('videoModal');
                const videoTitle = document.getElementById('videoTitle');
                const projectVideo = document.getElementById('projectVideo');
                
                if (videoModal && videoTitle && projectVideo) {
                    videoTitle.textContent = title;
                    projectVideo.src = videoSrc;
                    videoModal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            } else {
                // Open link in new tab
                window.open(videoSrc, '_blank');
            }
        });
    });
    
    // Code buttons already have target="_blank"
}

// ===== Project Video Modal =====
function initProjectVideoModal() {
    const videoModal = document.getElementById('videoModal');
    const videoTitle = document.getElementById('videoTitle');
    const projectVideo = document.getElementById('projectVideo');
    const videoClose = document.getElementById('videoClose');
    
    if (!videoModal || !projectVideo) return;
    
    // Close video modal
    if (videoClose) {
        videoClose.addEventListener('click', () => {
            videoModal.classList.remove('active');
            document.body.style.overflow = 'auto';
            if (projectVideo) {
                projectVideo.pause();
                projectVideo.currentTime = 0;
            }
        });
    }
    
    // Close modal on outside click
    videoModal.addEventListener('click', (e) => {
        if (e.target === videoModal) {
            videoModal.classList.remove('active');
            document.body.style.overflow = 'auto';
            if (projectVideo) {
                projectVideo.pause();
                projectVideo.currentTime = 0;
            }
        }
    });
}

// ===== Image Preview Functions =====
function initImagePreviews() {
    const profileImageWrapper = document.getElementById('profile-image-wrapper');
    const aboutImageWrapper = document.getElementById('about-image-wrapper');
    const imageModal = document.getElementById('imagePreviewModal');
    const previewImage = document.getElementById('previewImage');
    const imageModalClose = document.getElementById('imageModalClose');
    
    if (profileImageWrapper) {
        profileImageWrapper.addEventListener('click', () => {
            const imgSrc = profileImageWrapper.querySelector('img').src;
            previewImage.src = imgSrc;
            document.getElementById('imageModalTitle').textContent = 'Profile Photo';
            imageModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    if (aboutImageWrapper) {
        aboutImageWrapper.addEventListener('click', () => {
            const imgSrc = aboutImageWrapper.querySelector('img').src;
            previewImage.src = imgSrc;
            document.getElementById('imageModalTitle').textContent = 'About Photo';
            imageModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    if (imageModalClose) {
        imageModalClose.addEventListener('click', () => {
            imageModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    }
    
    if (imageModal) {
        imageModal.addEventListener('click', (e) => {
            if (e.target === imageModal) {
                imageModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }
}

// ===== QR Code Modal Functions =====
function initQRCodeModals() {
    const qrModal = document.getElementById('qrModal');
    const qrModalClose = document.getElementById('qrModalClose');
    const closeQrModal = document.getElementById('closeQrModal');
    const modalQrImage = document.getElementById('modalQrImage');
    const modalQrMessage = document.getElementById('modalQrMessage');
    const qrModalTitle = document.getElementById('qrModalTitle');
    const downloadQrBtn = document.getElementById('downloadQr');
    const qrCodeWrappers = document.querySelectorAll('.qr-code-wrapper');
    const scanGuideBtns = document.querySelectorAll('.scan-guide-btn');
    
    // Open QR Modal on QR code click
    qrCodeWrappers.forEach(wrapper => {
        wrapper.addEventListener('click', (e) => {
            e.preventDefault();
            const qrImage = wrapper.querySelector('.qr-code-image');
            const qrCard = wrapper.closest('.qr-card');
            const qrTitle = qrCard.querySelector('h3').textContent;
            
            if (qrImage && modalQrImage) {
                modalQrImage.src = qrImage.src;
                modalQrMessage.textContent = `Scan this QR code to connect via ${qrTitle}`;
                qrModalTitle.textContent = `${qrTitle} QR Code`;
                qrModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    // Close QR Modal
    const closeQRModal = () => {
        qrModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    };
    
    if (qrModalClose) qrModalClose.addEventListener('click', closeQRModal);
    if (closeQrModal) closeQrModal.addEventListener('click', closeQRModal);
    
    // Download QR Code
    if (downloadQrBtn) {
        downloadQrBtn.addEventListener('click', () => {
            const link = document.createElement('a');
            link.href = modalQrImage.src;
            link.download = 'qr-code.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            showToast('QR code downloaded successfully!', 'success');
        });
    }
    
    // Close modal on outside click
    if (qrModal) {
        qrModal.addEventListener('click', (e) => {
            if (e.target === qrModal) closeQRModal();
        });
    }
    
    // Scan guide buttons
    scanGuideBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const type = btn.getAttribute('data-type');
            let message = '';
            
            switch(type) {
                case 'whatsapp':
                    message = 'Open your phone\'s camera app and point it at the QR code. Tap the notification to start a chat on WhatsApp.';
                    break;
                case 'email':
                    message = 'Scan the QR code with your phone\'s camera. Your email app will open with my address pre-filled.';
                    break;
                case 'phone':
                    message = 'Use your phone\'s camera to scan the QR code. Your phone will prompt you to call the number.';
                    break;
                case 'instagram':
                    message = 'Scan with Instagram camera or your phone\'s camera app to open my Instagram profile directly.';
                    break;
                default:
                    message = 'Open your phone\'s camera app and point it at the QR code. Follow the on-screen instructions.';
            }
            
            if (typeof swal === 'function') {
                swal({
                    title: `How to Scan ${type.charAt(0).toUpperCase() + type.slice(1)} QR Code`,
                    text: message,
                    icon: 'info',
                    button: 'Got it!'
                });
            } else {
                showToast(message, 'info');
            }
        });
    });
}

// ===== Contact Form Functions =====
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const messageTextarea = document.getElementById('message');
    const charCount = document.getElementById('charCount');
    
    if (!contactForm) return;
    
    // Character counter for message
    if (messageTextarea && charCount) {
        messageTextarea.addEventListener('input', () => {
            const length = messageTextarea.value.length;
            charCount.textContent = length;
            
            if (length > 500) {
                charCount.style.color = '#ef4444';
                messageTextarea.value = messageTextarea.value.substring(0, 500);
            } else if (length > 400) {
                charCount.style.color = '#f59e0b';
            } else {
                charCount.style.color = 'var(--text-secondary)';
            }
        });
    }
    
    // Form submission
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('.btn-submit');
        const loader = submitBtn.querySelector('.submit-loader');
        const btnText = submitBtn.querySelector('span');
        const originalText = btnText.textContent;
        
        // Show loading state
        submitBtn.disabled = true;
        btnText.textContent = 'Sending...';
        loader.style.display = 'flex';
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Show success message
        showToast('Message sent successfully! I\'ll get back to you soon.', 'success');
        
        // Reset form
        contactForm.reset();
        if (charCount) charCount.textContent = '0';
        
        // Reset button state
        submitBtn.disabled = false;
        btnText.textContent = originalText;
        loader.style.display = 'none';
    });
}

// ===== Newsletter Functions =====
function initNewsletter() {
    const newsletterBtn = document.getElementById('newsletterBtn');
    const newsletterEmail = document.getElementById('newsletterEmail');
    
    if (!newsletterBtn || !newsletterEmail) return;
    
    newsletterBtn.addEventListener('click', () => {
        const email = newsletterEmail.value.trim();
        
        if (!email) {
            showToast('Please enter your email address', 'error');
            return;
        }
        
        if (!validateEmail(email)) {
            showToast('Please enter a valid email address', 'error');
            return;
        }
        
        // Show loading state
        const originalHTML = newsletterBtn.innerHTML;
        newsletterBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        newsletterBtn.disabled = true;
        
        // Simulate subscription
        setTimeout(() => {
            showToast('Successfully subscribed to newsletter!', 'success');
            newsletterEmail.value = '';
            newsletterBtn.innerHTML = originalHTML;
            newsletterBtn.disabled = false;
        }, 1500);
    });
    
    // Allow Enter key to submit
    newsletterEmail.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            newsletterBtn.click();
        }
    });
}

// ===== Resume Download Function =====
function initResumeDownload() {
    const resumeBtn = document.getElementById('resumeBtn');
    
    if (resumeBtn) {
        resumeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Show downloading toast
            showToast('Starting resume download...', 'info');
            
            try {
                // Create a temporary anchor element to trigger download
                const link = document.createElement('a');
                link.href = 'Aditya_Resume.pdf'; // Make sure this filename matches your actual file
                link.download = 'Aditya_Singh_Resume.pdf';
                link.style.display = 'none';
                document.body.appendChild(link);
                
                // Trigger click
                link.click();
                
                // Clean up
                setTimeout(() => {
                    document.body.removeChild(link);
                    showToast('Resume downloaded successfully!', 'success');
                }, 100);
                
            } catch (error) {
                console.error('Error downloading resume:', error);
                showToast('Failed to download resume. Please try again.', 'error');
                
                // Fallback: open in new tab
                setTimeout(() => {
                    window.open('Aditya_Resume.pdf', '_blank');
                }, 500);
            }
        });
    }
}

// ===== Modal Close Functions =====
function initModalClosures() {
    // Certificate modal
    const certModal = document.getElementById('certificateModal');
    const certModalClose = document.getElementById('modalClose');
    
    if (certModal && certModalClose) {
        certModalClose.addEventListener('click', () => {
            certModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
        
        certModal.addEventListener('click', (e) => {
            if (e.target === certModal) {
                certModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }
    
    // Video modal
    const videoModal = document.getElementById('videoModal');
    const videoClose = document.getElementById('videoClose');
    const projectVideo = document.getElementById('projectVideo');
    
    if (videoModal && videoClose) {
        videoClose.addEventListener('click', () => {
            videoModal.classList.remove('active');
            document.body.style.overflow = 'auto';
            if (projectVideo) projectVideo.pause();
        });
        
        videoModal.addEventListener('click', (e) => {
            if (e.target === videoModal) {
                videoModal.classList.remove('active');
                document.body.style.overflow = 'auto';
                if (projectVideo) projectVideo.pause();
            }
        });
    }
}

// ===== Toast Notification Function =====
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = toast.querySelector('.toast-message');
    const toastIcon = toast.querySelector('i');
    const toastProgress = toast.querySelector('.toast-progress');
    
    if (!toast || !toastMessage) return;
    
    // Set message and icon
    toastMessage.textContent = message;
    
    // Set icon and color based on type
    if (type === 'success') {
        toastIcon.className = 'fas fa-check-circle';
        toast.style.borderLeftColor = '#10b981';
    } else if (type === 'error') {
        toastIcon.className = 'fas fa-exclamation-circle';
        toast.style.borderLeftColor = '#ef4444';
    } else if (type === 'warning') {
        toastIcon.className = 'fas fa-exclamation-triangle';
        toast.style.borderLeftColor = '#f59e0b';
    } else {
        toastIcon.className = 'fas fa-info-circle';
        toast.style.borderLeftColor = '#3b82f6';
    }
    
    // Reset and show toast
    if (toastProgress) {
        toastProgress.style.width = '100%';
        toastProgress.style.transition = 'none';
        void toastProgress.offsetWidth; // Trigger reflow
        toastProgress.style.transition = 'width 3s linear';
        toastProgress.style.width = '0%';
    }
    
    toast.classList.add('show');
    
    // Hide toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ===== Utility Functions =====
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function updateAllCounters() {
    updateStatsCounter();
    updateTotalCounts();
    updateShowingCounts();
    updateFooterStats();
    updateEnhancedCounts();
    updateProjectsCount();
}

// ===== Initialize Everything =====
function initializeAll() {
    // Initialize core functionalities
    initLoader();
    initTheme();
    initTyping();
    initMobileNav();
    initSmoothScroll();
    initBackToTop();
    
    // Load data
    loadSkillsData();
    initEnhancedProjects(); // Updated to use enhanced projects
    initEnhancedCertifications();
    
    // Initialize interactive elements
    initImagePreviews();
    initQRCodeModals();
    initContactForm();
    initNewsletter();
    initResumeDownload();
    initModalClosures();
    initEducationAnimation();
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + T to toggle theme
        if ((e.ctrlKey || e.metaKey) && e.key === 't') {
            e.preventDefault();
            document.getElementById('theme-toggle')?.click();
        }
        
        // Escape to close modals
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal.active');
            if (activeModal) {
                activeModal.classList.remove('active');
                document.body.style.overflow = 'auto';
                // Pause video if it's playing
                const video = document.getElementById('projectVideo');
                if (video) {
                    video.pause();
                    video.currentTime = 0;
                }
            }
        }
    });
    
    // Initialize animations after a short delay
    setTimeout(() => {
        initAllAnimations();
    }, 100);
}

// ===== DOM Ready =====
document.addEventListener('DOMContentLoaded', initializeAll);

// ===== Window Load =====
window.addEventListener('load', () => {
    // Final optimizations after everything is loaded
    document.body.classList.add('fully-loaded');
    
    // Update counters one more time to ensure accuracy
    setTimeout(() => {
        updateAllCounters();
    }, 500);
});

// ===== Error Handling =====
window.addEventListener('error', (e) => {
    console.error('Error occurred:', e.error);
    
    // Graceful degradation for critical errors
    if (e.error && e.error.message && e.error.message.includes('Typed')) {
        const typingElement = document.querySelector('.typing-text');
        if (typingElement) {
            typingElement.textContent = 'Full Stack Developer';
        }
    }
});

// Make functions globally available for onclick attributes
window.downloadEnhancedCertificate = downloadEnhancedCertificate;
window.viewEnhancedCertificate = viewEnhancedCertificate;
window.loadMoreEnhancedCertificates = loadMoreEnhancedCertificates;
window.showLessEnhancedCertificates = showLessEnhancedCertificates;
window.downloadCurrentCertificate = downloadCurrentCertificate;
window.showToast = showToast;
window.loadMoreProjects = loadMoreProjects;
window.showLessProjects = showLessProjects;