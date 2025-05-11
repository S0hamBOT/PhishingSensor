// Content Script - runs in the context of web pages

// Create a warning banner for phishing sites
function createPhishingWarning(risk, score) {
  // Remove any existing warning
  const existingWarning = document.getElementById('phishsense-warning');
  if (existingWarning) {
    existingWarning.remove();
  }
  
  // Only create warning for suspicious or dangerous sites
  if (risk !== 'suspicious' && risk !== 'dangerous') {
    return;
  }
  
  // Create warning element
  const warning = document.createElement('div');
  warning.id = 'phishsense-warning';
  warning.style.position = 'fixed';
  warning.style.top = '0';
  warning.style.left = '0';
  warning.style.right = '0';
  warning.style.padding = '12px';
  warning.style.zIndex = '9999999';
  warning.style.display = 'flex';
  warning.style.alignItems = 'center';
  warning.style.justifyContent = 'center';
  warning.style.fontFamily = 'Arial, sans-serif';
  warning.style.fontSize = '14px';
  warning.style.fontWeight = 'bold';
  warning.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
  
  // Style based on risk level
  if (risk === 'dangerous') {
    warning.style.backgroundColor = 'rgba(220, 38, 38, 0.95)'; // red
    warning.style.color = 'white';
  } else { // suspicious
    warning.style.backgroundColor = 'rgba(245, 158, 11, 0.95)'; // amber
    warning.style.color = 'white';
  }
  
  // Create icon element (for simplicity, using emoji)
  const icon = document.createElement('span');
  icon.textContent = risk === 'dangerous' ? '⚠️' : '⚠️';
  icon.style.marginRight = '8px';
  icon.style.fontSize = '16px';
  
  // Create message
  const message = document.createElement('span');
  message.textContent = risk === 'dangerous' 
    ? 'Warning: This site may be a phishing attempt!' 
    : 'Caution: This site has some suspicious characteristics';
  
  // Create "More Info" button
  const button = document.createElement('button');
  button.textContent = 'Details';
  button.style.marginLeft = '12px';
  button.style.padding = '4px 8px';
  button.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
  button.style.color = risk === 'dangerous' ? '#DC2626' : '#F59E0B';
  button.style.border = 'none';
  button.style.borderRadius = '4px';
  button.style.cursor = 'pointer';
  button.style.fontWeight = 'bold';
  
  // Create close button
  const closeButton = document.createElement('button');
  closeButton.textContent = '✕';
  closeButton.style.marginLeft = '12px';
  closeButton.style.backgroundColor = 'transparent';
  closeButton.style.color = 'white';
  closeButton.style.border = 'none';
  closeButton.style.cursor = 'pointer';
  closeButton.style.fontWeight = 'bold';
  closeButton.style.fontSize = '16px';
  closeButton.onclick = () => warning.remove();
  
  // Add event listener to "More Info" button to open extension popup
  button.addEventListener('click', () => {
    // In a real extension, this would open the extension popup
    chrome.runtime.sendMessage({ action: 'open_popup' });
  });
  
  // Assemble the warning banner
  warning.appendChild(icon);
  warning.appendChild(message);
  warning.appendChild(button);
  warning.appendChild(closeButton);
  
  // Add the warning to the page
  document.body.appendChild(warning);
  
  // Push down the page content to make room for the warning
  document.body.style.marginTop = warning.offsetHeight + 'px';
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'phishing_result') {
    const { risk, score } = message.result;
    createPhishingWarning(risk, score);
    sendResponse({ status: 'warning_created' });
  }
  return true;
});

// Also, we'll extract features from the page and analyze on page load
chrome.runtime.sendMessage({ 
  action: 'page_loaded',
  url: window.location.href
});