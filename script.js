// ================================================================
// 1. LOADER
// ================================================================
(function initLoader() {
    const loader = document.getElementById('loader');
    const pageContent = document.getElementById('page-content');
    const progressFill = document.querySelector('.progress-fill');
    const progressPercentage = document.querySelector('.progress-percentage');
    const techItems = document.querySelectorAll('.tech-item');

    if (!loader || !pageContent) return;

    const loaderShown = sessionStorage.getItem('loaderShown');

    function finishLoading() {
        loader.classList.add('hidden-loader');
        setTimeout(function() {
            loader.classList.add('hidden-loader-final');
            pageContent.classList.add('visible');
            document.body.style.overflow = 'auto';
            sessionStorage.setItem('loaderShown', 'true');
            setTimeout(function() { initAll(); }, 100);
        }, 600);
    }

    if (loaderShown) {
        loader.classList.add('hidden-loader-final');
        pageContent.classList.add('visible');
        document.body.style.overflow = 'auto';
        setTimeout(function() { initAll(); }, 100);
        return;
    }

    document.body.style.overflow = 'hidden';

    let progress = 0;
    const duration = 2000;
    const interval = 50;
    const increment = 100 / (duration / interval);

    techItems.forEach(function(item, index) {
        setTimeout(function() { item.classList.add('visible'); }, 200 + index * 150);
    });

    const updateProgress = setInterval(function() {
        progress += increment;
        const eased = Math.min(100, progress);
        if (progressFill) progressFill.style.width = eased + '%';
        if (progressPercentage) progressPercentage.textContent = Math.floor(eased) + '%';
        if (progress >= 100) {
            clearInterval(updateProgress);
            setTimeout(finishLoading, 300);
        }
    }, interval);
})();

// ================================================================
// 2. 5D BACKGROUND (Canvas Particle System)
// ================================================================
function init5DBackground() {
    const canvas = document.getElementById('bgCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width, height;
    let particles = [];
    const particleCount = 120;
    let mouseX = 0,
        mouseY = 0;
    let targetMouseX = 0,
        targetMouseY = 0;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.z = Math.random() * 200 - 100;
            this.size = Math.random() * 3 + 1;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
            this.opacity = Math.random() * 0.6 + 0.2;
            this.color = `hsla(${Math.random() * 60 + 210}, 80%, 60%, `;
        }
        update() {
            const depthFactor = this.z / 100;
            const parallaxX = (mouseX - width / 2) * 0.02 * depthFactor;
            const parallaxY = (mouseY - height / 2) * 0.02 * depthFactor;
            this.x += this.speedX + parallaxX * 0.1;
            this.y += this.speedY + parallaxY * 0.1;
            if (this.x < -50) this.x = width + 50;
            if (this.x > width + 50) this.x = -50;
            if (this.y < -50) this.y = height + 50;
            if (this.y > height + 50) this.y = -50;
        }
        draw() {
            const size = this.size + (this.z / 50);
            const opacity = this.opacity + (this.z / 200);
            ctx.beginPath();
            ctx.arc(this.x, this.y, Math.max(0.5, size), 0, Math.PI * 2);
            ctx.fillStyle = this.color + Math.min(1, Math.max(0.1, opacity)) + ')';
            ctx.fill();
            if (size > 2) {
                ctx.shadowColor = this.color + '0.3)';
                ctx.shadowBlur = 15;
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    document.addEventListener('mousemove', function(e) {
        targetMouseX = e.clientX;
        targetMouseY = e.clientY;
    });
    document.addEventListener('touchmove', function(e) {
        if (e.touches.length > 0) {
            targetMouseX = e.touches[0].clientX;
            targetMouseY = e.touches[0].clientY;
        }
    }, { passive: true });

    function animate() {
        mouseX += (targetMouseX - mouseX) * 0.05;
        mouseY += (targetMouseY - mouseY) * 0.05;
        ctx.clearRect(0, 0, width, height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dz = particles[i].z - particles[j].z;
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
                if (dist < 120) {
                    const opacity = (1 - dist / 120) * 0.3;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = 'rgba(100, 150, 255, ' + opacity + ')';
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }
    animate();
}

// ================================================================
// 3. THEME TOGGLE
// ================================================================
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;
    const saved = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-theme', saved);
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const current = html.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            html.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
        });
    }
}

// ================================================================
// 4. TYPING
// ================================================================
function initTyping() {
    const el = document.querySelector('.typing-text');
    if (!el) return;
    if (typeof Typed !== 'undefined') {
        new Typed('.typing-text', {
            strings: ['Full Stack Developer', 'Web Developer', 'Frontend Developer', 'Backend Developer',
                'Problem Solver'
            ],
            typeSpeed: 50,
            backSpeed: 30,
            backDelay: 1500,
            loop: true,
            showCursor: false,
            smartBackspace: true
        });
    } else {
        el.textContent = 'Full Stack Developer';
    }
}

