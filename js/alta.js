// Alta self-service — envío del formulario al Apps Script del backend.
//
// Cuando el endpoint esté desplegado, rellena ENDPOINT con la URL de Apps
// Script (debería terminar en `/exec`). Mientras tanto, el form funciona
// en modo "preview": valida, muestra feedback y redirige a /alta/enviada/
// con el email en la query para que la UI se vea completa.
//
// El backend espera recibir un POST JSON con esta forma:
//   {
//     club: { name, type, size, city },
//     user: { name, role, email, phone },
//     plan: "pena" | "club" | "federacion",
//     accepted_terms_at: ISO string
//   }
//
// Debe responder 200 con { ok: true } o un error con { ok: false, error: "..." }.
// Si el club ya existe, idealmente { ok: false, error: "already_exists" } para
// que podamos ofrecerle recuperar el enlace.

const ENDPOINT = ''; // p. ej. "https://script.google.com/macros/s/.../exec"

const form      = document.getElementById('alta-form');
const btn       = form.querySelector('button[type="submit"]');
const errorBox  = document.getElementById('alta-error');
const successBox = document.getElementById('alta-success');

// Preselecciona el plan si venimos de /precios?plan=club
const planParam = new URLSearchParams(location.search).get('plan');
if (planParam && ['pena', 'club', 'federacion'].includes(planParam)) {
  const sel = document.getElementById('f-plan');
  if (sel) sel.value = planParam;
}

function showError(msg) {
  errorBox.textContent = msg;
  errorBox.classList.add('is-visible');
  successBox.classList.remove('is-visible');
}

function showSuccess(msg) {
  successBox.textContent = msg;
  successBox.classList.add('is-visible');
  errorBox.classList.remove('is-visible');
}

function clearFeedback() {
  errorBox.classList.remove('is-visible');
  successBox.classList.remove('is-visible');
}

function serialize() {
  return {
    club: {
      name: form.club_name.value.trim(),
      type: form.club_type.value,
      size: form.club_size.value,
      city: form.club_city.value.trim()
    },
    user: {
      name:  form.name.value.trim(),
      role:  form.role.value,
      email: form.email.value.trim().toLowerCase(),
      phone: form.phone.value.trim()
    },
    plan: form.plan.value,
    accepted_terms_at: new Date().toISOString()
  };
}

function validate(data) {
  if (!data.club.name)  return 'Pon el nombre del club.';
  if (!data.club.type)  return 'Elige el tipo de club.';
  if (!data.club.size)  return 'Elige el tamaño del club.';
  if (!data.user.name)  return 'Pon tu nombre.';
  if (!data.user.role)  return 'Elige tu cargo en el club.';
  if (!data.user.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.user.email)) {
    return 'Pon un email válido.';
  }
  if (!form.rgpd.checked) {
    return 'Acepta la política de privacidad y las condiciones.';
  }
  return null;
}

async function submit(data) {
  if (!ENDPOINT) {
    // Modo preview: simulamos un envío correcto para poder ver el flujo.
    await new Promise(r => setTimeout(r, 600));
    return { ok: true, preview: true };
  }
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' }, // Apps Script requires text/plain to avoid CORS preflight
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('http_' + res.status);
  return await res.json();
}

form.addEventListener('submit', async (ev) => {
  ev.preventDefault();
  clearFeedback();
  const data = serialize();
  const err = validate(data);
  if (err) { showError(err); return; }

  btn.disabled = true;
  btn.textContent = 'Creando tu club…';

  try {
    const res = await submit(data);
    if (res && res.ok) {
      const q = new URLSearchParams({ email: data.user.email });
      location.href = '/alta/enviada/?' + q.toString();
      return;
    }
    if (res && res.error === 'already_exists') {
      showError('Ya hay un club con este email. ¿Quieres que te enviemos otra vez el enlace de acceso?');
    } else {
      showError('No hemos podido crear el club ahora mismo. Vuelve a intentarlo en un minuto o escríbenos a hola@werclub.com.');
    }
  } catch (e) {
    showError('Ha fallado la conexión. Comprueba tu internet y vuelve a intentarlo.');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Crear el club y enviarme el enlace';
  }
});
