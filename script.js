document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");
  const year = document.querySelector("#year");
  const backToTopBtn = document.querySelector("#back-to-top");

  // Contact Form
  const contactForm = document.querySelector("#contact-form");
  const contactStatus = document.querySelector("#form-status");

  // Article Submission Form
  const submissionForm = document.querySelector("#article-submission-form");
  const submissionStatus = document.querySelector("#submission-status");
  const summaryInput = document.querySelector("#sub-summary");
  const wordCountBadge = document.querySelector("#word-count-badge");
  const dropzone = document.querySelector("#upload-dropzone");
  const fileInput = document.querySelector("#article-attachment");
  const filePreview = document.querySelector("#file-preview");
  const fileNameEl = document.querySelector("#file-name");
  const fileSizeEl = document.querySelector("#file-size");
  const removeFileBtn = document.querySelector("#btn-remove-file");
  const submitArticleBtn = document.querySelector("#btn-submit-article");

  let attachedFile = null;

  // Year in Footer
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  // Mobile Navigation
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

  // Smooth Scroll Transitions on Scrolling Downwards (IntersectionObserver)
  const revealElements = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach((el) => el.classList.add("is-visible"));
  }

  // Window Scroll: Header elevation & Back to Top button
  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;

    if (header) {
      header.style.boxShadow = currentScrollY > 12 ? "0 10px 30px rgba(0,0,0,0.22)" : "none";
    }

    if (backToTopBtn) {
      if (currentScrollY > 320) {
        backToTopBtn.classList.add("is-shown");
      } else {
        backToTopBtn.classList.remove("is-shown");
      }
    }
  }, { passive: true });

  // Back to Top button click
  backToTopBtn?.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  // Contact Form Submission
  contactForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    contactStatus.className = "form-status";
    contactStatus.textContent = "";

    if (!contactForm.checkValidity()) {
      contactStatus.classList.add("is-error");
      contactStatus.textContent = "Please complete all required fields marked with an asterisk (*).";
      contactForm.reportValidity();
      return;
    }

    const formData = new FormData(contactForm);
    const name = formData.get("name") || "there";
    const inquiryType = formData.get("inquiryType") || "General Enquiry";
    const subject = formData.get("subject") || "your inquiry";

    contactStatus.classList.add("is-success");
    contactStatus.innerHTML = `✓ <strong>Inquiry sent successfully!</strong><br />Thank you, ${name}. Your message regarding <em>"${inquiryType}: ${subject}"</em> has been received by the Axis Cooperation Secretariat. We will get back to you shortly.`;
    contactForm.reset();
  });

  // Format File Size
  function formatBytes(bytes, decimals = 1) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  // Handle Selected File
  function handleFile(file) {
    if (!file) return;

    // Check size limit: 25MB
    const maxSizeBytes = 25 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      alert("File is too large. The maximum permitted attachment size is 25MB.");
      resetAttachment();
      return;
    }

    // Allowed extensions
    const validExtensions = [".pdf", ".doc", ".docx", ".png", ".jpg", ".jpeg"];
    const fileName = file.name.toLowerCase();
    const isValid = validExtensions.some((ext) => fileName.endsWith(ext));

    if (!isValid) {
      alert("Unsupported file format. Please upload a PDF, Word document (.docx, .doc), or image (.png, .jpg).");
      resetAttachment();
      return;
    }

    attachedFile = file;
    fileNameEl.textContent = file.name;
    fileSizeEl.textContent = formatBytes(file.size);
    filePreview.classList.add("is-active");
  }

  // Reset Attachment
  function resetAttachment() {
    attachedFile = null;
    if (fileInput) fileInput.value = "";
    if (filePreview) filePreview.classList.remove("is-active");
  }

  // Dropzone Interaction
  dropzone?.addEventListener("click", () => {
    fileInput?.click();
  });

  dropzone?.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      fileInput?.click();
    }
  });

  fileInput?.addEventListener("change", (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  });

  // Drag and Drop Events
  ["dragenter", "dragover"].forEach((eventName) => {
    dropzone?.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.add("is-dragover");
    });
  });

  ["dragleave", "drop"].forEach((eventName) => {
    dropzone?.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.remove("is-dragover");
    });
  });

  dropzone?.addEventListener("drop", (e) => {
    const dt = e.dataTransfer;
    if (dt && dt.files && dt.files[0]) {
      handleFile(dt.files[0]);
    }
  });

  // Remove File Button
  removeFileBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    resetAttachment();
  });

  // Summary Word Counter
  summaryInput?.addEventListener("input", () => {
    const text = summaryInput.value.trim();
    const count = text ? text.split(/\s+/).filter(Boolean).length : 0;
    if (wordCountBadge) {
      wordCountBadge.textContent = `${count} words (300–500 recommended)`;
      if (count >= 300 && count <= 500) {
        wordCountBadge.style.color = "#15803d";
        wordCountBadge.style.fontWeight = "600";
      } else if (count > 500) {
        wordCountBadge.style.color = "#b45309";
      } else {
        wordCountBadge.style.color = "var(--muted)";
        wordCountBadge.style.fontWeight = "500";
      }
    }
  });

  // Article Submission Form Handler
  submissionForm?.addEventListener("submit", (e) => {
    e.preventDefault();

    submissionStatus.className = "submission-status";
    submissionStatus.textContent = "";

    // Validate standard fields
    if (!submissionForm.checkValidity()) {
      submissionStatus.classList.add("is-error");
      submissionStatus.textContent = "Please fill in all required fields marked with an asterisk (*).";
      submissionForm.reportValidity();
      return;
    }

    // Validate attachment
    if (!attachedFile) {
      submissionStatus.classList.add("is-error");
      submissionStatus.textContent = "Please upload your project attachment (PDF, Word document, or image) before submitting.";
      dropzone.scrollIntoView({ behavior: "smooth", block: "center" });
      dropzone.focus();
      return;
    }

    // Submission animation state
    const originalBtnText = submitArticleBtn.innerHTML;
    submitArticleBtn.disabled = true;
    submitArticleBtn.style.opacity = "0.75";
    submitArticleBtn.innerHTML = `
      <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="animation: spin 1s linear infinite;"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
      Submitting article and attachment...
    `;

    setTimeout(() => {
      const refId = "AXIS-SIM-" + Math.floor(100000 + Math.random() * 900000);
      submissionStatus.classList.add("is-success");
      submissionStatus.innerHTML = `
        ✓ <strong>Submission Successful!</strong><br />
        Thank you. Your article and attachment (<em>${attachedFile.name}</em>) have been securely received by the Sunrise Innovation Magazine Editorial Secretariat.<br />
        <strong>Tracking Reference ID: ${refId}</strong>. We will review your entry and contact your guiding teacher shortly.
      `;

      submissionForm.reset();
      resetAttachment();
      if (wordCountBadge) {
        wordCountBadge.textContent = "0 words (300–500 recommended)";
        wordCountBadge.style.color = "var(--muted)";
      }

      submitArticleBtn.disabled = false;
      submitArticleBtn.style.opacity = "1";
      submitArticleBtn.innerHTML = originalBtnText;

      submissionStatus.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 900);
  });
});