// ================================================================
// 5. MOBILE NAV
// ================================================================
function initMobileNav() {
    const toggle = document.getElementById('mobile-toggle');
    const navbar = document.querySelector('.navbar');
    if (!toggle || !navbar) return;
    toggle.addEventListener('click', function() {
        toggle.classList.toggle('active');
        navbar.classList.toggle('active');
        document.body.style.overflow = navbar.classList.contains('active') ? 'hidden' : 'auto';
    });
    document.querySelectorAll('.nav-link').forEach(function(link) {
        link.addEventListener('click', function() {
            toggle.classList.remove('active');
            navbar.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });
}

// ================================================================
// 6. SMOOTH SCROLL
// ================================================================
function initSmoothScroll() {
    const links = document.querySelectorAll('.nav-link');
    const header = document.querySelector('.header');
    links.forEach(function(link) {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = document.getElementById(href.substring(1));
                if (target) {
                    const offset = header ? header.offsetHeight : 0;
                    window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
                    history.pushState(null, null, href);
                    links.forEach(function(l) { l.classList.remove('active'); });
                    this.classList.add('active');
                }
            }
        });
    });

    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;
        let current = '';
        sections.forEach(function(section) {
            const top = section.offsetTop - (header ? header.offsetHeight : 0);
            const height = section.offsetHeight;
            if (scrollPos >= top && scrollPos < top + height) {
                current = section.getAttribute('id');
            }
        });
        links.forEach(function(link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
}

// ================================================================
// 7. BACK TO TOP
// ================================================================
function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;
    window.addEventListener('scroll', function() {
        btn.classList.toggle('visible', window.scrollY > 300);
    });
    btn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ================================================================
// 8. STATS COUNTER
// ================================================================
function initStatsCounter() {
    document.querySelectorAll('.stat-number').forEach(function(stat) {
        const target = parseInt(stat.getAttribute('data-count')) || 0;
        if (target === 0) { stat.textContent = '0'; return; }
        const duration = 2000;
        const interval = 50;
        const increment = target / (duration / interval);
        let current = 0;
        const timer = setInterval(function() {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
                stat.textContent = Math.floor(current);
            } else {
                stat.textContent = Math.floor(current);
            }
        }, interval);
    });
}

// ================================================================
// 9. SKILLS DATA
// ================================================================
function loadSkillsData() {
    const data = {
        programming: [
            { skill: 'C', level: 75, desc: 'System Programming', icon: 'fas fa-terminal' },
            { skill: 'C++', level: 72, desc: 'OOP & Algorithms', icon: 'fas fa-cogs' },
            { skill: 'Java', level: 78, desc: 'Enterprise Applications', icon: 'fab fa-java' },
            { skill: 'Python', level: 75, desc: 'Scripting & Automation', icon: 'fab fa-python' },
            { skill: 'JavaScript', level: 85, desc: 'ES6+ & DOM', icon: 'fab fa-js' }
        ],
        frontend: [
            { skill: 'HTML5', level: 95, desc: 'Semantic Markup', icon: 'fab fa-html5' },
            { skill: 'CSS3', level: 90, desc: 'Styling & Layouts', icon: 'fab fa-css3-alt' },
            { skill: 'React', level: 80, desc: 'Components & Hooks', icon: 'fab fa-react' },
            { skill: 'JSP', level: 85, desc: 'Dynamic Web Pages', icon: 'fas fa-file-code' },
            { skill: 'Bootstrap', level: 85, desc: 'Responsive Design', icon: 'fab fa-bootstrap' }
        ],
        backend: [
            { skill: 'Node.js', level: 82, desc: 'Runtime & APIs', icon: 'fab fa-node-js' },
            { skill: 'MySQL', level: 80, desc: 'Database Management', icon: 'fas fa-database' },
            { skill: 'MongoDB', level: 70, desc: 'NoSQL Database', icon: 'fas fa-leaf' },
            { skill: 'Express.js', level: 78, desc: 'Web Framework', icon: 'fas fa-rocket' },
            { skill: 'Servlet', level: 83, desc: 'Java Web Components', icon: 'fas fa-cogs' }
        ],
        tools: [
            { skill: 'Git', level: 88, desc: 'Version Control', icon: 'fab fa-git-alt' },
            { skill: 'GitHub', level: 90, desc: 'Code Hosting', icon: 'fab fa-github' },
            { skill: 'VS Code', level: 92, desc: 'Code Editor', icon: 'fas fa-code' },
            { skill: 'IntelliJ', level: 80, desc: 'Java IDE', icon: 'fas fa-lightbulb' },
            { skill: 'Eclipse', level: 75, desc: 'Development IDE', icon: 'fas fa-sun' }
        ]
    };

    const render = function(gridId, items) {
        const grid = document.getElementById(gridId);
        if (!grid) return;
        grid.innerHTML = items.map(function(item) {
            return '<div class="skill-icon-card animate-on-scroll" data-skill="' + item.skill +
                '" data-level="' + item.level + '">' +
                '<div class="skill-icon-wrapper"><div class="skill-icon-bg"><i class="' + item.icon +
                '"></i></div></div>' +
                '<div class="skill-info"><h4 class="skill-name">' + item.skill +
                '</h4><p class="skill-description">' + item.desc + '</p></div>' +
                '</div>';
        }).join('');
    };

    render('programmingGrid', data.programming);
    render('frontendGrid', data.frontend);
    render('backendGrid', data.backend);
    render('toolsGrid', data.tools);
}

