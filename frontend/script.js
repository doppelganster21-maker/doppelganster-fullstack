
// const uploadForm = document.getElementById('uploadForm');
// const statusEl = document.getElementById('status');
// const galleryGrid = document.getElementById('galleryGrid');
// const emptyMsg = document.getElementById('emptyMsg');
// const searchInput = document.getElementById('searchInput');
// const nextPageBtn = document.getElementById('nextPageBtn');
// const prevPageBtn = document.getElementById('prevPageBtn');

// let currentPage = 0;
// let items = [];

// // Escape HTML
// function escapeHtml(str) {
//   return String(str).replace(/[&<>"']/g, m => ({
//     '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
//   }[m]));
// }

// function getItemsPerPage() {
//   return window.innerWidth <= 820 ? 6 : 12;
// }

// function renderGallery(itemsList) {
//   galleryGrid.innerHTML = '';
//   const filtered = itemsList.filter(item => (item.name || '').toLowerCase().includes(searchInput.value.toLowerCase()));
//   const perPage = getItemsPerPage();
//   const start = currentPage * perPage;
//   const paged = filtered.slice(start, start + perPage);

//   prevPageBtn.disabled = currentPage === 0;
//   nextPageBtn.disabled = (start + perPage) >= filtered.length;

//   if (paged.length === 0) {
//     emptyMsg.style.display = 'block';
//     return;
//   }
//   emptyMsg.style.display = 'none';

//   paged.forEach(item => {
//     const symbol = item.currency || '₹';
//     const rewardDisplay = `${escapeHtml(symbol)}${escapeHtml(item.reward || 0)}`;
//     const tile = document.createElement('div');
//     tile.className = 'tile';
//     tile.innerHTML = `
//       <img src="${item.url}" alt="Uploaded Image"/>
//       <div class="reward-label">${rewardDisplay}</div>
//       <div class="meta">
//         <b>${escapeHtml(item.name || 'Anonymous')}</b>
//         <div class="small muted">${escapeHtml(item.email || '')}</div>
//       </div>`;
//     galleryGrid.appendChild(tile);
//   });
// }

// function setStatus(msg) {
//   statusEl.textContent = msg;
// }

// function resetForm() {
//   uploadForm.reset();
//   setStatus('');
// }

// async function loadItems() {
//   const base = window.location.origin;
//   try {
//     const res = await fetch(base + '/api/images');
//     if (!res.ok) throw new Error('Failed to load images');
//     items = await res.json();
//   } catch (e) {
//     console.warn('Could not load images:', e);
//     items = [];
//   }
//   renderGallery(items);
// }

// async function saveItem(formData) {
//   const base = window.location.origin;
//   const res = await fetch(base + '/api/upload', { method: 'POST', body: formData });
//   if (!res.ok) {
//     const err = await res.json();
//     throw new Error(err.error || 'Upload failed');
//   }
//   return await res.json();
// }

// async function checkFaceInImage(file) {
//   return new Promise(async (resolve, reject) => {
//     if (!window.faceapi) {
//       const script = document.createElement('script');
//       script.src = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.0.2/dist/face-api.min.js';
//       script.onload = async () => {
//         await loadModels();
//         detectFace();
//       };
//       script.onerror = () => reject('Failed to load face-api library');
//       document.head.appendChild(script);
//     } else {
//       await loadModels();
//       detectFace();
//     }
//     async function loadModels() {
//       await faceapi.nets.tinyFaceDetector.loadFromUri('https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.0.2/model/');
//     }
//     async function detectFace() {
//       try {
//         const img = new Image();
//         img.src = URL.createObjectURL(file);
//         img.onload = async () => {
//           const detection = await faceapi.detectSingleFace(img, new faceapi.TinyFaceDetectorOptions());
//           URL.revokeObjectURL(img.src);
//           resolve(!!detection);
//         };
//         img.onerror = () => resolve(false);
//       } catch {
//         resolve(false);
//       }
//     }
//   });
// }

// uploadForm.addEventListener('submit', async e => {
//   e.preventDefault();
//   const name = document.getElementById('name').value.trim();
//   const email = document.getElementById('email').value.trim();
//   const reward = document.getElementById('reward').value;
//   const currency = document.getElementById('currency').value;
//   const fileInput = document.getElementById('file');
//   const file = fileInput.files[0];
//   if (!file) { setStatus('Please choose an image file.'); return; }

//   const formData = new FormData();
//   formData.append('name', name);
//   formData.append('email', email);
//   formData.append('reward', reward);
//   formData.append('currency', currency);
//   formData.append('file', file);

//   setStatus('Checking face in the image...');
//   try {
//     const faceFound = await checkFaceInImage(file);
//     if (!faceFound) {
//       setStatus('No face detected in the image. Please upload a clear face photo.');
//       return;
//     }
//     setStatus('Uploading...');
//     await saveItem(formData);
//     await loadItems();
//     resetForm();
//     setStatus('Uploaded successfully.');
//   } catch (err) {
//     console.error(err);
//     setStatus('Upload failed: ' + err.message);
//   }
// });

