// Theme Toggle
        const themeToggle = document.getElementById('theme-toggle');
        const html = document.documentElement;

themeToggle.addEventListener('click', () => {
    if (html.getAttribute('data-theme') === 'dark') {
        html.setAttribute('data-theme', 'light');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        html.setAttribute('data-theme', 'dark');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
});
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

// Email Form
const form = document.querySelector("form");
const fullName = document.getElementById("name");
const email = document.getElementById("email");
const number = document.getElementById("number");
const subject = document.getElementById("subject");
const mess = document.getElementById("message");

function sendEmail() {
    const bodyMessage = `Full Name: ${fullName.value}<br> Email: ${email.value}<br> Number: ${number.value}<br> Message: ${mess.value}`;

    Email.send({
        SecureToken: "0e1cf1ac-9547-4e51-9ead-cbcc34744ef9",
        To: 'myportfoliomails01@gmail.com',
        From: "myportfoliomails01@gmail.com",
        Subject: subject.value,
        Body: bodyMessage
    }).then(
        message => {
            if (message == "OK") {
                Swal.fire({
                    title: "Success!",
                    text: "Message sent successfully!",
                    icon: "success"
                });
            }
        }
    );
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!fullName.classList.contains("error") && !email.classList.contains("error") && !number.classList.contains("error") && !subject.classList.contains("error") && !mess.classList.contains("error")) {
        sendEmail();
        form.reset();
    }
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
loaderAnimation();
// Initialize Particles.js
        particlesJS("particles-js", {
            particles: {
                number: { value: 100, density: { enable: true, value_area: 700 } },
                color: { value: "#FF7D00" },
                shape: { type: "circle", stroke: { width: 0, color: "#000000" } },
                opacity: { value: 0.9, random: true },
                size: { value: 5, random: true },
                line_linked: {
                    enable: true,
                    distance: 120,
                    color: "#FF7D00",
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