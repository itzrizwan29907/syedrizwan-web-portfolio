// ============================================================
// THEME TOGGLE
// ============================================================
const root = document.documentElement;
const toggle = document.getElementById('themeToggle');
const saved = localStorage.getItem('theme');
const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
root.setAttribute('data-theme', saved || (prefersLight ? 'light' : 'dark'));

toggle.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
});

// ============================================================
// CURSOR SPOTLIGHT
// ============================================================
document.addEventListener('mousemove', (e) => {
    root.style.setProperty('--mx', e.clientX + 'px');
    root.style.setProperty('--my', e.clientY + 'px');
});

// ============================================================
// SCROLL PROGRESS BAR
// ============================================================
const progressBar = document.getElementById('progressBar');
window.addEventListener('scroll', () => {
    const h = document.documentElement;
    const scrolled = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
    progressBar.style.width = scrolled + '%';
}, { passive: true });

// ============================================================
// TYPEWRITER EFFECT
// ============================================================
const phrases = ['clear decisions.', 'useful stories.', 'actionable insights.', 'visual dashboards.'];
const twEl = document.getElementById('typewriter');
let pi = 0, ci = 0, deleting = false;

function type() {
    const current = phrases[pi];
    twEl.textContent = deleting ? current.slice(0, --ci) : current.slice(0, ++ci);

    if (!deleting && ci === current.length) {
        setTimeout(() => { deleting = true; type(); }, 1800);
    } else if (deleting && ci === 0) {
        deleting = false;
        pi = (pi + 1) % phrases.length;
        setTimeout(type, 300);
    } else {
        setTimeout(type, deleting ? 40 : 75);
    }
}
type();

// ============================================================
// ANIMATED STAT COUNTERS
// ============================================================
const counters = document.querySelectorAll('.stat-num');
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = +el.dataset.target;
        const suffix = el.dataset.suffix || '';
        let cur = 0;
        const step = Math.max(1, Math.ceil(target / 40));
        const tick = () => {
            cur += step;
            if (cur >= target) { el.textContent = target + suffix; return; }
            el.textContent = cur + suffix;
            requestAnimationFrame(tick);
        };
        tick();
        counterObserver.unobserve(el);
    });
}, { threshold: 0.5 });
counters.forEach(c => counterObserver.observe(c));

// ============================================================
// COPY EMAIL
// ============================================================
const toast = document.getElementById('toast');
function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2200);
}
document.querySelectorAll('.copy-email-btn, #copyEmailBtn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
        const email = e.currentTarget.dataset.email;
        try {
            await navigator.clipboard.writeText(email);
            showToast('✓ Email copied to clipboard');
        } catch {
            showToast('Could not copy — email: ' + email);
        }
    });
});

// ============================================================
// PROJECT FILTER TABS
// ============================================================
const filterBtns = document.querySelectorAll('.filter-btn');
const projects = document.querySelectorAll('.project');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        projects.forEach(p => {
            const match = filter === 'all' || p.dataset.category === filter;
            p.classList.toggle('hidden', !match);
        });
    });
});

// ============================================================
// SKILL → FILTER PROJECTS
// ============================================================
document.querySelectorAll('.pill.clickable').forEach(pill => {
    pill.addEventListener('click', () => {
        const skill = pill.dataset.skill;
        document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
        filterBtns.forEach(b => b.classList.remove('active'));
        document.querySelector('[data-filter="all"]').classList.add('active');

        let visibleCount = 0;
        projects.forEach(p => {
            const text = p.textContent.toLowerCase();
            const match = text.includes(skill.toLowerCase());
            p.classList.toggle('hidden', !match);
            if (match) visibleCount++;
        });

        showToast(visibleCount
            ? `${visibleCount} project(s) use ${skill}`
            : `No projects tagged with ${skill} yet`);
    });
});

