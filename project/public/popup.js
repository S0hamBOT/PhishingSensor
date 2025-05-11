document.getElementById("scanBtn").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: getPageText,
      }, async (results) => {
        const emailText = results[0].result;
  
        const response = await fetch("http://localhost:8000/predict/email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email_text: emailText }),
        });
  
        const result = await response.json();
        document.getElementById("result").innerHTML = `
          <p><strong>Label:</strong> ${result.label}</p>
          <p><strong>Confidence:</strong> ${result.confidence}</p>
          <p><strong>Explanation:</strong> ${result.explanation}</p>
        `;
      });
    });
  });
  
  function getPageText() {
    return document.body.innerText;
  }
  