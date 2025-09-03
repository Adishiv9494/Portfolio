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