// ================================================================
// 10. CERTIFICATIONS
// ================================================================
function loadCertifications() {
    const certs = [
        { id: 1, title: 'Programming in Python', issuer: 'Dibrugarh University Conducted by NPTEL',
            date: 'Dec 2023',
            description: 'Successfully completed the 4-credit course in December 2023 with an excellent consolidated score of 84%, demonstrating strong proficiency in Python programming fundamentals through online assignments and a proctored exam.',
            skills: ['Python Syntax', 'Data Types', 'Control Structures', 'Functions', 'OOP Principles',
                'File Handling'
            ], score: 84, category: 'technical', featured: true, icon: 'fab fa-python',
            image: 'Certificates/Py.png', download: 'Certificates/Python.pdf', fileType: 'pdf' },
        { id: 2, title: 'Getting Started with Enterprise Data Science', issuer: 'IBM', date: 'Jun 2024',
            description: 'Earned this IBM credential in June 2024, validating foundational knowledge and commitment to understanding cloud solution design principles and their business application.',
            skills: ['Cloud Computing', 'IaaS/PaaS/SaaS', 'Cloud Deployment', 'Business Solutions'],
            score: 100, category: 'professional', featured: true, icon: 'fas fa-chart-line',
            image: 'Certificates/ibm2.png', download: 'Certificates/ibm2.png', fileType: 'png' },
        { id: 3, title: 'Programming in Java', issuer: 'IIT Kharagpur Conducted by NPTEL',
            date: 'Dec 2024',
            description: 'Concluded this 12-week Java programming course in Jul-Oct 2024 with a consolidated score of 64% with "Elite Batch", showcasing strong practical skills through assignments and exams certified by IIT Kharagpur.',
            skills: ['Java Syntax', 'OOP Concepts', 'Exception Handling', 'Multithreading',
                'Collections Framework'
            ], score: 64, category: 'technical', featured: false, icon: 'fab fa-java',
            image: 'Certificates/Java.png', download: 'Certificates/Programming in Java.pdf',
            fileType: 'pdf' },
        { id: 4, title: 'Database Management System', issuer: 'IIT Kharagpur Conducted by NPTEL',
            date: 'Nov 2024',
            description: 'Completed this 8-week core course in the Jul-Sep 2024 session with a consolidated score of 56%, covering fundamental DBMS concepts and practices certified by IIT Kharagpur.',
            skills: ['Database Systems', 'ER Modeling', 'Relational Model', 'SQL', 'Normalization'],
            score: 56, category: 'technical', featured: false, icon: 'fas fa-database',
            image: 'Certificates/DBMS.png', download: 'Certificates/Data Base Management System (1).pdf',
            fileType: 'pdf' },
        { id: 5, title: 'Data Structure & Algorithms Using Java',
            issuer: 'IIT Kharagpur Conducted by NPTEL', date: 'Dec 2024',
            description: 'Completed this 8-week core course in the Jul-Oct 2024 session with a consolidated score of 61% with "Elite Batch", covering fundamental DBMS concepts and practices certified by IIT Kharagpur.',
            skills: ['Data Structures', 'Algorithms', 'Time Complexity', 'Space Complexity',
                'Java Implementation'
            ], score: 61, category: 'technical', featured: false, icon: 'fas fa-sitemap',
            image: 'Certificates/DSA.png',
            download: 'Certificates/Data Structure and Algorithms using Java.pdf', fileType: 'pdf' },
        { id: 6, title: 'Journey to Cloud Envisioning Your Solution', issuer: 'IBM', date: 'Jun 2024',
            description: 'Achieved in June 2024, this IBM badge signifies the acquisition of essential concepts for applying data science methodologies within an enterprise environment.',
            skills: ['Data Science Lifecycle', 'Enterprise Context', 'Data Governance', 'Model Management'],
            score: 100, category: 'professional', featured: true, icon: 'fas fa-cloud',
            image: 'Certificates/ibm.png', download: 'Certificates/ibm.png', fileType: 'png' },
        { id: 7, title: 'Frontend Web Development', issuer: 'Lakshya IT Solution', date: 'Dec 2023',
            description: 'Successfully completed a Frontend Web Development certification course, significantly enhancing skills in HTML5, CSS3, and JavaScript. Through hands-on projects, mastered modern techniques like responsive design, CSS animations, and API integration.',
            skills: ['HTML5', 'CSS3', 'JavaScript', 'Responsive Design', 'CSS Animations',
                'API Integration'
            ], score: 100, category: 'technical', featured: true, icon: 'fas fa-laptop-code',
            image: 'Certificates/Front.jpg', download: 'Certificates/Front.jpg', fileType: 'jpg' },
        { id: 8, title: 'Industrial Training Institute (ITI)',
            issuer: 'Ministry of Skill Development and Entrepreneurship', date: 'Aug 2017',
            description: 'Upon completing the ITI COPA trade, gained comprehensive proficiency in computer fundamentals and troubleshooting, and operating systems. Developed strong skills in office productivity software.',
            skills: ['Computer Fundamentals', 'Troubleshooting', 'MS Office', 'C/C++ Programming',
                'HTML/CSS', 'Database Concepts'
            ], score: 100, category: 'university', featured: false, icon: 'fas fa-graduation-cap',
            image: 'Certificates/ITI.png', download: 'Certificates/ITI.png', fileType: 'png' },
        { id: 9, title: 'AWS Cloud Practitioner Essentials', issuer: 'Amazon Web Services (AWS)',
            date: 'Sep 2025',
            description: 'Achieved in September 2025, this AWS certificate validates a foundational understanding of Amazon Web Services cloud concepts and services.',
            skills: ['AWS Services', 'Cloud Security', 'Billing & Pricing', 'Cloud Economics',
                'AWS Navigation'
            ], score: 100, category: 'professional', featured: true, icon: 'fab fa-aws',
            image: 'Certificates/AW.png', download: 'Certificates/AWS.pdf', fileType: 'pdf' },
        { id: 10, title: 'Apprenticeship in HPCL', issuer: 'Ministry of Skill Development and Entrepreneurship',
            date: 'Jan 2019',
            description: 'Successfully completed the COPA Trade Apprenticeship Certificate Course, a government-recognized program certified by NCVT.',
            skills: ['Computer Operations', 'Software Installation', 'Python/C++ Programming',
                'Database Management', 'Networking'
            ], score: 100, category: 'professional', featured: false, icon: 'fas fa-briefcase',
            image: 'Certificates/App.png', download: 'Certificates/Apprenticeship_Certificate.pdf',
            fileType: 'pdf' }
    ];

    const grid = document.getElementById('certificationsGrid');
    const totalCerts = document.getElementById('totalCerts');
    const certTotal = document.getElementById('certTotal');
    if (!grid) return;
    if (totalCerts) totalCerts.textContent = certs.length;
    if (certTotal) certTotal.textContent = certs.length;

    grid.innerHTML = '';
    certs.forEach(function(cert, index) {
        const hidden = index >= 3;
        const scoreClass = cert.score >= 90 ? 'high-score' : (cert.score < 70 ? 'low-score' :
        'medium-score');
        const card = document.createElement('div');
        card.className = 'cert-card' + (hidden ? ' hidden-cert' : '') + (cert.featured ? ' featured' :
        '');
        card.setAttribute('data-id', cert.id);
        card.setAttribute('data-category', cert.category);
        card.setAttribute('data-score', cert.score);
        card.innerHTML =
            (cert.featured ? '<div class="cert-ribbon"><i class="fas fa-star"></i> Featured</div>' :
                '') +
            '<div class="cert-header">' +
            '<div class="cert-badge"><i class="' + cert.icon + '"></i></div>' +
            '<div class="cert-title-wrapper"><div class="cert-icon"><i class="' + cert.icon +
            '"></i></div><h3 class="cert-title">' + cert.title + '</h3></div>' +
            '<p class="cert-subtitle">' + cert.category.toUpperCase() + ' CERTIFICATION</p>' +
            '</div>' +
            '<div class="cert-image" onclick="viewCert(' + cert.id +
            ')"><img src="' + cert.image + '" alt="' + cert.title +
            '" loading="lazy" /><div class="cert-image-overlay"><button class="view-cert-btn" onclick="viewCert(' +
            cert.id + ')"><i class="fas fa-expand-alt"></i></button></div></div>' +
            '<div class="cert-content">' +
            '<div class="cert-meta"><div class="cert-issuer"><i class="fas fa-university"></i><span>' +
            cert.issuer + '</span></div><span class="cert-date">' + cert.date + '</span></div>' +
            '<div class="cert-description"><p>' + cert.description +
            '</p><div class="skills-gained"><div class="skills-title"><i class="fas fa-tools"></i><span>Skills Gained</span></div><div class="skills-list">' +
            cert.skills.map(function(s) { return '<span class="skill-tag">' + s + '</span>'; }).join(
                '') +
            '</div></div></div>' +
            '<div class="cert-score"><div class="score-header"><span class="score-label">Achievement Score</span><span class="score-value">' +
            cert.score + '%</span></div><div class="score-bar-container"><div class="score-bar-fill ' +
            scoreClass + '" style="width:' + cert.score + '%;"></div></div></div>' +
            '<div class="cert-actions"><button class="btn-view" onclick="viewCert(' + cert.id +
            ')"><i class="fas fa-eye"></i> View Certificate</button><button class="btn-download" onclick="downloadCert(' +
            cert.id + ', this)"><i class="fas fa-download"></i> Download</button></div>' +
            '</div>';
        grid.appendChild(card);
    });

    updateCertCounts();
    window._certsData = certs;
}

