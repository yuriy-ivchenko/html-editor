// Simple editor logic: run, live preview, save to localStorage, download file
const codeEl = document.getElementById('code');
const output = document.getElementById('output');
const runBtn = document.getElementById('runBtn');
const openBtn = document.getElementById('openBtn');
const downloadBtn = document.getElementById('downloadBtn');
const templates = document.getElementById('templates');
const liveCheckbox = document.getElementById('live');
const clearBtn = document.getElementById('clearBtn');

const STORAGE_KEY = 'alohtml_github_editor_v1';

function run() {
  const html = codeEl.value;
  output.srcdoc = html;
  // save snapshot
  localStorage.setItem(STORAGE_KEY, html);
}

function debounce(fn, ms){let t; return (...a)=>{clearTimeout(t); t=setTimeout(()=>fn(...a), ms)}}

const liveRun = debounce(()=>{ if(liveCheckbox.checked) run() }, 300);

codeEl.addEventListener('input', liveRun);
runBtn.addEventListener('click', run);
templates.addEventListener('change', ()=>{ if(templates.value){ codeEl.value = templates.value; liveRun(); templates.selectedIndex = 0 }});

openBtn.addEventListener('click', ()=>{
  // open current srcdoc in new tab as data URL
  const html = codeEl.value;
  const w = window.open();
  w.document.open();
  w.document.write(html);
  w.document.close();
});

downloadBtn.addEventListener('click', ()=>{
  const blob = new Blob([codeEl.value], {type:'text/html;charset=utf-8'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'page.html';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
});

clearBtn.addEventListener('click', ()=>{
  if(confirm('Очистити редактор і localStorage?')) {
    codeEl.value = '';
    localStorage.removeItem(STORAGE_KEY);
    run();
  }
});

// load from storage
window.addEventListener('load', ()=>{
  const saved = localStorage.getItem(STORAGE_KEY);
  if(saved) codeEl.value = saved;
  run();
});

// allow Ctrl/Cmd+S to download
window.addEventListener('keydown', (e)=>{
  if((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's'){
    e.preventDefault();
    downloadBtn.click();
  }
});
