// =============================================================================
// semgrep-test.jsx
// PURPOSE: Intentionally vulnerable code to trigger Semgrep HIGH/MEDIUM findings
//          and cause the security gate to FAIL.
// DO NOT use any of this in production.
// =============================================================================


// -----------------------------------------------------------------------------
// 1. eval() with user input — p/javascript, p/nodejs
//    Expected severity: HIGH (ERROR-level rule)
// -----------------------------------------------------------------------------
function runUserCode(userInput) {
  eval(userInput);
}


// -----------------------------------------------------------------------------
// 2. dangerouslySetInnerHTML — p/react
//    Expected severity: MEDIUM/HIGH (XSS)
// -----------------------------------------------------------------------------
function RenderHtml({ htmlContent }) {
  return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
}


// -----------------------------------------------------------------------------
// 3. innerHTML assignment — p/dom, p/owasp-top-ten
//    Expected severity: HIGH (DOM XSS)
// -----------------------------------------------------------------------------
function setContent(userInput) {
  document.getElementById("app").innerHTML = userInput;
}


// -----------------------------------------------------------------------------
// 4. document.write — p/dom
//    Expected severity: HIGH (DOM XSS)
// -----------------------------------------------------------------------------
function writeToPage(userInput) {
  document.write(userInput);
}


// -----------------------------------------------------------------------------
// 5. Hardcoded secret — p/secrets
//    Expected severity: HIGH (credential exposure)
// -----------------------------------------------------------------------------
const AWS_SECRET_ACCESS_KEY = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY";
const AWS_ACCESS_KEY_ID     = "AKIAIOSFODNN7EXAMPLE";
const GITHUB_TOKEN          = "ghp_aBcDeFgHiJkLmNoPqRsTuVwXyZ012345";
const DB_PASSWORD           = "SuperSecret@Passw0rd!";


// -----------------------------------------------------------------------------
// 6. Command injection via child_process — p/nodejs
//    Expected severity: HIGH (OS command injection)
// -----------------------------------------------------------------------------
const { exec } = require("child_process");

function runCommand(userInput) {
  exec("ls " + userInput);
}


// -----------------------------------------------------------------------------
// 7. SQL injection pattern — p/owasp-top-ten
//    Expected severity: HIGH (injection)
// -----------------------------------------------------------------------------
function getUser(userId) {
  const query = "SELECT * FROM users WHERE id = " + userId;
  return query;
}


// -----------------------------------------------------------------------------
// 8. Prototype pollution — p/nodejs
//    Expected severity: MEDIUM
// -----------------------------------------------------------------------------
function merge(target, source) {
  for (const key in source) {
    target[key] = source[key];
  }
}


// -----------------------------------------------------------------------------
// 9. setTimeout with string (eval-like) — p/javascript
//    Expected severity: MEDIUM
// -----------------------------------------------------------------------------
function delayedExec(userInput) {
  setTimeout(userInput, 1000);
}


// -----------------------------------------------------------------------------
// 10. Open redirect — p/owasp-top-ten
//     Expected severity: MEDIUM
// -----------------------------------------------------------------------------
function redirect(userInput) {
  window.location.href = userInput;
}


export {
  runUserCode,
  RenderHtml,
  setContent,
  writeToPage,
  runCommand,
  getUser,
  merge,
  delayedExec,
  redirect,
};
