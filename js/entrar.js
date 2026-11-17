// Entrar — pide un enlace mágico para una cuenta ya existente.
//
// El backend espera recibir un POST JSON con esta forma:
//   { email: "..." }
//
// Debe responder 200 con { ok: true } tanto si el email existe como si no
// (para no filtrar qué cuentas existen). Si existe, dispara el enlace al
// correo; si no, simplemente no manda nada. La UI es la misma en ambos
// casos: siempre decimos "revisa tu email".

const ENDPOINT = ''; // p. ej. "https://script.google.com/macros/s/.../exec?action=login"

const form     = document.getElementById('login-form');
const btn      = form.querySelector('button[type="submit"]');
const errorBox = document.getElementById('login-error');

function showError(msg) {
  errorBox.textContent = msg;
  errorBox.classList.add('is-visible');
}

async function submit(email) {
  if (!ENDPOINT) {
    await new Promise(r => setTimeout(r, 600));
    return { ok: true, preview: true };
  }
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({ email, intent: 'login' })
  });
  if (!res.ok) throw new Error('http_' + res.status);
  return await res.json();
}

form.addEventListener('submit', async (ev) => {
  ev.preventDefault();
  errorBox.classList.remove('is-visible');

  const email = form.email.value.trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showError('Pon un email válido.');
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Enviando el enlace…';

  try {
    const res = await submit(email);
    if (res && res.ok) {
      const q = new URLSearchParams({ email });
      location.href = '/entrar/enviado/?' + q.toString();
      return;
    }
    showError('No hemos podido enviar el enlace ahora mismo. Inténtalo de nuevo en un minuto.');
  } catch (e) {
    showError('Ha fallado la conexión. Comprueba tu internet y vuelve a intentarlo.');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Mándame el enlace';
  }
});
