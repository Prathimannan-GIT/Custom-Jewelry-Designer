/* Custom Jewelry Designer – Vanilla JS Interactions */

(function(){
  "use strict";

  function $(sel, root){ return (root || document).querySelector(sel); }
  function $all(sel, root){ return Array.from((root || document).querySelectorAll(sel)); }

  function safeJsonParse(raw, fallback){
    try{ return JSON.parse(raw); }catch(_e){ return fallback; }
  }

  function getPageName(){
    var path = (location.pathname || "").split("/").pop();
    return path || "index.html";
  }

  function setActiveLinks(){
    var current = getPageName();
    if(current === 'admin-dashboard.html') current = 'dashboard.html';
    $all('a[data-nav]').forEach(function(a){
      var href = (a.getAttribute('href') || "").split("#")[0];
      a.classList.toggle('active', href === current);
    });
  }

  function initNav(){
    var toggle = $('#navToggle');
    if(toggle){
      toggle.addEventListener('click', function(){
        document.body.classList.toggle('nav-open');
      });
    }

    $all('.mobile-drawer a').forEach(function(a){
      a.addEventListener('click', function(){
        document.body.classList.remove('nav-open');
      });
    });

    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape'){
        document.body.classList.remove('nav-open');
        document.body.classList.remove('sidebar-open');
      }
    });
  }

  function initTheme(){
    var root = document.documentElement;
    var btn = $('#themeToggle');
    var stored = localStorage.getItem('aa_theme');
    if(stored){ root.setAttribute('data-theme', stored); }

    function updateIcon(){
      if(!btn) return;
      var theme = root.getAttribute('data-theme') || 'dark';
      var icon = btn.querySelector('i');
      if(icon){
        icon.className = theme === 'light' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
      }
    }

    updateIcon();

    if(btn){
      btn.addEventListener('click', function(){
        var current = root.getAttribute('data-theme') || 'dark';
        var next = current === 'light' ? 'dark' : 'light';
        root.setAttribute('data-theme', next);
        localStorage.setItem('aa_theme', next);
        updateIcon();
        toast('Theme updated', 'info');
      });
    }
  }

  function ensureToastStack(){
    var stack = $('.toast-stack');
    if(stack) return stack;
    stack = document.createElement('div');
    stack.className = 'toast-stack';
    document.body.appendChild(stack);
    return stack;
  }

  function toast(title, type){
    var stack = ensureToastStack();
    var el = document.createElement('div');
    el.className = 'toast';
    var icon = 'fa-gem';
    if(type === 'success') icon = 'fa-circle-check';
    if(type === 'warn') icon = 'fa-triangle-exclamation';
    if(type === 'error') icon = 'fa-circle-xmark';

    el.innerHTML =
      '<i class="fa-solid ' + icon + '"></i>' +
      '<div>' +
        '<strong>' + escapeHtml(title) + '</strong>' +
        '<p>' + escapeHtml(messageForType(type)) + '</p>' +
      '</div>';

    stack.appendChild(el);
    setTimeout(function(){
      el.style.opacity = '0';
      el.style.transform = 'translateY(6px)';
    }, 3200);
    setTimeout(function(){
      if(el && el.parentNode) el.parentNode.removeChild(el);
    }, 3600);
  }

  function messageForType(type){
    if(type === 'success') return 'Saved successfully.';
    if(type === 'warn') return 'Please review the details.';
    if(type === 'error') return 'Something went wrong.';
    return 'Custom Jewelry Designer is ready.';
  }

  function escapeHtml(str){
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function initLinkButtons(){
    $all('[data-link]').forEach(function(btn){
      btn.addEventListener('click', function(){
        var href = btn.getAttribute('data-link');
        if(href) location.href = href;
      });
    });
  }

  function initValidation(){
    $all('form[data-validate]').forEach(function(form){
      form.addEventListener('submit', function(e){
        var required = $all('[required]', form);
        var ok = true;
        required.forEach(function(el){
          var v = (el.value || '').trim();
          if(!v){
            ok = false;
            el.focus();
            el.style.borderColor = 'rgba(214,180,106,0.55)';
          }else{
            el.style.borderColor = '';
          }
        });

        if(!ok){
          e.preventDefault();
          toast('Please complete required fields', 'warn');
          return;
        }

        e.preventDefault();
        toast('Submitted', 'success');
      });
    });
  }

  function initSidebar(){
    var btn = $('#sidebarToggle');
    if(!btn) return;
    btn.addEventListener('click', function(){
      document.body.classList.toggle('sidebar-open');
    });

    $all('.sidebar-nav a').forEach(function(a){
      a.addEventListener('click', function(){
        $all('.sidebar-nav a').forEach(function(x){ x.classList.remove('active'); });
        a.classList.add('active');

        var target = a.getAttribute('data-target');
        if(target){
          var el = document.getElementById(target);
          if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
        }
      });
    });
  }

  function initConfigurator(){
    var studio = $('#designStudio');
    if(!studio) return;

    var typeBtns = $all('[data-type]', studio);
    var metalBtns = $all('[data-metal]', studio);
    var gemBtns = $all('[data-gem]', studio);
    var notes = $('#designNotes');
    var upload = $('#designUpload');

    var state = {
      type: 'Ring',
      metal: 'Gold',
      gem: 'Diamond',
      notes: ''
    };

    var key = 'aa_design_draft';
    var stored = safeJsonParse(localStorage.getItem(key), null);
    if(stored){ state = Object.assign(state, stored); }

    function setActive(group, value, attr){
      group.forEach(function(btn){
        btn.classList.toggle('active', btn.getAttribute(attr) === value);
      });
    }

    function metalColor(m){
      if(m === 'Platinum') return '#cfd4da';
      if(m === 'Silver') return '#c6cdd6';
      return '#d6b46a';
    }

    function gemColor(g){
      if(g === 'Emerald') return '#2fbf71';
      if(g === 'Ruby') return '#e54557';
      if(g === 'Sapphire') return '#3b6ef6';
      return '#f2f2f4';
    }

    function render(){
      setActive(typeBtns, state.type, 'data-type');
      setActive(metalBtns, state.metal, 'data-metal');
      setActive(gemBtns, state.gem, 'data-gem');

      if(notes) notes.value = state.notes;

      var label = $('#previewLabel');
      if(label) label.textContent = state.metal + ' ' + state.type + ' • ' + state.gem;

      var metalEl = $('#svgMetal');
      var gemEl = $('#svgGem');
      if(metalEl) metalEl.setAttribute('fill', metalColor(state.metal));
      if(gemEl) gemEl.setAttribute('fill', gemColor(state.gem));

      localStorage.setItem(key, JSON.stringify(state));
    }

    typeBtns.forEach(function(btn){
      btn.addEventListener('click', function(){
        state.type = btn.getAttribute('data-type');
        render();
      });
    });

    metalBtns.forEach(function(btn){
      btn.addEventListener('click', function(){
        state.metal = btn.getAttribute('data-metal');
        render();
      });
    });

    gemBtns.forEach(function(btn){
      btn.addEventListener('click', function(){
        state.gem = btn.getAttribute('data-gem');
        render();
      });
    });

    if(notes){
      notes.addEventListener('input', function(){
        state.notes = notes.value;
        render();
      });
    }

    if(upload){
      upload.addEventListener('change', function(){
        var list = $('#uploadPreview');
        if(!list) return;
        list.innerHTML = '';

        var files = Array.from(upload.files || []);
        if(!files.length){
          list.innerHTML = '<p class="helper">No files selected.</p>';
          return;
        }

        files.forEach(function(f){
          var row = document.createElement('div');
          row.className = 'card pad';
          row.style.boxShadow = 'none';
          row.style.background = 'rgba(255,255,255,0.03)';

          var title = document.createElement('div');
          title.innerHTML = '<strong>' + escapeHtml(f.name) + '</strong><div class="helper">' + Math.round(f.size/1024) + ' KB</div>';

          row.appendChild(title);

          if(f.type && f.type.indexOf('image/') === 0){
            var img = document.createElement('img');
            img.alt = 'Upload preview';
            img.style.marginTop = '10px';
            img.style.borderRadius = '12px';
            img.style.border = '1px solid rgba(255,255,255,0.10)';
            img.src = URL.createObjectURL(f);
            row.appendChild(img);
          }

          list.appendChild(row);
        });

        toast('Files ready for review', 'info');
      });
    }

    var submit = $('#submitDesign');
    if(submit){
      submit.addEventListener('click', function(){
        var queue = safeJsonParse(localStorage.getItem('aa_requests'), []);
        queue.unshift({
          id: 'REQ-' + Math.floor(Date.now()/1000),
          createdAt: new Date().toISOString(),
          summary: state.metal + ' ' + state.type + ' with ' + state.gem,
          status: 'New'
        });
        localStorage.setItem('aa_requests', JSON.stringify(queue));
        toast('Design request submitted', 'success');
      });
    }

    render();
  }

  function initMessaging(){
    var box = $('#messages');
    if(!box) return;

    var list = $('#messageList');
    var form = $('#messageForm');
    var input = $('#messageInput');

    var key = 'aa_messages';

    function load(){
      return safeJsonParse(localStorage.getItem(key), [
        {from:'Designer', text:'Welcome. Share your vision and references here.', ts: Date.now() - 1000*60*60}
      ]);
    }

    function save(items){
      localStorage.setItem(key, JSON.stringify(items));
    }

    function render(){
      var items = load();
      if(!list) return;
      list.innerHTML = '';

      items.slice(0, 30).reverse().forEach(function(m){
        var row = document.createElement('div');
        row.className = 'card pad';
        row.style.boxShadow = 'none';
        row.style.background = 'rgba(255,255,255,0.03)';
        row.innerHTML = '<div style="display:flex;justify-content:space-between;gap:12px;align-items:center;flex-wrap:wrap;">' +
          '<strong>' + escapeHtml(m.from) + '</strong>' +
          '<span class="helper">' + new Date(m.ts).toLocaleString() + '</span>' +
        '</div>' +
        '<div class="divider"></div>' +
        '<p style="margin:0;color:var(--muted);">' + escapeHtml(m.text) + '</p>';
        list.appendChild(row);
      });
    }

    if(form){
      form.addEventListener('submit', function(e){
        e.preventDefault();
        if(!input) return;
        var text = (input.value || '').trim();
        if(!text){ toast('Write a message first', 'warn'); return; }
        var items = load();
        items.push({from:'Client', text:text, ts: Date.now()});
        save(items);
        input.value = '';
        render();
        toast('Message sent', 'success');
      });
    }

    render();
  }

  function initApprovals(){
    var box = $('#approvals');
    if(!box) return;

    var key = 'aa_approvals';
    var statusEl = $('#approvalStatus');

    function get(){
      return localStorage.getItem(key) || 'Pending';
    }

    function set(v){
      localStorage.setItem(key, v);
      if(statusEl) statusEl.textContent = v;
    }

    var approve = $('#approveBtn');
    var revise = $('#reviseBtn');

    if(approve){
      approve.addEventListener('click', function(){
        set('Approved');
        toast('Concept approved', 'success');
      });
    }

    if(revise){
      revise.addEventListener('click', function(){
        set('Revision Requested');
        toast('Revision requested', 'info');
      });
    }

    set(get());
  }

  function initPayments(){
    var box = $('#payments');
    if(!box) return;

    var key = 'aa_payment_stages';
    var stages = $all('input[data-stage]');
    var bar = $('#paymentBar');
    var label = $('#paymentLabel');

    function load(){
      return safeJsonParse(localStorage.getItem(key), {s1:false,s2:false,s3:false});
    }

    function save(data){ localStorage.setItem(key, JSON.stringify(data)); }

    function render(){
      var data = load();
      stages.forEach(function(cb){
        var k = cb.getAttribute('data-stage');
        cb.checked = !!data[k];
      });

      var total = stages.length;
      var done = stages.filter(function(cb){ return cb.checked; }).length;
      var pct = Math.round((done/Math.max(1,total)) * 100);

      if(bar) bar.style.width = pct + '%';
      if(label) label.textContent = pct + '% complete';
    }

    stages.forEach(function(cb){
      cb.addEventListener('change', function(){
        var data = load();
        var k = cb.getAttribute('data-stage');
        data[k] = cb.checked;
        save(data);
        render();
        toast('Payment stage updated', 'success');
      });
    });

    render();
  }

  function initRequestsTable(){
    var table = $('#requestTableBody');
    if(!table) return;

    var items = safeJsonParse(localStorage.getItem('aa_requests'), []);
    if(!items.length){
      table.innerHTML = '<tr><td colspan="4" class="helper">No requests yet. Create one in Design Studio.</td></tr>';
      return;
    }

    table.innerHTML = '';
    items.slice(0, 6).forEach(function(r){
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + escapeHtml(r.id) + '</td>' +
        '<td>' + escapeHtml(r.summary) + '</td>' +
        '<td><span class="badge"><i class="fa-solid fa-sparkles"></i>' + escapeHtml(r.status) + '</span></td>' +
        '<td><button class="btn small" data-act="approve">Approve</button></td>';

      var btn = tr.querySelector('button');
      if(btn){
        btn.addEventListener('click', function(){
          localStorage.setItem('aa_approvals', 'Approved');
          toast('Approved from dashboard', 'success');
        });
      }

      table.appendChild(tr);
    });
  }

  function initRoleSwitch(){
    var sw = $('#roleSwitch');
    if(!sw) return;

    var key = 'aa_role';
    var stored = localStorage.getItem(key) || 'client';

    function apply(role){
      localStorage.setItem(key, role);
      document.documentElement.setAttribute('data-role', role);
      var label = $('#roleLabel');
      if(label) label.textContent = role === 'admin' ? 'Admin / Designer Mode' : 'Client Mode';
    }

    sw.addEventListener('change', function(){
      apply(sw.checked ? 'admin' : 'client');
      toast('Dashboard view updated', 'info');
    });

    sw.checked = stored === 'admin';
    apply(stored);
  }

  function initNotifications(){
    var list = $('#notificationList');
    if(!list) return;

    var key = 'aa_notifications';

    function seedIfEmpty(){
      var existing = safeJsonParse(localStorage.getItem(key), null);
      if(existing && Array.isArray(existing) && existing.length) return;
      var seed = [
        {title:'Consultation booked', body:'Your consultation is scheduled. Add reference images in Design Studio.', ts: Date.now() - 1000*60*30},
        {title:'Designer update', body:'A new concept draft is ready for review in Approvals.', ts: Date.now() - 1000*60*120},
        {title:'Payment milestone', body:'The deposit stage is available in Payments.', ts: Date.now() - 1000*60*240}
      ];
      localStorage.setItem(key, JSON.stringify(seed));
    }

    function render(){
      var items = safeJsonParse(localStorage.getItem(key), []);
      list.innerHTML = '';
      items.slice(0, 6).forEach(function(n){
        var row = document.createElement('div');
        row.className = 'card pad';
        row.style.boxShadow = 'none';
        row.style.background = 'rgba(255,255,255,0.03)';
        row.innerHTML = '<strong>' + escapeHtml(n.title) + '</strong>' +
          '<div class="helper">' + new Date(n.ts).toLocaleString() + '</div>' +
          '<div class="divider"></div>' +
          '<p style="margin:0;">' + escapeHtml(n.body) + '</p>';
        list.appendChild(row);
      });
    }

    seedIfEmpty();
    render();
  }

  document.addEventListener('DOMContentLoaded', function(){
    window.toast = toast;

    setActiveLinks();
    initNav();
    initTheme();
    initLinkButtons();
    initValidation();

    initSidebar();
    initConfigurator();
    initMessaging();
    initApprovals();
    initPayments();
    initRequestsTable();
    initRoleSwitch();
    initNotifications();
  });
})();
