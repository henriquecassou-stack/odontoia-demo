// Início da demonstração: liga o "servidor" que roda no navegador (service worker) antes das páginas
// carregarem, mostra a tela de entrada no painel e o atalho para recomeçar com dados novos.

function semSuporte() {
  document.body.innerHTML = `<div style="font-family:system-ui,sans-serif;max-width:520px;margin:15vh auto;padding:24px;line-height:1.5">
    <h1 style="font-size:22px">Não foi possível abrir a demonstração</h1>
    <p>Este navegador não permite o recurso que a demonstração usa (por exemplo, janela anônima do Firefox).
    Abra o link numa janela normal do Chrome, Edge, Safari ou Firefox.</p></div>`;
  throw new Error('Service worker indisponível');
}

if (!('serviceWorker' in navigator)) semSuporte();

// A página só segue quando está sob controle da versão ATIVA do service worker registrado. Cobre a
// primeira visita, uma versão nova esperando para assumir e páginas presas a uma versão antiga.
let registro = null;
try {
  registro = (await navigator.serviceWorker.getRegistration('./')) || (await navigator.serviceWorker.register('./sw.js'));
  registro.update().catch(() => {}); // procura uma versão nova da demonstração
} catch {
  semSuporte();
}
const sobControleCerto = () => {
  const atual = navigator.serviceWorker.controller;
  return Boolean(atual) && atual === registro.active && !registro.waiting;
};
if (!sobControleCerto()) {
  const assumiu = new Promise((resolver) => navigator.serviceWorker.addEventListener('controllerchange', resolver, { once: true }));
  const prazo = new Promise((resolver) => setTimeout(resolver, 6000));
  await Promise.race([assumiu, prazo]);
  if (!sobControleCerto()) {
    let jaTentou = null;
    try { jaTentou = sessionStorage.getItem('demo-recarregou'); sessionStorage.setItem('demo-recarregou', '1'); } catch { /* sem armazenamento */ }
    if (!jaTentou) { location.reload(); await new Promise(() => {}); }
    if (!navigator.serviceWorker.controller) semSuporte(); // segue com o que estiver controlando a página
  }
}
try { sessionStorage.removeItem('demo-recarregou'); } catch { /* sem armazenamento */ }

// Com a página já aberta: quando uma versão nova é instalada, recarrega para soltar as conexões
// em tempo real da versão antiga (assim a nova assume) e, quando ela assume, recarrega de novo para usá-la.
navigator.serviceWorker.addEventListener('controllerchange', () => location.reload());
registro.addEventListener('updatefound', () => {
  const nova = registro.installing;
  nova?.addEventListener('statechange', () => {
    if (nova.state === 'installed' && navigator.serviceWorker.controller) location.reload();
  });
});

const guardar = {
  ler: (k) => { try { return sessionStorage.getItem(k); } catch { return null; } },
  gravar: (k, v) => { try { sessionStorage.setItem(k, v); } catch { /* sem armazenamento: pede de novo na próxima vez */ } },
};

async function recomecar(e) {
  e?.preventDefault();
  if (!confirm('Recomeçar a demonstração? Tudo o que você fez aqui será apagado e os dados de exemplo voltam ao início.')) return;
  await fetch('api/demo/recomecar', { method: 'POST' }).catch(() => {});
  location.reload();
}

// Só no painel (index.html): tela de entrada e atalho "Recomeçar" no menu
if (document.querySelector('.sidebar')) {
  const rodape = document.querySelector('.sidebar-footer');
  if (rodape) {
    const linha = document.createElement('div');
    linha.style.marginTop = '8px';
    linha.innerHTML = '🧪 Demonstração · <a href="#" id="demo-recomecar">Recomeçar do zero</a>';
    rodape.prepend(linha);
    linha.querySelector('a').addEventListener('click', recomecar);
  }

  if (!guardar.ler('demo-entrou')) {
    const tela = document.createElement('div');
    tela.setAttribute('role', 'dialog');
    tela.setAttribute('aria-label', 'Entrar na demonstração');
    tela.style.cssText = 'position:fixed;inset:0;z-index:100;display:grid;place-items:center;padding:16px;background:linear-gradient(160deg,#0b3b38,#115e59);font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif';
    tela.innerHTML = `
      <form style="background:#fff;border-radius:16px;padding:28px;width:min(400px,100%);box-shadow:0 20px 60px rgba(0,0,0,.3);display:grid;gap:14px">
        <div style="display:flex;align-items:center;gap:10px">
          <div style="width:40px;height:40px;border-radius:11px;background:#14b8a6;display:grid;place-items:center">
            <svg viewBox="0 0 32 32" width="26" height="26"><path d="M10 8c-3 0-4 3-3 7 1 3 1 9 3 9s2-5 3-5h6c1 0 1 5 3 5s2-6 3-9c1-4 0-7-3-7-2 0-3 1-6 1s-4-1-6-1z" fill="white"/></svg>
          </div>
          <div><b style="font-size:19px;color:#0f172a">OdontoIA</b><div style="font-size:13px;color:#64748b">Demonstração</div></div>
        </div>
        <p style="margin:0;color:#334155;font-size:14px;line-height:1.5">Sistema para clínicas odontológicas com recepcionista de IA no WhatsApp. Entre com o acesso de demonstração:</p>
        <label style="display:grid;gap:4px;font-size:12px;font-weight:600;color:#64748b">E-mail
          <input name="email" value="dono@demo.com" autocomplete="off" style="font:inherit;font-size:15px;padding:10px;border:1px solid #e2e8f0;border-radius:8px;color:#0f172a"></label>
        <label style="display:grid;gap:4px;font-size:12px;font-weight:600;color:#64748b">Senha
          <input name="senha" type="password" value="demo" autocomplete="off" style="font:inherit;font-size:15px;padding:10px;border:1px solid #e2e8f0;border-radius:8px;color:#0f172a"></label>
        <button style="font:inherit;font-weight:700;font-size:15px;padding:12px;border:0;border-radius:10px;background:#0f766e;color:#fff;cursor:pointer">Entrar</button>
        <p style="margin:0;font-size:12px;color:#64748b;line-height:1.5">Os dados são fictícios e ficam só neste navegador: nada é enviado para lugar nenhum. Use qualquer senha.</p>
      </form>`;
    document.body.append(tela);
    tela.querySelector('form').addEventListener('submit', (e) => {
      e.preventDefault();
      guardar.gravar('demo-entrou', '1');
      tela.remove();
    });
    tela.querySelector('button').focus();
  }
}