// ============================================================
// PROJECT MODAL
// ============================================================
const projectDetails = {
    'academic-relay': {
        title: 'Academic Relay',
        subtitle: 'Centralized academic resource platform',
        img: 'assets/academic-relay.png',
        body: `
      <p>A platform that connects students and faculty by bringing circulars, timetables,
      assignments, notes, marks, and other academic resources into one organized place.</p>
      <h4>What I built</h4>
      <ul>
        <li>Full authentication system with signup, login, and password recovery.</li>
        <li>Role-based access for faculty and students.</li>
        <li>Centralized dashboard for circulars, assignments, notes, and marks.</li>
        <li>Deployed as a working prototype.</li>
      </ul>
      <h4>Tech stack</h4>
      <div class="pills">
        <span class="pill">Python</span>
        <span class="pill">Flask</span>
        <span class="pill">PostgreSQL</span>
        <span class="pill">Supabase</span>
        <span class="pill">JavaScript</span>
      </div>
      <p style="margin-top:1.5rem">
        <a href="https://academic-relay.onrender.com" target="_blank" rel="noopener" class="btn btn-primary">Live site ↗</a>
      </p>`
    },
    'adidas': {
        title: 'Adidas Shoes Sales Analysis',
        subtitle: 'Power BI dashboard',
        img: 'assets/adidas.png',
        body: `
      <p>Analyzed <strong>2M+ units sold</strong> across regions, sale methods, and product
      categories to surface what actually drives revenue.</p>
      <h4>Key insights</h4>
      <ul>
        <li>Top cities by sales volume and profit.</li>
        <li>Best-performing products by profit margin.</li>
        <li>Monthly sales trends and seasonal patterns.</li>
      </ul>
      <h4>Tools</h4>
      <div class="pills">
        <span class="pill">Power BI</span>
        <span class="pill">Power Query</span>
        <span class="pill">Data Modeling</span>
      </div>`
    },
    'amazon': {
        title: 'Amazon Sales Analysis',
        subtitle: 'Power BI dashboard',
        img: 'assets/amazon.png',
        body: `
      <p>Explored <strong>725K+ in sales</strong> across cities, categories, and states to find
      the patterns behind the numbers.</p>
      <h4>Key insights</h4>
      <ul>
        <li>Top-performing products and categories.</li>
        <li>Profit distribution across regions.</li>
        <li>Monthly order patterns and growth trends.</li>
      </ul>
      <h4>Tools</h4>
      <div class="pills">
        <span class="pill">Power BI</span>
        <span class="pill">Power Query</span>
        <span class="pill">Data Modeling</span>
      </div>`
    },
    'chocolate': {
        title: 'Global Chocolate Sales & Shipments',
        subtitle: 'Power BI dashboard',
        img: 'assets/chocolate.png',
        body: `
      <p>Tracked <strong>6184K revenue</strong> and <strong>177K boxes shipped</strong> across
      6 countries to understand global sales dynamics.</p>
      <h4>Key insights</h4>
      <ul>
        <li>Sales breakdown by product and country.</li>
        <li>Salesperson performance ranking.</li>
        <li>Monthly shipment trends.</li>
      </ul>
      <h4>Tools</h4>
      <div class="pills">
        <span class="pill">Power BI</span>
        <span class="pill">Power Query</span>
        <span class="pill">Data Modeling</span>
      </div>`
    }
};

const modal = document.getElementById('modal');
const modalContent = document.getElementById('modalContent');
const modalClose = document.getElementById('modalClose');

document.querySelectorAll('[data-open]').forEach(btn => {
    btn.addEventListener('click', () => {
        const data = projectDetails[btn.dataset.open];
        if (!data) return;
        modalContent.innerHTML = `
      <h3>${data.title}</h3>
      <p class="muted" style="margin-top:-0.5rem">${data.subtitle}</p>
      ${data.img ? `<img src="${data.img}" alt="${data.title}" />` : ''}
      ${data.body}
    `;
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    });
});

function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
}
modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

// ============================================================
// FOOTER — YEAR + LIVE HYDERABAD CLOCK
// ============================================================
document.getElementById('year').textContent = new Date().getFullYear();

function updateClock() {
    const now = new Date();
    const hyd = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    const hh = String(hyd.getHours()).padStart(2, '0');
    const mm = String(hyd.getMinutes()).padStart(2, '0');
    const ss = String(hyd.getSeconds()).padStart(2, '0');
    document.getElementById('clock').textContent = `Hyderabad · ${hh}:${mm}:${ss} IST`;
}
updateClock();
setInterval(updateClock, 1000);

// ============================================================
// SCROLL REVEAL FOR SECTIONS
// ============================================================
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.style.opacity = '1';
            e.target.style.transform = 'translateY(0)';
            revealObserver.unobserve(e.target);
        }
    });
}, { threshold: 0.08 });

document.querySelectorAll('.section').forEach(sec => {
    sec.style.opacity = '0';
    sec.style.transform = 'translateY(20px)';
    sec.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    revealObserver.observe(sec);
});

// ============================================================
// SCROLL RAIL — fill + moving dot
// ============================================================
const railFill = document.getElementById('railFill');
const railDot = document.getElementById('railDot');

function updateRail() {
    const h = document.documentElement;
    const total = h.scrollHeight - h.clientHeight;
    const pct = total > 0 ? (h.scrollTop / total) * 100 : 0;

    railFill.style.height = pct + '%';
    railDot.style.top = pct + '%';
}

window.addEventListener('scroll', updateRail, { passive: true });
window.addEventListener('resize', updateRail);
updateRail();

// ============================================================
// NAV — scrolled state, active section, mobile menu
// ============================================================
const nav = document.querySelector('.nav');
const navLinks = document.getElementById('navLinks');
const navBurger = document.getElementById('navBurger');

// Solidify nav on scroll
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// Burger toggle
navBurger?.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    navBurger.classList.toggle('open');
});

// Close mobile menu on link click
navLinks?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navBurger.classList.remove('open');
    });
});

// Active section highlight
const navAnchors = document.querySelectorAll('.nav-links a');
const navSections = ['top', 'projects', 'experience', 'achievements', 'linkedin', 'skills', 'education', 'contact'];

function updateActiveNav() {
    const mid = window.scrollY + window.innerHeight * 0.35;
    let currentId = 'top';

    for (const id of navSections) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= mid) currentId = id;
    }

    navAnchors.forEach(a => {
        const href = a.getAttribute('href').replace('#', '');
        a.classList.toggle('active', href === currentId);
    });
}

window.addEventListener('scroll', updateActiveNav, { passive: true });
window.addEventListener('resize', updateActiveNav);
updateActiveNav();

// ============================================================
// BACK TO TOP
// ============================================================
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});