function updateCertCounts() {
    const hidden = document.querySelectorAll('.cert-card.hidden-cert');
    const showing = document.getElementById('showingCerts');
    const total = document.getElementById('totalCerts');
    const loadMore = document.getElementById('loadMoreCerts');
    if (showing && total) {
        const totalCerts = document.querySelectorAll('.cert-card').length;
        const showingCount = totalCerts - hidden.length;
        showing.textContent = showingCount;
        total.textContent = totalCerts;
        if (loadMore) {
            const span = loadMore.querySelector('span');
            if (span) span.textContent = hidden.length > 0 ? 'Load More (' + hidden.length +
                ' remaining)' : 'Load More Certificates';
        }
    }
}

function viewCert(id) {
    const card = document.querySelector('.cert-card[data-id="' + id + '"]');
    if (!card) return;
    const modal = document.getElementById('certificateModal');
    const title = document.getElementById('modalTitle');
    const img = document.getElementById('certificateImage');
    if (!modal || !title || !img) return;
    const certTitle = card.querySelector('.cert-title').textContent;
    const src = card.querySelector('.cert-image img').src;
    title.textContent = certTitle;
    img.src = src;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function downloadCert(id, btn) {
    const card = document.querySelector('.cert-card[data-id="' + id + '"]');
    if (!card) return;
    const src = card.querySelector('.cert-image img').src;
    const title = card.querySelector('.cert-title').textContent;
    const orig = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Downloading...';
    btn.disabled = true;
    const link = document.createElement('a');
    link.href = src;
    link.download = 'Certificate_' + title.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(function() {
        btn.innerHTML = orig;
        btn.disabled = false;
        showToast('"' + title + '" downloaded successfully!', 'success');
    }, 1000);
}

function initCertFilters() {
    document.querySelectorAll('.filter-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(function(b) { b.classList.remove(
                    'active'); });
            this.classList.add('active');
            const filter = this.getAttribute('data-filter');
            document.querySelectorAll('.cert-card').forEach(function(card) {
                const cat = card.getAttribute('data-category');
                const score = parseInt(card.getAttribute('data-score')) || 0;
                let show = true;
                if (filter === 'university') show = cat === 'university';
                else if (filter === 'professional') show = cat === 'professional';
                else if (filter === 'technical') show = cat === 'technical';
                else if (filter === 'top-rated') show = score >= 85;
                card.style.display = show ? 'flex' : 'none';
            });
            updateCertCounts();
        });
    });
}

function initCertControls() {
    document.getElementById('loadMoreCerts').addEventListener('click', function() {
        const hidden = document.querySelectorAll('.cert-card.hidden-cert');
        if (!hidden.length) return;
        hidden.forEach(function(card, i) {
            setTimeout(function() {
                card.classList.remove('hidden-cert');
                card.style.display = 'flex';
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px)';
                card.offsetHeight;
                card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, i * 100);
        });
        this.style.display = 'none';
        document.getElementById('showLessCerts').style.display = 'inline-flex';
        updateCertCounts();
        showToast('All certificates loaded successfully!', 'success');
    });

    document.getElementById('showLessCerts').addEventListener('click', function() {
        const all = document.querySelectorAll('.cert-card');
        all.forEach(function(card, i) {
            if (i >= 3) {
                card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(function() {
                    card.classList.add('hidden-cert');
                    card.style.display = 'none';
                    card.style.transition = '';
                }, 300);
            }
        });
        this.style.display = 'none';
        document.getElementById('loadMoreCerts').style.display = 'inline-flex';
        updateCertCounts();
        showToast('Showing first 3 certificates', 'info');
    });
}

