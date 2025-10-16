/* -------------------------
   Basic interactive behaviors
   ------------------------- */

/* Year in footer */
document.getElementById('year').textContent = new Date().getFullYear();

/* Mobile nav toggle */
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
navToggle && navToggle.addEventListener('click', () => {
  if (navLinks.style.display === 'flex') {
    navLinks.style.display = '';
  } else {
    navLinks.style.display = 'flex';
    navLinks.style.flexDirection = 'column';
    navLinks.style.background = 'transparent';
    navLinks.style.position = 'absolute';
    navLinks.style.right = '1.5rem';
    navLinks.style.top = '68px';
    navLinks.style.padding = '0.8rem';
    navLinks.style.gap = '0.4rem';
  }
});

/* Smooth internal links (for anchors) */
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', e=>{
    const href = a.getAttribute('href');
    if (href && href.length>1) {
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({behavior:'smooth', block:'start'});
      // close mobile nav after click
      if (window.innerWidth < 880 && navLinks.style.display === 'flex') navLinks.style.display = '';
    }
  });
});

/* IntersectionObserver to reveal sections */
const ro = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // optional: unobserve to avoid toggling back
      ro.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => ro.observe(el));

/* CONTACT FORM — simulated send + validation */
const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // simple client validation
    const name = form.querySelector('#name').value.trim();
    const email = form.querySelector('#email').value.trim();
    const message = form.querySelector('#message').value.trim();
    if (!name || !email || !message) {
      showToast('Preencha todos os campos.', true);
      return;
    }

    // Simulate sending (show loading state)
    const btn = form.querySelector('.btn.primary');
    btn.disabled = true;
    const original = btn.textContent;
    btn.textContent = 'Enviando...';

    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = original;
      form.reset();
      showToast('Mensagem enviada! (simulação)');
    }, 1200);
  });
}

/* Copy email button */
const copyBtn = document.getElementById('copyEmail');
if (copyBtn) {
  copyBtn.addEventListener('click', async () => {
    const email = document.getElementById('plainEmail').textContent.trim();
    try {
      await navigator.clipboard.writeText(email);
      showToast('E-mail copiado para a área de transferência.');
    } catch (err) {
      showToast('Não foi possível copiar. Use copiar manualmente.', true);
    }
  });
}

/* Toast */
function showToast(msg, isError=false){
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  t.style.position = 'fixed';
  t.style.right = '18px';
  t.style.bottom = '18px';
  t.style.background = isError ? 'linear-gradient(90deg,#ff6b6b,#ff8a8a)' : 'linear-gradient(90deg,var(--accent1),var(--accent2))';
  t.style.color = '#041019';
  t.style.padding = '0.65rem 0.95rem';
  t.style.borderRadius = '10px';
  t.style.boxShadow = '0 8px 28px rgba(2,6,23,0.5)';
  t.style.zIndex = 9999;
  document.body.appendChild(t);
  setTimeout(()=> t.style.opacity = '0', 2600);
  setTimeout(()=> t.remove(), 3000);
}

/* PROJECT MODAL (details) */
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modal-content');

document.querySelectorAll('[data-open-project]').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const id = btn.getAttribute('data-open-project');
    openProjectModal(id);
  });
});

function openProjectModal(id){
  // simple static content for demo — replace with real project details
  const data = {
    '1': {
      title: 'API de Usuários',
      body: `<p><strong>Descrição:</strong> API REST feita com Django + DRF. Autenticação por token, endpoints CRUD para usuários, testes unitários e documentação básica.</p>
             <p><strong>Stack:</strong> Python, Django, Django REST Framework, Postgres</p>
             <p><strong>Links:</strong> <a href="#" target="_blank">Repositório</a></p>`
    },
    '2': {
      title: 'To-Do App (Backend)',
      body: `<p><strong>Descrição:</strong> Serviço backend para um aplicativo de tarefas com endpoints para criar, listar, editar e remover tarefas. Testes e validações incluídas.</p>
             <p><strong>Stack:</strong> Python, Django, SQLite</p>
             <p><strong>Links:</strong> <a href="#" target="_blank">Repositório</a></p>`
    }
  };

  const proj = data[id] || {title:'Projeto', body:'Detalhes indisponíveis.'};
  modalContent.innerHTML = `<h3>${proj.title}</h3>${proj.body}`;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden','false');
}

document.querySelectorAll('.modal-close').forEach(b=>b.addEventListener('click', closeModal));
modal.addEventListener('click', (e)=> { if (e.target === modal) closeModal(); });
function closeModal(){
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden','true');
  modalContent.innerHTML = '';
}

/* Accessibility: close modal with ESC */
document.addEventListener('keydown', (e)=> {
  if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
});
