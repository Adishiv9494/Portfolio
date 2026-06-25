        // ================================================================
        // 1. LOADER – FIXED: ensures loader hides and content appears
        // ================================================================
        function initLoader() {
            const loader = document.getElementById('loader');
            const progressFill = document.querySelector('.progress-fill');
            const progressPercentage = document.querySelector('.progress-percentage');
            const techItems = document.querySelectorAll('.tech-item');

            // If loader already shown in this session, hide immediately
            const loaderShown = sessionStorage.getItem('loaderShown');
            if (loaderShown) {
                loader.classList.add('hidden-final');
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

            const updateProgress = setInterval(function() {
                progress += increment;
                var easedProgress = easeOutQuad(progress / 100) * 100;

                if (progressFill) {
                    progressFill.style.width = easedProgress + '%';
                }
                if (progressPercentage) {
                    progressPercentage.textContent = Math.min(100, Math.floor(easedProgress)) + '%';
                }

                techItems.forEach(function(item, index) {
                    if (easedProgress > (index + 1) * 20) {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }
                });

                if (progress >= 100) {
                    clearInterval(updateProgress);
                    // Hide loader with animation then remove it
                    loader.classList.add('hidden');
                    setTimeout(function() {
                        loader.classList.add('hidden-final');
                        document.body.style.overflow = 'auto';
                        document.body.classList.add('loaded');
                        sessionStorage.setItem('loaderShown', 'true');
                        setTimeout(function() {
                            initAllAnimations();
                            updateAllCounters();
                        }, 300);
                    }, 500);
                }
            }, interval);

            // Safety fallback: if loader doesn't finish in 5s, force hide
            setTimeout(function() {
                if (!loader.classList.contains('hidden-final')) {
                    loader.classList.add('hidden');
                    setTimeout(function() {
                        loader.classList.add('hidden-final');
                        document.body.style.overflow = 'auto';
                        document.body.classList.add('loaded');
                        sessionStorage.setItem('loaderShown', 'true');
                        initAllAnimations();
                        updateAllCounters();
                    }, 300);
                }
            }, 5000);
        }

        function easeOutQuad(t) {
            return t * (2 - t);
        }

        // ================================================================
        // 2. THEME TOGGLE
        // ================================================================
        function initTheme() {
            var themeToggle = document.getElementById('theme-toggle');
            var html = document.documentElement;
            var savedTheme = localStorage.getItem('theme') || 'dark';
            html.setAttribute('data-theme', savedTheme);

            if (themeToggle) {
                themeToggle.addEventListener('click', function() {
                    var currentTheme = html.getAttribute('data-theme');
                    var newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                    html.setAttribute('data-theme', newTheme);
                    localStorage.setItem('theme', newTheme);
                });
            }
        }

        // ================================================================
        // 3. TYPING ANIMATION
        // ================================================================
        function initTyping() {
            var typingElement = document.querySelector('.typing-text');
            if (!typingElement) return;
            if (typeof Typed !== 'undefined') {
                try {
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
                } catch (e) {
                    typingElement.textContent = 'Full Stack Developer';
                }
            } else {
                typingElement.textContent = 'Full Stack Developer';
            }
        }

        // ================================================================
        // 4. MOBILE NAV
        // ================================================================
        function initMobileNav() {
            var toggle = document.getElementById('mobile-toggle');
            var navbar = document.querySelector('.navbar');
            var links = document.querySelectorAll('.nav-link');

            if (!toggle || !navbar) return;

            toggle.addEventListener('click', function() {
                toggle.classList.toggle('active');
                navbar.classList.toggle('active');
                document.body.style.overflow = navbar.classList.contains('active') ? 'hidden' : 'auto';
            });

            links.forEach(function(link) {
                link.addEventListener('click', function() {
                    toggle.classList.remove('active');
                    navbar.classList.remove('active');
                    document.body.style.overflow = 'auto';
                });
            });

            document.addEventListener('click', function(e) {
                if (navbar.classList.contains('active') &&
                    !navbar.contains(e.target) &&
                    !toggle.contains(e.target)) {
                    toggle.classList.remove('active');
                    navbar.classList.remove('active');
                    document.body.style.overflow = 'auto';
                }
            });
        }

        // ================================================================
        // 5. SMOOTH SCROLL & ACTIVE NAV
        // ================================================================
        function initSmoothScroll() {
            var links = document.querySelectorAll('.nav-link');
            var header = document.querySelector('.header');

            links.forEach(function(link) {
                link.addEventListener('click', function(e) {
                    var href = this.getAttribute('href');
                    if (href && href.startsWith('#')) {
                        e.preventDefault();
                        var targetId = href.substring(1);
                        var target = document.getElementById(targetId);
                        if (target) {
                            var offset = header ? header.offsetHeight : 0;
                            window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
                            links.forEach(function(l) { l.classList.remove('active'); });
                            this.classList.add('active');
                            history.pushState(null, null, href);
                        }
                    }
                });
            });

            window.addEventListener('scroll', function() {
                var sections = document.querySelectorAll('section[id]');
                var scrollPos = window.scrollY + 100;
                var current = '';
                sections.forEach(function(s) {
                    var top = s.offsetTop - (header ? header.offsetHeight : 0);
                    var height = s.offsetHeight;
                    if (scrollPos >= top && scrollPos < top + height) {
                        current = s.id;
                    }
                });
                links.forEach(function(l) {
                    l.classList.toggle('active', l.getAttribute('href') === '#' + current);
                });
            });
        }

        // ================================================================
        // 6. BACK TO TOP
        // ================================================================
        function initBackToTop() {
            var btn = document.getElementById('backToTop');
            if (!btn) return;
            window.addEventListener('scroll', function() {
                var visible = window.scrollY > 300;
                btn.classList.toggle('visible', visible);
                btn.style.opacity = visible ? '1' : '0';
                btn.style.visibility = visible ? 'visible' : 'hidden';
            });
            btn.addEventListener('click', function() {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                document.querySelectorAll('.nav-link').forEach(function(l) { l.classList.remove('active'); });
                var home = document.querySelector('a[href="#home"]');
                if (home) home.classList.add('active');
            });
        }

        // ================================================================
        // 7. STATS COUNTER
        // ================================================================
        function updateStatsCounter() {
            var stats = document.querySelectorAll('.stat-number');
            stats.forEach(function(stat) {
                var target = parseInt(stat.getAttribute('data-count')) || 0;
                var duration = 2000;
                var interval = 50;
                var increment = target / (duration / interval);
                var current = 0;
                var timer = setInterval(function() {
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
        // 8. COUNTER UPDATES
        // ================================================================
        function updateTotalCounts() {
            var proj = document.querySelectorAll('.project-card');
            var total = document.getElementById('projectsTotal');
            if (total) total.textContent = proj.length;

            var skills = document.querySelectorAll('.skill-icon-card');
            var soft = document.querySelectorAll('.soft-skill-card');
            var skillsTotal = document.getElementById('skillsTotal');
            if (skillsTotal) skillsTotal.textContent = skills.length + soft.length;

            updateFooterStats();
        }

        function updateShowingCounts() {
            var hidden = document.querySelectorAll('.project-card.hidden-project');
            var showingSpan = document.getElementById('showingProjects');
            var totalSpan = document.getElementById('projectsTotal');
            if (showingSpan && totalSpan) {
                var total = document.querySelectorAll('.project-card').length;
                showingSpan.textContent = total - hidden.length;
                totalSpan.textContent = total;
            }
        }

        function updateFooterStats() {
            var fp = document.getElementById('footerProjects');
            var fc = document.getElementById('footerCerts');
            if (fp) fp.textContent = document.querySelectorAll('.project-card').length;
            if (fc) {
                var tc = document.getElementById('totalCerts');
                if (tc) fc.textContent = tc.textContent;
            }
        }

        function updateEnhancedCounts() {
            var hidden = document.querySelectorAll('.cert-card.hidden-cert');
            var showingSpan = document.getElementById('showingCerts');
            var totalSpan = document.getElementById('totalCerts');
            var loadBtn = document.getElementById('loadMoreCerts');
            if (showingSpan && totalSpan) {
                var total = document.querySelectorAll('.cert-card').length;
                var showing = total - hidden.length;
                showingSpan.textContent = showing;
                totalSpan.textContent = total;
                if (loadBtn && hidden.length > 0) {
                    var span = loadBtn.querySelector('span');
                    if (span) span.textContent = 'Load More (' + hidden.length + ' remaining)';
                }
            }
        }

        function updateProjectsCount() {
            var hidden = document.querySelectorAll('.project-card.hidden-project');
            var showingSpan = document.getElementById('showingProjects');
            var totalSpan = document.getElementById('projectsTotal');
            var loadBtn = document.getElementById('loadMoreProjects');
            if (showingSpan && totalSpan) {
                var total = document.querySelectorAll('.project-card').length;
                var showing = total - hidden.length;
                showingSpan.textContent = showing;
                totalSpan.textContent = total;
                if (loadBtn && hidden.length > 0) {
                    var span = loadBtn.querySelector('span');
                    if (span) span.textContent = 'View More Projects (' + hidden.length + ' remaining)';
                }
            }
            updateFooterStats();
        }

        function updateAllCounters() {
            updateStatsCounter();
            updateTotalCounts();
            updateShowingCounts();
            updateFooterStats();
            updateEnhancedCounts();
            updateProjectsCount();
        }

        // ================================================================
        // 9. ANIMATIONS ON SCROLL
        // ================================================================
        function initAllAnimations() {
            window.addEventListener('scroll', function() {
                var els = document.querySelectorAll('.animate-on-scroll');
                els.forEach(function(el) {
                    var top = el.getBoundingClientRect().top;
                    if (top < window.innerHeight - 150) {
                        el.classList.add('visible');
                    }
                });
            });
            // trigger once
            document.querySelectorAll('.animate-on-scroll').forEach(function(el) {
                var top = el.getBoundingClientRect().top;
                if (top < window.innerHeight - 150) {
                    el.classList.add('visible');
                }
            });
        }

        // ================================================================
        // 10. SKILLS DATA
        // ================================================================
        function loadSkillsData() {
            var data = {
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

            var grids = {
                programmingGrid: data.programming,
                frontendGrid: data.frontend,
                backendGrid: data.backend,
                toolsGrid: data.tools
            };

            Object.keys(grids).forEach(function(id) {
                var grid = document.getElementById(id);
                if (!grid) return;
                grid.innerHTML = grids[id].map(function(s) {
                    return '<div class="skill-icon-card animate-on-scroll" data-skill="' + s.skill + '" data-level="' +
                        s.level + '">' +
                        '<div class="skill-icon-wrapper"><div class="skill-icon-bg"><i class="' + s.icon +
                        '"></i></div></div>' +
                        '<div class="skill-info"><h4 class="skill-name">' + s.skill +
                        '</h4><p class="skill-description">' + s.desc + '</p></div>' +
                        '</div>';
                }).join('');
            });
        }

        // ================================================================
        // 11. CERTIFICATIONS
        // ================================================================
        var certificateData = [{
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
        }, {
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
        }, {
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
        }, {
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
        }, {
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
        }, {
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
        }, {
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
        }, {
            id: 8,
            title: "Industrial Training Institute (ITI)",
            issuer: "Ministry of Skill Development and Entrepreneurship",
            date: "Aug 2017",
            description: "Upon completing the ITI COPA trade, gained comprehensive proficiency in computer fundamentals and troubleshooting, and operating systems. Developed strong skills in office productivity software.",
            skills: ["Computer Fundamentals", "Troubleshooting", "MS Office", "C/C++ Programming", "HTML/CSS",
                "Database Concepts"
            ],
            score: 100,
            category: "university",
            featured: false,
            icon: "fas fa-graduation-cap",
            image: "Certificates/ITI.png",
            download: "Certificates/ITI.png",
            fileType: "png"
        }, {
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
        }, {
            id: 10,
            title: "Apprenticeship in HPCL",
            issuer: "Ministry of Skill Development and Entrepreneurship",
            date: "Jan 2019",
            description: "Successfully completed the COPA Trade Apprenticeship Certificate Course, a government-recognized program certified by NCVT.",
            skills: ["Computer Operations", "Software Installation", "Python/C++ Programming", "Database Management",
                "Networking"
            ],
            score: 100,
            category: "professional",
            featured: false,
            icon: "fas fa-briefcase",
            image: "Certificates/App.png",
            download: "Certificates/Apprenticeship_Certificate.pdf",
            fileType: "pdf"
        }];

        function loadEnhancedCertificates() {
            var grid = document.getElementById('certificationsGrid');
            var totalCerts = document.getElementById('totalCerts');
            var certTotal = document.getElementById('certTotal');
            if (!grid) return;
            if (totalCerts) totalCerts.textContent = certificateData.length;
            if (certTotal) certTotal.textContent = certificateData.length;

            grid.innerHTML = '';
            certificateData.forEach(function(cert, index) {
                var isHidden = index >= 3;
                var card = document.createElement('div');
                card.className = 'cert-card' + (isHidden ? ' hidden-cert' : '') + (cert.featured ? ' featured' : '');
                card.setAttribute('data-id', cert.id);
                card.setAttribute('data-category', cert.category);
                card.setAttribute('data-score', cert.score);

                var scoreClass = cert.score >= 90 ? 'high-score' : (cert.score < 70 ? 'low-score' : 'medium-score');

                card.innerHTML =
                    (cert.featured ? '<div class="cert-ribbon"><i class="fas fa-star"></i> Featured</div>' : '') +
                    '<div class="cert-header">' +
                    '<div class="cert-badge"><i class="' + cert.icon + '"></i></div>' +
                    '<div class="cert-title-wrapper"><div class="cert-icon"><i class="' + cert.icon +
                    '"></i></div><h3 class="cert-title">' + cert.title + '</h3></div>' +
                    '<p class="cert-subtitle">' + cert.category.toUpperCase() + ' CERTIFICATION</p>' +
                    '</div>' +
                    '<div class="cert-image" onclick="viewEnhancedCertificate(' + cert.id + ')">' +
                    '<img src="' + cert.image + '" alt="' + cert.title + '" loading="lazy">' +
                    '<div class="cert-image-overlay"><button class="view-cert-btn" onclick="viewEnhancedCertificate(' +
                    cert.id + ')"><i class="fas fa-expand-alt"></i></button></div>' +
                    '</div>' +
                    '<div class="cert-content">' +
                    '<div class="cert-meta"><div class="cert-issuer"><i class="fas fa-university"></i><span>' + cert
                    .issuer + '</span></div><span class="cert-date">' + cert.date + '</span></div>' +
                    '<div class="cert-description"><p>' + cert.description +
                    '</p><div class="skills-gained"><div class="skills-title"><i class="fas fa-tools"></i><span>Skills Gained</span></div><div class="skills-list">' +
                    cert.skills.map(function(s) { return '<span class="skill-tag">' + s + '</span>'; }).join('') +
                    '</div></div></div>' +
                    '<div class="cert-score"><div class="score-header"><span class="score-label">Achievement Score</span><span class="score-value">' +
                    cert.score + '%</span></div>' +
                    '<div class="score-bar-container"><div class="score-bar-fill ' + scoreClass +
                    '" style="width:' + cert.score + '%"></div></div></div>' +
                    '<div class="cert-actions">' +
                    '<button class="btn-view" onclick="viewEnhancedCertificate(' + cert.id +
                    ')"><i class="fas fa-eye"></i> View Certificate</button>' +
                    '<button class="btn-download" onclick="downloadEnhancedCertificate(' + cert.id +
                    ', this)"><i class="fas fa-download"></i> Download</button>' +
                    '</div>' +
                    '</div>';

                grid.appendChild(card);
            });

            setTimeout(function() {
                document.querySelectorAll('.score-bar-fill').forEach(function(bar) {
                    var w = bar.style.width;
                    bar.style.transition = 'none';
                    bar.style.width = '0%';
                    setTimeout(function() {
                        bar.style.transition = 'width 1.5s ease-out';
                        bar.style.width = w;
                    }, 100);
                });
            }, 500);

            updateEnhancedCounts();
            initCertificateFilters();
        }

        function initCertificateFilters() {
            var btns = document.querySelectorAll('.filter-btn');
            btns.forEach(function(btn) {
                btn.addEventListener('click', function() {
                    btns.forEach(function(b) { b.classList.remove('active'); });
                    this.classList.add('active');
                    var filter = this.getAttribute('data-filter');
                    var cards = document.querySelectorAll('.cert-card');
                    cards.forEach(function(card) {
                        var cat = card.getAttribute('data-category');
                        var score = parseInt(card.getAttribute('data-score'));
                        var show = false;
                        switch (filter) {
                            case 'all':
                                show = true;
                                break;
                            case 'university':
                                show = cat === 'university';
                                break;
                            case 'professional':
                                show = cat === 'professional';
                                break;
                            case 'technical':
                                show = cat === 'technical';
                                break;
                            case 'top-rated':
                                show = score >= 85;
                                break;
                            default:
                                show = true;
                        }
                        card.style.display = show ? 'flex' : 'none';
                        if (show) card.classList.add('show');
                        else card.classList.remove('show');
                    });
                    setTimeout(updateEnhancedCounts, 300);
                });
            });
        }

        function viewEnhancedCertificate(id) {
            var card = document.querySelector('.cert-card[data-id="' + id + '"]');
            if (!card) { showToast('Certificate not found!', 'error'); return; }
            var modal = document.getElementById('certificateModal');
            var title = document.getElementById('modalTitle');
            var img = document.getElementById('certificateImage');
            if (!modal || !title || !img) return;
            var t = card.querySelector('.cert-title').textContent;
            var src = card.querySelector('.cert-image img').src;
            title.textContent = t;
            img.src = src;
            img.alt = t + ' Certificate';
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function downloadEnhancedCertificate(id, btn) {
            var card = document.querySelector('.cert-card[data-id="' + id + '"]');
            if (!card) { showToast('Certificate not found!', 'error'); return; }
            var title = card.querySelector('.cert-title').textContent;
            var src = card.querySelector('.cert-image img').src;
            var orig = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Downloading...';
            btn.disabled = true;
            var link = document.createElement('a');
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

        function loadMoreEnhancedCertificates() {
            var hidden = document.querySelectorAll('.cert-card.hidden-cert');
            var loadBtn = document.getElementById('loadMoreCerts');
            var lessBtn = document.getElementById('showLessCerts');
            if (!hidden.length) return;
            hidden.forEach(function(cert, i) {
                setTimeout(function() {
                    cert.classList.remove('hidden-cert');
                    cert.style.opacity = '0';
                    cert.style.transform = 'translateY(30px)';
                    cert.offsetHeight;
                    cert.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    cert.style.opacity = '1';
                    cert.style.transform = 'translateY(0)';
                }, i * 100);
            });
            if (loadBtn) loadBtn.style.display = 'none';
            if (lessBtn) lessBtn.style.display = 'inline-flex';
            updateEnhancedCounts();
            showToast('All certificates loaded successfully!', 'success');
        }

        function showLessEnhancedCertificates() {
            var all = document.querySelectorAll('.cert-card');
            var loadBtn = document.getElementById('loadMoreCerts');
            var lessBtn = document.getElementById('showLessCerts');
            all.forEach(function(cert, i) {
                if (i >= 3) {
                    cert.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    cert.style.opacity = '0';
                    cert.style.transform = 'translateY(20px)';
                    setTimeout(function() {
                        cert.classList.add('hidden-cert');
                        cert.style.transition = '';
                    }, 300);
                }
            });
            if (loadBtn) loadBtn.style.display = 'inline-flex';
            if (lessBtn) lessBtn.style.display = 'none';
            updateEnhancedCounts();
            showToast('Showing first 3 certificates', 'info');
        }

        // ================================================================
        // 12. PROJECTS
        // ================================================================
        var projectData = [{
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
        }, {
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
        }, {
            id: 3,
            title: "Calculator App",
            description: "A responsive calculator application with basic arithmetic operations, scientific functions, and memory features. Built with clean UI and keyboard support.",
            technologies: ["HTML5", "CSS3", "JavaScript", "Responsive Design"],
            features: ["Basic Operations", "Scientific Functions", "Memory Storage", "Keyboard Support"],
            date: "2023",
            image: "Images/Cal.png",
            demoLink: "Videoes/Calulator.mp4",
            codeLink: "https://github.com/Adishiv9494/Calculator",
            status: "completed",
            complexity: 1,
            featured: false
        }, {
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
        }, {
            id: 5,
            title: "Stop Watch Application",
            description: "A precise stopwatch with lap time tracking, countdown timer, and multiple display modes. Features include time formatting and export functionality.",
            technologies: ["HTML5", "CSS3", "JavaScript", "CSS Animations"],
            features: ["Lap Timing", "Countdown Timer", "Multiple Displays", "Time Export"],
            date: "2023",
            image: "Images/SWatch.jpg",
            demoLink: "Videoes/SWatch.mp4",
            codeLink: "https://github.com/Adishiv9494/Stop-Watch",
            status: "completed",
            complexity: 1,
            featured: false
        }, {
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
        }, {
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
        }, {
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
        }];

        function loadEnhancedProjects() {
            var grid = document.getElementById('projectsGrid');
            var total = document.getElementById('projectsTotal');
            if (!grid) return;
            if (total) total.textContent = projectData.length;

            grid.innerHTML = '';
            projectData.forEach(function(proj, index) {
                var isHidden = index >= 3;
                var card = document.createElement('div');
                card.className = 'project-card' + (isHidden ? ' hidden-project' : '') + (proj.featured ? ' featured' :
                    '');
                card.setAttribute('data-id', proj.id);
                card.setAttribute('data-status', proj.status);
                card.setAttribute('data-complexity', proj.complexity);

                card.innerHTML =
                    (proj.featured ? '<div class="project-ribbon"><i class="fas fa-star"></i> Featured</div>' : '') +
                    '<div class="project-image"><img src="' + proj.image + '" alt="' + proj.title +
                    '" loading="lazy"><div class="project-overlay"><div class="overlay-content"><h3>' + proj
                    .title + '</h3><p>' + proj.description.substring(0, 100) + '...</p><div class="tech-stack">' +
                    proj.technologies.map(function(t) { return '<span>' + t + '</span>'; }).join('') +
                    '</div></div></div><span class="project-status ' + proj.status + '">' + proj.status
                    .charAt(0).toUpperCase() + proj.status.slice(1) + '</span></div>' +
                    '<div class="project-info"><div class="project-header"><h3>' + proj.title +
                    '</h3><span class="project-date">' + proj.date + '</span></div>' +
                    '<p class="project-description">' + proj.description + '</p>' +
                    '<div class="project-features">' +
                    proj.features.map(function(f) { return '<div class="feature"><i class="fas fa-check-circle"></i><span>' +
                            f + '</span></div>'; }).join('') +
                    '</div>' +
                    '<div class="project-actions"><button class="demo-btn live-demo-btn" data-video="' + proj
                    .demoLink + '" data-title="' + proj.title + ' Demo"><i class="fas fa-external-link-alt"></i> Live Demo</button>' +
                    '<a href="' + proj.codeLink + '" class="code-btn" target="_blank"><i class="fab fa-github"></i> Source Code</a>' +
                    '</div></div>';

                grid.appendChild(card);
            });

            updateProjectsCount();

            // Live demo buttons
            document.querySelectorAll('.live-demo-btn').forEach(function(btn) {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    var src = this.getAttribute('data-video');
                    var title = this.getAttribute('data-title');
                    if (src && src.endsWith('.mp4')) {
                        var modal = document.getElementById('videoModal');
                        var vTitle = document.getElementById('videoTitle');
                        var video = document.getElementById('projectVideo');
                        if (modal && vTitle && video) {
                            vTitle.textContent = title;
                            video.src = src;
                            modal.classList.add('active');
                            document.body.style.overflow = 'hidden';
                        }
                    } else {
                        window.open(src, '_blank');
                    }
                });
            });
        }

        function loadMoreProjects() {
            var hidden = document.querySelectorAll('.project-card.hidden-project');
            var loadBtn = document.getElementById('loadMoreProjects');
            var lessBtn = document.getElementById('showLessProjects');
            if (!hidden.length) return;
            hidden.forEach(function(proj, i) {
                setTimeout(function() {
                    proj.classList.remove('hidden-project');
                    proj.style.opacity = '0';
                    proj.style.transform = 'translateY(30px)';
                    proj.offsetHeight;
                    proj.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    proj.style.opacity = '1';
                    proj.style.transform = 'translateY(0)';
                }, i * 100);
            });
            if (loadBtn) loadBtn.style.display = 'none';
            if (lessBtn) lessBtn.style.display = 'flex';
            updateProjectsCount();
            showToast('All projects loaded successfully!', 'success');
        }

        function showLessProjects() {
            var all = document.querySelectorAll('.project-card');
            var loadBtn = document.getElementById('loadMoreProjects');
            var lessBtn = document.getElementById('showLessProjects');
            all.forEach(function(proj, i) {
                if (i >= 3) {
                    proj.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    proj.style.opacity = '0';
                    proj.style.transform = 'translateY(20px)';
                    setTimeout(function() {
                        proj.classList.add('hidden-project');
                        proj.style.transition = '';
                    }, 300);
                }
            });
            if (loadBtn) loadBtn.style.display = 'flex';
            if (lessBtn) lessBtn.style.display = 'none';
            updateProjectsCount();
            showToast('Showing first 3 projects', 'info');
        }

        // ================================================================
        // 13. IMAGE PREVIEWS
        // ================================================================
        function initImagePreviews() {
            var profile = document.getElementById('profile-image-wrapper');
            var about = document.getElementById('about-image-wrapper');
            var modal = document.getElementById('imagePreviewModal');
            var img = document.getElementById('previewImage');
            var close = document.getElementById('imageModalClose');
            var title = document.getElementById('imageModalTitle');

            function openPreview(src, label) {
                if (!modal || !img || !title) return;
                img.src = src;
                title.textContent = label;
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }

            if (profile) {
                profile.addEventListener('click', function() {
                    var src = this.querySelector('img').src;
                    openPreview(src, 'Profile Photo');
                });
            }
            if (about) {
                about.addEventListener('click', function() {
                    var src = this.querySelector('img').src;
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
        // 14. QR CODE MODALS
        // ================================================================
        function initQRCodeModals() {
            var modal = document.getElementById('qrModal');
            var close = document.getElementById('qrModalClose');
            var closeBtn = document.getElementById('closeQrModal');
            var img = document.getElementById('modalQrImage');
            var msg = document.getElementById('modalQrMessage');
            var title = document.getElementById('qrModalTitle');
            var downloadBtn = document.getElementById('downloadQr');

            var wrappers = document.querySelectorAll('.qr-code-wrapper');
            wrappers.forEach(function(w) {
                w.addEventListener('click', function(e) {
                    e.preventDefault();
                    var qrImg = this.querySelector('.qr-code-image');
                    var card = this.closest('.qr-card');
                    var name = card ? card.querySelector('h3').textContent : 'QR Code';
                    if (qrImg && img) {
                        img.src = qrImg.src;
                        msg.textContent = 'Scan this QR code to connect via ' + name;
                        title.textContent = name + ' QR Code';
                        modal.classList.add('active');
                        document.body.style.overflow = 'hidden';
                    }
                });
            });

            function closeModal() {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
            if (close) close.addEventListener('click', closeModal);
            if (closeBtn) closeBtn.addEventListener('click', closeModal);
            if (modal) {
                modal.addEventListener('click', function(e) {
                    if (e.target === this) closeModal();
                });
            }
            if (downloadBtn) {
                downloadBtn.addEventListener('click', function() {
                    var link = document.createElement('a');
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
                    var type = this.getAttribute('data-type');
                    var msgs = {
                        whatsapp: 'Open your phone\'s camera app and point it at the QR code. Tap the notification to start a chat on WhatsApp.',
                        email: 'Scan the QR code with your phone\'s camera. Your email app will open with my address pre-filled.',
                        phone: 'Use your phone\'s camera to scan the QR code. Your phone will prompt you to call the number.',
                        instagram: 'Scan with Instagram camera or your phone\'s camera app to open my Instagram profile directly.'
                    };
                    var m = msgs[type] ||
                        'Open your phone\'s camera app and point it at the QR code. Follow the on-screen instructions.';
                    if (typeof swal === 'function') {
                        swal({ title: 'How to Scan ' + type.charAt(0).toUpperCase() + type.slice(1) +
                                ' QR Code', text: m, icon: 'info', button: 'Got it!' });
                    } else {
                        showToast(m, 'info');
                    }
                });
            });
        }

        // ================================================================
        // 15. CONTACT FORM – EmailJS
        // ================================================================
        function initContactForm() {
            var form = document.getElementById('contactForm');
            var submitBtn = document.getElementById('formSubmit');
            var charCount = document.getElementById('charCount');
            var msg = document.getElementById('userMessage');

            if (msg && charCount) {
                msg.addEventListener('input', function() {
                    var len = this.value.length;
                    charCount.textContent = len;
                    if (len > 500) {
                        this.value = this.value.substring(0, 500);
                        charCount.textContent = 500;
                    }
                });
            }

            emailjs.init('21fjfdG5_Sgm82ifT');

            form.addEventListener('submit', function(e) {
                e.preventDefault();

                var name = document.getElementById('userName').value.trim();
                var email = document.getElementById('userEmail').value.trim();
                var phone = document.getElementById('userPhone').value.trim();
                var subject = document.getElementById('userSubject').value.trim();
                var message = document.getElementById('userMessage').value.trim();

                if (!name || !email || !subject || !message) {
                    showToast('Please fill all required fields.', 'error');
                    return;
                }
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                    showToast('Please enter a valid email address.', 'error');
                    return;
                }

                submitBtn.classList.add('loading');
                submitBtn.disabled = true;

                var htmlBody =
                    '<h2 style="color:#6c5ce7;margin-bottom:16px;">📩 New Contact Form Message</h2>' +
                    '<table style="width:100%;border-collapse:collapse;font-family:Inter,sans-serif;">' +
                    '<tr><td style="padding:8px 12px;font-weight:700;background:#f0f0ff;border:1px solid #ddd;">Name</td><td style="padding:8px 12px;border:1px solid #ddd;">' +
                    name + '</td></tr>' +
                    '<tr><td style="padding:8px 12px;font-weight:700;background:#f0f0ff;border:1px solid #ddd;">Email</td><td style="padding:8px 12px;border:1px solid #ddd;">' +
                    email + '</td></tr>' +
                    '<tr><td style="padding:8px 12px;font-weight:700;background:#f0f0ff;border:1px solid #ddd;">Phone</td><td style="padding:8px 12px;border:1px solid #ddd;">' +
                    (phone || 'Not provided') + '</td></tr>' +
                    '<tr><td style="padding:8px 12px;font-weight:700;background:#f0f0ff;border:1px solid #ddd;">Subject</td><td style="padding:8px 12px;border:1px solid #ddd;">' +
                    subject + '</td></tr>' +
                    '<tr><td style="padding:8px 12px;font-weight:700;background:#f0f0ff;border:1px solid #ddd;">Message</td><td style="padding:8px 12px;border:1px solid #ddd;white-space:pre-wrap;">' +
                    message + '</td></tr></table>' +
                    '<p style="margin-top:20px;color:#888;font-size:12px;">Sent from your portfolio contact form.</p>';

                emailjs.send('service_smhhvth', 'template_z4feg0q', {
                    from_name: name,
                    from_email: email,
                    phone: phone || 'Not provided',
                    subject: subject,
                    message: message,
                    html_body: htmlBody,
                    to_email: 'myportfoliomails01@gmail.com'
                }).then(function() {
                    showToast('Message sent successfully! I\'ll get back to you soon.', 'success');
                    form.reset();
                    if (charCount) charCount.textContent = '0';
                }).catch(function(err) {
                    console.error('EmailJS Error:', err);
                    showToast('Failed to send message. Please try again later.', 'error');
                }).finally(function() {
                    submitBtn.classList.remove('loading');
                    submitBtn.disabled = false;
                });
            });
        }

        // ================================================================
        // 16. NEWSLETTER
        // ================================================================
        function initNewsletter() {
            var btn = document.getElementById('newsletterBtn');
            var input = document.getElementById('newsletterEmail');
            if (!btn || !input) return;

            function subscribe() {
                var email = input.value.trim();
                if (!email) { showToast('Please enter your email address', 'error'); return; }
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showToast('Please enter a valid email address',
                    'error'); return; }
                var orig = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                btn.disabled = true;
                setTimeout(function() {
                    showToast('Successfully subscribed to newsletter!', 'success');
                    input.value = '';
                    btn.innerHTML = orig;
                    btn.disabled = false;
                }, 1500);
            }

            btn.addEventListener('click', subscribe);
            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') subscribe();
            });
        }

        // ================================================================
        // 17. RESUME DOWNLOAD
        // ================================================================
        function initResumeDownload() {
            var btn = document.getElementById('resumeBtn');
            if (!btn) return;
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                showToast('Starting resume download...', 'info');
                try {
                    var link = document.createElement('a');
                    link.href = 'Aditya_Resume.pdf';
                    link.download = 'Aditya_Singh_Resume.pdf';
                    link.style.display = 'none';
                    document.body.appendChild(link);
                    link.click();
                    setTimeout(function() {
                        document.body.removeChild(link);
                        showToast('Resume downloaded successfully!', 'success');
                    }, 100);
                } catch (err) {
                    showToast('Failed to download resume. Please try again.', 'error');
                    setTimeout(function() { window.open('Aditya_Resume.pdf', '_blank'); }, 500);
                }
            });
        }

        // ================================================================
        // 18. MODAL CLOSURES
        // ================================================================
        function initModalClosures() {
            var certModal = document.getElementById('certificateModal');
            var certClose = document.getElementById('modalClose');
            if (certModal && certClose) {
                certClose.addEventListener('click', function() {
                    certModal.classList.remove('active');
                    document.body.style.overflow = 'auto';
                });
                certModal.addEventListener('click', function(e) {
                    if (e.target === this) {
                        this.classList.remove('active');
                        document.body.style.overflow = 'auto';
                    }
                });
            }

            var videoModal = document.getElementById('videoModal');
            var videoClose = document.getElementById('videoClose');
            var video = document.getElementById('projectVideo');
            if (videoModal && videoClose) {
                videoClose.addEventListener('click', function() {
                    videoModal.classList.remove('active');
                    document.body.style.overflow = 'auto';
                    if (video) video.pause();
                });
                videoModal.addEventListener('click', function(e) {
                    if (e.target === this) {
                        this.classList.remove('active');
                        document.body.style.overflow = 'auto';
                        if (video) video.pause();
                    }
                });
            }
        }

        // ================================================================
        // 19. TOAST
        // ================================================================
        function showToast(message, type) {
            type = type || 'success';
            var toast = document.getElementById('toast');
            if (!toast) return;
            var msgEl = toast.querySelector('.toast-message');
            var icon = toast.querySelector('i');
            var prog = toast.querySelector('.toast-progress');

            msgEl.textContent = message;
            icon.className = type === 'success' ? 'fas fa-check-circle' :
                (type === 'error' ? 'fas fa-exclamation-circle' :
                    (type === 'warning' ? 'fas fa-exclamation-triangle' : 'fas fa-info-circle'));
            toast.style.borderLeftColor = type === 'success' ? '#10b981' :
                (type === 'error' ? '#ef4444' :
                    (type === 'warning' ? '#f59e0b' : '#3b82f6'));

            if (prog) {
                prog.style.width = '100%';
                prog.style.transition = 'none';
                void prog.offsetWidth;
                prog.style.transition = 'width 3s linear';
                prog.style.width = '0%';
            }

            toast.classList.add('show');
            clearTimeout(toast._timer);
            toast._timer = setTimeout(function() {
                toast.classList.remove('show');
            }, 3000);
        }

        // ================================================================
        // 20. EDUCATION ANIMATION
        // ================================================================
        function initEducationAnimation() {
            var items = document.querySelectorAll('.timeline-item');
            function check() {
                items.forEach(function(item) {
                    var top = item.getBoundingClientRect().top;
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
        // 21. INIT
        // ================================================================
        function initializeAll() {
            initLoader();
            initTheme();
            initTyping();
            initMobileNav();
            initSmoothScroll();
            initBackToTop();
            loadSkillsData();
            loadEnhancedProjects();
            loadEnhancedCertificates();
            initImagePreviews();
            initQRCodeModals();
            initContactForm();
            initNewsletter();
            initResumeDownload();
            initModalClosures();
            initEducationAnimation();

            document.addEventListener('keydown', function(e) {
                if ((e.ctrlKey || e.metaKey) && e.key === 't') {
                    e.preventDefault();
                    var toggle = document.getElementById('theme-toggle');
                    if (toggle) toggle.click();
                }
                if (e.key === 'Escape') {
                    var active = document.querySelector('.modal.active');
                    if (active) {
                        active.classList.remove('active');
                        document.body.style.overflow = 'auto';
                        var v = document.getElementById('projectVideo');
                        if (v) { v.pause();
                            v.currentTime = 0; }
                    }
                }
            });

            setTimeout(function() {
                initAllAnimations();
            }, 100);
        }

        document.addEventListener('DOMContentLoaded', initializeAll);

        window.addEventListener('load', function() {
            document.body.classList.add('fully-loaded');
            setTimeout(function() { updateAllCounters(); }, 500);
        });

        // Expose globals for onclick
        window.downloadEnhancedCertificate = downloadEnhancedCertificate;
        window.viewEnhancedCertificate = viewEnhancedCertificate;
        window.loadMoreEnhancedCertificates = loadMoreEnhancedCertificates;
        window.showLessEnhancedCertificates = showLessEnhancedCertificates;
        window.showToast = showToast;
        window.loadMoreProjects = loadMoreProjects;
        window.showLessProjects = showLessProjects;
