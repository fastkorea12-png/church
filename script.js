const header = document.querySelector(".site-header");
const inquiryForm = document.querySelector("#inquiryForm");
const formStatus = document.querySelector("#formStatus");
const INQUIRY_ENDPOINT = "";
const FALLBACK_EMAIL = "fastkorea12@gmail.com";
const revealTargets = document.querySelectorAll(
  ".section, .mission-band, .dark-section, .sample-section, .cta-section"
);

const syncHeader = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 24);
};

window.addEventListener("scroll", syncHeader, { passive: true });
syncHeader();

window.addEventListener("load", () => {
  document.body.classList.add("is-loaded");
});

if ("IntersectionObserver" in window) {
  revealTargets.forEach((target) => target.classList.add("reveal"));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  revealTargets.forEach((target) => observer.observe(target));
} else {
  revealTargets.forEach((target) => target.classList.add("is-visible"));
}

const buildMailtoUrl = (data) => {
  const subject = `[작은교회 섬김 프로젝트 문의] ${data.get("churchName") || ""}`;
  const body = [
    "작은교회 섬김 프로젝트 문의가 접수되었습니다.",
    "",
    `교회명: ${data.get("churchName") || ""}`,
    `담당자: ${data.get("contactName") || ""}`,
    `연락처: ${data.get("phone") || ""}`,
    `이메일: ${data.get("email") || ""}`,
    `관심 플랜: ${data.get("plan") || ""}`,
    "",
    "문의 내용:",
    data.get("message") || "",
    "",
    `페이지: ${window.location.href}`,
  ].join("\n");

  return `mailto:${FALLBACK_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

inquiryForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const data = new FormData(inquiryForm);
  data.append("pageUrl", window.location.href);
  data.append("submittedAt", new Date().toISOString());

  const submitButton = inquiryForm.querySelector("button[type='submit']");
  submitButton.disabled = true;
  formStatus.textContent = "문의 내용을 전송하고 있습니다.";

  if (!INQUIRY_ENDPOINT) {
    formStatus.textContent = "이메일 앱을 열어 문의 내용을 전달합니다.";
    window.location.href = buildMailtoUrl(data);
    submitButton.disabled = false;
    return;
  }

  try {
    await fetch(INQUIRY_ENDPOINT, {
      method: "POST",
      mode: "no-cors",
      body: data,
    });

    inquiryForm.reset();
    formStatus.textContent = "문의가 접수되었습니다. 곧 연락드리겠습니다.";
  } catch {
    formStatus.textContent = "전송이 원활하지 않습니다. 이메일 문의 버튼을 이용해 주세요.";
  } finally {
    submitButton.disabled = false;
  }
});
