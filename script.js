 // Initialize Particles.js
        particlesJS("particles-js", {
            particles: {
                number: { value: 100, density: { enable: true, value_area: 500 } },
                color: { value: "#3b82f6" },
                shape: { type: "circle", stroke: { width: 0, color: "#000000" } },
                opacity: { value: 0.9, random: true },
                size: { value: 5, random: true },
                line_linked: {
                    enable: true,
                    distance: 120,
                    color: "#ff7b00",
                    opacity: 0.8,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: "none",
                    random: true,
                    straight: false,
                    out_mode: "out",
                    bounce: false
                }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: { enable: true, mode: "repulse" },
                    onclick: { enable: true, mode: "push" },
                    resize: true
                }
            },
            retina_detect: true
        });

        // Custom Cursor
        const cursor = document.querySelector('.cursor');
        const cursorFollower = document.querySelector('.cursor-follower');

        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';

            // Add a slight delay to the follower for a smooth trailing effect
            setTimeout(() => {
                cursorFollower.style.left = e.clientX + 'px';
                cursorFollower.style.top = e.clientY + 'px';
            }, 100);
        });

        // Add hover effects to interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .btn, .education-box, .certificate-box, .skills-box, .project-item, .service-box, .theme-toggle, .img-container, .social-media a, .project-links a, .certificate-btn, .live-demo-btn');

        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hover');
                cursorFollower.classList.add('hover');
            });

            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover');
                cursorFollower.classList.remove('hover');
            });
        });

        // Theme Toggle
        const themeToggle = document.getElementById('theme-toggle');
        const html = document.documentElement;

        // Check for saved theme preference or use preferred color scheme
        const savedTheme = localStorage.getItem('theme') ||
            (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');

        if (savedTheme === 'light') {
            html.setAttribute('data-theme', 'light');
        } else {
            html.setAttribute('data-theme', 'dark');
        }

        themeToggle.addEventListener('click', () => {
            if (html.getAttribute('data-theme') === 'dark') {
                html.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
            } else {
                html.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            }
        });

        // Menu Toggle
        let menuIcon = document.querySelector('#menu-icon');
        let navbar = document.querySelector('.navbar');

        menuIcon.onclick = () => {
            menuIcon.classList.toggle('fa-xmark');
            navbar.classList.toggle('active');
        };

        // Active Section Highlight
        let sections = document.querySelectorAll('section');
        let navLinks = document.querySelectorAll('header nav a');

        window.onscroll = () => {
            // Active section highlight
            sections.forEach(sec => {
                let top = window.scrollY;
                let offset = sec.offsetTop - 150;
                let height = sec.offsetHeight;
                let id = sec.getAttribute('id');

                if (top >= offset && top < offset + height) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                    });
                    document.querySelector(`header nav a[href*='${id}']`).classList.add('active');
                }
            });

            let header = document.querySelector('header');
            header.classList.toggle('sticky', window.scrollY > 100);

            menuIcon.classList.remove('fa-xmark');
            navbar.classList.remove('active');
        };

        // Scroll Reveal Animation
        ScrollReveal({
            distance: '80px',
            duration: 2000,
            delay: 200,
        });

        ScrollReveal().reveal('.home-content, .heading', { origin: 'top' });
        ScrollReveal().reveal('.home-img, .project-item, .contact form, .education-container, .skills-container', { origin: 'bottom' });
        ScrollReveal().reveal('.home-content h1, .about-img', { origin: 'left' });
        ScrollReveal().reveal('.home-content p, .about-content', { origin: 'right' });

        // Typed Text Animation
        const typed = new Typed('.multiple-text', {
            strings: ['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Web Developer', 'Software Developer'],
            typeSpeed: 70,
            backSpeed: 70,
            backDelay: 1000,
            loop: true,
        });

        // Loader Animation
        function loaderAnimation() {
            var loader = document.querySelector("#loader")
            setTimeout(function () {
                loader.style.top = "-100%"
                document.body.style.overflow = 'auto';
            }, 4000)
        }
        loaderAnimation();

        // Toast Functions
        function showToast(message, type = 'default') {
            const toast = document.getElementById('downloadToast');
            const icon = toast.querySelector('i');
            const text = toast.querySelector('.text');

            // Update content
            text.textContent = message;

            // Reset classes
            toast.className = 'toast';

            // Set icon based on type
            if (type === 'success') {
                icon.className = 'fas fa-check';
                toast.classList.add('success');
            } else if (type === 'error') {
                icon.className = 'fas fa-times';
                toast.classList.add('error');
            } else {
                icon.className = 'fas fa-download';
            }

            // Show toast
            toast.classList.add('show');

            // Auto-hide after 3 seconds
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }

        function hideToast() {
            const toast = document.getElementById('downloadToast');
            toast.classList.remove('show');
        }

        // Download Functionality with Toast Notification
        const resumeBtn = document.getElementById('resumeBtn');

        resumeBtn.addEventListener('click', function (e) {
            e.preventDefault();

            // Show downloading toast
            showToast('Downloading resume...');

            // Simulate download with a delay
            setTimeout(() => {
                try {
                    // Create a temporary anchor element
                    const link = document.createElement('a');
                    link.href = 'Aditya_Resume.pdf';
                    link.download = 'Aditya_Resume.pdf';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);

                    // Show success toast
                    showToast('Resume downloaded successfully!', 'success');
                } catch (error) {
                    // Show error toast if download fails
                    showToast('Download failed! Please try again.', 'error');
                    console.error('Download error:', error);
                }
            }, 1000);
        });

        // Add event listeners to certificate download buttons
        const certificateButtons = document.querySelectorAll('.certificate-btn');

        certificateButtons.forEach(button => {
            button.addEventListener('click', function (e) {
                // Prevent default to allow toast notification
                e.preventDefault();

                // Get the download URL and filename
                const downloadUrl = this.href;
                const fileName = this.getAttribute('download');

                // Show downloading toast
                showToast(`Downloading ${fileName}...`);

                // Simulate download with a delay
                setTimeout(() => {
                    try {
                        // Create a temporary anchor element
                        const link = document.createElement('a');
                        link.href = downloadUrl;
                        link.download = fileName;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);

                        // Show success toast
                        showToast(`${fileName} downloaded successfully!`, 'success');
                    } catch (error) {
                        // Show error toast if download fails
                        showToast(`Download failed for ${fileName}!`, 'error');
                        console.error('Download error:', error);
                    }
                }, 1000);
            });
        });

        // Video Modal Functionality
        const videoModal = document.getElementById('videoModal');
        const projectVideo = document.getElementById('projectVideo');
        const modalTitle = document.getElementById('modalTitle');
        const closeModal = document.getElementById('closeModal');
        const liveDemoButtons = document.querySelectorAll('.live-demo-btn');

        // Function to open modal with video
        function openVideoModal(videoSrc, title) {
            modalTitle.textContent = title;
            projectVideo.src = videoSrc;
            videoModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
        }

        // Function to close modal
        function closeVideoModal() {
            videoModal.classList.remove('active');
            projectVideo.pause();
            projectVideo.currentTime = 0;
            document.body.style.overflow = 'auto'; // Re-enable scrolling
        }

        // Add event listeners to live demo buttons
        liveDemoButtons.forEach(button => {
            button.addEventListener('click', function (e) {
                e.preventDefault();
                const videoSrc = this.getAttribute('data-video');
                const title = this.getAttribute('data-title');
                openVideoModal(videoSrc, title);
            });
        });

        // Close modal when clicking close button
        closeModal.addEventListener('click', closeVideoModal);

        // Close modal when clicking outside the modal content
        videoModal.addEventListener('click', function (e) {
            if (e.target === videoModal) {
                closeVideoModal();
            }
        });

        // Close modal when video ends
        projectVideo.addEventListener('ended', closeVideoModal);

        // Close modal with Escape key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && videoModal.classList.contains('active')) {
                closeVideoModal();
            }
        });
        // Solar System Implementation
        function initSolarSystem() {
            // Scene setup
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
            const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(window.devicePixelRatio);
            document.getElementById('solar-system').appendChild(renderer.domElement);

            // Position camera for a better view
            camera.position.set(0, 50, 100);

            // Add more realistic lighting
            const ambientLight = new THREE.AmbientLight(0x333333, 0.5);
            scene.add(ambientLight);

            const sunLight = new THREE.PointLight(0xffffff, 1.5, 1000);
            sunLight.position.set(0, 0, 0);
            scene.add(sunLight);

            // Add directional light for better planet illumination
            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
            directionalLight.position.set(5, 3, 5);
            scene.add(directionalLight);

            // Add orbit controls
            const controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.05;
            controls.rotateSpeed = 0.5;
            controls.enableZoom = true;
            controls.autoRotate = true;
            controls.autoRotateSpeed = 0.3;
            controls.minDistance = 50;
            controls.maxDistance = 300;

            // Create more realistic stars background
            const starGeometry = new THREE.BufferGeometry();
            const starCount = 10000;
            const positionArray = new Float32Array(starCount * 3);
            const colorArray = new Float32Array(starCount * 3);
            const sizeArray = new Float32Array(starCount);

            for (let i = 0; i < starCount * 3; i += 3) {
                positionArray[i] = (Math.random() - 0.5) * 3000;
                positionArray[i + 1] = (Math.random() - 0.5) * 3000;
                positionArray[i + 2] = (Math.random() - 0.5) * 3000;

                // Add some color variation to stars
                const colorIntensity = 0.8 + Math.random() * 0.2;
                colorArray[i] = colorIntensity;
                colorArray[i + 1] = colorIntensity;
                colorArray[i + 2] = colorIntensity;

                // Vary star sizes
                sizeArray[i / 3] = Math.random() * 2 + 0.5;
            }

            starGeometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3));
            starGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
            starGeometry.setAttribute('size', new THREE.BufferAttribute(sizeArray, 1));

            const starMaterial = new THREE.PointsMaterial({
                color: 0xffffff,
                size: 2,
                sizeAttenuation: true,
                vertexColors: true,
                transparent: true
            });

            const stars = new THREE.Points(starGeometry, starMaterial);
            scene.add(stars);

            // Create glowing orbit lines
            const orbitMaterial = new THREE.LineBasicMaterial({
                color: 0x8888ff,
                transparent: true,
                opacity: 0.3,
                linewidth: 1
            });

            // Create planets with more realistic properties
            const planets = [
                { name: 'sun', radius: 10, color: 0xffcc00, rotationSpeed: 0.002, orbitRadius: 0, orbitSpeed: 0, texture: null },
                { name: 'mercury', radius: 1.5, color: 0x8c8c8c, rotationSpeed: 0.006, orbitRadius: 20, orbitSpeed: 0.015 },
                { name: 'venus', radius: 2.2, color: 0xe6c8a5, rotationSpeed: 0.004, orbitRadius: 30, orbitSpeed: 0.012 },
                { name: 'earth', radius: 2.5, color: 0x6b93d6, rotationSpeed: 0.008, orbitRadius: 40, orbitSpeed: 0.01 },
                { name: 'mars', radius: 2, color: 0xc1440e, rotationSpeed: 0.007, orbitRadius: 50, orbitSpeed: 0.008 },
                { name: 'jupiter', radius: 5, color: 0xd8ca9d, rotationSpeed: 0.012, orbitRadius: 65, orbitSpeed: 0.004 },
                { name: 'saturn', radius: 4.5, color: 0xf1e6c0, rotationSpeed: 0.01, orbitRadius: 80, orbitSpeed: 0.003 },
                { name: 'uranus', radius: 3.5, color: 0xc6e2ff, rotationSpeed: 0.005, orbitRadius: 95, orbitSpeed: 0.002 },
                { name: 'neptune', radius: 3.5, color: 0x5b5ddf, rotationSpeed: 0.005, orbitRadius: 110, orbitSpeed: 0.0015 }
            ];

            const planetObjects = [];
            const planetGroup = new THREE.Group();
            scene.add(planetGroup);

            // Create orbital lines for each planet
            planets.forEach(planet => {
                if (planet.orbitRadius > 0) {
                    const orbitGeometry = new THREE.BufferGeometry();
                    const points = [];
                    const segments = 128;

                    for (let i = 0; i <= segments; i++) {
                        const theta = (i / segments) * Math.PI * 2;
                        points.push(
                            new THREE.Vector3(
                                Math.cos(theta) * planet.orbitRadius,
                                0,
                                Math.sin(theta) * planet.orbitRadius
                            )
                        );
                    }

                    orbitGeometry.setFromPoints(points);
                    const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
                    scene.add(orbitLine);
                }
            });

            // Create rings for Saturn
            const saturnRingGeometry = new THREE.RingGeometry(5, 7, 64);
            const saturnRingMaterial = new THREE.MeshBasicMaterial({
                color: 0xf0e6b2,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.8
            });
            const saturnRing = new THREE.Mesh(saturnRingGeometry, saturnRingMaterial);
            saturnRing.rotation.x = Math.PI / 2;

            // Create glow effect for sun
            const sunGlowGeometry = new THREE.SphereGeometry(12, 32, 32);
            const sunGlowMaterial = new THREE.MeshBasicMaterial({
                color: 0xff9900,
                transparent: true,
                opacity: 0.3
            });
            const sunGlow = new THREE.Mesh(sunGlowGeometry, sunGlowMaterial);
            scene.add(sunGlow);

            // Create planets with enhanced materials
            planets.forEach(planet => {
                const geometry = new THREE.SphereGeometry(planet.radius, 64, 64);

                // Use Phong material for better lighting effects
                const material = new THREE.MeshPhongMaterial({
                    color: planet.color,
                    shininess: 30,
                    specular: 0xffffff,
                    emissive: planet.name === 'sun' ? planet.color : 0x000000,
                    emissiveIntensity: planet.name === 'sun' ? 0.8 : 0
                });

                const mesh = new THREE.Mesh(geometry, material);

                if (planet.name === 'sun') {
                    // Add sun to scene directly (not in planet group)
                    scene.add(mesh);
                    planetObjects.push({
                        mesh: mesh,
                        data: planet,
                        angle: Math.random() * Math.PI * 2
                    });
                }
                else if (planet.name === 'saturn') {
                    const saturnGroup = new THREE.Group();
                    saturnGroup.add(mesh);
                    saturnGroup.add(saturnRing.clone());
                    planetGroup.add(saturnGroup);
                    planetObjects.push({
                        mesh: saturnGroup,
                        data: planet,
                        angle: Math.random() * Math.PI * 2
                    });
                } else {
                    planetGroup.add(mesh);
                    planetObjects.push({
                        mesh: mesh,
                        data: planet,
                        angle: Math.random() * Math.PI * 2
                    });
                }
            });

            // Add asteroid belt with more asteroids
            const asteroidBeltGeometry = new THREE.BufferGeometry();
            const asteroidCount = 5000;
            const asteroidPositions = new Float32Array(asteroidCount * 3);
            const asteroidSizes = new Float32Array(asteroidCount);

            for (let i = 0; i < asteroidCount * 3; i += 3) {
                const angle = Math.random() * Math.PI * 2;
                const distance = 55 + Math.random() * 5;
                const height = (Math.random() - 0.5) * 2;

                asteroidPositions[i] = Math.cos(angle) * distance;
                asteroidPositions[i + 1] = height;
                asteroidPositions[i + 2] = Math.sin(angle) * distance;

                // Random asteroid size
                asteroidSizes[i / 3] = Math.random() * 0.5 + 0.1;
            }

            asteroidBeltGeometry.setAttribute('position', new THREE.BufferAttribute(asteroidPositions, 3));
            asteroidBeltGeometry.setAttribute('size', new THREE.BufferAttribute(asteroidSizes, 1));

            const asteroidMaterial = new THREE.PointsMaterial({
                color: 0x888888,
                size: 0.5,
                sizeAttenuation: true
            });

            const asteroidBelt = new THREE.Points(asteroidBeltGeometry, asteroidMaterial);
            scene.add(asteroidBelt);

            // Animation
            function animate() {
                requestAnimationFrame(animate);

                controls.update();

                // Update planet positions and rotations
                planetObjects.forEach(planet => {
                    if (planet.data.orbitRadius > 0) {
                        planet.angle += planet.data.orbitSpeed;
                        planet.mesh.position.x = Math.cos(planet.angle) * planet.data.orbitRadius;
                        planet.mesh.position.z = Math.sin(planet.angle) * planet.data.orbitRadius;

                        // Add slight vertical variation for more natural look
                        planet.mesh.position.y = Math.sin(planet.angle * 0.7) * 2;
                    }
                    planet.mesh.rotation.y += planet.data.rotationSpeed;

                    // Special rotation for Saturn's rings
                    if (planet.data.name === 'saturn') {
                        planet.mesh.children[1].rotation.y += 0.005;
                    }
                });

                // Rotate asteroid belt
                asteroidBelt.rotation.y += 0.0007;

                // Slowly rotate the entire system
                planetGroup.rotation.y += 0.0003;

                // Pulsate sun glow
                const pulseIntensity = 0.05 * Math.sin(Date.now() * 0.001) + 1;
                sunGlow.scale.set(pulseIntensity, pulseIntensity, pulseIntensity);

                renderer.render(scene, camera);
            }

            // Handle window resize
            function onWindowResize() {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            }

            window.addEventListener('resize', onWindowResize, false);

            // Theme change handler
            function updateSolarSystemTheme(theme) {
                if (theme === 'dark') {
                    // Dark theme colors - more vibrant for dark mode
                    orbitMaterial.color.set(0x4488ff);
                    orbitMaterial.opacity = 0.4;
                    ambientLight.intensity = 0.4;
                    sunLight.intensity = 2.0;
                } else {
                    // Light theme colors
                    orbitMaterial.color.set(0x4488ff);
                    orbitMaterial.opacity = 0.2;
                    ambientLight.intensity = 0.7;
                    sunLight.intensity = 1.5;
                }
            }

            // Initial theme setup
            updateSolarSystemTheme(document.documentElement.getAttribute('data-theme'));

            // Listen for theme changes
            const themeToggle = document.getElementById('theme-toggle');
            if (themeToggle) {
                themeToggle.addEventListener('click', () => {
                    const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
                    setTimeout(() => updateSolarSystemTheme(newTheme), 100);
                });
            }

            // Start animation
            animate();
        }

        // Initialize solar system when page loads
        window.addEventListener('load', initSolarSystem);