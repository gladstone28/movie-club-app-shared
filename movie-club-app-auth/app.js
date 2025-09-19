// Movie Club – Shared + Firebase Auth (Google) + Firestore
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore, collection, addDoc, onSnapshot, query, orderBy,
  enableIndexedDbPersistence, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { firebaseConfig } from "./firebase-config.js";

// Init
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
enableIndexedDbPersistence(db).catch(()=>{});

const listEl = document.getElementById('list');
const template = document.getElementById('movieItemTemplate');
const genreSelect = document.getElementById('genre');
const searchForm = document.getElementById('searchForm');
const queryInput = document.getElementById('query');
const resetFiltersBtn = document.getElementById('resetFilters');
const selectAllBtn = document.getElementById('selectAll');
const clearSelectedBtn = document.getElementById('clearSelected');
const exportBtn = document.getElementById('exportBtn');
const seedBtn = document.getElementById('seedBtn');
const selectedListEl = document.getElementById('selectedList');
const countEl = document.getElementById('count');
const statusMsg = document.getElementById('statusMsg');
const themeBtn = document.getElementById('themeBtn');
const reduceMotionBtn = document.getElementById('reduceMotionBtn');
const signInBtn = document.getElementById('signInBtn');
const signOutBtn = document.getElementById('signOutBtn');
const userNameEl = document.getElementById('userName');
const authHint = document.getElementById('authHint');

const addForm = document.getElementById('addForm');
const addTitle = document.getElementById('title');
const addYear = document.getElementById('year');
const addGenre = document.getElementById('genreInput');
const addRuntime = document.getElementById('runtime');

const STORAGE_KEY = 'movie-club-selections-v1';
const STORAGE_PREFS = 'movie-club-prefs-v1';
let movies = []; // live from Firestore
let selected = new Set(load(STORAGE_KEY, []));
let prefs = load(STORAGE_PREFS, { theme: 'dark', reduceMotion: false });
let currentUser = null;

/** Utilities **/
function save(k,v){ localStorage.setItem(k, JSON.stringify(v)); }
function load(k,f){ try{ return JSON.parse(localStorage.getItem(k)) ?? f; }catch{ return f; } }
function unique(arr, key){ return Array.from(new Map(arr.map(x=>[x[key], x])).values()); }
function setDisabled(el, state){ if(Array.isArray(el)) el.forEach(x=>x.disabled=state); else el.disabled=state; }

/** Preferences **/
function applyPrefs(){
  document.documentElement.dataset.theme = (prefs.theme === 'light' ? 'light' : 'dark');
  document.documentElement.style.setProperty('scroll-behavior', prefs.reduceMotion ? 'auto' : 'smooth');
  themeBtn.setAttribute('aria-pressed', prefs.theme === 'light');
  reduceMotionBtn.setAttribute('aria-pressed', prefs.reduceMotion);
}
themeBtn.addEventListener('click', ()=>{
  prefs.theme = (prefs.theme === 'light' ? 'dark' : 'light');
  save(STORAGE_PREFS, prefs); applyPrefs();
});
reduceMotionBtn.addEventListener('click', ()=>{
  prefs.reduceMotion = !prefs.reduceMotion; save(STORAGE_PREFS, prefs); applyPrefs();
});
applyPrefs();

/** Auth UI **/
const provider = new GoogleAuthProvider();
signInBtn.addEventListener('click', async ()=>{
  try{
    await signInWithPopup(auth, provider);
  }catch(err){
    statusMsg.textContent = `Sign-in failed: ${err.message}`;
  }
});
signOutBtn.addEventListener('click', async ()=>{
  await signOut(auth);
});

onAuthStateChanged(auth, (user)=>{
  currentUser = user || null;
  const signedIn = !!currentUser;
  signInBtn.hidden = signedIn;
  signOutBtn.hidden = !signedIn;
  authHint.style.display = signedIn ? 'none' : 'block';

  // Toggle add/seed capabilities
  setDisabled([addTitle, addYear, addGenre, addRuntime], !signedIn);
  setDisabled(addForm.querySelector('button'), !signedIn);
  setDisabled(seedBtn, !signedIn);

  if(signedIn){
    const name = currentUser.displayName || currentUser.email || 'Signed in';
    userNameEl.textContent = `Hello, ${name}`;
    userNameEl.hidden = false;
    statusMsg.textContent = 'Signed in. You can add or seed movies now.';
  }else{
    userNameEl.hidden = true;
    statusMsg.textContent = 'You are signed out. Sign in to add movies.';
  }
});

/** Genres **/
function populateGenres(){
  const genres = Array.from(new Set(movies.map(m=>m.genre))).sort();
  genreSelect.innerHTML = '<option value="">All genres</option>' + genres.map(g=>`<option value="${g}">${g}</option>`).join('');
}

/** Render list **/
let currentFilter = { query: '', genre: '' };
function renderList(filter=currentFilter){
  const q = (filter.query ?? '').trim().toLowerCase();
  const g = (filter.genre ?? '').trim();
  const filtered = movies.filter(m=>{
    const matchesQ = !q || (m.title.toLowerCase().includes(q) || String(m.year).includes(q) || m.genre.toLowerCase().includes(q));
    const matchesG = !g || m.genre === g;
    return matchesQ && matchesG;
  });

  listEl.innerHTML = '';
  for(const m of filtered){
    const node = template.content.firstElementChild.cloneNode(true);
    node.dataset.id = m.id;
    node.querySelector('.title').textContent = m.title;
    node.querySelector('.year').textContent = m.year;
    node.querySelector('.genre').textContent = m.genre;
    node.querySelector('.runtime').textContent = `${m.runtime} min`;
    const cb = node.querySelector('.select');
    cb.checked = selected.has(m.id);
    cb.setAttribute('aria-label', `Select ${m.title}`);
    listEl.appendChild(node);
  }
  statusMsg.textContent = `${filtered.length} result${filtered.length!==1?'s':''}`;
}