// ================================================================
// 11. PROJECTS
// ================================================================
function loadProjects() {
    const projects = [{
        id: 1,
        title: 'Library Management System',
        description: 'A comprehensive library management system built with Java Swing for GUI and MySQL for database management. Features include book issuing, return tracking, fine calculation, and user management.',
        technologies: ['Java', 'Swing', 'MySQL', 'JDBC'],
        features: ['Book Management', 'User Authentication', 'Fine Calculation', 'Search Functionality'],
        date: '2023',
        image: 'Images/L.png',
        demoLink: 'Videoes/Library.mp4',
        codeLink: 'https://github.com/Adishiv9494/Library_Management_System',
        status: 'completed',
        complexity: 3,
        featured: true
    }, {
        id: 2,
        title: 'Code Editor',
        description: 'A web-based code editor with syntax highlighting for multiple programming languages. Features real-time preview, code formatting, and file management capabilities.',
        technologies: ['HTML5', 'CSS3', 'JavaScript', 'Monaco Editor'],
        features: ['Syntax Highlighting', 'Multiple Languages', 'Real-time Preview', 'File Management'],
        date: '2024',
        image: 'Images/Code.png',
        demoLink: 'Videoes/Code.mp4',
        codeLink: 'https://github.com/Adishiv9494/CodeEditor',
        status: 'completed',
        complexity: 2,
        featured: false
    }, {
        id: 3,
        title: 'To-Do List Application',
        description: 'A productivity application for managing daily tasks with features like priority setting, due dates, task categorization, and progress tracking.',
        technologies: ['HTML5', 'CSS3', 'JavaScript', 'LocalStorage'],
        features: ['Task Management', 'Priority Setting', 'Due Dates', 'Progress Tracking'],
        date: '2023',
        image: 'Images/Todo.png',
        demoLink: 'Videoes/Todo.mp4',
        codeLink: 'https://github.com/Adishiv9494/TODO-List',
        status: 'completed',
        complexity: 2,
        featured: false
    }, {
        id: 4,
        title: 'Portfolio Website',
        description: 'This responsive portfolio website showcasing skills, projects, and certifications. Features dark/light mode, animations, and contact form.',
        technologies: ['HTML5', 'CSS3', 'JavaScript', 'Responsive Design'],
        features: ['Responsive Design', 'Dark/Light Mode', 'Animations', 'Contact Form'],
        date: '2024',
        image: 'Images/Port.png',
        demoLink: 'Videoes/Port.mp4',
        codeLink: 'https://github.com/Adishiv9494/Portfolio',
        status: 'completed',
        complexity: 2,
        featured: true
    }, {
        id: 5,
        title: 'Job & Internship Portal Web Application',
        description: 'A MERN stack Job and Internship Portal is a full-stack web application designed to bridge the gap between companies (Recruiters) and job seekers (Applicants).',
        technologies: ['React', 'Express.js', 'Node.js', 'MongoDB', 'Postman'],
        features: ['User Authentication', 'Recruiter Dashboard', 'Applicant Dashboard',
            'Advanced Filtering'
        ],
        date: 'Oct 2023 - Mar 2024',
        image: 'Images/Job.jpg',
        demoLink: 'Videoes/J.mp4',
        codeLink: 'https://github.com/Adishiv9494/Job_Portal',
        status: 'completed',
        complexity: 3,
        featured: true
    }, {
        id: 6,
        title: 'Weather Web Application',
        description: 'This Weather Web Application is a dynamic and interactive front-end project that provides real-time weather information for any location worldwide.',
        technologies: ['HTML', 'CSS', 'JavaScript', 'Weather API'],
        features: ['API Integration', 'Search Functionality', 'Responsive Design', 'Dynamic DOM Updates'],
        date: 'Dec 2022',
        image: 'Images/Weather.png',
        demoLink: 'Videoes/Weather.mp4',
        codeLink: 'https://github.com/Adishiv9494/weather',
        status: 'completed',
        complexity: 2,
        featured: false
    }];

    const grid = document.getElementById('projectsGrid');
    const total = document.getElementById('projectsTotal');
    if (!grid) return;
    if (total) total.textContent = projects.length;

    grid.innerHTML = '';
    projects.forEach(function(proj, index) {
        const hidden = index >= 3;
        const card = document.createElement('div');
        card.className = 'project-card' + (hidden ? ' hidden-project' : '') + (proj.featured ?
            ' featured' : '');
        card.setAttribute('data-id', proj.id);
        card.innerHTML =
            (proj.featured ? '<div class="project-ribbon"><i class="fas fa-star"></i> Featured</div>' :
                '') +
            '<div class="project-image"><img src="' + proj.image + '" alt="' + proj.title +
            '" loading="lazy" />' +
            '<div class="project-overlay"><div class="overlay-content"><h3>' + proj.title +
            '</h3><p>' + proj.description.substring(0, 100) + '...</p><div class="tech-stack">' +
            proj.technologies.map(function(t) { return '<span>' + t + '</span>'; }).join('') +
            '</div></div></div>' +
            '<span class="project-status ' + proj.status + '">' + proj.status.charAt(0).toUpperCase() +
            proj.status.slice(1) + '</span></div>' +
            '<div class="project-info"><div class="project-header"><h3>' + proj.title +
            '</h3><span class="project-date">' + proj.date + '</span></div>' +
            '<p class="project-description">' + proj.description + '</p>' +
            '<div class="project-features">' + proj.features.map(function(f) {
                return '<div class="feature"><i class="fas fa-check-circle"></i><span>' + f +
                    '</span></div>';
            }).join('') + '</div>' +
            '<div class="project-actions"><button class="demo-btn live-demo-btn" data-video="' +
            proj.demoLink + '" data-title="' + proj.title +
            ' Demo"><i class="fas fa-external-link-alt"></i> Live Demo</button>' +
            '<a href="' + proj.codeLink +
            '" class="code-btn" target="_blank"><i class="fab fa-github"></i> Source Code</a></div>' +
            '</div>';
        grid.appendChild(card);
    });

    window._projectsData = projects;
    updateProjectCounts();

    document.querySelectorAll('.live-demo-btn').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const video = this.getAttribute('data-video');
            const title = this.getAttribute('data-title');
            if (video && video.endsWith('.mp4')) {
                const modal = document.getElementById('videoModal');
                const vTitle = document.getElementById('videoTitle');
                const player = document.getElementById('projectVideo');
                if (modal && vTitle && player) {
                    vTitle.textContent = title;
                    player.src = video;
                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                    player.load();
                    player.play().catch(function() {});
                }
            } else if (video) {
                window.open(video, '_blank');
            }
        });
    });
}

