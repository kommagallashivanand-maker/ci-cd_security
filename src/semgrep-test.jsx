// =============================================================================
// semgrep-test.jsx
// PURPOSE: Intentionally vulnerable code to verify Semgrep is detecting issues.
// DO NOT use any of this in production.
// =============================================================================


// -----------------------------------------------------------------------------
// 1. eval() — should trigger p/javascript (eval injection)
// -----------------------------------------------------------------------------
function runUserCode(userInput) {
  eval(userInput); // UNSAFE: arbitrary code execution
}


// -----------------------------------------------------------------------------
// 2. dangerouslySetInnerHTML — should trigger p/react (XSS)
// -----------------------------------------------------------------------------
function RenderHtml({ htmlContent }) {
  return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
}


// -----------------------------------------------------------------------------
// 3. document.write — should trigger p/javascript (DOM XSS)
// -----------------------------------------------------------------------------
function writeToPage(userInput) {
  document.write(userInput); // UNSAFE: DOM XSS
}


// -----------------------------------------------------------------------------
// 4. innerHTML assignment — should trigger p/javascript (DOM XSS)
// -----------------------------------------------------------------------------
function setContent(userInput) {
  document.getElementById("app").innerHTML = userInput; // UNSAFE: XSS
}


// -----------------------------------------------------------------------------
// 5. Hardcoded secret — should trigger p/javascript (hardcoded credentials)
// -----------------------------------------------------------------------------
const API_KEY = "hardcoded-secret-key-1234567890abcdef"; // UNSAFE: hardcoded secret


// -----------------------------------------------------------------------------
// 6. localStorage storing sensitive data — should trigger p/react or p/javascript
// -----------------------------------------------------------------------------
function storeToken(token) {
  localStorage.setItem("authToken", token); // UNSAFE: sensitive data in localStorage
}


// -----------------------------------------------------------------------------
// 7. setTimeout with string argument — should trigger p/javascript (eval-like)
// -----------------------------------------------------------------------------
function delayedExec(userInput) {
  setTimeout(userInput, 1000); // UNSAFE: string passed to setTimeout acts like eval
}


// -----------------------------------------------------------------------------
// 8. Prototype pollution — should trigger p/javascript
// -----------------------------------------------------------------------------
function merge(target, source) {
  for (const key in source) {
    target[key] = source[key]; // UNSAFE: potential prototype pollution
  }
}


export {
  runUserCode,
  RenderHtml,
  writeToPage,
  setContent,
  storeToken,
  delayedExec,
  merge,
};
