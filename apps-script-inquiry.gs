const SPREADSHEET_ID = "1c9ky0lA_yZQTa7RCMwRm2h4MR4TXSuZqkDK6tTVVZQ8";
const SHEET_NAME = "문의접수";
const NOTIFY_EMAIL = "fastkorea12@gmail.com";

function doPost(e) {
  const params = e.parameter || {};

  const row = [
    new Date(),
    params.churchName || "",
    params.contactName || "",
    params.phone || "",
    params.email || "",
    params.plan || "",
    params.message || "",
    params.pageUrl || "",
    params.source || "",
    "신규",
  ];

  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
  sheet.appendRow(row);

  const subject = `[작은교회 섬김 프로젝트 문의] ${params.churchName || "새 문의"}`;
  const body = [
    "작은교회 섬김 프로젝트 문의가 접수되었습니다.",
    "",
    `교회명: ${params.churchName || ""}`,
    `담당자: ${params.contactName || ""}`,
    `연락처: ${params.phone || ""}`,
    `이메일: ${params.email || ""}`,
    `관심 플랜: ${params.plan || ""}`,
    "",
    "문의 내용:",
    params.message || "",
    "",
    `페이지: ${params.pageUrl || ""}`,
    `스프레드시트: https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit`,
  ].join("\n");

  MailApp.sendEmail(NOTIFY_EMAIL, subject, body);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return ContentService
    .createTextOutput("Small Church Care Project inquiry endpoint is running.")
    .setMimeType(ContentService.MimeType.TEXT);
}