function updateProjectCounts() {
    const hidden = document.querySelectorAll('.project-card.hidden-project');
    const showing = document.getElementById('showingProjects');
    const total = document.getElementById('projectsTotal');
    const loadMore = document.getElementById('loadMoreProjects');
    if (showing && total) {
        const totalP = document.querySelectorAll('.project-card').length;
        const showingP = totalP - hidden.length;
        showing.textContent = showingP;
        total.textContent = totalP;
        if (loadMore) {
            const span = loadMore.querySelector('span');
            if (span) span.textContent = hidden.length > 0 ? 'View More Projects (' + hidden.length +
                ' remaining)' : 'View More Projects';
        }
    }
    const fp = document.getElementById('footerProjects');
    if (fp) fp.textContent = document.querySelectorAll('.project-card').length;
}

function initProjectControls() {
    document.getElementById('loadMoreProjects').addEventListener('click', function() {
        const hidden = document.querySelectorAll('.project-card.hidden-project');
        if (!hidden.length) return;
        hidden.forEach(function(card, i) {
            setTimeout(function() {
                card.classList.remove('hidden-project');
                card.style.display = 'flex';
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px)';
                card.offsetHeight;
                card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, i * 100);
        });
        this.style.display = 'none';
        document.getElementById('showLessProjects').style.display = 'flex';
        updateProjectCounts();
        showToast('All projects loaded successfully!', 'success');
    });

    document.getElementById('showLessProjects').addEventListener('click', function() {
        const all = document.querySelectorAll('.project-card');
        all.forEach(function(card, i) {
            if (i >= 3) {
                card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(function() {
                    card.classList.add('hidden-project');
                    card.style.display = 'none';
                    card.style.transition = '';
                }, 300);
            }
        });
        this.style.display = 'none';
        document.getElementById('loadMoreProjects').style.display = 'flex';
        updateProjectCounts();
        showToast('Showing first 3 projects', 'info');
    });
}

// ================================================================
// 12. IMAGE PREVIEWS
// ================================================================
function initImagePreviews() {
    const profile = document.getElementById('profile-image-wrapper');
    const about = document.getElementById('about-image-wrapper');
    const modal = document.getElementById('imagePreviewModal');
    const img = document.getElementById('previewImage');
    const title = document.getElementById('imageModalTitle');
    const close = document.getElementById('imageModalClose');

    function openPreview(src, name) {
        if (!modal || !img || !title) return;
        img.src = src;
        title.textContent = name;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    if (profile) {
        profile.addEventListener('click', function() {
            const src = this.querySelector('img').src;
            openPreview(src, 'Profile Photo');
        });
    }
    if (about) {
        about.addEventListener('click', function() {
            const src = this.querySelector('img').src;
            openPreview(src, 'About Photo');
        });
    }
    if (close) {
        close.addEventListener('click', function() {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    }
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }
}

// ================================================================
// 13. QR CODE MODALS
// ================================================================
function initQRCodeModals() {
    const modal = document.getElementById('qrModal');
    const close = document.getElementById('qrModalClose');
    const close2 = document.getElementById('closeQrModal');
    const img = document.getElementById('modalQrImage');
    const msg = document.getElementById('modalQrMessage');
    const title = document.getElementById('qrModalTitle');
    const download = document.getElementById('downloadQr');

    function openQR(src, name) {
        if (!modal || !img || !msg || !title) return;
        img.src = src;
        msg.textContent = 'Scan this QR code to connect via ' + name;
        title.textContent = name + ' QR Code';
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    document.querySelectorAll('.qr-code-wrapper').forEach(function(wrapper) {
        wrapper.addEventListener('click', function(e) {
            e.preventDefault();
            const qrImg = this.querySelector('.qr-code-image');
            const card = this.closest('.qr-card');
            const name = card ? card.querySelector('h3').textContent : 'QR Code';
            if (qrImg) openQR(qrImg.src, name);
        });
    });

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    if (close) close.addEventListener('click', closeModal);
    if (close2) close2.addEventListener('click', closeModal);
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) closeModal();
        });
    }
    if (download) {
        download.addEventListener('click', function() {
            if (!img) return;
            const link = document.createElement('a');
            link.href = img.src;
            link.download = 'qr-code.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            showToast('QR code downloaded successfully!', 'success');
        });
    }

    document.querySelectorAll('.scan-guide-btn').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const type = this.getAttribute('data-type');
            const messages = {
                whatsapp: 'Open your phone\'s camera app and point it at the QR code. Tap the notification to start a chat on WhatsApp.',
                email: 'Scan the QR code with your phone\'s camera. Your email app will open with my address pre-filled.',
                phone: 'Use your phone\'s camera to scan the QR code. Your phone will prompt you to call the number.',
                instagram: 'Scan with Instagram camera or your phone\'s camera app to open my Instagram profile directly.'
            };
            const msg = messages[type] ||
                'Open your phone\'s camera app and point it at the QR code. Follow the on-screen instructions.';

            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    title: '📱 How to Scan',
                    html: `
                            <div style="text-align:left; font-size:1.5rem; line-height:1.6;">
                                <p style="margin-bottom:1.5rem;"><strong>${type.charAt(0).toUpperCase()+type.slice(1)}</strong></p>
                                <p style="background:var(--bg-secondary); padding:1.5rem; border-radius:12px; border-left:4px solid var(--primary);">
                                    ${msg}
                                </p>
                                <div style="margin-top:2rem; display:flex; gap:1rem; justify-content:center; flex-wrap:wrap;">
                                    <span style="background:var(--primary); color:white; padding:0.4rem 1.2rem; border-radius:20px; font-size:1.2rem;">📸 Open Camera</span>
                                    <span style="background:var(--accent); color:white; padding:0.4rem 1.2rem; border-radius:20px; font-size:1.2rem;">🔍 Point at QR</span>
                                    <span style="background:var(--success); color:white; padding:0.4rem 1.2rem; border-radius:20px; font-size:1.2rem;">✅ Tap Notification</span>
                                </div>
                            </div>
                        `,
                    icon: 'info',
                    confirmButtonText: 'Got it!',
                    confirmButtonColor: 'var(--primary)',
                    background: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                    backdrop: 'rgba(0,0,0,0.7)',
                    width: 500,
                    padding: '2rem',
                    showClass: { popup: 'animate__animated animate__fadeInUp' },
                    hideClass: { popup: 'animate__animated animate__fadeOutDown' }
                });
            } else {
                showToast(msg, 'info');
            }
        });
    });
}