/** Selected list (local/private) **/
function renderSelected(){
  selectedListEl.innerHTML = '';
  const rows = movies.filter(m=>selected.has(m.id)).sort((a,b)=>a.title.localeCompare(b.title));
  for(const m of rows){
    const li = document.createElement('li');
    li.textContent = `${m.title} (${m.year})`;
    selectedListEl.appendChild(li);
  }
  countEl.textContent = `${rows.length} selected`;
}

/** Event delegation for selection **/
listEl.addEventListener('change', (e)=>{
  if(e.target.classList.contains('select')){
    const li = e.target.closest('.item');
    const id = li.dataset.id;
    if(e.target.checked) selected.add(id); else selected.delete(id);
    save(STORAGE_KEY, Array.from(selected));
    renderSelected();
  }
});

/** Search and filters **/
searchForm.addEventListener('submit', (e)=>{
  e.preventDefault();
  currentFilter.query = queryInput.value;
  currentFilter.genre = genreSelect.value;
  renderList(currentFilter);
});
resetFiltersBtn.addEventListener('click', ()=>{
  queryInput.value = '';
  genreSelect.value = '';
  currentFilter = { query: '', genre: '' };
  renderList(currentFilter);
});

/** Bulk actions **/
selectAllBtn.addEventListener('click', ()=>{
  const items = listEl.querySelectorAll('.item');
  for(const li of items){
    const id = li.dataset.id;
    const cb = li.querySelector('.select');
    if(!cb.checked){
      cb.checked = true;
      selected.add(id);
    }
  }
  save(STORAGE_KEY, Array.from(selected));
  renderSelected();
});
clearSelectedBtn.addEventListener('click', ()=>{
  selected.clear();
  save(STORAGE_KEY, Array.from(selected));
  listEl.querySelectorAll('.select').forEach(cb => cb.checked = false);
  renderSelected();
});

/** Export to CSV **/
exportBtn.addEventListener('click', ()=>{
  const rows = movies.filter(m=>selected.has(m.id));
  const header = ['Title','Year','Genre','Runtime(min)'];
  const csvRows = [header.join(',')].concat(rows.map(m => [m.title, m.year, m.genre, m.runtime].join(',')));
  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'movie-club-selections.csv';
  document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
});

/** Add Movie – shared (requires auth) **/
addForm.addEventListener('submit', async (e)=>{
  e.preventDefault();
  if(!currentUser){ statusMsg.textContent = 'Please sign in to add movies.'; return; }
  const title = addTitle.value.trim();
  const year = Number(addYear.value);
  const genre = addGenre.value.trim() || 'Other';
  const runtime = Number(addRuntime.value) || 90;
  if(!title || !year) return;
  try{
    await addDoc(collection(db, 'movies'), {
      title, year, genre, runtime,
      createdAt: serverTimestamp(),
      createdBy: {
        uid: currentUser.uid,
        name: currentUser.displayName || null,
        email: currentUser.email || null
      }
    });
    statusMsg.textContent = `Added “${title}”`;
    addForm.reset();
  }catch(err){
    statusMsg.textContent = `Error adding movie: ${err.message}`;
  }
});

/** Seed sample movies (auth required) **/
const seedMovies = [
  { title: 'The Shawshank Redemption', year: 1994, genre: 'Drama', runtime: 142 },
  { title: 'The Godfather', year: 1972, genre: 'Crime', runtime: 175 },
  { title: 'The Matrix', year: 1999, genre: 'Sci-Fi', runtime: 136 },
  { title: 'Avengers: Endgame', year: 2019, genre: 'Action', runtime: 181 },
  { title: 'Indiana Jones and the Last Crusade', year: 1989, genre: 'Adventure', runtime: 127 },
  { title: 'Spirited Away', year: 2001, genre: 'Animation', runtime: 125 },
  { title: 'Up', year: 2009, genre: 'Animation', runtime: 96 },
  { title: 'Toy Story', year: 1995, genre: 'Animation', runtime: 81 },
  { title: 'Life is Beautiful', year: 1997, genre: 'Comedy', runtime: 116 },
  { title: 'Inception', year: 2010, genre: 'Sci-Fi', runtime: 148 },
  { title: 'Parasite', year: 2019, genre: 'Thriller', runtime: 132 }
];
seedBtn.addEventListener('click', async ()=>{
  if(!currentUser){ statusMsg.textContent = 'Please sign in to seed movies.'; return; }
  seedBtn.disabled = True;
  try{
    for(const m of seedMovies){
      await addDoc(collection(db, 'movies'), {
        ...m,
        createdAt: serverTimestamp(),
        createdBy: {
          uid: currentUser.uid,
          name: currentUser.displayName || null,
          email: currentUser.email || null
        }
      });
    }
    statusMsg.textContent = `Seeded ${seedMovies.length} sample movies`;
  }catch(err){
    statusMsg.textContent = `Error seeding: ${err.message}`;
  }finally{
    setTimeout(()=>{ seedBtn.disabled = false; }, 2000);
  }
});

/** Real-time subscription to shared list **/
const q = query(collection(db, 'movies'), orderBy('title'));
onSnapshot(q, (snapshot)=>{
  movies = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  populateGenres();
  renderList(currentFilter);
  renderSelected();
});
