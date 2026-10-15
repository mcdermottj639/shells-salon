/* Beauty Shell — shared client. Talks to Supabase only through the salon_* RPC functions (no direct table access). */
window.BS = (() => {
  const URL = 'https://rjbvcvnwbubxeaxcklgg.supabase.co/rest/v1/rpc/';
  const KEY = 'sb_publishable_5OIYrgknbczyF9VJGWqjyQ_VzycGKt0';
  async function rpc(fn, args) {
    const r = await fetch(URL + fn, { method: 'POST', headers: { apikey: KEY, Authorization: 'Bearer ' + KEY, 'Content-Type': 'application/json' }, body: JSON.stringify(args || {}) });
    const t = await r.text(); let j = null; try { j = t ? JSON.parse(t) : null; } catch (e) { j = t; }
    if (!r.ok) { const m = (j && (j.message || j.hint)) || ('HTTP ' + r.status); const e = new Error(m); e.code = r.status; throw e; }
    return j;
  }
  const T = {
    es: {
      tag: 'Color, corte y tratamientos', hero_h: 'Hablemos de tu cabello', hero_p: 'Diseño de color, antifrizz, botox capilar y corte, con atención personal en Stamford, Rye, Port Chester y alrededores.',
      wa: 'Escríbeme por WhatsApp', req: 'Pedir cita', svc_h: 'Servicios', svc_p: 'Cada cabello tiene su proceso; el precio se confirma en la consulta, antes de tu cita.',
      price_ask: 'Precio en consulta', from: 'desde', min: 'min', ask: 'Consultar', how_h: 'Cómo funciona', how: [['Envíame una foto', 'De tu cabello actual, con luz natural.'], ['Cuéntame tu idea', 'Una referencia o unas palabras. Dime tu ciudad.'], ['Confirmamos juntas', 'Servicio, precio y horario por WhatsApp.']],
      rev_h: 'Opiniones', rev_empty: 'Las primeras opiniones de clientas llegan pronto.', form_h: 'Pedir cita', form_p: 'Déjame tus datos y te escribo por WhatsApp para confirmar. Sin compromiso.',
      f_name: 'Tu nombre', f_phone: 'Tu WhatsApp o teléfono', f_city: 'Tu ciudad', f_svc: '¿Qué te gustaría hacer?', f_idea: 'Cuéntame tu idea', f_idea_ph: 'Por ejemplo: quiero un rubio más claro sin dañar mi cabello…', f_when: '¿Qué días te sirven?', f_when_ph: 'Por ejemplo: sábados por la mañana', send: 'Enviar solicitud', sending: 'Enviando…',
      ok_h: '¡Recibido!', ok_p: 'Te escribo pronto para confirmar. Si quieres adelantar, envíame ahora tu foto por WhatsApp:', ok_wa: 'Enviar mi foto por WhatsApp', err_req: 'Necesito tu nombre y un teléfono para escribirte.', err_net: 'No se pudo enviar. Prueba de nuevo o escríbeme por WhatsApp.',
      foot: 'Atención con cita previa. Nada se confirma hasta que hablemos.', ig: 'Instagram', wa_msg_req: (id, kw) => `Hola Mishell, acabo de pedir cita (#${id}) para ${kw}. Te envío mi foto 😊`, wa_msg: 'Hola Mishell, vi tu página y me gustaría preguntar por un servicio.',
      rv_h: 'Tu opinión', rv_p: 'Gracias por venir a Beauty Shell ♡ ¿Cómo fue tu experiencia?', rv_name: 'Tu nombre (como quieras que aparezca)', rv_text: 'Cuéntalo en tus palabras', rv_send: 'Enviar opinión', rv_ok: '¡Gracias! Mishell la revisará antes de publicarla.', rv_bad: 'Este enlace ya se usó o no es válido.',
    },
    en: {
      tag: 'Hair color, cuts & treatments', hero_h: 'Let’s talk about your hair', hero_p: 'Hair color, anti-frizz, hair botox and haircuts, with personal attention in Stamford, Rye, Port Chester and nearby. Se habla español.',
      wa: 'Message me on WhatsApp', req: 'Request an appointment', svc_h: 'Services', svc_p: 'Every head of hair has its own starting point; the price is confirmed in the consultation, before your appointment.',
      price_ask: 'Price on consultation', from: 'from', min: 'min', ask: 'Ask', how_h: 'How it works', how: [['Send me a photo', 'Of your hair today, in natural light.'], ['Tell me your idea', 'A reference or a few words. Tell me your town.'], ['We confirm together', 'Service, price and time on WhatsApp.']],
      rev_h: 'Reviews', rev_empty: 'The first client reviews are coming soon.', form_h: 'Request an appointment', form_p: 'Leave your details and I’ll message you on WhatsApp to confirm. No commitment.',
      f_name: 'Your name', f_phone: 'Your WhatsApp or phone', f_city: 'Your town', f_svc: 'What would you like to do?', f_idea: 'Tell me your idea', f_idea_ph: 'For example: a lighter blonde without damaging my hair…', f_when: 'Which days work for you?', f_when_ph: 'For example: Saturday mornings', send: 'Send request', sending: 'Sending…',
      ok_h: 'Got it!', ok_p: 'I’ll message you soon to confirm. To get ahead, send me your photo on WhatsApp now:', ok_wa: 'Send my photo on WhatsApp', err_req: 'I need your name and a phone number to reach you.', err_net: 'Couldn’t send. Try again or message me on WhatsApp.',
      foot: 'By appointment. Nothing is confirmed until we talk.', ig: 'Instagram', wa_msg_req: (id, kw) => `Hi Mishell, I just requested an appointment (#${id}) for ${kw}. Sending my photo 😊`, wa_msg: 'Hi Mishell, I saw your page and I’d like to ask about a service.',
      rv_h: 'Your review', rv_p: 'Thank you for visiting Beauty Shell ♡ How was it?', rv_name: 'Your name (as you’d like it shown)', rv_text: 'In your own words', rv_send: 'Send review', rv_ok: 'Thank you! Mishell will review it before it’s published.', rv_bad: 'This link was already used or isn’t valid.',
    }
  };
  let lang = (() => { try { return localStorage.getItem('bs.lang') || ((navigator.language || '').startsWith('es') ? 'es' : 'en'); } catch (e) { return 'es'; } })();
  if (!T[lang]) lang = 'es';
  const t = (k) => T[lang][k];
  const setLang = (l) => { lang = T[l] ? l : 'es'; try { localStorage.setItem('bs.lang', lang); } catch (e) {} document.documentElement.lang = lang; };
  const waLink = (num, msg) => 'https://wa.me/' + num + '?text=' + encodeURIComponent(msg);
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const money = (n) => '$' + Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  const stars = (n) => '★'.repeat(n) + '☆'.repeat(5 - n);
  return { rpc, t, get lang() { return lang; }, setLang, waLink, esc, money, stars };
})();