// ================================================================
// 14. VIDEO MODAL - FIXED close functionality
// ================================================================
function initVideoModal() {
    const modal = document.getElementById('videoModal');
    const closeBtn = document.getElementById('videoClose');
    const video = document.getElementById('projectVideo');

    if (!modal || !closeBtn || !video) return;

    function closeVideoModal() {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        video.pause();
        video.currentTime = 0;
    }

    closeBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        closeVideoModal();
    });

    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            closeVideoModal();
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeVideoModal();
        }
    });
}

// ================================================================
// 15. CERTIFICATE MODAL - FIXED close functionality
// ================================================================
function initCertificateModal() {
    const modal = document.getElementById('certificateModal');
    const closeBtn = document.getElementById('modalClose');
    const modalTitle = document.getElementById('modalTitle');
    const certImage = document.getElementById('certificateImage');

    if (!modal || !closeBtn) return;

    function closeCertModal() {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        // Clear image to release memory
        if (certImage) {
            certImage.src = '';
        }
        if (modalTitle) {
            modalTitle.textContent = 'Certificate Preview';
        }
    }

    // Close button click
    closeBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        closeCertModal();
    });

    // Click on modal backdrop
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            closeCertModal();
        }
    });

    // ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeCertModal();
        }
    });

    // Also ensure the viewCert function works correctly with this modal
    // The viewCert function is already defined globally, we just need to make sure
    // it uses the modal correctly. The fix is in the viewCert function above.
}

// ================================================================
// 16. CONTACT FORM – EmailJS
// ================================================================
function initContactForm() {
    const form = document.getElementById('contactForm');
    const submit = document.getElementById('formSubmit');
    const charCount = document.getElementById('charCount');
    const msg = document.getElementById('userMessage');

    if (msg && charCount) {
        msg.addEventListener('input', function() {
            var len = this.value.length;
            charCount.textContent = len;
            if (len > 500) { this.value = this.value.substring(0, 500);
                charCount.textContent = 500; }
        });
    }

    if (!form) return;

    if (typeof emailjs !== 'undefined') {
        emailjs.init('21fjfdG5_Sgm82ifT');
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('userName').value.trim();
        const email = document.getElementById('userEmail').value.trim();
        const phone = document.getElementById('userPhone').value.trim();
        const subject = document.getElementById('userSubject').value.trim();
        const message = document.getElementById('userMessage').value.trim();

        if (!name || !email || !subject || !message) {
            showToast('Please fill all required fields.', 'error');
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showToast('Please enter a valid email address.', 'error');
            return;
        }

        submit.classList.add('loading');
        submit.disabled = true;

        var htmlBody =
            '<h2 style="color:#6c5ce7; margin-bottom:16px;">📩 New Contact Form Message</h2>' +
            '<table style="width:100%; border-collapse:collapse; font-family:Inter, sans-serif;">' +
            '<tr><td style="padding:8px 12px; font-weight:700; background:#f0f0ff; border:1px solid #ddd;">Name</td><td style="padding:8px 12px; border:1px solid #ddd;">' +
            name + '</td></tr>' +
            '<tr><td style="padding:8px 12px; font-weight:700; background:#f0f0ff; border:1px solid #ddd;">Email</td><td style="padding:8px 12px; border:1px solid #ddd;">' +
            email + '</td></tr>' +
            '<tr><td style="padding:8px 12px; font-weight:700; background:#f0f0ff; border:1px solid #ddd;">Phone</td><td style="padding:8px 12px; border:1px solid #ddd;">' +
            (phone || 'Not provided') + '</td></tr>' +
            '<tr><td style="padding:8px 12px; font-weight:700; background:#f0f0ff; border:1px solid #ddd;">Subject</td><td style="padding:8px 12px; border:1px solid #ddd;">' +
            subject + '</td></tr>' +
            '<tr><td style="padding:8px 12px; font-weight:700; background:#f0f0ff; border:1px solid #ddd;">Message</td><td style="padding:8px 12px; border:1px solid #ddd; white-space:pre-wrap;">' +
            message + '</td></tr></table>' +
            '<p style="margin-top:20px; color:#888; font-size:12px;">Sent from your portfolio contact form.</p>';

        if (typeof emailjs !== 'undefined') {
            emailjs.send('service_smhhvth', 'template_z4feg0q', {
                from_name: name,
                from_email: email,
                phone: phone || 'Not provided',
                subject: subject,
                message: message,
                html_body: htmlBody,
                to_email: 'myportfoliomails01@gmail.com'
            }).then(function() {
                showToast('Message sent successfully! I\'ll get back to you soon.',
                'success');
                form.reset();
                if (charCount) charCount.textContent = '0';
            }).catch(function(err) {
                console.error('EmailJS Error:', err);
                showToast('Failed to send message. Please try again later.', 'error');
            }).finally(function() {
                submit.classList.remove('loading');
                submit.disabled = false;
            });
        } else {
            showToast('Email service not available. Please try again later.', 'error');
            submit.classList.remove('loading');
            submit.disabled = false;
        }
    });
}

