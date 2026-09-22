const header = document.querySelector(".site-header");
const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");
const year = document.querySelector("#year");
const form = document.querySelector("#contact-form");
const status = document.querySelector("#form-status");

if (year) year.textContent = new Date().getFullYear();

toggle?.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    toggle?.setAttribute("aria-expanded", "false");
  });
});

window.addEventListener("scroll", () => {
  header.style.boxShadow = window.scrollY > 8 ? "0 10px 30px rgba(0,0,0,0.18)" : "none";
});

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!form.checkValidity()) {
    status.textContent = "Please complete all required fields.";
    status.style.color = "#9b1c1c";
    form.reportValidity();
    return;
  }
  status.style.color = "#0b3d2e";
  status.textContent = "Thank you. The Axis Cooperation Secretariat has received your message.";
  form.reset();
});
