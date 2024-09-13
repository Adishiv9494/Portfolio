
let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

menuIcon.onclick = () => {
    menuIcon.classList.toggle('fa-xmark');
    navbar.classList.toggle('active');
};

let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav a');

window.onscroll = () => {
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

ScrollReveal({
    distance: '80px',
    duration: 2000,
    delay: 200,
});
ScrollReveal().reveal('.home-content, .heading', {
    origin: 'top'
});
ScrollReveal().reveal('.home-img, .services-container, .portfolio-box, .contact form', {
    origin: 'bottom'
});
ScrollReveal().reveal('.home-content h1, .about-img', {
    origin: 'left'
});
ScrollReveal().reveal('.home-content p, .about-content', {
    origin: 'right'
});

const typed = new Typed('.multiple-text', {
    strings: ['Frontend Developer', 'Full Stack Developer','Web Designer', 'App Developer'],
    typeSpeed: 70,
    backSpeed: 70,
    backDelay: 1000,
    loop: true,
});

const form = document.querySelector("form");
const fullName = document.getElementById("name");
const  email= document.getElementById("email");
const number = document.getElementById("number");
const subject = document.getElementById("subject");
const mess = document.getElementById("message");

function sendEmail(){
  const bodyMessage = `Full Name: ${fullName.value}<br> Email: ${email.value}<br> Number: ${number.value}<br> Message: ${mess.value}`;

  Email.send({
    SecureToken: "0e1cf1ac-9547-4e51-9ead-cbcc34744ef9",
   
    To : 'myportfoliomails01@gmail.com',
    From : "myportfoliomails01@gmail.com",
    Subject : subject.value,
    Body : bodyMessage
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
  
  if(!fullName.classList.contains("error") && !email.classList.contains("error") && !number.classList.contains("error") && !subject.classList.contains("error") && !mess.classList.contains("error")){
    sendEmail();
    form.reset();
  }
   
});
function loaderAnimation() {
  var loader = document.querySelector("#loader")
  setTimeout(function () {
      loader.style.top = "-100%"
  }, 4200)
}
loaderAnimation();