// ================================================================
// 17. NEWSLETTER
// ================================================================
function initNewsletter() {
    const btn = document.getElementById('newsletterBtn');
    const input = document.getElementById('newsletterEmail');
    if (!btn || !input) return;
    btn.addEventListener('click', function() {
        const email = input.value.trim();
        if (!email) { showToast('Please enter your email address', 'error'); return; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showToast('Please enter a valid email address',
                'error'); return; }
        const orig = this.innerHTML;
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        this.disabled = true;
        setTimeout(function() {
            showToast('Successfully subscribed to newsletter!', 'success');
            input.value = '';
            btn.innerHTML = orig;
            btn.disabled = false;
        }, 1500);
    });
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') btn.click();
    });
}

// ================================================================
// 18. RESUME DOWNLOAD
// ================================================================
function initResumeDownload() {
    const btn = document.getElementById('resumeBtn');
    if (!btn) return;
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        showToast('Starting resume download...', 'info');
        try {
            const link = document.createElement('a');
            link.href = 'Aditya_Resume.pdf';
            link.download = 'Aditya_Singh_Resume.pdf';
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            setTimeout(function() {
                document.body.removeChild(link);
                showToast('Resume downloaded successfully!', 'success');
            }, 200);
        } catch (err) {
            showToast('Failed to download resume. Please try again.', 'error');
            setTimeout(function() { window.open('Aditya_Resume.pdf', '_blank'); }, 500);
        }
    });
}

// ================================================================
// 19. TOAST
// ================================================================
function showToast(message, type) {
    type = type || 'success';
    const toast = document.getElementById('toast');
    if (!toast) return;
    const msgEl = toast.querySelector('.toast-message');
    const icon = toast.querySelector('.toast-content i');
    if (!msgEl || !icon) return;
    msgEl.textContent = message;
    icon.className = type === 'success' ? 'fas fa-check-circle' :
        (type === 'error' ? 'fas fa-exclamation-circle' :
            (type === 'warning' ? 'fas fa-exclamation-triangle' : 'fas fa-info-circle'));
    toast.style.borderLeftColor = type === 'success' ? '#10b981' :
        (type === 'error' ? '#ef4444' :
            (type === 'warning' ? '#f59e0b' : '#3b82f6'));
    toast.classList.remove('show');
    void toast.offsetWidth;
    toast.classList.add('show');
    setTimeout(function() { toast.classList.remove('show'); }, 3000);
}

// ================================================================
// 20. EDUCATION ANIMATION
// ================================================================
function initEducationAnimation() {
    const items = document.querySelectorAll('.timeline-item');

    function check() {
        items.forEach(function(item) {
            const top = item.getBoundingClientRect().top;
            if (top < window.innerHeight - 150) {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }
        });
    }
    window.addEventListener('scroll', check);
    check();
}

// ================================================================
// 21. INIT ALL
// ================================================================
function initAll() {
    init5DBackground();
    initTheme();
    initTyping();
    initMobileNav();
    initSmoothScroll();
    initBackToTop();
    initStatsCounter();
    loadSkillsData();
    loadCertifications();
    initCertFilters();
    initCertControls();
    loadProjects();
    initProjectControls();
    initImagePreviews();
    initQRCodeModals();
    initVideoModal();
    initCertificateModal(); // <-- FIX: Certificate modal close now works
    initContactForm();
    initNewsletter();
    initResumeDownload();
    initEducationAnimation();

    const fc = document.getElementById('footerCerts');
    if (fc) {
        const total = document.getElementById('totalCerts');
        if (total) fc.textContent = total.textContent;
    }
    setTimeout(function() {
        updateCertCounts();
        updateProjectCounts();
    }, 300);
}

// ================================================================
// 22. EXPOSE GLOBALS
// ================================================================
window.viewCert = viewCert;
window.downloadCert = downloadCert;
window.showToast = showToast;

// ================================================================
// 23. DOM READY
// ================================================================
document.addEventListener('DOMContentLoaded', function() {
    const pageContent = document.getElementById('page-content');
    if (pageContent && pageContent.classList.contains('visible')) {
        // already visible, initAll was called by loader.
    } else {
        setTimeout(function() {
            if (pageContent && !pageContent.classList.contains('visible')) {
                pageContent.classList.add('visible');
                initAll();
            }
        }, 1000);
    }
});

console.log('🚀 Portfolio Loaded with 5D Background & Fixed Certificate Modal!');
