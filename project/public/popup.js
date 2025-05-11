document.addEventListener('DOMContentLoaded', function () {
    const scanBtn = document.getElementById("scanBtn");
    const resultContainer = document.getElementById("result");
    const statusIndicator = document.getElementById("statusIndicator");
    const statusText = document.getElementById("statusText");
    const resultHeader = document.getElementById("resultHeader");
    const resultTitle = document.getElementById("resultTitle");
    const riskLevel = document.getElementById("riskLevel");
    const confidence = document.getElementById("confidence");
    const confidenceFill = document.getElementById("confidenceFill");
    const explanation = document.getElementById("explanation");
    const currentUrl = document.getElementById("currentUrl");
  
    // Show current tab's URL
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs[0] && tabs[0].url) {
        currentUrl.textContent = tabs[0].url;
      }
  
      // Optional: Check for cached result
      if (chrome.storage && chrome.storage.local) {
        chrome.storage.local.get(tabs[0].url, function (data) {
          if (data && data[tabs[0].url]) {
            displayResult(data[tabs[0].url]);
          }
        });
      }
    });
  
    scanBtn.addEventListener("click", () => {
      scanBtn.disabled = true;
      scanBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin button-icon"></i> Scanning...';
      scanBtn.classList.add('scanning');
      resultContainer.style.display = 'none';
      statusIndicator.className = 'status-indicator';
      statusText.className = 'status-text';
      statusText.textContent = 'Scanning...';
  
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          function: () => {
            return {
              text: document.body.innerText
            };
          }
        }, async (results) => {
          try {
            if (!results || !results[0]) {
              throw new Error("Unable to extract page content.");
            }
  
            const pageContent = results[0].result;
  
            const response = await fetch("http://localhost:8000/predict/email", {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                email_text: pageContent.text || ""
              })
            });
  
            if (!response.ok) {
              throw new Error("API request failed");
            }
  
            const result = await response.json();
  
            // Cache result if allowed
            if (chrome.storage && chrome.storage.local && tabs[0].url) {
              let cache = {};
              cache[tabs[0].url] = result;
              chrome.storage.local.set(cache);
            }
  
            displayResult(result);
  
          } catch (error) {
            console.error("Error during scan:", error);
            displayError();
          } finally {
            scanBtn.disabled = false;
            scanBtn.innerHTML = '<i class="fa-solid fa-shield-halved button-icon"></i> Scan This Page';
            scanBtn.classList.remove('scanning');
          }
        });
      });
    });
  
    function displayResult(result) {
      resultContainer.style.display = 'block';
  
      const confidenceValue = Math.round(result.confidence * 100);
      confidence.textContent = `${confidenceValue}%`;
      confidenceFill.style.width = `${confidenceValue}%`;
      riskLevel.textContent = capitalizeFirstLetter(result.label);
      explanation.textContent = result.explanation;
  
      switch (result.label.toLowerCase()) {
        case 'safe':
          applyStyleForRiskLevel('safe');
          break;
        case 'suspicious':
          applyStyleForRiskLevel('suspicious');
          break;
        case 'phishing':
        case 'dangerous':
          applyStyleForRiskLevel('danger');
          break;
        default:
          applyStyleForRiskLevel('suspicious');
      }
    }
  
    function displayError() {
      resultContainer.style.display = 'block';
      statusIndicator.className = 'status-indicator';
      statusText.className = 'status-text';
      statusText.textContent = 'Scan Failed';
      explanation.textContent = 'Unable to complete the scan. Please try again.';
    }
  
    function applyStyleForRiskLevel(riskLevel) {
      statusIndicator.className = 'status-indicator';
      statusText.className = 'status-text';
      resultHeader.className = 'result-header';
      confidenceFill.className = 'progress-fill';
  
      statusIndicator.classList.add(`status-${riskLevel}`);
      statusText.classList.add(`text-${riskLevel}`);
      resultHeader.classList.add(`result-${riskLevel}`);
      confidenceFill.classList.add(`fill-${riskLevel}`);
  
      switch (riskLevel) {
        case 'safe':
          statusText.textContent = 'Site Appears Safe';
          resultTitle.textContent = 'No Phishing Detected';
          break;
        case 'suspicious':
          statusText.textContent = 'Potentially Suspicious';
          resultTitle.textContent = 'Suspicious Elements Found';
          break;
        case 'danger':
          statusText.textContent = 'Potential Phishing Detected';
          resultTitle.textContent = 'Warning: Phishing Risk';
          break;
      }
    }
  
    function capitalizeFirstLetter(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
  });
  