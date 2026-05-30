// DevUtils - Tool Logic

// Tab switching
document.querySelectorAll('.tool-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tool-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tool-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('panel-' + tab.dataset.tool).classList.add('active');
  });
});

// Toast notification
function showToast(msg) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  document.body.appendChild(t);
  requestAnimationFrame(() => t.classList.add('show'));
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, 2000);
}

function copyOutput(id) {
  const el = document.getElementById(id);
  navigator.clipboard.writeText(el.value).then(() => showToast('Copied!'));
}

function copyText(text) {
  navigator.clipboard.writeText(text).then(() => showToast('Copied!'));
}

// === JSON ===
function formatJson() {
  try {
    const obj = JSON.parse(document.getElementById('jsonInput').value);
    document.getElementById('jsonOutput').value = JSON.stringify(obj, null, 2);
  } catch (e) {
    document.getElementById('jsonOutput').value = 'Error: ' + e.message;
  }
}

function minifyJson() {
  try {
    const obj = JSON.parse(document.getElementById('jsonInput').value);
    document.getElementById('jsonOutput').value = JSON.stringify(obj);
  } catch (e) {
    document.getElementById('jsonOutput').value = 'Error: ' + e.message;
  }
}

function validateJson() {
  try {
    JSON.parse(document.getElementById('jsonInput').value);
    document.getElementById('jsonOutput').value = 'Valid JSON!';
  } catch (e) {
    document.getElementById('jsonOutput').value = 'Invalid: ' + e.message;
  }
}

// === Base64 ===
function encodeBase64() {
  try {
    document.getElementById('base64Output').value = btoa(unescape(encodeURIComponent(document.getElementById('base64Input').value)));
  } catch (e) { document.getElementById('base64Output').value = 'Error: ' + e.message; }
}

function decodeBase64() {
  try {
    document.getElementById('base64Input').value = decodeURIComponent(escape(atob(document.getElementById('base64Output').value)));
  } catch (e) { document.getElementById('base64Input').value = 'Error: ' + e.message; }
}

// === JWT ===
function decodeJwt() {
  const token = document.getElementById('jwtInput').value.trim();
  const parts = token.split('.');
  if (parts.length !== 3) {
    alert('Invalid JWT: must have 3 parts separated by dots');
    return;
  }
  try {
    const header = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    document.getElementById('jwtHeader').textContent = JSON.stringify(header, null, 2);
    document.getElementById('jwtPayload').textContent = JSON.stringify(payload, null, 2);
    document.getElementById('jwtSignature').textContent = parts[2];
    document.getElementById('jwtResult').style.display = 'grid';
  } catch (e) { alert('Decode error: ' + e.message); }
}

// === Regex ===
function testRegex() {
  const pattern = document.getElementById('regexPattern').value;
  const flags = document.getElementById('regexFlags').value;
  const str = document.getElementById('regexTestString').value;
  const result = document.getElementById('regexResult');

  if (!pattern || !str) { result.innerHTML = '<span style="color:var(--text-dim)">Enter a pattern and test string...</span>'; return; }

  try {
    const re = new RegExp(pattern, flags);
    const matches = [...str.matchAll(re)];
    if (matches.length === 0) {
      result.innerHTML = '<span style="color:var(--text-dim)">No matches found.</span>';
      return;
    }

    let html = `<div style="margin-bottom:8px;color:var(--green)">${matches.length} match${matches.length > 1 ? 'es' : ''} found</div>`;

    // Highlighted text
    let highlighted = '';
    let lastIdx = 0;
    const allMatches = [...str.matchAll(re)];
    allMatches.forEach(m => {
      highlighted += escapeHtml(str.slice(lastIdx, m.index));
      highlighted += `<span class="regex-match">${escapeHtml(m[0])}</span>`;
      lastIdx = m.index + m[0].length;
    });
    highlighted += escapeHtml(str.slice(lastIdx));
    html += `<div style="margin-bottom:12px;line-height:1.8">${highlighted}</div>`;

    // Groups
    if (matches[0].length > 1) {
      html += '<div style="color:var(--text-dim);font-size:12px;margin-bottom:6px">Capture Groups:</div>';
      matches.forEach((m, i) => {
        for (let g = 1; g < m.length; g++) {
          html += `<div><span class="regex-group">Match ${i+1}, Group ${g}:</span> ${escapeHtml(m[g] || 'undefined')}</div>`;
        }
      });
    }

    result.innerHTML = html;
  } catch (e) {
    result.innerHTML = `<span style="color:var(--red)">Invalid regex: ${escapeHtml(e.message)}</span>`;
  }
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// === UUID ===
function generateUuids() {
  const count = Math.min(parseInt(document.getElementById('uuidCount').value) || 1, 100);
  const upper = document.getElementById('uuidUppercase').checked;
  const noDash = document.getElementById('uuidNoDash').checked;
  const uuids = [];
  for (let i = 0; i < count; i++) {
    let uuid = crypto.randomUUID();
    if (noDash) uuid = uuid.replace(/-/g, '');
    if (upper) uuid = uuid.toUpperCase();
    uuids.push(uuid);
  }
  document.getElementById('uuidOutput').value = uuids.join('\n');
}

// === URL ===
function encodeUrl() {
  document.getElementById('urlOutput').value = encodeURIComponent(document.getElementById('urlInput').value);
}
function decodeUrl() {
  try { document.getElementById('urlInput').value = decodeURIComponent(document.getElementById('urlOutput').value); }
  catch (e) { document.getElementById('urlInput').value = 'Error: ' + e.message; }
}
function encodeUrlComponent() {
  document.getElementById('urlOutput').value = encodeURIComponent(document.getElementById('urlInput').value);
}

// === HTML Entity ===
function encodeHtml() {
  const el = document.createElement('div');
  el.textContent = document.getElementById('htmlInput').value;
  document.getElementById('htmlOutput').value = el.innerHTML;
}
function decodeHtml() {
  const el = document.createElement('div');
  el.innerHTML = document.getElementById('htmlOutput').value;
  document.getElementById('htmlInput').value = el.textContent;
}

// === Hash ===
async function generateHashes() {
  const text = document.getElementById('hashInput').value;
  if (!text) {
    ['hashSha1', 'hashSha256', 'hashSha512'].forEach(id => {
      document.getElementById(id).textContent = '\u2014';
    });
    return;
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(text);

  const algorithms = [
    ['SHA-1', 'hashSha1'],
    ['SHA-256', 'hashSha256'],
    ['SHA-512', 'hashSha512'],
  ];

  for (const [algo, id] of algorithms) {
    const hashBuffer = await crypto.subtle.digest(algo, data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    document.getElementById(id).textContent = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
}

// Auto-generate UUIDs on load
window.addEventListener('load', generateUuids);