// searchInput.addEventListener('input', () => { currentPage = 0; renderGallery(items); });
// nextPageBtn.addEventListener('click', () => { currentPage++; renderGallery(items); });
// prevPageBtn.addEventListener('click', () => { if (currentPage > 0) currentPage--; renderGallery(items); });

// loadItems();
// window.addEventListener('resize', () => { renderGallery(items); });

const uploadForm = document.getElementById('uploadForm');
const statusEl = document.getElementById('status');
const galleryGrid = document.getElementById('galleryGrid');
const emptyMsg = document.getElementById('emptyMsg');
const searchInput = document.getElementById('searchInput');
const nextPageBtn = document.getElementById('nextPageBtn');
const prevPageBtn = document.getElementById('prevPageBtn');

let currentPage = 0;
let items = [];

// Escape HTML to prevent injection
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, m => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[m]));
}

function getItemsPerPage() {
  return window.innerWidth <= 820 ? 6 : 12;
}

function renderGallery(itemsList) {
  galleryGrid.innerHTML = '';
  const filtered = itemsList.filter(item => (item.name || '').toLowerCase().includes(searchInput.value.toLowerCase()));
  const perPage = getItemsPerPage();
  const start = currentPage * perPage;
  const paged = filtered.slice(start, start + perPage);

  prevPageBtn.disabled = currentPage === 0;
  nextPageBtn.disabled = (start + perPage) >= filtered.length;

  if (paged.length === 0) {
    emptyMsg.style.display = 'block';
    return;
  }
  emptyMsg.style.display = 'none';

  paged.forEach(item => {
    const symbol = item.currency || '₹';
    const rewardDisplay = `${escapeHtml(symbol)}${escapeHtml(item.reward || 0)}`;
    const tile = document.createElement('div');
    tile.className = 'tile';
    tile.innerHTML = `
      <img src="${item.url}" alt="Uploaded Image"/>
      <div class="reward-label">${rewardDisplay}</div>
      <div class="meta">
        <b>${escapeHtml(item.name || 'Anonymous')}</b>
        <div class="small muted">${escapeHtml(item.email || '')}</div>
      </div>`;
    galleryGrid.appendChild(tile);
  });
}

function setStatus(msg) {
  statusEl.textContent = msg;
}

function resetForm() {
  uploadForm.reset();
  setStatus('');
}

async function loadItems() {
  const base = window.location.origin;
  try {
    const res = await fetch(base + '/api/images');
    if (!res.ok) throw new Error('Failed to load images');
    items = await res.json();
  } catch (e) {
    console.warn('Could not load images:', e);
    items = [];
  }
  renderGallery(items);
}

async function saveItem(formData) {
  const base = window.location.origin;
  const res = await fetch(base + '/api/upload', { method: 'POST', body: formData });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Upload failed');
  }
  return await res.json();
}

async function checkFaceInImage(file) {
  return new Promise(async (resolve, reject) => {
    if (!window.faceapi) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.0.2/dist/face-api.min.js';
      script.onload = async () => {
        await loadModels();
        detectFace();
      };
      script.onerror = () => reject('Failed to load face-api library');
      document.head.appendChild(script);
    } else {
      await loadModels();
      detectFace();
    }
    async function loadModels() {
      await faceapi.nets.tinyFaceDetector.loadFromUri('https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.0.2/model/');
    }
    async function detectFace() {
      try {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = async () => {
          const detection = await faceapi.detectSingleFace(img, new faceapi.TinyFaceDetectorOptions());
          URL.revokeObjectURL(img.src);
          resolve(!!detection);
        };
        img.onerror = () => resolve(false);
      } catch {
        resolve(false);
      }
    }
  });
}

uploadForm.addEventListener('submit', async e => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const reward = document.getElementById('reward').value;
  const currency = document.getElementById('currency').value;
  const fileInput = document.getElementById('file');
  const file = fileInput.files[0];
  if (!file) { setStatus('Please choose an image file.'); return; }

  const formData = new FormData();
  formData.append('name', name);
  formData.append('email', email);
  formData.append('reward', reward);
  formData.append('currency', currency);
  formData.append('file', file);

  setStatus('Checking face in the image...');
  try {
    const faceFound = await checkFaceInImage(file);
    if (!faceFound) {
      setStatus('No face detected in the image. Please upload a clear face photo.');
      return;
    }
    setStatus('Uploading...');
    await saveItem(formData);
    await loadItems();
    resetForm();
    setStatus('Uploaded successfully.');
  } catch (err) {
    console.error(err);
    setStatus('Upload failed: ' + err.message);
  }
});

searchInput.addEventListener('input', () => { currentPage = 0; renderGallery(items); });
nextPageBtn.addEventListener('click', () => { currentPage++; renderGallery(items); });
prevPageBtn.addEventListener('click', () => { if (currentPage > 0) currentPage--; renderGallery(items); });

loadItems();
window.addEventListener('resize', () => { renderGallery(items); });
