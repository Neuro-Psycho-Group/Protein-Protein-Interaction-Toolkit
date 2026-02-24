/* ============================================================
   PPI GUIDEBOOK — INTERACTIVE COMPONENTS
   ============================================================ */

(function () {
  'use strict';

  // ── Tabs ──────────────────────────────────────────────────
  document.querySelectorAll('.tabs').forEach(tabGroup => {
    const triggers = tabGroup.querySelectorAll('.tab-btn');
    const panels   = tabGroup.querySelectorAll('.tab-panel');

    triggers.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tab;

        triggers.forEach(t => {
          t.setAttribute('aria-selected', 'false');
          t.classList.remove('active');
        });
        panels.forEach(p => {
          p.hidden = true;
          p.classList.remove('active');
        });

        btn.setAttribute('aria-selected', 'true');
        btn.classList.add('active');

        const panel = tabGroup.querySelector(`[data-panel="${target}"]`);
        if (panel) {
          panel.hidden = false;
          panel.classList.add('active');
          panel.style.animation = 'tab-in 0.3s var(--ease) both';
        }
      });
    });

    // Init first tab
    if (triggers[0]) triggers[0].click();
  });

  // ── Glossary tooltip enhancement ──────────────────────────
  // Auto-adds tooltips to any [data-def] elements
  document.querySelectorAll('[data-def]').forEach(el => {
    const def = el.dataset.def;
    el.classList.add('tooltip-term');
    const wrap = document.createElement('span');
    wrap.className = 'tooltip-wrap';
    el.parentNode.insertBefore(wrap, el);
    wrap.appendChild(el);
    const box = document.createElement('span');
    box.className = 'tooltip-box';
    box.textContent = def;
    wrap.appendChild(box);
  });

  // ── Confidence score slider (for databases page) ──────────
  const slider = document.getElementById('confidence-slider');
  if (slider) {
    const output = document.getElementById('confidence-value');
    const desc   = document.getElementById('confidence-desc');
    const bar    = document.getElementById('confidence-bar');

    const descriptions = {
      low:  { label: 'Low (< 0.4)', text: 'Many false positives. Only use when exploring broadly. Not recommended for publication.', color: '#ff6b8a' },
      med:  { label: 'Medium (0.4–0.7)', text: 'Balanced recall and precision. Good for initial exploration and hypothesis generation.', color: '#f5a623' },
      high: { label: 'High (0.7–0.9)', text: 'Recommended for most analyses. Good evidence quality, fewer false positives.', color: '#00c9a7' },
      vhigh:{ label: 'Very High (> 0.9)', text: 'Very well-supported interactions only. May miss important but less-studied connections.', color: '#a78bfa' },
    };

    const update = () => {
      const v = parseFloat(slider.value);
      let tier;
      if (v < 0.4) tier = 'low';
      else if (v < 0.7) tier = 'med';
      else if (v < 0.9) tier = 'high';
      else tier = 'vhigh';

      const d = descriptions[tier];
      output.textContent = v.toFixed(2);
      output.style.color = d.color;
      desc.textContent   = d.text;
      desc.style.color   = d.color;
      if (bar) bar.style.width = (v * 100) + '%';
    };

    slider.addEventListener('input', update);
    update();
  }

  // ── Animated count-up for stats ───────────────────────────
  function countUp(el, target, duration = 1500, prefix = '', suffix = '') {
    const start = performance.now();
    const update = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const val = Math.round(ease * target);
      el.textContent = prefix + val.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  // Trigger count-ups when visible
  const statEls = document.querySelectorAll('[data-count]');
  if (statEls.length && 'IntersectionObserver' in window) {
    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target  = parseInt(el.dataset.count);
          const prefix  = el.dataset.prefix || '';
          const suffix  = el.dataset.suffix || '';
          countUp(el, target, 1500, prefix, suffix);
          countObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    statEls.forEach(el => countObserver.observe(el));
  }

  // ── Copy-to-clipboard for code blocks ─────────────────────
  document.querySelectorAll('pre code').forEach(block => {
    const wrapper = block.closest('pre');
    if (!wrapper) return;
    wrapper.style.position = 'relative';

    const btn = document.createElement('button');
    btn.textContent = 'Copy';
    btn.className = 'copy-btn';
    btn.style.cssText = `
      position:absolute; top:0.6rem; right:0.6rem;
      background:rgba(0,201,167,0.1); border:1px solid rgba(0,201,167,0.25);
      color:#00c9a7; font-family:'DM Mono',monospace; font-size:0.7rem;
      padding:0.25rem 0.6rem; border-radius:4px; cursor:pointer; transition:all 0.2s;
    `;
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(block.textContent);
        btn.textContent = 'Copied!';
        btn.style.background = 'rgba(0,201,167,0.25)';
        setTimeout(() => {
          btn.textContent = 'Copy';
          btn.style.background = 'rgba(0,201,167,0.1)';
        }, 1500);
      } catch { btn.textContent = 'Error'; }
    });
    wrapper.appendChild(btn);
  });

  // ── Glossary search (for search page / sidebar) ───────────
  const glossarySearch = document.getElementById('glossary-search');
  if (glossarySearch) {
    const items = document.querySelectorAll('.glossary-item');
    glossarySearch.addEventListener('input', () => {
      const q = glossarySearch.value.toLowerCase();
      items.forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(q) ? '' : 'none';
      });
    });
  }

  // ── Smooth expand "Read more" sections ────────────────────
  document.querySelectorAll('.read-more-btn').forEach(btn => {
    const target = document.getElementById(btn.dataset.target);
    if (!target) return;
    target.style.maxHeight = '0';
    target.style.overflow = 'hidden';
    target.style.transition = 'max-height 0.5s cubic-bezier(0.23,1,0.32,1)';

    btn.addEventListener('click', () => {
      const open = target.style.maxHeight !== '0px' && target.style.maxHeight !== '0';
      target.style.maxHeight = open ? '0' : target.scrollHeight + 'px';
      btn.textContent = open ? btn.dataset.more || 'Read more ↓' : btn.dataset.less || 'Show less ↑';
      btn.classList.toggle('open', !open);
    });
  });

})();
