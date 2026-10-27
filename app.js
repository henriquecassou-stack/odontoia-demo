const i=(a,n=document)=>n.querySelector(a),E=(a,n=document)=>[...n.querySelectorAll(a)],d=a=>String(a??"").replace(/[&<>"']/g,n=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[n]),T=a=>Number(a||0).toLocaleString("pt-BR",{style:"currency",currency:"BRL"}),K=a=>`${Math.round((a||0)*100)}%`,ra=["Dom","Seg","Ter","Qua","Qui","Sex","S\xE1b"],ba=["domingo","segunda-feira","ter\xE7a-feira","quarta-feira","quinta-feira","sexta-feira","s\xE1bado"],ea=["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"],ta={agendada:"Agendada",confirmada:"Confirmada",em_atendimento:"Em atendimento",concluida:"Conclu\xEDda",faltou:"Faltou",cancelada:"Cancelada"},sa={pix:"Pix",cartao:"Cart\xE3o",dinheiro:"Dinheiro",convenio:"Conv\xEAnio",boleto:"Boleto"};function J(a){const t=String(a||"").replace(/\D/g,"").match(/^55(\d{2})(\d{4,5})(\d{4})$/);return t?`(${t[1]}) ${t[2]}-${t[3]}`:a||""}const oa=(a,n)=>new Date(Date.parse(`${a}T00:00Z`)+n*864e5).toISOString().slice(0,10),Z=a=>new Date(`${a}T00:00Z`).getUTCDay(),X=a=>a?a.slice(0,10).split("-").reverse().join("/"):"",na=a=>`${ra[Z(a)]} ${a.slice(8,10)}/${a.slice(5,7)}`,I=a=>a.slice(11,16),F=a=>Number(a.slice(0,2))*60+Number(a.slice(3,5)),ga=a=>`${String(Math.floor(a/60)).padStart(2,"0")}:${String(a%60).padStart(2,"0")}`,$a=a=>new Date(a).toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"});function ha(a){const n=new Date(a);return n.toDateString()===new Date().toDateString()?$a(a):n.toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit"})}function fa(a){if(!a)return null;const[n,t,e]=a.split("-").map(Number),[s,c,l]=A.hoje.split("-").map(Number);return s-n-(c<t||c===t&&l<e?1:0)}const aa=a=>a.nome_contato||a.paciente_nome||J(a.telefone),Ra=a=>a.replace(/https?:\/\/[^\s<]+/g,n=>`<a href="${n}" target="_blank" rel="noopener">${n}</a>`),z=(a,n)=>{let t;return(...e)=>{clearTimeout(t),t=setTimeout(()=>a(...e),n)}};async function h(a,{method:n="GET",body:t}={}){const e=await fetch(`/api${a}`,{method:n,headers:t?{"Content-Type":"application/json"}:void 0,body:t?JSON.stringify(t):void 0}),s=await e.json().catch(()=>({}));if(!e.ok)throw new Error(s.erro||`Erro ${e.status}`);return s}function x(a,n=""){const t=document.createElement("div");t.className=`toast ${n}`,t.textContent=a,i("#toasts").append(t),setTimeout(()=>t.remove(),4500)}function q({title:a,body:n,foot:t="",onMount:e,width:s}){const c=i("#modal-root"),l=document.createElement("div");l.className="modal-bg",l.innerHTML=`<div class="modal" ${s?`style="width:min(${s}px,100%)"`:""}>
      <div class="modal-head"><h2>${a}</h2><span class="spacer"></span><button class="btn ghost sm" data-close>\u2715</button></div>
      <div class="modal-body">${n}</div>
      ${t?`<div class="modal-foot">${t}</div>`:""}
    </div>`;const p=()=>l.remove();l.addEventListener("mousedown",u=>{u.target===l&&p()}),l.addEventListener("click",u=>{u.target.closest("[data-close]")&&p()}),c.append(l);const o={el:l,close:p};return e?.(o),i("input, select, textarea",l)?.focus(),o}const R=a=>Object.fromEntries(E("[name]",a).map(n=>[n.name,n.type==="checkbox"?n.checked:n.value])),A={dentists:[],procedures:[],status:{},hoje:new Date().toISOString().slice(0,10),settings:{}};let O={};async function pa(){const[a,n,t,e]=await Promise.all([h("/dentists"),h("/procedures"),h("/status"),h("/settings")]);Object.assign(A,{dentists:a,procedures:n,status:t,settings:e,hoje:t.agora.slice(0,10)}),i("#brand-name").textContent=e.nome_clinica||"OdontoIA",document.title=`${e.nome_clinica||"OdontoIA"} \u2014 Painel`,i("#st-ia").className=`dot ${t.ia?"on":"off"}`,i("#st-ia-txt").textContent=t.ia?"ativa":"em modo demonstra\xE7\xE3o",i("#st-wa").className=`dot ${t.whatsapp?"on":"off"}`,i("#st-wa-txt").textContent=t.whatsapp?"conectado":"n\xE3o configurado"}async function ya(){const n=(await h("/conversations")).filter(e=>e.precisa_atencao).length,t=i("#nav-alertas");t.textContent=n,t.classList.toggle("hidden",!n)}const Ha=z(ya,300);function Ua(){const a=new EventSource("/api/stream");for(const n of["mensagem","conversa","ia_delta","ia_digitando","ia_rascunho_descartado","agenda","financeiro","pacientes","config","agentes","orcamentos","imagens","uso_ia"])a.addEventListener(n,t=>{const e=JSON.parse(t.data);Fa[n]?.(e),O[n]?.(e)})}const Fa={conversa:()=>Ha(),mensagem:({message:a,conversa:n})=>{a.autor==="paciente"&&Y.nome!=="conversas"&&x(`\u{1F4AC} ${aa(n)}: ${a.texto.slice(0,80)}`)},agenda:({tipo:a,consulta:n})=>{a==="criada"&&n.origem==="ia"&&x(`\u{1F916} IA agendou ${n.paciente_nome} \u2014 ${na(n.inicio)} ${I(n.inicio)} com ${n.dentista_nome}`,"ia")},config:async()=>{await pa()}},Y={nome:"painel",id:null},wa={painel:za,agenda:Ja,conversas:Qa,"equipe-ia":Va,pacientes:Xa,financeiro:ce,config:pe};function xa(){const[,a="painel",n=null]=location.hash.split("/");Object.assign(Y,{nome:wa[a]?a:"painel",id:n}),E("[data-nav]").forEach(t=>t.classList.toggle("active",t.dataset.nav===Y.nome)),i("#view").classList.toggle("tela-cheia",Y.nome==="conversas"),O={},i("#gf-dica")?.classList.add("hidden"),wa[Y.nome](Y.id)}async function za(){const a=i("#view"),n=async()=>{const[e,s,c]=await Promise.all([h("/dashboard"),h("/resumo-do-dia"),h("/uso-ia")]),l=new Date().getHours(),p=l<12?"Bom dia":l<18?"Boa tarde":"Boa noite",o=s.consultas,u=Ba(s);a.innerHTML=`
      <div class="page-head">
        <div><h1>${p}!</h1><p class="muted">${ba[Z(e.hoje)]}, ${X(e.hoje)} \xB7 ${o.total?`${o.total} consulta(s), ${o.confirmadas} confirmada(s)`:"nenhuma consulta hoje"}</p></div>
        <span class="spacer"></span>
        <a class="btn ghost" href="chat.html" target="_blank">Testar a IA \u2197</a>
        <button class="btn primary" id="nova">+ Nova consulta</button>
      </div>
      ${c.ia&&(c.atingido||c.alerta)?`<a class="aviso-limite faixa" href="#/config">${c.atingido?"\u26A0\uFE0F A IA atingiu o limite mensal do plano: o que ela n\xE3o entender vai para a equipe responder.":`A IA j\xE1 usou ${K(c.percentual)} do limite mensal do plano.`} Ver uso \u2192</a>`:""}
      <div class="card kpi-faixa">
        <div class="kpi"><div class="label">Agendadas pela IA</div><div class="value">${e.agendadas_ia_7d}</div><div class="hint">\xFAltimos 7 dias</div></div>
        <div class="kpi"><div class="label">Recebido no m\xEAs</div><div class="value">${T(e.recebido_mes)}</div><div class="hint">${T(e.a_receber)} a receber</div></div>
        <div class="kpi"><div class="label">Faltas no m\xEAs</div><div class="value">${K(e.taxa_faltas_mes)}</div><div class="hint">das consultas encerradas</div></div>
      </div>
      <div class="grid grid-3-1">
        <div class="card">
          <div class="card-head"><h2>Agenda de hoje</h2><span class="spacer"></span><a href="#/agenda" class="small">Abrir agenda \u2192</a></div>
          ${e.consultas_hoje.length?e.consultas_hoje.map($=>`
            <div class="list-item click" data-appt="${$.id}" style="cursor:pointer">
              <span class="color-bar" style="background:${$.cor}"></span>
              <span class="time-pill">${I($.inicio)}</span>
              <div style="flex:1;min-width:0"><b>${d($.paciente)}</b> ${$.origem==="ia"?'<span class="badge ia">IA</span>':""}${(u.get($.patient_id)||[]).join("")}<div class="muted small">${d($.procedimento||"\u2014")} \xB7 ${d($.dentista)}</div></div>
              <span class="st st-${$.status}">${ta[$.status]}</span>
            </div>`).join(""):'<div class="empty">Nenhuma consulta hoje.</div>'}
        </div>
        ${Wa(s,e.conversas_atencao)}
      </div>`,i("#nova").onclick=()=>G({}),E("[data-appt]",a).forEach($=>$.onclick=()=>G({id:Number($.dataset.appt)})),E("[data-ia]",a).forEach($=>$.onclick=()=>Ia($.dataset.ia))};await n();const t=z(n,400);O={agenda:t,conversa:t,financeiro:t,orcamentos:t,agentes:t,uso_ia:t}}function Ba(a){const n=new Map,t=(s,c)=>n.set(s,[...n.get(s)||[],c]),e=(s,c,l)=>` <span class="badge ${s}" title="${d(l)}">${c}</span>`;for(const s of a.alertas_de_saude)t(s.paciente_id,e("alerta","\u26A0\uFE0F sa\xFAde",s.alertas.join(", ")));for(const s of a.cobrar_hoje)t(s.paciente_id,e("",`\u{1F4B3} ${T(s.valor)}`,"Valor em aberto"));for(const s of a.orcamentos_para_apresentar)t(s.paciente_id,e("","\u{1F4CB} or\xE7amento",`${s.titulo}${s.status==="rascunho"?" (rascunho)":""}`));for(const s of a.aniversariantes)t(s.paciente_id,e("ok","\u{1F382}",`Faz ${s.idade} anos hoje`));return n}function Wa(a,n){const t=(c,l,p=[],o="")=>{const u=`<span class="pend-ico">${c}</span><span>${l}</span>`;return p.length?`<details class="pend-item"><summary>${u}<span class="spacer"></span><span class="muted pend-seta">\u25BE</span></summary>
      <ul>${p.join("")}</ul></details>`:`<a class="pend-item" href="${o}">${u}<span class="spacer"></span><span class="muted">\u2192</span></a>`},e=(c,l)=>`<li><a href="#/pacientes/${c}">${l}</a></li>`;return`
    <div class="card pendencias" style="align-self:start">
      <div class="card-head"><h2>Pend\xEAncias</h2><span class="spacer"></span><button type="button" class="chip" data-ia="Monte meu resumo do dia com as prioridades">\u2728 Resumo com IA</button></div>
      ${[n.length&&t("\u{1F4AC}",`<b>${n.length}</b> conversa(s) pedindo a equipe`,n.map(c=>`<li><a href="#/conversas/${c.id}"><b>${d(aa(c))}</b> \xB7 <span class="muted">${d(c.motivo_atencao||"")}</span></a></li>`)),a.sem_confirmacao.length&&t("\u23F3",`<b>${a.sem_confirmacao.length}</b> sem confirma\xE7\xE3o`,a.sem_confirmacao.map(c=>e(c.paciente_id,`<b>${d(c.paciente)}</b> \xB7 ${d(c.quando)}`))),a.aniversariantes.length&&t("\u{1F382}",`<b>${a.aniversariantes.length}</b> aniversariante(s)`,a.aniversariantes.map(c=>e(c.paciente_id,`<b>${d(c.paciente)}</b> \xB7 ${c.idade} anos`))),a.retornos_na_fila&&t("\u{1F501}",`<b>${a.retornos_na_fila}</b> retorno(s) atrasado(s)`,[],"#/equipe-ia"),a.vencidos_total&&t("\u{1F4B0}",`<b>${T(a.vencidos_total)}</b> vencido(s)`,[],"#/financeiro")].filter(Boolean).join("")||'<div class="empty">Tudo em dia. \u2728</div>'}
    </div>`}async function Va(){const a=i("#view"),n=async()=>{const[{agentes:e,atividade:s},c]=await Promise.all([h("/agentes"),h("/modelos")]),l=Object.fromEntries(e.map(o=>[o.id,o])),p=o=>{const u=o.metricas;return`<div class="card agente ${o.ativo?"":"pausado"}" style="--c:${o.cor}">
        <div class="agente-topo">
          <div class="agente-avatar">${d(o.nome[0])}</div>
          <div style="flex:1;min-width:0"><div class="agente-funcao">${d(o.funcao)}</div><b style="font-size:16px">${d(o.nome)}</b> <span class="muted small">${o.ativo?"\xB7 ativo":"\xB7 pausado"}</span></div>
          <label class="switch" title="${o.ativo?"Pausar":"Ativar"}"><input type="checkbox" data-ativo="${o.id}" ${o.ativo?"checked":""} aria-label="Ativar ${d(o.funcao)}"><span></span></label>
        </div>
        <p class="agente-desc">${d(o.descricao)}</p>
        <div class="agente-regra">\u{1F4CF} ${d(o.regra)}${o.modelo?`<br>\u{1F4AC} Fora da janela de 24h: modelo <code>${d(o.modelo)}</code>`:""}</div>
        <div class="agente-metricas">
          <div><b>${u.hoje}</b><span>${u.rotulos.hoje}</span></div>
          <div><b>${u.semana}</b><span>${u.rotulos.semana}</span></div>
          <div><b>${u.fila}</b><span>${u.rotulos.fila}</span></div>
        </div>
        <div class="row"><span class="agente-resultado"><b>${d(String(u.resultado.valor))}</b> ${d(u.resultado.rotulo)}</span><span class="spacer"></span>
          ${o.executavel?`<button class="btn sm" data-rodar="${o.id}" ${u.fila?"":"disabled"}>Rodar agora</button>`:'<a class="btn sm" href="#/conversas">Ver conversas</a>'}</div>
      </div>`};a.innerHTML=`
      <div class="page-head"><div><h1>Equipe de IA</h1>
        <p class="muted">Agentes que trabalham sozinhos pelo WhatsApp, de segunda a s\xE1bado, das 8h \xE0s 20h. As respostas dos pacientes chegam em Conversas, onde a recepcionista continua o atendimento.</p></div></div>
      ${A.status.demo?'<div class="ia-demo" style="margin-bottom:14px">\u{1F9EA} Modo demonstra\xE7\xE3o: as mensagens v\xE3o para o simulador de paciente. Para ver e responder, abra o simulador e entre como o paciente.</div>':""}
      <div class="agentes">${e.map(p).join("")}</div>
      <div class="card" style="margin-top:16px">
        <div class="card-head"><h2>Modelos do WhatsApp</h2></div>
        <div class="card-pad muted small" style="padding-bottom:6px">At\xE9 24h depois da \xFAltima mensagem do paciente, os agentes escrevem livremente. Fora dessa janela, o WhatsApp s\xF3 entrega mensagens por <b>modelo aprovado</b>, ent\xE3o eles usam estes. O nome e o texto precisam ser iguais aos cadastrados no WhatsApp Manager da Meta.</div>
        <div class="table-wrap"><table class="table"><thead><tr><th>Modelo</th><th>Categoria</th><th>Usado por</th><th>Texto</th><th></th></tr></thead><tbody>
          ${c.map(o=>`<tr><td><code>${d(o.nome)}</code>${o.personalizado?' <span class="badge">personalizado</span>':""}</td>
            <td><span class="badge ${o.categoria==="Marketing"?"alerta":"ia"}">${d(o.categoria)}</span></td>
            <td class="small">${d(o.usadoPor)}</td>
            <td class="small muted" style="max-width:320px">${d(o.texto.length>90?`${o.texto.slice(0,90)}\u2026`:o.texto)}</td>
            <td style="text-align:right"><button class="btn sm" data-modelo="${o.id}">Ver e editar</button></td></tr>`).join("")}
        </tbody></table></div>
      </div>
      <div class="card" style="margin-top:16px">
        <div class="card-head"><h2>Atividade recente</h2></div>
        ${s.length?`<div class="table-wrap"><table class="table"><thead><tr><th>Quando</th><th>Agente</th><th>Paciente</th><th>O que fez</th><th></th></tr></thead><tbody>
          ${s.map(o=>`<tr><td>${ha(o.criado_em)}</td><td><span class="dot" style="background:${l[o.agente]?.cor}"></span>${d(l[o.agente]?.nome||o.agente)}</td>
            <td>${o.patient_id?`<a href="#/pacientes/${o.patient_id}">${d(o.paciente_nome)}</a>`:"\u2014"}</td><td>${d(o.descricao)}</td>
            <td style="text-align:right">${o.conversation_id?`<a class="btn sm ghost" href="#/conversas/${o.conversation_id}">Conversa</a>`:""}</td></tr>`).join("")}
        </tbody></table></div>`:'<div class="empty">Nenhuma a\xE7\xE3o ainda. Use "Rodar agora" em um agente com pacientes na fila.</div>'}
      </div>`,E("[data-ativo]",a).forEach(o=>o.addEventListener("change",async()=>{await h(`/agentes/${o.dataset.ativo}`,{method:"PUT",body:{ativo:o.checked}}).catch(u=>x(u.message,"err")),x(`${l[o.dataset.ativo].funcao}: ${o.checked?"ativado":"pausado"}.`),n()})),E("[data-modelo]",a).forEach(o=>o.onclick=()=>ee(c.find(u=>u.id===o.dataset.modelo),n)),E("[data-rodar]",a).forEach(o=>o.onclick=async()=>{o.disabled=!0,o.textContent="Enviando\u2026";const u=await h(`/agentes/${o.dataset.rodar}/rodar`,{method:"POST"}).catch($=>(x($.message,"err"),null));u&&x(u.enviados?`${l[o.dataset.rodar].nome} contatou ${u.enviados} paciente(s).`:"Ningu\xE9m na fila agora.","ia"),n()})};await n();const t=z(n,500);O={agentes:t,orcamentos:t,financeiro:t,agenda:t,conversa:t}}const P={data:null,modo:"dia",dentistaId:null,ocultos:new Set},B=420,ma=1200,Ga=30,_a=44,W=_a/Ga;async function Ja(){P.data??=A.hoje,P.dentistaId??=A.dentists[0]?.id;const a=i("#view");let n=null;const t=async()=>{const e=P.modo==="semana",s=oa(P.data,-((Z(P.data)+6)%7)),c=e?s:P.data,l=e?oa(s,6):P.data,p=(await h(`/appointments?de=${c}&ate=${l}${e?`&dentist_id=${P.dentistaId}`:""}`)).filter(v=>v.status!=="cancelada"),o=(await h(`/appointments?de=${c}&ate=${l}`)).filter(v=>v.status==="cancelada").length,u=e?Array.from({length:7},(v,L)=>({data:oa(s,L),dentista:A.dentists.find(D=>D.id===P.dentistaId)})).map(v=>({...v,titulo:na(v.data),sub:v.data===A.hoje?"hoje":""})):A.dentists.filter(v=>!P.ocultos.has(v.id)).map(v=>({data:P.data,dentista:v,titulo:v.nome,sub:v.especialidade||""})),$=(ma-B)*W,r=F(A.status.agora?.slice(11,16)||"00:00"),w=e?`${Number(c.slice(8))} ${ea[Number(c.slice(5,7))-1]} \u2013 ${Number(l.slice(8))} ${ea[Number(l.slice(5,7))-1]} ${l.slice(0,4)}`:`${ba[Z(P.data)]}, ${Number(P.data.slice(8))} de ${ea[Number(P.data.slice(5,7))-1]}`;a.innerHTML=`
      <div class="page-head"><h1>Agenda</h1><span class="spacer"></span><button class="btn primary" id="nova">+ Nova consulta</button></div>
      <div class="agenda-toolbar">
        <button class="btn sm" data-nav-dia="-1">\u25C0</button>
        <button class="btn sm" data-nav-dia="0">Hoje</button>
        <button class="btn sm" data-nav-dia="1">\u25B6</button>
        <span class="agenda-title">${w}</span>
        <input type="date" id="ag-data" value="${P.data}" style="height:30px">
        <div class="seg"><button data-modo="dia" class="${e?"":"on"}">Dia</button><button data-modo="semana" class="${e?"on":""}">Semana</button></div>
        ${e?`<select id="ag-dentista">${A.dentists.map(v=>`<option value="${v.id}" ${v.id===P.dentistaId?"selected":""}>${d(v.nome)}</option>`).join("")}</select>`:A.dentists.map(v=>`<span class="dentist-chip ${P.ocultos.has(v.id)?"off":""}" data-chip="${v.id}"><span class="sw" style="background:${v.cor}"></span>${d(v.nome)}</span>`).join("")}
        <span class="spacer"></span>
        ${o?`<span class="muted small">${o} cancelada(s) oculta(s)</span>`:""}
      </div>
      ${u.length?`
      <div class="cal card" style="grid-template-columns:56px repeat(${u.length}, minmax(150px, 1fr)); --slot:${_a}px">
        <div class="cal-corner"></div>
        ${u.map(v=>`<div class="cal-head ${v.data===A.hoje&&e?"hoje":""}" ${e?"":`style="box-shadow: inset 0 -3px 0 ${v.dentista.cor}"`}>${d(v.titulo)}<small>${d(v.sub)}</small></div>`).join("")}
        <div class="cal-times" style="height:${$}px;position:sticky">
          ${Array.from({length:(ma-B)/60},(v,L)=>`<div class="cal-time" style="position:absolute;top:${L*60*W}px;right:0">${ga(B+L*60)}</div>`).join("")}
        </div>
        ${u.map((v,L)=>{const D=v.dentista?.horarios?.[Z(v.data)]||[],S=p.filter(y=>y.inicio.slice(0,10)===v.data&&y.dentist_id===v.dentista?.id);return`<div class="cal-col" data-col="${L}" style="height:${$}px">
            ${D.map(([y,g])=>`<div class="cal-work" style="top:${(F(y)-B)*W}px;height:${(F(g)-F(y))*W}px"></div>`).join("")}
            ${v.data===A.hoje&&r>B&&r<ma?`<div class="cal-now" style="top:${(r-B)*W}px"></div>`:""}
            ${S.map(y=>{const g=(F(I(y.inicio))-B)*W,f=Math.max((F(I(y.fim))-F(I(y.inicio)))*W-2,20);return`<div class="appt s-${y.status} ${y.id===n?"flash":""}" data-appt="${y.id}" style="top:${g}px;height:${f}px;--c:${y.dentista_cor}" title="${d(`${I(y.inicio)}\u2013${I(y.fim)} ${y.paciente_nome} \xB7 ${y.procedimento_nome||""} \xB7 ${ta[y.status]}`)}">
                <div class="tags">${y.origem==="ia"?'<span class="tag">IA</span>':""}${y.status==="confirmada"?'<span class="tag" style="color:var(--ok)">\u2713</span>':""}${y.status==="faltou"?'<span class="tag" style="color:var(--warn)">falta</span>':""}</div>
                <b>${d(y.paciente_nome)}</b>
                <div class="meta">${I(y.inicio)} \xB7 ${d(y.procedimento_nome||"Consulta")}</div>
              </div>`}).join("")}
          </div>`}).join("")}
      </div>`:'<div class="card empty">Selecione ao menos um dentista.</div>'}`,i("#nova").onclick=()=>G({data:P.data,dentist_id:e?P.dentistaId:void 0}),E("[data-nav-dia]",a).forEach(v=>v.onclick=()=>{const L=Number(v.dataset.navDia);P.data=L===0?A.hoje:oa(P.data,L*(e?7:1)),t()}),i("#ag-data").onchange=v=>{v.target.value&&(P.data=v.target.value,t())},E("[data-modo]",a).forEach(v=>v.onclick=()=>{P.modo=v.dataset.modo,t()}),i("#ag-dentista")?.addEventListener("change",v=>{P.dentistaId=Number(v.target.value),t()}),E("[data-chip]",a).forEach(v=>v.onclick=()=>{const L=Number(v.dataset.chip);P.ocultos.has(L)?P.ocultos.delete(L):P.ocultos.add(L),t()}),E(".cal-col",a).forEach(v=>v.addEventListener("click",L=>{const D=L.target.closest("[data-appt]");if(D)return G({id:Number(D.dataset.appt)});const S=u[Number(v.dataset.col)],y=B+Math.floor((L.clientY-v.getBoundingClientRect().top)/W/15)*15;G({data:S.data,hora:ga(y),dentist_id:S.dentista.id})}));const _=i(".cal",a);_&&!_.dataset.scrolled&&(_.scrollTop=Math.max(0,((P.data===A.hoje?r-60:480)-B)*W-20))};await t(),O={agenda:async({tipo:e,consulta:s})=>{e==="criada"&&(n=s.id);const c=i(".cal")?.scrollTop;await t(),c!=null&&i(".cal")&&(i(".cal").scrollTop=c)},config:()=>setTimeout(t,200)}}async function G({id:a,data:n,hora:t,dentist_id:e,patient_id:s,procedure_id:c}){const[l,p]=await Promise.all([a?h(`/appointments/${a}`):null,h("/patients")]),o=l||{},u=o.inicio?.slice(0,10)||n||P.data||A.hoje,$=o.inicio?I(o.inicio):t||"",r=o.dentist_id||e||A.dentists[0]?.id,w=o.procedure_id||c||"",_=p.find(y=>y.id===(o.patient_id||s)),v=o.inicio?F(I(o.fim))-F(I(o.inicio)):"",L=y=>`${y.nome} \xB7 ${J(y.telefone)} #${y.id}`,D=`
    <datalist id="dl-pac">${p.map(y=>`<option value="${d(L(y))}"></option>`).join("")}</datalist>
    <div class="form-grid">
      <label class="field full">Paciente
        <input name="paciente" list="dl-pac" placeholder="Busque pelo nome ou digite o nome de um paciente novo" value="${_?d(L(_)):""}" autocomplete="off">
      </label>
      <label class="field full hidden" id="f-novo-tel">Telefone do novo paciente
        <input name="novo_telefone" placeholder="(51) 99999-0000">
      </label>
      <label class="field">Dentista
        <select name="dentist_id">${A.dentists.map(y=>`<option value="${y.id}" ${y.id===r?"selected":""}>${d(y.nome)}</option>`).join("")}</select>
      </label>
      <label class="field">Procedimento
        <select name="procedure_id"><option value="">\u2014</option>${A.procedures.map(y=>`<option value="${y.id}" ${y.id===w?"selected":""}>${d(y.nome)}</option>`).join("")}</select>
      </label>
      <label class="field">Data<input type="date" name="data" value="${u}"></label>
      <label class="field">Hor\xE1rio<input type="time" name="hora" value="${$}" step="900"></label>
      <div class="full">
        <div class="muted small" style="margin-bottom:6px;font-weight:600">Hor\xE1rios livres no expediente</div>
        <div class="row wrap" id="livres"><span class="muted small">\u2014</span></div>
      </div>
      <label class="field">Dura\xE7\xE3o (min)<input type="number" name="duracao_min" min="10" step="5" value="${v}"></label>
      <label class="field">Valor (R$)<input type="number" name="valor" min="0" step="0.01" value="${o.valor??""}"></label>
      ${a?`<label class="field">Status<select name="status">${Object.entries(ta).map(([y,g])=>`<option value="${y}" ${y===o.status?"selected":""}>${g}</option>`).join("")}</select></label>
      <div class="field">Origem<div style="padding-top:8px">${o.origem==="ia"?'<span class="badge ia">Agendada pela IA</span>':'<span class="badge">Recep\xE7\xE3o</span>'}</div></div>`:""}
      <label class="field full">Observa\xE7\xF5es<textarea name="observacoes" rows="2">${d(o.observacoes||"")}</textarea></label>
    </div>`,S=`
    ${a?`<button class="btn sm" data-st="confirmada">\u2713 Confirmar</button>
      <button class="btn sm" data-st="em_atendimento">Iniciar</button>
      <button class="btn sm" data-st="concluida">Concluir</button>
      <button class="btn sm" data-st="faltou">Faltou</button>
      <button class="btn sm danger" data-st="cancelada">Cancelar consulta</button>
      <a class="btn sm ghost" href="#/pacientes/${o.patient_id}" data-close>Ficha</a>`:""}
    <span class="spacer"></span>
    <button class="btn" data-close>Fechar</button>
    <button class="btn primary" id="salvar">${a?"Salvar":"Agendar"}</button>`;q({title:a?`Consulta de ${d(o.paciente_nome)}`:"Nova consulta",body:D,foot:S,width:680,onMount:({el:y,close:g})=>{const f=M=>i(`[name="${M}"]`,y),k=()=>(f("paciente").value.match(/#(\d+)$/)||[])[1],b=()=>i("#f-novo-tel",y).classList.toggle("hidden",!f("paciente").value.trim()||!!k());f("paciente").addEventListener("input",b);const m=()=>{const M=A.procedures.find(C=>C.id===Number(f("procedure_id").value));M&&(f("duracao_min").value=M.duracao_min,f("valor").value=M.preco),j()},j=async()=>{const M=Number(f("duracao_min").value)||30,C=await h(`/dentists/${f("dentist_id").value}/livres?data=${f("data").value}&duracao=${M}`).catch(()=>[]),V=i("#livres",y);V.innerHTML=C.length?C.map(U=>`<button type="button" class="btn sm ${U===f("hora").value?"primary":""}" data-h="${U}">${U}</button>`).join(""):'<span class="muted small">Sem hor\xE1rios livres no expediente deste dia (encaixes ainda s\xE3o poss\xEDveis).</span>',E("[data-h]",V).forEach(U=>U.onclick=()=>{f("hora").value=U.dataset.h,j()})};f("procedure_id").addEventListener("change",m),["dentist_id","data","duracao_min"].forEach(M=>f(M).addEventListener("change",j)),!a&&c?m():j();const N=async(M={})=>{const C=R(y),V={dentist_id:C.dentist_id,procedure_id:C.procedure_id,data:C.data,hora:C.hora,duracao_min:C.duracao_min,valor:C.valor,observacoes:C.observacoes,...a?{status:C.status}:{},...M},U=k();U?V.patient_id=U:a||(V.novo_paciente_nome=C.paciente,V.novo_paciente_telefone=C.novo_telefone);try{a?await h(`/appointments/${a}`,{method:"PUT",body:V}):await h("/appointments",{method:"POST",body:V}),x(a?"Consulta atualizada.":"Consulta agendada."),g()}catch(qa){x(qa.message,"err")}};i("#salvar",y).onclick=()=>N(),E("[data-st]",y).forEach(M=>M.onclick=()=>{M.dataset.st==="cancelada"&&!confirm("Cancelar esta consulta?")||N({status:M.dataset.st})})}})}async function Qa(a){const n=i("#view");n.innerHTML=`
    <div class="page-head"><div><h1>Conversas</h1><p class="muted">A IA responde em tempo real. Assuma qualquer conversa quando quiser.</p></div>
      <span class="spacer"></span><a class="btn" href="chat.html" target="_blank">Simular paciente \u2197</a></div>
    <div class="card chat-layout">
      <div class="conv-list" id="conv-list"></div>
      <div class="thread" id="thread"><div class="empty" style="margin:auto">Selecione uma conversa.</div></div>
    </div>`;let t=await h("/conversations");const e={id:a?Number(a):null,conv:null},s=new Set,c=()=>{i("#conv-list").innerHTML=t.length?t.map(r=>`
      <a class="conv-item ${r.id===e.id?"active":""}" href="#/conversas/${r.id}">
        <div class="top">
          <span class="name">${d(aa(r))}</span>
          ${r.nao_lidas&&r.id!==e.id?`<span class="badge count">${r.nao_lidas}</span>`:""}
          <span class="muted small">${ha(r.atualizado_em)}</span>
        </div>
        <div class="preview">${s.has(r.id)?'<i style="color:var(--primary)">IA digitando\u2026</i>':d(r.ultima_mensagem||"")}</div>
        <div class="row" style="margin-top:6px;gap:4px">
          <span class="badge ${r.modo}">${r.modo==="ia"?"\u{1F916} IA":"\u{1F464} Equipe"}</span>
          ${r.precisa_atencao?'<span class="badge alerta">Aten\xE7\xE3o</span>':""}
          <span class="badge">${r.canal==="whatsapp"?"WhatsApp":"Simulador"}</span>
        </div>
      </a>`).join(""):'<div class="empty">Nenhuma conversa ainda. Abra o simulador e mande uma mensagem como paciente.</div>'},l=r=>{const w={paciente:"",ia:"\u{1F916} IA",atendente:"\u{1F464} Equipe",lembrete:"\u23F0 Clara \xB7 confirma\xE7\xE3o",retorno:"\u{1F501} L\xE9o \xB7 convite de retorno",cobranca:"\u{1F4B3} Duda \xB7 lembrete de pagamento",orcamento:"\u{1F4CB} Or\xE7amento",sistema:""}[r.autor]??"",_=r.extras,v=_?.modelo?`<div class="tpl-tag">Modelo do WhatsApp \xB7 ${d(_.modelo)}</div>`:"",L=_?.rodape?`<div class="tpl-rodape">${d(_.rodape)}</div>`:"",D=_?.botoes?.length?`<div class="tpl-botoes">${_.botoes.map(S=>`<span>${S.tipo==="link"?"\u2197":"\u21A9"} ${d(S.texto)}</span>`).join("")}</div>`:"";return`<div class="bubble b-${r.autor}" data-msg="${r.id}">${w?`<div class="who">${w}</div>`:""}${v}${Ra(d(r.texto))}${L}${D}<div class="when">${$a(r.criado_em)}</div></div>`},p=()=>{const r=i("#thread-body");r&&(r.scrollTop=r.scrollHeight)},o=()=>{const r=e.conv;i("#thread-head").innerHTML=`
      <div style="min-width:0"><h2>${d(aa(r))}</h2><div class="muted small">${aa(r)!==J(r.telefone)?`${J(r.telefone)} \xB7 `:""}${r.canal==="whatsapp"?"WhatsApp":"Simulador"}</div></div>
      <span class="badge ${r.modo}">${r.modo==="ia"?"\u{1F916} IA respondendo":"\u{1F464} Equipe no controle"}</span>
      <span class="spacer"></span>
      ${r.patient_id?`<a class="btn sm" href="#/pacientes/${r.patient_id}">Ficha do paciente</a>`:""}
      ${r.modo==="ia"?'<button class="btn sm" id="assumir">Assumir conversa</button>':'<button class="btn sm primary" id="devolver">Devolver para a IA</button>'}`,i("#alerta").innerHTML=r.precisa_atencao?`<div class="alert-bar">\u26A0\uFE0F ${d(r.motivo_atencao||"Precisa de aten\xE7\xE3o")}<span class="spacer"></span><button class="btn sm" id="resolver">Assumir e resolver</button></div>`:"";const w=r.canal==="whatsapp"&&!(r.ultima_do_paciente&&Date.now()-Date.parse(r.ultima_do_paciente)<23.5*36e5);i("#composer-hint").textContent=w?"\u26A0\uFE0F Janela de 24h do WhatsApp fechada: o paciente s\xF3 recebe mensagens da cl\xEDnica por modelo aprovado. O que voc\xEA digitar aqui s\xF3 chega depois que ele responder (os agentes da Equipe de IA usam os modelos).":r.modo==="ia"?"A IA est\xE1 respondendo esta conversa. Se voc\xEA enviar uma mensagem, a equipe assume e a IA para de responder.":"Voc\xEA est\xE1 no controle. A IA n\xE3o responde at\xE9 voc\xEA devolver a conversa.";const _=v=>h(`/conversations/${r.id}/modo`,{method:"POST",body:{modo:v}}).catch(L=>x(L.message,"err"));i("#assumir")?.addEventListener("click",()=>_("humano")),i("#resolver")?.addEventListener("click",()=>_("humano")),i("#devolver")?.addEventListener("click",()=>_("ia"))},u=async r=>{e.id=r,e.conv=await h(`/conversations/${r}`),i("#thread").innerHTML=`
      <div class="thread-head" id="thread-head"></div>
      <div id="alerta"></div>
      <div class="thread-body" id="thread-body">${e.conv.mensagens.map(l).join("")}<div class="typing hidden" id="typing">IA digitando\u2026</div></div>
      <div class="composer"><textarea id="msg" rows="1" placeholder="Escreva uma mensagem para o paciente\u2026"></textarea><button class="btn primary" id="enviar">Enviar</button></div>
      <div class="composer-hint" id="composer-hint"></div>`,o(),i("#typing").classList.toggle("hidden",!s.has(r)),p();const w=async()=>{const _=i("#msg").value.trim();_&&(i("#msg").value="",await h(`/conversations/${r}/mensagens`,{method:"POST",body:{texto:_}}).catch(v=>x(v.message,"err")))};i("#enviar").onclick=w,i("#msg").addEventListener("keydown",_=>{_.key==="Enter"&&!_.shiftKey&&(_.preventDefault(),w())}),e.conv.nao_lidas&&h(`/conversations/${r}/lida`,{method:"POST"}),c()};c(),e.id&&await u(e.id);const $=()=>e.id?i("#thread-body"):null;O={conversa:r=>{const w=t.findIndex(_=>_.id===r.id);w>=0?t[w]=r:t.unshift(r),t.sort((_,v)=>v.atualizado_em.localeCompare(_.atualizado_em)),c(),r.id===e.id&&(Object.assign(e.conv,r),o())},mensagem:({message:r,draft_id:w,conversa:_})=>{if(O.conversa(_),r.conversation_id!==e.id)return;const v=$();w&&i(`[data-draft="${w}"]`,v)?.remove(),i(`[data-msg="${r.id}"]`,v)||i("#typing",v).insertAdjacentHTML("beforebegin",l(r)),r.autor==="paciente"&&h(`/conversations/${e.id}/lida`,{method:"POST"}),p()},ia_delta:({conversation_id:r,draft_id:w,delta:_})=>{if(r!==e.id)return;const v=$();let L=i(`[data-draft="${w}"]`,v);L||(i("#typing",v).insertAdjacentHTML("beforebegin",`<div class="bubble b-ia b-draft" data-draft="${w}"><div class="who">\u{1F916} IA</div><span class="txt"></span></div>`),L=i(`[data-draft="${w}"]`,v)),i(".txt",L).textContent+=_,p()},ia_rascunho_descartado:({conversation_id:r,draft_id:w})=>{r===e.id&&i(`[data-draft="${w}"]`,$())?.remove()},ia_digitando:({conversation_id:r,ativo:w})=>{w?s.add(r):s.delete(r),c(),r===e.id&&(i("#typing")?.classList.toggle("hidden",!w),p())}}}const ua={higido:{nome:"H\xEDgido",cor:"#cbd5e1",fundo:"#fff",ico:""},carie:{nome:"C\xE1rie",cor:"#dc2626",fundo:"#fee2e2",ico:"\u25CF"},restaurado:{nome:"Restaurado",cor:"#2563eb",fundo:"#dbeafe",ico:"\u25A0"},canal:{nome:"Canal",cor:"#7c3aed",fundo:"#ede9fe",ico:"\u2502"},coroa:{nome:"Coroa/pr\xF3tese",cor:"#d97706",fundo:"#fef3c7",ico:"\u265B"},implante:{nome:"Implante",cor:"#475569",fundo:"#e2e8f0",ico:"\u22A5"},extracao:{nome:"Extra\xE7\xE3o indicada",cor:"#dc2626",fundo:"#fff",ico:"\u2715"},ausente:{nome:"Ausente",cor:"#e2e8f0",fundo:"#f8fafc",ico:"\u2014"}},Ka=[[[18,17,16,15,14,13,12,11],[21,22,23,24,25,26,27,28]],[[48,47,46,45,44,43,42,41],[31,32,33,34,35,36,37,38]]],ka=[["hipertensao","Hipertens\xE3o"],["diabetes","Diabetes"],["cardiopatia","Problema card\xEDaco"],["anticoagulante","Usa anticoagulante"],["coagulacao","Problema de coagula\xE7\xE3o"],["gestante","Gestante"],["fumante","Fumante"],["bruxismo","Bruxismo"]];async function Xa(a){if(a)return Ya(Number(a));const n=i("#view");n.innerHTML=`
    <div class="page-head"><h1>Pacientes</h1><span class="spacer"></span>
      <input id="busca" placeholder="Buscar por nome, telefone ou CPF" style="width:300px">
      <button class="btn primary" id="novo">+ Novo paciente</button></div>
    <div class="card table-wrap" id="lista"></div>`;const t=async()=>{const e=await h(`/patients?q=${encodeURIComponent(i("#busca").value)}`);i("#lista").innerHTML=e.length?`<table class="table"><thead><tr><th>Nome</th><th>Telefone</th><th>Conv\xEAnio</th><th>Idade</th><th>\xDAltima consulta</th><th>Pr\xF3xima consulta</th></tr></thead><tbody>
      ${e.map(s=>`<tr class="click" data-id="${s.id}"><td><b>${d(s.nome)}</b></td><td>${J(s.telefone)}</td><td>${d(s.convenio||"Particular")}</td><td>${fa(s.data_nascimento)??"\u2014"}</td>
        <td>${s.ultima_consulta?X(s.ultima_consulta):"\u2014"}</td><td>${s.proxima_consulta?`${na(s.proxima_consulta)} ${I(s.proxima_consulta)}`:"\u2014"}</td></tr>`).join("")}
      </tbody></table>`:'<div class="empty">Nenhum paciente encontrado.</div>',E("[data-id]",n).forEach(s=>s.onclick=()=>location.hash=`#/pacientes/${s.dataset.id}`)};i("#busca").addEventListener("input",z(t,250)),i("#novo").onclick=()=>Ea({},e=>location.hash=`#/pacientes/${e.id}`),await t(),O={pacientes:t,agenda:z(t,500)}}function Ea(a,n){q({title:a.id?"Editar dados":"Novo paciente",body:`<div class="form-grid">
      <label class="field full">Nome completo<input name="nome" value="${d(a.nome||"")}"></label>
      <label class="field">Telefone (WhatsApp)<input name="telefone" value="${d(J(a.telefone))}" placeholder="(51) 99999-0000"></label>
      <label class="field">E-mail<input name="email" type="email" value="${d(a.email||"")}"></label>
      <label class="field">CPF<input name="cpf" value="${d(a.cpf||"")}"></label>
      <label class="field">Data de nascimento<input name="data_nascimento" type="date" value="${d(a.data_nascimento||"")}"></label>
      <label class="field">Conv\xEAnio<input name="convenio" value="${d(a.convenio||"")}" placeholder="Particular"></label>
      <label class="field full">Observa\xE7\xF5es<textarea name="observacoes" rows="2">${d(a.observacoes||"")}</textarea></label>
      <label class="check full"><input type="checkbox" name="consentimento_lgpd" ${a.consentimento_lgpd?"checked":""}> Paciente autorizou o uso dos dados para atendimento e contato (LGPD)</label>
    </div>`,foot:'<span class="spacer"></span><button class="btn" data-close>Cancelar</button><button class="btn primary" id="salvar">Salvar</button>',onMount:({el:t,close:e})=>{i("#salvar",t).onclick=async()=>{try{const s=await h(a.id?`/patients/${a.id}`:"/patients",{method:a.id?"PUT":"POST",body:R(t)});x("Paciente salvo."),e(),n?.(s)}catch(s){x(s.message,"err")}}}})}async function Ya(a,n="odontograma"){const t=i("#view");let e=await h(`/patients/${a}`),s=n,c="abrir",l=null;const p=()=>{const g=fa(e.data_nascimento),f=[...ka.filter(([k])=>e.anamnese[k]).map(([,k])=>k),e.anamnese.alergia&&`Alergia: ${e.anamnese.alergia}`].filter(Boolean);t.innerHTML=`
      <div class="page-head">
        <a href="#/pacientes" class="btn sm ghost">\u2190 Pacientes</a>
      </div>
      <div class="card card-pad" style="margin-bottom:16px">
        <div class="row wrap" style="gap:14px">
          <div style="width:52px;height:52px;border-radius:50%;background:var(--primary-50);color:var(--primary);display:grid;place-items:center;font-weight:800;font-size:20px">${d(e.nome[0])}</div>
          <div style="min-width:0">
            <h1>${d(e.nome)}</h1>
            <div class="muted">${J(e.telefone)||"sem telefone"}${g!=null?` \xB7 ${g} anos`:""} \xB7 ${d(e.convenio||"Particular")}${e.consentimento_lgpd?' \xB7 <span style="color:var(--ok)">LGPD \u2713</span>':' \xB7 <span style="color:var(--warn)">sem consentimento LGPD</span>'}</div>
            ${f.length?`<div class="row wrap" style="margin-top:6px;gap:4px">${f.map(k=>`<span class="badge alerta">\u26A0 ${d(k)}</span>`).join("")}</div>`:""}
          </div>
          <span class="spacer"></span>
          ${e.conversas[0]?`<a class="btn" href="#/conversas/${e.conversas[0].id}">Conversa</a>`:""}
          <button class="btn" id="editar">Editar dados</button>
          <button class="btn primary" id="nova-consulta">+ Agendar</button>
        </div>
      </div>
      <div class="card">
        <div class="tabs">${[["odontograma","Odontograma"],["imagens",`Imagens (${e.imagens.length})`],["anamnese","Anamnese"],["orcamentos",`Or\xE7amentos (${e.orcamentos.length})`],["consultas",`Consultas (${e.consultas.length})`],["financeiro","Financeiro"]].map(([k,b])=>`<button data-aba="${k}" class="${s===k?"on":""}">${b}</button>`).join("")}</div>
        <div class="card-pad" id="aba"></div>
      </div>`,i("#editar").onclick=()=>Ea(e,async()=>{e=await h(`/patients/${a}`),p()}),i("#nova-consulta").onclick=()=>G({patient_id:e.id}),E("[data-aba]",t).forEach(k=>k.onclick=()=>{s=k.dataset.aba,p()}),{odontograma:u,imagens:L,anamnese:w,orcamentos:D,consultas:_,financeiro:S}[s]()},o=g=>e.imagens.filter(f=>String(f.dente||"").split(/[\s,;/]+/).includes(String(g))),u=()=>{const g=i("#aba"),f=e.odontograma_notas||{},k=(b,m)=>{const j=ua[e.odontograma[b]||"higido"],N=!!f[b],M=o(b).length,C=[`${b} \u2014 ${j.nome}`,N?`Obs.: ${f[b]}`:"",M?`${M} imagem(ns)`:""].filter(Boolean).join(`
`);return`<button class="dente ${m?"inferior":""} ${String(b)===l?"aberto":""}" data-dente="${b}" title="${d(C)}" style="border-color:${j.cor};background:${j.fundo};${e.odontograma[b]==="ausente"?"border-style:dashed;opacity:.6":""}">
        <span class="ico" style="color:${j.cor}">${j.ico}</span>${b}
        ${N||M?`<span class="dente-marcas">${N?'<i class="m-nota" aria-label="tem observa\xE7\xE3o"></i>':""}${M?'<i class="m-img" aria-label="tem imagem"></i>':""}</span>`:""}</button>`};g.innerHTML=`
      <div class="legenda" style="margin-bottom:14px">
        <button data-pincel="abrir" class="${c==="abrir"?"on":""}">\u{1F50D} Abrir dente</button>
        ${Object.entries(ua).map(([b,m])=>`<button data-pincel="${b}" class="${b===c?"on":""}"><span class="sw" style="border-color:${m.cor};background:${m.fundo}"></span>${m.nome}</button>`).join("")}</div>
      <p class="muted small" style="text-align:center;margin:0 0 10px">${c==="abrir"?"Clique num dente para ver e editar a situa\xE7\xE3o, a observa\xE7\xE3o e as imagens dele.":'Clique nos dentes para marcar. Salva automaticamente. Para observa\xE7\xF5es e imagens, use "Abrir dente".'}
        <span class="legenda-marcas"><i class="m-nota"></i> observa\xE7\xE3o \xB7 <i class="m-img"></i> imagem</span></p>
      <div class="odonto">
        ${Ka.map(([b,m],j)=>`<div class="arcada"><div class="quadrante">${b.map(N=>k(N,j===1)).join("")}</div><div class="quadrante">${m.map(N=>k(N,j===1)).join("")}</div></div>`).join('<div style="height:1px;width:100%;background:var(--border)"></div>')}
      </div>
      <div id="painel-dente"></div>`,E("[data-pincel]",g).forEach(b=>b.onclick=()=>{c=b.dataset.pincel,u()}),E("[data-dente]",g).forEach(b=>b.onclick=async()=>{const m=b.dataset.dente;if(c==="abrir")return l=l===m?null:m,u();e.odontograma[m]===c||c==="higido"?delete e.odontograma[m]:e.odontograma[m]=c,u(),await h(`/patients/${e.id}`,{method:"PUT",body:{odontograma:e.odontograma}}).catch(j=>x(j.message,"err"))}),l?r(l):$()},$=()=>{const g=i("#painel-dente"),f=e.odontograma_notas||{},k=Object.entries(f).filter(([b,m])=>b!=="geral"&&m).sort(([b],[m])=>Number(b)-Number(m));g.innerHTML=`
      <div class="painel-dente">
        <h3>Observa\xE7\xF5es gerais</h3>
        <textarea id="nota-geral" rows="3" style="width:100%;margin-top:8px" placeholder="Ex.: Gengiva inflamada na regi\xE3o inferior; bruxismo, indicar placa">${d(f.geral||"")}</textarea>
        <div class="row" style="margin-top:8px"><span class="spacer"></span><button class="btn primary sm" id="salvar-geral">Salvar observa\xE7\xF5es</button></div>
        <div style="margin-top:14px"><b class="small">Observa\xE7\xF5es por dente (${k.length})</b>
          ${k.length?`<ul class="lista-notas">${k.map(([b,m])=>`<li><button class="link-dente" data-abrir-dente="${d(b)}">Dente ${d(b)}</button> ${d(m)}</li>`).join("")}</ul>`:'<p class="muted small" style="margin:4px 0 0">Nenhuma ainda. Clique num dente para anotar algo sobre ele.</p>'}
        </div>
      </div>`,i("#salvar-geral",g).onclick=async()=>{const b=i("#nota-geral",g).value.trim(),m={...e.odontograma_notas||{}};b?m.geral=b:delete m.geral;try{await h(`/patients/${e.id}`,{method:"PUT",body:{odontograma_notas:m}}),e.odontograma_notas=m,x("Observa\xE7\xF5es salvas.")}catch(j){x(j.message,"err")}},E("[data-abrir-dente]",g).forEach(b=>b.onclick=()=>{c="abrir",l=b.dataset.abrirDente,u()})},r=g=>{const f=i("#painel-dente"),k=e.odontograma_notas||{},b=o(g);f.innerHTML=`
      <div class="painel-dente">
        <div class="row wrap"><h3>Dente ${d(g)}</h3><span class="spacer"></span><button class="btn sm ghost" id="fechar-dente" aria-label="Fechar">\u2715</button></div>
        <div class="form-grid" style="margin-top:10px">
          <label class="field">Situa\xE7\xE3o<select id="dente-status">${Object.entries(ua).map(([m,j])=>`<option value="${m}" ${(e.odontograma[g]||"higido")===m?"selected":""}>${j.nome}</option>`).join("")}</select></label>
          <div></div>
          <label class="field full">Observa\xE7\xE3o<textarea id="dente-nota" rows="3" placeholder="Ex.: Restaura\xE7\xE3o antiga com infiltra\xE7\xE3o na face distal; acompanhar">${d(k[g]||"")}</textarea></label>
        </div>
        <div class="row" style="margin-top:8px"><span class="muted small" id="dente-salvo"></span><span class="spacer"></span><button class="btn primary sm" id="salvar-dente">Salvar dente</button></div>
        <div class="row wrap" style="margin:16px 0 8px"><b class="small">Imagens deste dente (${b.length})</b><span class="spacer"></span>
          <label class="btn sm" style="cursor:pointer">+ Adicionar imagem<input type="file" id="dente-arquivos" accept="image/*" multiple hidden></label></div>
        ${b.length?`<div class="galeria">${b.map(m=>`
          <button class="img-card" data-img-dente="${m.id}">
            <img src="/api/imagens/${m.id}/miniatura" alt="${d(H[m.tipo]||m.tipo)}" loading="lazy">
            <span class="img-info"><b>${d(H[m.tipo]||m.tipo)}</b><br><span class="muted">${X(m.data)}${m.descricao?` \xB7 ${d(m.descricao)}`:""}</span></span>
          </button>`).join("")}</div>`:'<p class="muted small" style="margin:0">Nenhuma imagem ligada a este dente.</p>'}
      </div>`,i("#fechar-dente",f).onclick=()=>{l=null,u()},i("#salvar-dente",f).onclick=async()=>{const m=i("#dente-status",f).value,j=i("#dente-nota",f).value.trim();m==="higido"?delete e.odontograma[g]:e.odontograma[g]=m;const N={...e.odontograma_notas||{}};j?N[g]=j:delete N[g];try{await h(`/patients/${e.id}`,{method:"PUT",body:{odontograma:e.odontograma,odontograma_notas:N}}),e.odontograma_notas=N,x(`Dente ${g} salvo.`),u()}catch(M){x(M.message,"err")}},i("#dente-arquivos",f).addEventListener("change",m=>{va(e,[...m.target.files],{dente:g}),m.target.value=""}),E("[data-img-dente]",f).forEach(m=>m.onclick=()=>Aa(b,b.findIndex(j=>j.id===Number(m.dataset.imgDente))))},w=()=>{const g=i("#aba"),f=e.anamnese;g.innerHTML=`
      <div class="grid grid-2">
        <div><h3 style="margin-bottom:10px">Condi\xE7\xF5es de sa\xFAde</h3>
          <div class="grid" style="gap:8px">${ka.map(([k,b])=>`<label class="check"><input type="checkbox" name="${k}" ${f[k]?"checked":""}> ${b}</label>`).join("")}</div>
        </div>
        <div class="grid" style="gap:12px;align-content:start">
          <label class="field">Alergias<input name="alergia" value="${d(f.alergia||"")}" placeholder="Ex.: dipirona, l\xE1tex"></label>
          <label class="field">Medicamentos em uso<input name="medicamentos" value="${d(f.medicamentos||"")}"></label>
          <label class="field">Queixa principal<input name="queixa" value="${d(f.queixa||"")}"></label>
          <label class="field">Outras observa\xE7\xF5es cl\xEDnicas<textarea name="obs" rows="3">${d(f.obs||"")}</textarea></label>
        </div>
      </div>
      <div class="row" style="margin-top:14px"><span class="spacer"></span><button class="btn primary" id="salvar-anamnese">Salvar anamnese</button></div>`,i("#salvar-anamnese").onclick=async()=>{const k=R(g);e.anamnese=Object.fromEntries(Object.entries(k).filter(([,b])=>b!==!1&&b!=="")),await h(`/patients/${e.id}`,{method:"PUT",body:{anamnese:e.anamnese}}).then(()=>{x("Anamnese salva."),p()}).catch(b=>x(b.message,"err"))}},_=()=>{i("#aba").innerHTML=e.consultas.length?`<div class="table-wrap"><table class="table"><thead><tr><th>Data</th><th>Procedimento</th><th>Dentista</th><th>Valor</th><th>Status</th></tr></thead><tbody>
      ${e.consultas.map(g=>`<tr class="click" data-appt="${g.id}"><td>${na(g.inicio)} ${g.inicio.slice(0,4)} \xB7 ${I(g.inicio)}</td><td>${d(g.procedimento_nome||"\u2014")} ${g.origem==="ia"?'<span class="badge ia">IA</span>':""}</td>
        <td><span class="dot" style="background:${g.dentista_cor}"></span>${d(g.dentista_nome)}</td><td>${g.valor?T(g.valor):"\u2014"}</td><td><span class="st st-${g.status}">${ta[g.status]}</span></td></tr>`).join("")}
      </tbody></table></div>`:'<div class="empty">Nenhuma consulta.</div>',E("[data-appt]",i("#aba")).forEach(g=>g.onclick=()=>G({id:Number(g.dataset.appt)}))};let v="";const L=()=>{const g=i("#aba"),f=v?e.imagens.filter(m=>m.tipo===v):e.imagens,k=m=>e.imagens.filter(j=>j.tipo===m).length;g.innerHTML=`
      <div class="row wrap" style="margin-bottom:12px;gap:6px">
        <div class="seg">${[["",`Todas (${e.imagens.length})`],...Object.entries(H).filter(([m])=>k(m)).map(([m,j])=>[m,`${j} (${k(m)})`])].map(([m,j])=>`<button data-filtro="${m}" class="${v===m?"on":""}">${d(j)}</button>`).join("")}</div>
        <span class="spacer"></span>
        <label class="btn primary sm" style="cursor:pointer">+ Adicionar imagens<input type="file" id="img-arquivos" accept="image/*" multiple hidden></label>
      </div>
      <div class="soltar" id="img-soltar">
        ${f.length?`<div class="galeria">${f.map(m=>`
          <button class="img-card" data-img="${m.id}" title="${d(m.descricao||H[m.tipo])}">
            <img src="/api/imagens/${m.id}/miniatura" alt="${d(`${H[m.tipo]}${m.dente?`, dente ${m.dente}`:""}`)}" loading="lazy">
            <span class="img-info"><b>${d(H[m.tipo]||m.tipo)}</b>${m.dente?` \xB7 dente ${d(m.dente)}`:""}<br><span class="muted">${X(m.data)}${m.descricao?` \xB7 ${d(m.descricao)}`:""}</span></span>
          </button>`).join("")}</div>`:`<div class="empty">${e.imagens.length?"Nenhuma imagem deste tipo.":'Nenhuma imagem ainda. Arraste fotos ou raio-X para c\xE1, ou use "Adicionar imagens".'}</div>`}
      </div>`,E("[data-filtro]",g).forEach(m=>m.onclick=()=>{v=m.dataset.filtro,L()}),E("[data-img]",g).forEach(m=>m.onclick=()=>Aa(f,f.findIndex(j=>j.id===Number(m.dataset.img)))),i("#img-arquivos",g).addEventListener("change",m=>{va(e,[...m.target.files]),m.target.value=""});const b=i("#img-soltar",g);b.addEventListener("dragover",m=>{m.preventDefault(),b.classList.add("arrastando")}),b.addEventListener("dragleave",()=>b.classList.remove("arrastando")),b.addEventListener("drop",m=>{m.preventDefault(),b.classList.remove("arrastando");const j=[...m.dataTransfer.files].filter(N=>N.type.startsWith("image/"));j.length?va(e,j):x("Solte arquivos de imagem (JPG, PNG\u2026).","err")})},D=()=>{const g=i("#aba");g.innerHTML=`
      <div class="row wrap" style="margin-bottom:12px"><span class="muted">Monte o plano em etapas, envie pelo WhatsApp e o paciente aprova pelo celular. As parcelas entram sozinhas no Financeiro.</span>
        <span class="spacer"></span><button class="btn primary sm" id="novo-orc">+ Novo or\xE7amento</button></div>
      ${e.orcamentos.length?e.orcamentos.map(oe).join(""):'<div class="empty">Nenhum or\xE7amento ainda.</div>'}`,i("#novo-orc").onclick=()=>ja({patient_id:e.id}),E("[data-agendar-proc]",g).forEach(f=>f.onclick=()=>G({patient_id:e.id,procedure_id:Number(f.dataset.agendarProc)})),E("[data-orc]",g).forEach(f=>f.onclick=async()=>{const k=e.orcamentos.find(m=>m.id===Number(f.dataset.id)),b=f.dataset.orc;try{if(b==="editar")return ja({patient_id:e.id,orcamento:k});if(b==="copiar")return await navigator.clipboard.writeText(new URL(`orcamento.html?t=${k.token}`,document.baseURI).href),x("Link copiado.");if(b==="enviar")return f.disabled=!0,await h(`/orcamentos/${k.id}/enviar`,{method:"POST"}),x(`Or\xE7amento enviado para ${e.nome.split(" ")[0]} pelo ${A.status.whatsapp?"WhatsApp":"simulador"}.`,"ia");(b==="aprovado"||b==="recusado")&&confirm(b==="aprovado"?"Marcar como aprovado? As parcelas ser\xE3o lan\xE7adas no Financeiro.":"Marcar como recusado?")&&(await h(`/orcamentos/${k.id}/status`,{method:"POST",body:{status:b}}),x(b==="aprovado"?"Or\xE7amento aprovado e parcelas lan\xE7adas.":"Or\xE7amento marcado como recusado."))}catch(m){x(m.message,"err"),f.disabled=!1}})},S=()=>{const g=e.pagamentos.filter(f=>f.status==="pendente").reduce((f,k)=>f+k.valor,0);i("#aba").innerHTML=`<div class="row" style="margin-bottom:12px"><span>Em aberto: <b style="color:${g?"var(--warn)":"inherit"}">${T(g)}</b></span><span class="spacer"></span><button class="btn sm" id="novo-lanc">+ Lan\xE7amento</button></div>
      ${La(e.pagamentos,!1)}`,Pa(i("#aba"),e.pagamentos),i("#novo-lanc").onclick=()=>Ta({patient_id:e.id,nome:e.nome})};p();const y=z(async()=>{e=await h(`/patients/${a}`),p()},300);O={agenda:y,financeiro:y,orcamentos:y,imagens:y}}const H={"raio-x":"Raio-X","foto-intraoral":"Foto intraoral","foto-extraoral":"Foto do sorriso/rosto",documento:"Documento/exame",outro:"Outro"},Za=a=>new Promise((n,t)=>{const e=new FileReader;e.onload=()=>n(String(e.result).split(",")[1]),e.onerror=()=>t(e.error),e.readAsDataURL(a)});async function ae(a){let n;try{n=await createImageBitmap(a,{imageOrientation:"from-image"})}catch{throw new Error(`N\xE3o consegui abrir "${a.name}". Use JPG ou PNG (fotos HEIC do iPhone: exporte como JPG).`)}const t=async(c,l)=>{const p=Math.min(1,c/Math.max(n.width,n.height)),o=document.createElement("canvas");o.width=Math.round(n.width*p),o.height=Math.round(n.height*p);const u=o.getContext("2d");u.fillStyle="#fff",u.fillRect(0,0,o.width,o.height),u.drawImage(n,0,0,o.width,o.height);const $=await new Promise(r=>o.toBlob(r,"image/jpeg",l));return{base64:await Za($),largura:o.width,altura:o.height}},e=await t(1800,.86),s=await t(360,.72);return n.close?.(),{mime:"image/jpeg",base64:e.base64,largura:e.largura,altura:e.altura,miniatura_base64:s.base64}}function va(a,n,{dente:t=""}={}){if(!n.length)return;const e=n.map(s=>URL.createObjectURL(s));q({title:`Adicionar ${n.length===1?"imagem":`${n.length} imagens`} \xB7 ${d(a.nome)}`,width:640,body:`
      <div class="galeria" style="margin-bottom:14px">${e.map(s=>`<div class="img-card estatica"><img src="${s}" alt="Pr\xE9via"></div>`).join("")}</div>
      <div class="form-grid">
        <label class="field">Tipo<select name="tipo">${Object.entries(H).map(([s,c])=>`<option value="${s}" ${t&&s==="raio-x"?"selected":""}>${c}</option>`).join("")}</select></label>
        <label class="field">Data do exame ou da foto<input type="date" name="data" value="${A.hoje}"></label>
        <label class="field">Dente (opcional)<input name="dente" placeholder="Ex.: 36" value="${d(t)}"></label>
        <label class="field">Descri\xE7\xE3o (opcional)<input name="descricao" placeholder="Ex.: Periapical antes do canal"></label>
      </div>
      <p class="muted small" style="margin:12px 0 0">As imagens s\xE3o reduzidas neste aparelho antes de salvar (sem perder a nitidez necess\xE1ria) e ficam na ficha do paciente.</p>`,foot:'<span class="spacer"></span><button class="btn" data-close>Cancelar</button><button class="btn primary" id="enviar-imgs">Salvar</button>',onMount:({el:s,close:c})=>{const l=i("#enviar-imgs",s),p=()=>{e.forEach(o=>URL.revokeObjectURL(o)),c()};E("[data-close]",s).forEach(o=>o.addEventListener("click",()=>e.forEach(u=>URL.revokeObjectURL(u)))),l.onclick=async()=>{const o=R(s);l.disabled=!0;let u=0;for(const[$,r]of n.entries()){l.textContent=`Salvando ${$+1} de ${n.length}\u2026`;try{const w=await ae(r);await h(`/patients/${a.id}/imagens`,{method:"POST",body:{...o,...w}}),u++}catch(w){x(w.message,"err")}}u&&x(u===1?"Imagem adicionada \xE0 ficha.":`${u} imagens adicionadas \xE0 ficha.`),p()}}})}function Aa(a,n){let t=n;return q({title:"Imagem",width:980,body:'<div id="visor"></div>',onMount:({el:s,close:c})=>{const l=()=>{const o=a[t];i(".modal-head h2",s).textContent=`${H[o.tipo]||o.tipo}${o.dente?` \xB7 dente ${o.dente}`:""} \xB7 ${X(o.data)}`,i("#visor",s).innerHTML=`
          <div class="visor-img">
            ${a.length>1?'<button class="btn visor-nav" data-nav="-1" aria-label="Imagem anterior">\u2039</button>':""}
            <a href="/api/imagens/${o.id}/arquivo" target="_blank" rel="noopener" title="Abrir em tamanho original">
              <img src="/api/imagens/${o.id}/arquivo" alt="${d(o.descricao||H[o.tipo])}"></a>
            ${a.length>1?'<button class="btn visor-nav direita" data-nav="1" aria-label="Pr\xF3xima imagem">\u203A</button>':""}
          </div>
          <div class="muted small" style="text-align:center;margin:6px 0 12px">${t+1} de ${a.length} \xB7 ${o.largura}\xD7${o.altura} px \xB7 ${Math.round(o.tamanho/1024)} KB \xB7 clique na imagem para abrir em tamanho original</div>
          <div class="form-grid" id="dados-img">
            <label class="field">Tipo<select name="tipo">${Object.entries(H).map(([u,$])=>`<option value="${u}" ${u===o.tipo?"selected":""}>${$}</option>`).join("")}</select></label>
            <label class="field">Data<input type="date" name="data" value="${d(o.data||"")}"></label>
            <label class="field">Dente<input name="dente" value="${d(o.dente||"")}"></label>
            <label class="field">Descri\xE7\xE3o<input name="descricao" value="${d(o.descricao||"")}"></label>
          </div>
          <div class="row" style="margin-top:12px"><button class="btn sm danger" id="excluir-img">Excluir imagem</button><span class="spacer"></span><button class="btn primary" id="salvar-img">Salvar altera\xE7\xF5es</button></div>`,E("[data-nav]",s).forEach(u=>u.onclick=()=>{t=(t+Number(u.dataset.nav)+a.length)%a.length,l()}),i("#salvar-img",s).onclick=async()=>{try{Object.assign(a[t],await h(`/imagens/${o.id}`,{method:"PUT",body:R(i("#dados-img",s))})),x("Dados da imagem salvos."),l()}catch(u){x(u.message,"err")}},i("#excluir-img",s).onclick=async()=>{if(confirm("Excluir esta imagem da ficha? N\xE3o d\xE1 para desfazer."))try{if(await h(`/imagens/${o.id}`,{method:"DELETE"}),x("Imagem exclu\xEDda."),a.splice(t,1),!a.length)return c();t=Math.min(t,a.length-1),l()}catch(u){x(u.message,"err")}}},p=o=>{if(!document.body.contains(s))return document.removeEventListener("keydown",p);o.target.closest("input, select, textarea")||a.length<2||(o.key==="ArrowRight"&&(t=(t+1)%a.length,l()),o.key==="ArrowLeft"&&(t=(t-1+a.length)%a.length,l()))};document.addEventListener("keydown",p),l()}})}function ee(a,n){const t=`${new URL("orcamento.html",document.baseURI).href}?t={{1}}`,e=s=>d(s).replace(/\{\{(\d+)\}\}/g,(c,l)=>`<b>${d(a.exemplo[Number(l)-1]??c)}</b>`);q({title:`Modelo ${d(a.nome)}`,width:720,body:`<div class="form-grid">
      <label class="field">Nome na Meta<input name="nome" value="${d(a.nome)}" spellcheck="false"></label>
      <div class="field">Categoria sugerida<div style="padding-top:8px"><span class="badge ${a.categoria==="Marketing"?"alerta":"ia"}">${d(a.categoria)}</span> <span class="muted small">a Meta confirma na aprova\xE7\xE3o</span></div></div>
      <label class="field full">Texto do modelo<textarea name="texto" rows="4" spellcheck="false">${d(a.texto)}</textarea></label>
      <div class="full">
        <div class="muted small" style="font-weight:600;margin-bottom:6px">Vari\xE1veis, que o sistema preenche nesta ordem</div>
        <div class="row wrap" style="gap:6px">${a.variaveis.map((s,c)=>`<span class="badge">{{${c+1}}} ${d(s)}</span>`).join("")}</div>
      </div>
      <div class="full small">
        <div class="muted" style="font-weight:600;margin-bottom:4px">Configure tamb\xE9m na Meta</div>
        ${a.rodape?`<div>Rodap\xE9: ${d(a.rodape)}</div>`:""}
        <div>Bot\xF5es: ${a.botoes.map(s=>s.tipo==="link"?`"${d(s.texto)}" (link: <code>${d(t)}</code>)`:`"${d(s.texto)}" (resposta r\xE1pida)`).join(" \xB7 ")}</div>
      </div>
      <div class="full">
        <div class="muted small" style="font-weight:600;margin-bottom:6px">Pr\xE9via com dados de exemplo</div>
        <div class="previa-modelo" id="previa"></div>
        <div class="tpl-botoes">${a.botoes.map(s=>`<span>${s.tipo==="link"?"\u2197":"\u21A9"} ${d(s.texto)}</span>`).join("")}</div>
      </div>
    </div>`,foot:`${a.personalizado?'<button class="btn sm ghost" id="restaurar">Restaurar padr\xE3o</button>':""}
      <button class="btn sm ghost" id="copiar">Copiar texto para a Meta</button>
      <span class="spacer"></span><button class="btn" data-close>Cancelar</button><button class="btn primary" id="salvar">Salvar</button>`,onMount:({el:s,close:c})=>{const l=i("[name=texto]",s),p=()=>{i("#previa",s).innerHTML=e(l.value)+(a.rodape?`<div class="tpl-rodape">${d(a.rodape)}</div>`:"")};l.addEventListener("input",p),p(),i("#copiar",s).onclick=async()=>{await navigator.clipboard.writeText(l.value).catch(()=>{}),x('Texto copiado. Cole no campo "Corpo" do modelo no WhatsApp Manager.')},i("#restaurar",s)?.addEventListener("click",async()=>{await h(`/modelos/${a.id}/restaurar`,{method:"POST"}).catch(o=>x(o.message,"err")),x("Modelo restaurado para o padr\xE3o."),c(),n?.()}),i("#salvar",s).onclick=async()=>{try{await h(`/modelos/${a.id}`,{method:"PUT",body:{nome:i("[name=nome]",s).value,texto:l.value}}),x("Modelo salvo."),c(),n?.()}catch(o){x(o.message,"err")}}}})}const te={rascunho:"Rascunho",enviado:"Enviado",aprovado:"Aprovado",recusado:"Recusado"};function se(a){const n=new Map;for(const t of a)n.set(t.etapa,[...n.get(t.etapa)||[],t]);return[...n.entries()].sort((t,e)=>t[0]-e[0])}function oe(a){const n=s=>s?new Date(s).toLocaleDateString("pt-BR"):"",t={rascunho:"Ainda n\xE3o enviado ao paciente.",enviado:`Enviado em ${n(a.enviado_em)}${a.followups?` \xB7 Gabi acompanhou ${a.followups}x`:""}. Aguardando o paciente.`,aprovado:`Aprovado em ${n(a.respondido_em)}${a.aceite?.assinatura?` pelo paciente no celular, assinado como "${d(a.aceite.assinatura)}"`:" (registrado pela equipe)"}. Parcelas lan\xE7adas no Financeiro.`,recusado:`Recusado em ${n(a.respondido_em)}.`}[a.status],e=["rascunho","enviado"].includes(a.status);return`<div class="orc">
    <div class="orc-topo">
      <b>${d(a.titulo)}</b><span class="st st-${a.status}">${te[a.status]}</span>
      ${a.dentista_nome?`<span class="muted small">${d(a.dentista_nome)}</span>`:""}
      <span class="spacer"></span>
      <span class="orc-total">${T(a.total)}</span>${a.parcelas>1?`<span class="muted small">em ${a.parcelas}x de ${T(a.valor_parcela)}</span>`:""}
    </div>
    <div class="timeline">${se(a.itens).map(([s,c])=>`
      <div class="etapa"><div class="etapa-num">${s}</div><ul>${c.map(l=>`
        <li><span>${d(l.descricao)}${l.dente?` <span class="muted">\xB7 dente ${d(l.dente)}</span>`:""}</span>
          <span class="row" style="gap:4px">${T(l.valor)}${a.status==="aprovado"&&l.procedure_id?`<button class="btn sm ghost" data-agendar-proc="${l.procedure_id}" title="Agendar esta etapa">\u{1F4C5}</button>`:""}</span></li>`).join("")}
      </ul></div>`).join("")}
    </div>
    ${a.desconto?`<div class="small muted">Subtotal ${T(a.subtotal)} \xB7 desconto de ${T(a.desconto)}</div>`:""}
    ${a.observacoes?`<div class="small" style="margin-top:4px">\u{1F4DD} ${d(a.observacoes)}</div>`:""}
    <div class="small muted" style="margin-top:6px">${t}</div>
    <div class="row wrap" style="margin-top:10px">
      ${e?`<button class="btn sm" data-orc="editar" data-id="${a.id}">Editar</button>
        <button class="btn sm primary" data-orc="enviar" data-id="${a.id}">${a.status==="rascunho"?"Enviar pelo WhatsApp":"Reenviar"}</button>`:""}
      ${a.token?`<a class="btn sm" href="orcamento.html?t=${a.token}" target="_blank">Ver como o paciente \u2197</a>
        <button class="btn sm ghost" data-orc="copiar" data-id="${a.id}">Copiar link</button>`:""}
      ${e?`<span class="spacer"></span><button class="btn sm ghost" data-orc="aprovado" data-id="${a.id}">Marcar aprovado</button>
        <button class="btn sm ghost danger" data-orc="recusado" data-id="${a.id}">Recusado</button>`:""}
    </div>
  </div>`}function ja({patient_id:a,orcamento:n}){const t=n||{titulo:"",dentist_id:A.dentists[0]?.id,desconto:0,parcelas:1,observacoes:"",itens:[]};let e=t.itens.map(s=>({etapa:s.etapa,procedure_id:s.procedure_id||"",descricao:s.descricao,dente:s.dente||"",valor:s.valor}));e.length||e.push({etapa:1,procedure_id:"",descricao:"",dente:"",valor:""}),q({title:n?"Editar or\xE7amento":"Novo or\xE7amento",width:860,body:`<div class="form-grid">
      <label class="field">T\xEDtulo<input name="titulo" value="${d(t.titulo)}" placeholder="Ex.: Tratamento de c\xE1rie"></label>
      <label class="field">Dentista respons\xE1vel<select name="dentist_id">${A.dentists.map(s=>`<option value="${s.id}" ${s.id===t.dentist_id?"selected":""}>${d(s.nome)}</option>`).join("")}</select></label>
      <div class="full">
        <div class="row wrap" style="margin-bottom:8px"><b class="small">Itens do plano</b><span class="spacer"></span>
          <button type="button" class="btn sm" id="sugerir">\u2728 Sugerir pelo odontograma</button>
          <button type="button" class="btn sm" id="add-item">+ Item</button></div>
        <div class="itens-edit" id="itens"></div>
      </div>
      <label class="field">Desconto (R$)<input name="desconto" type="number" min="0" step="0.01" value="${t.desconto||""}"></label>
      <label class="field">Parcelas<select name="parcelas">${Array.from({length:12},(s,c)=>`<option value="${c+1}" ${c+1===t.parcelas?"selected":""}>${c+1}x</option>`).join("")}</select></label>
      <label class="field full">Observa\xE7\xF5es (o paciente v\xEA)<textarea name="observacoes" rows="2">${d(t.observacoes||"")}</textarea></label>
      <div class="full row" style="border-top:1px solid var(--border);padding-top:10px"><span class="muted" id="orc-detalhe"></span><span class="spacer"></span><b id="orc-total" style="font-size:20px"></b></div>
    </div>`,foot:`<span class="spacer"></span><button class="btn" data-close>Cancelar</button>
      <button class="btn" id="salvar">Salvar rascunho</button><button class="btn primary" id="salvar-enviar">Salvar e enviar pelo WhatsApp</button>`,onMount:({el:s,close:c})=>{const l=i("#itens",s),p=()=>{const $=e.reduce((_,v)=>_+(Number(v.valor)||0),0),r=Math.max(0,$-(Number(i("[name=desconto]",s).value)||0)),w=Number(i("[name=parcelas]",s).value)||1;i("#orc-total",s).textContent=T(r),i("#orc-detalhe",s).textContent=`${e.filter(_=>_.descricao).length} item(ns)${w>1?` \xB7 ${w}x de ${T(r/w)}`:""}`},o=()=>{l.innerHTML='<div class="item-edit cab"><span>Etapa</span><span>Procedimento</span><span>Descri\xE7\xE3o</span><span>Dente</span><span>Valor (R$)</span><span></span></div>'+e.map(($,r)=>`<div class="item-edit" data-i="${r}">
            <input type="number" min="1" max="9" data-k="etapa" value="${$.etapa}" aria-label="Etapa">
            <select data-k="procedure_id" aria-label="Procedimento"><option value="">Outro</option>${A.procedures.map(w=>`<option value="${w.id}" ${Number($.procedure_id)===w.id?"selected":""}>${d(w.nome)}</option>`).join("")}</select>
            <input data-k="descricao" value="${d($.descricao)}" placeholder="Descri\xE7\xE3o" aria-label="Descri\xE7\xE3o">
            <input data-k="dente" value="${d($.dente)}" placeholder="Ex.: 36" aria-label="Dente">
            <input type="number" min="0" step="0.01" data-k="valor" value="${$.valor}" aria-label="Valor">
            <button type="button" class="btn sm ghost" data-rm="${r}" aria-label="Remover item">\u2715</button>
          </div>`).join(""),p()};l.addEventListener("input",$=>{const r=$.target.closest("[data-i]");if(!r||!$.target.dataset.k)return;const w=e[Number(r.dataset.i)];if(w[$.target.dataset.k]=$.target.value,$.target.dataset.k==="procedure_id"){const _=A.procedures.find(v=>v.id===Number($.target.value));if(_){w.descricao=_.nome,w.valor=_.preco,o();return}}p()}),l.addEventListener("click",$=>{const r=$.target.closest("[data-rm]");r&&(e.splice(Number(r.dataset.rm),1),e.length||e.push({etapa:1,procedure_id:"",descricao:"",dente:"",valor:""}),o())}),i("[name=desconto]",s).addEventListener("input",p),i("[name=parcelas]",s).addEventListener("change",p),i("#add-item",s).onclick=()=>{e.push({etapa:e.at(-1)?.etapa||1,procedure_id:"",descricao:"",dente:"",valor:""}),o()},i("#sugerir",s).onclick=async()=>{const $=await h(`/patients/${a}/sugestao-orcamento`).catch(r=>(x(r.message,"err"),[]));if(!$.length)return x("O odontograma n\xE3o tem c\xE1rie, canal, extra\xE7\xE3o indicada nem dente ausente marcados.");e=[...e.filter(r=>r.descricao),...$.map(r=>({...r,procedure_id:r.procedure_id||""}))],i("[name=titulo]",s).value||(i("[name=titulo]",s).value="Plano de tratamento"),o(),x(`${$.length} item(ns) sugerido(s) a partir do odontograma. Revise os valores.`)};const u=async $=>{const r=R(s),w={patient_id:a,titulo:r.titulo,dentist_id:r.dentist_id,desconto:r.desconto,parcelas:r.parcelas,observacoes:r.observacoes,itens:e};try{const _=await h(n?`/orcamentos/${n.id}`:"/orcamentos",{method:n?"PUT":"POST",body:w});$?(await h(`/orcamentos/${_.id}/enviar`,{method:"POST"}),x(`Or\xE7amento enviado pelo ${A.status.whatsapp?"WhatsApp":"simulador"}.`,"ia")):x("Or\xE7amento salvo."),c()}catch(_){x(_.message,"err")}};i("#salvar",s).onclick=()=>u(!1),i("#salvar-enviar",s).onclick=()=>u(!0),o()}})}function La(a,n=!0){return a.length?`<div class="table-wrap"><table class="table"><thead><tr><th>Data</th>${n?"<th>Paciente</th>":""}<th>Descri\xE7\xE3o</th><th>Valor</th><th>Forma</th><th>Status</th><th></th></tr></thead><tbody>
    ${a.map(t=>{const e=t.status==="pendente"&&t.vencimento&&t.vencimento<A.hoje;return`<tr><td>${X(t.pago_em||t.vencimento||t.criado_em)}</td>${n?`<td><a href="#/pacientes/${t.patient_id}">${d(t.paciente_nome)}</a></td>`:""}
        <td>${d(t.descricao)}</td><td><b>${T(t.valor)}</b></td><td>${sa[t.forma]||"\u2014"}</td>
        <td><span class="st st-${t.status}">${t.status==="pago"?"Pago":e?"Vencido":"Pendente"}</span></td>
        <td style="text-align:right">${t.status==="pendente"?`<button class="btn sm primary" data-receber="${t.id}">Receber</button>`:`<button class="btn sm ghost" data-estornar="${t.id}">Estornar</button>`}</td></tr>`}).join("")}</tbody></table></div>`:'<div class="empty">Nenhum lan\xE7amento.</div>'}function Pa(a){E("[data-receber]",a).forEach(n=>n.onclick=()=>q({title:"Registrar recebimento",body:`<label class="field">Forma de pagamento<select name="forma">${Object.entries(sa).map(([t,e])=>`<option value="${t}">${e}</option>`).join("")}</select></label>`,foot:'<span class="spacer"></span><button class="btn" data-close>Cancelar</button><button class="btn primary" id="ok">Confirmar recebimento</button>',width:380,onMount:({el:t,close:e})=>{i("#ok",t).onclick=async()=>{await h(`/payments/${n.dataset.receber}`,{method:"PUT",body:{status:"pago",forma:i("[name=forma]",t).value}}).catch(s=>x(s.message,"err")),x("Recebimento registrado."),e()}}})),E("[data-estornar]",a).forEach(n=>n.onclick=async()=>{confirm("Voltar este lan\xE7amento para pendente?")&&await h(`/payments/${n.dataset.estornar}`,{method:"PUT",body:{status:"pendente"}}).catch(t=>x(t.message,"err"))})}async function Ta({patient_id:a,nome:n}){const t=a?[]:await h("/patients");q({title:"Novo lan\xE7amento",body:`<datalist id="dl-pac-fin">${t.map(e=>`<option value="${d(`${e.nome} #${e.id}`)}"></option>`).join("")}</datalist>
      <div class="form-grid">
        <label class="field full">Paciente<input name="paciente" list="dl-pac-fin" value="${a?d(`${n} #${a}`):""}" ${a?"readonly":""}></label>
        <label class="field full">Descri\xE7\xE3o<input name="descricao" placeholder="Ex.: Plano de tratamento \u2014 1\xAA parcela"></label>
        <label class="field">Valor (R$)<input name="valor" type="number" min="0" step="0.01"></label>
        <label class="field">Vencimento<input name="vencimento" type="date" value="${A.hoje}"></label>
        <label class="field">Forma<select name="forma"><option value="">\u2014</option>${Object.entries(sa).map(([e,s])=>`<option value="${e}">${s}</option>`).join("")}</select></label>
        <label class="check" style="padding-top:20px"><input type="checkbox" name="pago"> J\xE1 recebido</label>
      </div>`,foot:'<span class="spacer"></span><button class="btn" data-close>Cancelar</button><button class="btn primary" id="ok">Salvar</button>',onMount:({el:e,close:s})=>{i("#ok",e).onclick=async()=>{const c=R(e),l=(c.paciente.match(/#(\d+)$/)||[])[1];if(!l)return x("Escolha um paciente da lista.","err");try{await h("/payments",{method:"POST",body:{...c,patient_id:l,status:c.pago?"pago":"pendente"}}),x("Lan\xE7amento criado."),s()}catch(p){x(p.message,"err")}}}})}const ia=a=>`${ea[Number(a.slice(5,7))-1]}/${a.slice(2,4)}`,da=a=>a>=1e3?`R$ ${(a/1e3).toLocaleString("pt-BR",{maximumFractionDigits:1})} mil`:T(a);function ne(a){if(a<=0)return 1;const n=10**Math.floor(Math.log10(a))/2;return Math.ceil(a/n)*n}function ie(a){const n=ne(Math.max(...a.map(l=>l.valor))),t=a.reduce((l,p)=>p.valor>l.valor?p:l,a[0]),[e,s]=a.filter(l=>!l.parcial).slice(-2),c=e?.valor&&s?(s.valor-e.valor)/e.valor:null;return`
    <div class="card card-pad">
      <div class="row wrap"><h2>Recebido por m\xEAs</h2><span class="spacer"></span>
        ${c!=null?`<span class="muted small">${ia(s.mes)}: <b style="color:var(--text)">${c>=0?"\u25B2":"\u25BC"} ${K(Math.abs(c))}</b> sobre ${ia(e.mes)}</span>`:""}</div>
      <div class="gf-colunas">
        <div class="gf-grade">${[1,.5,0].map(l=>`<div style="bottom:${l*100}%"><span>${da(n*l)}</span></div>`).join("")}</div>
        ${a.map(l=>`
          <div class="gf-coluna ${l.parcial?"parcial":""}" data-tip="${d(`<b>${ia(l.mes)}${l.parcial?" (at\xE9 hoje)":""}</b><br>${T(l.valor)} \xB7 ${l.qtd} pagamento(s)`)}">
            <div class="gf-barra" style="height:${l.valor/n*100}%">${l===t||l.parcial?`<span class="gf-valor">${da(l.valor)}</span>`:""}</div>
          </div>`).join("")}
      </div>
      <div class="gf-meses">${a.map(l=>`<span>${ia(l.mes)}${l.parcial?"<br><i>parcial</i>":""}</span>`).join("")}</div>
    </div>`}function Ma(a,n){const t=n.reduce((s,c)=>s+c.valor,0),e=Math.max(1,...n.map(s=>s.valor));return`
    <div class="card card-pad">
      <div class="row"><h2>${d(a)}</h2><span class="spacer"></span><span class="muted small">${T(t)}</span></div>
      ${n.length?`<div class="gf-linhas">${n.map(s=>`
        <div class="gf-linha" data-tip="${d(`<b>${d(s.nome)}</b><br>${T(s.valor)} \xB7 ${s.qtd} pagamento(s) \xB7 ${K(s.valor/t)} do total`)}">
          <span class="gf-nome">${d(s.nome)}</span>
          <span class="gf-trilho"><span class="gf-barra-h" style="width:${s.valor/e*100}%"></span></span>
          <span class="gf-num">${da(s.valor)} <span class="muted">${K(s.valor/t)}</span></span>
        </div>`).join("")}</div>`:'<div class="empty">Nenhum pagamento recebido no per\xEDodo.</div>'}
    </div>`}function de(a){const n=[["vencido","\u26A0\uFE0F Vencido",a.vencido],["","Em at\xE9 30 dias",a.proximos_30],["","Ap\xF3s 30 dias",a.depois]],t=Math.max(1,...n.map(([,,s])=>s.valor)),e=n.reduce((s,[,,c])=>s+c.valor,0);return`
    <div class="card card-pad">
      <div class="row"><h2>A receber</h2><span class="spacer"></span><span class="muted small">${T(e)}</span></div>
      <div class="gf-linhas">${n.map(([s,c,l])=>`
        <div class="gf-linha ${s}" data-tip="${d(`<b>${c}</b><br>${T(l.valor)} \xB7 ${l.qtd} lan\xE7amento(s)`)}">
          <span class="gf-nome">${c}</span>
          <span class="gf-trilho"><span class="gf-barra-h" style="width:${l.valor/t*100}%"></span></span>
          <span class="gf-num">${da(l.valor)}</span>
        </div>`).join("")}</div>
    </div>`}function le(a){const n=i("#gf-dica")||document.body.appendChild(Object.assign(document.createElement("div"),{id:"gf-dica",className:"gf-dica hidden"}));n.classList.add("hidden"),E("[data-tip]",a).forEach(t=>{t.onmouseenter=()=>{n.innerHTML=t.dataset.tip,n.classList.remove("hidden")},t.onmousemove=e=>{const s=Math.min(e.clientX+14,innerWidth-n.offsetWidth-8);n.style.transform=`translate(${s}px, ${e.clientY+14}px)`},t.onmouseleave=()=>n.classList.add("hidden")})}async function ce(){const a=i("#view");let n="",t="6m";const e=async()=>{const[s,c]=await Promise.all([h(`/payments${n?`?status=${n}`:""}`),h(`/financeiro/graficos?periodo=${t}`)]),l=c.totais;a.innerHTML=`
      <div class="page-head"><div><h1>Financeiro</h1><p class="muted">Cobran\xE7as s\xE3o criadas automaticamente quando uma consulta \xE9 conclu\xEDda.</p></div><span class="spacer"></span><button class="btn primary" id="novo">+ Lan\xE7amento</button></div>
      <div class="grid grid-4" style="margin-bottom:16px">
        <div class="card card-pad kpi"><div class="label">Recebido no m\xEAs</div><div class="value" style="color:var(--ok)">${T(l.recebido_mes)}</div></div>
        <div class="card card-pad kpi"><div class="label">A receber</div><div class="value">${T(l.a_receber)}</div></div>
        <div class="card card-pad kpi"><div class="label">Vencidos</div><div class="value" style="color:${l.vencidos_qtd?"var(--danger)":"inherit"}">${T(l.vencidos)}</div><div class="hint">${l.vencidos_qtd} lan\xE7amento(s)</div></div>
        <div class="card card-pad kpi"><div class="label">Ticket m\xE9dio (m\xEAs)</div><div class="value">${T(l.recebido_mes/Math.max(1,l.qtd_mes))}</div></div>
      </div>
      <div class="grid grid-3-1" style="margin-bottom:16px">
        ${ie(c.meses)}
        ${de(c.a_receber)}
      </div>
      <div class="row wrap" style="margin-bottom:10px"><h2>De onde vem a receita</h2><span class="spacer"></span>
        <div class="seg">${[["mes","M\xEAs atual"],["6m","\xDAltimos 6 meses"]].map(([p,o])=>`<button data-periodo="${p}" class="${t===p?"on":""}">${o}</button>`).join("")}</div></div>
      <div class="grid grid-2" style="margin-bottom:16px">
        ${Ma("Formas de pagamento",c.formas.map(p=>({nome:sa[p.forma]||"N\xE3o informado",valor:p.valor,qtd:p.qtd})))}
        ${Ma("Procedimentos",c.procedimentos)}
      </div>
      <div class="card">
        <div class="card-head"><div class="seg">${[["","Todos"],["pendente","Pendentes"],["pago","Pagos"]].map(([p,o])=>`<button data-f="${p}" class="${n===p?"on":""}">${o}</button>`).join("")}</div></div>
        ${La(s)}
      </div>`,E("[data-f]",a).forEach(p=>p.onclick=()=>{n=p.dataset.f,e()}),E("[data-periodo]",a).forEach(p=>p.onclick=()=>{t=p.dataset.periodo,e()}),le(a),i("#novo").onclick=()=>Ta({}),Pa(a)};await e(),O={financeiro:z(e,200)}}function Sa(a=[]){return a.map(([n,t])=>`${n}-${t}`).join(", ")}function re(a){const n=[];for(const t of a.split(",").map(e=>e.trim()).filter(Boolean)){const e=t.match(/^(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})$/);if(!e)throw new Error(`Hor\xE1rio inv\xE1lido: "${t}". Use o formato 08:00-12:00.`);n.push([e[1].padStart(5,"0"),e[2].padStart(5,"0")])}return n}async function pe(){const a=i("#view"),n=async()=>{const[t,e,s,c,l]=await Promise.all([h("/settings"),h("/dentists?todos=1"),h("/procedures?todos=1"),h("/status"),h("/uso-ia")]),p=(o,u,$="",r=!1,w=!1)=>`<label class="field ${r?"full":""}">${u}${w?`<textarea name="${o}" rows="2" placeholder="${$}">${d(t[o]||"")}</textarea>`:`<input name="${o}" value="${d(t[o]||"")}" placeholder="${$}">`}</label>`;a.innerHTML=`
      <div class="page-head"><h1>Configura\xE7\xF5es</h1></div>
      <div class="grid grid-2" style="align-items:start">
        <div class="grid">
          <div class="card">
            <div class="card-head"><h2>Dados da cl\xEDnica</h2><span class="spacer"></span><span class="muted small">a IA usa estas informa\xE7\xF5es</span></div>
            <div class="card-pad" id="form-clinica"><div class="form-grid">
              ${p("nome_clinica","Nome da cl\xEDnica")}${p("nome_assistente","Nome da assistente virtual","Sofia")}
              ${p("endereco","Endere\xE7o","",!0)}${p("telefone","Telefone")}${p("horario_funcionamento","Hor\xE1rio de funcionamento")}
              ${p("convenios","Conv\xEAnios aceitos","",!0)}${p("formas_pagamento","Formas de pagamento","",!0)}${p("chave_pix","Chave Pix (enviada nos lembretes de pagamento)","CNPJ, e-mail, telefone ou chave aleat\xF3ria",!0)}
              ${p("info_adicional","Outras informa\xE7\xF5es para a IA","Estacionamento, pol\xEDticas de cancelamento, etc.",!0,!0)}
            </div>
            <div class="row" style="margin-top:12px"><span class="muted small">Novas conversas j\xE1 usam os dados atualizados.</span><span class="spacer"></span><button class="btn primary" id="salvar-clinica">Salvar</button></div></div>
          </div>
          <div class="card card-pad">
            <h2 style="margin-bottom:10px">Automa\xE7\xE3o e integra\xE7\xF5es</h2>
            <div class="grid" style="gap:10px">
              <div class="row"><span class="dot ${c.ia?"on":"off"}"></span><div><b>Recepcionista de IA</b> \u2014 ${c.ia?`ativa (${d(c.modelo)})`:c.demo_publica?"vers\xE3o de demonstra\xE7\xE3o: respostas simuladas. Na vers\xE3o contratada, quem responde \xE9 a IA de verdade (Claude).":"modo demonstra\xE7\xE3o: respostas simuladas por regras. Para usar o Claude, defina ANTHROPIC_API_KEY no arquivo .env e reinicie"}</div></div>
              <div class="row"><span class="dot ${c.whatsapp?"on":"off"}"></span><div><b>WhatsApp Business</b> \u2014 ${c.whatsapp?"conectado":c.demo_publica?"na vers\xE3o contratada, a cl\xEDnica conecta o pr\xF3prio WhatsApp oficial. Aqui, use o simulador de paciente.":"n\xE3o configurado (veja o README). Use o simulador enquanto isso."}</div></div>
              <div class="row"><span class="dot on"></span><div style="flex:1"><b>Equipe de IA</b> \u2014 confirma\xE7\xF5es, retornos, cobran\xE7as e acompanhamento de or\xE7amentos pelo WhatsApp.</div><a class="btn sm" href="#/equipe-ia">Abrir</a></div>
              ${me(l)}
            </div>
          </div>
        </div>
        <div class="grid">
          <div class="card">
            <div class="card-head"><h2>Dentistas</h2><span class="spacer"></span><button class="btn sm primary" id="novo-dentista">+ Dentista</button></div>
            ${e.map(o=>`<div class="list-item click" data-dentista="${o.id}" style="cursor:pointer;${o.ativo?"":"opacity:.5"}">
              <span class="color-bar" style="background:${o.cor}"></span>
              <div style="flex:1;min-width:0"><b>${d(o.nome)}</b> <span class="muted small">${d(o.cro||"")}</span><div class="muted small">${d(o.especialidade||"")}</div>
              <div class="small" style="margin-top:2px">${[1,2,3,4,5,6,0].filter(u=>o.horarios[u]?.length).map(u=>`<b>${ra[u]}</b> ${Sa(o.horarios[u])}`).join(" \xB7 ")||'<span class="muted">sem hor\xE1rios</span>'}</div></div>
              <span class="muted">\u203A</span></div>`).join("")}
          </div>
          <div class="card">
            <div class="card-head"><h2>Procedimentos</h2><span class="spacer"></span><button class="btn sm primary" id="novo-proc">+ Procedimento</button></div>
            <div class="table-wrap"><table class="table"><thead><tr><th>Procedimento</th><th>Dura\xE7\xE3o</th><th>Pre\xE7o</th><th>Retorno</th></tr></thead><tbody>
              ${s.map(o=>`<tr class="click" data-proc="${o.id}" style="${o.ativo?"":"opacity:.5"}"><td><b>${d(o.nome)}</b><div class="muted small">${d(o.descricao||"")}</div></td><td>${o.duracao_min} min</td><td>${T(o.preco)}</td><td>${o.retorno_meses?`${o.retorno_meses} ${o.retorno_meses===1?"m\xEAs":"meses"}`:"\u2014"}</td></tr>`).join("")}
            </tbody></table></div>
          </div>
        </div>
      </div>`,i("#salvar-clinica").onclick=async()=>{await h("/settings",{method:"PUT",body:R(i("#form-clinica"))}).then(()=>{x("Dados da cl\xEDnica salvos."),pa()}).catch(o=>x(o.message,"err"))},i("#novo-dentista").onclick=()=>Na({horarios:{},procedimentos:[],ativo:1,cor:"#0ea5e9"},s),E("[data-dentista]",a).forEach(o=>o.onclick=()=>Na(e.find(u=>u.id===Number(o.dataset.dentista)),s)),i("#novo-proc").onclick=()=>Ca({ativo:1,duracao_min:30}),E("[data-proc]",a).forEach(o=>o.onclick=()=>Ca(s.find(u=>u.id===Number(o.dataset.proc))))};await n(),O={config:z(n,200),uso_ia:z(n,200)}}function me(a){if(!a.ia)return"";const n=a.percentual;return`<div class="uso-ia">
    <div class="row"><b>Uso da IA neste m\xEAs</b><span class="spacer"></span><span class="muted small">${n!=null?`${K(n)} do limite do plano`:"sem limite definido"}</span></div>
    ${n!=null?`<div class="uso-trilho"><span class="uso-barra ${a.atingido?"cheio":a.alerta?"alerta":""}" style="width:${Math.max(n*100,1)}%"></span></div>`:""}
    <div class="muted small">${a.recepcao.conversas} conversa(s) atendida(s) pela recepcionista \xB7 ${a.equipe.chamadas} resposta(s) do assistente da equipe</div>
    ${a.atingido?'<div class="aviso-limite">Limite do plano atingido. At\xE9 o dia 1\xBA, a recepcionista responde s\xF3 o que \xE9 simples (marcar, pre\xE7os, endere\xE7o) e passa o resto para a equipe.</div>':""}
  </div>`}function Na(a,n){q({title:a.id?`Editar ${d(a.nome)}`:"Novo dentista",width:720,body:`<div class="form-grid">
      <label class="field">Nome<input name="nome" value="${d(a.nome||"")}" placeholder="Dra. Maria Silva"></label>
      <label class="field">Especialidade<input name="especialidade" value="${d(a.especialidade||"")}"></label>
      <label class="field">CRO<input name="cro" value="${d(a.cro||"")}"></label>
      <label class="field">Cor na agenda<input name="cor" type="color" value="${a.cor}" style="height:36px;padding:2px"></label>
      <div class="full"><div class="muted small" style="font-weight:600;margin-bottom:6px">Hor\xE1rios de atendimento (ex.: 08:00-12:00, 13:00-18:00)</div>
        <div class="grid" style="gap:6px">${[1,2,3,4,5,6,0].map(t=>`<div class="row"><b style="width:40px">${ra[t]}</b><input data-dia="${t}" value="${Sa(a.horarios[t])}" placeholder="n\xE3o atende" style="flex:1"></div>`).join("")}</div>
      </div>
      <div class="full"><div class="muted small" style="font-weight:600;margin-bottom:6px">Procedimentos que realiza (nenhum marcado = todos)</div>
        <div class="grid grid-2" style="gap:6px">${n.filter(t=>t.ativo).map(t=>`<label class="check"><input type="checkbox" data-proc-id="${t.id}" ${a.procedimentos.includes(t.id)?"checked":""}> ${d(t.nome)}</label>`).join("")}</div>
      </div>
      <label class="check full"><input type="checkbox" name="ativo" ${a.ativo?"checked":""}> Ativo (aparece na agenda e para a IA)</label>
    </div>`,foot:'<span class="spacer"></span><button class="btn" data-close>Cancelar</button><button class="btn primary" id="ok">Salvar</button>',onMount:({el:t,close:e})=>{i("#ok",t).onclick=async()=>{try{const s=R(t),c={};for(const p of E("[data-dia]",t)){const o=re(p.value);o.length&&(c[p.dataset.dia]=o)}const l={nome:s.nome,especialidade:s.especialidade,cro:s.cro,cor:s.cor,ativo:s.ativo,horarios:c,procedimentos:E("[data-proc-id]",t).filter(p=>p.checked).map(p=>Number(p.dataset.procId))};await h(a.id?`/dentists/${a.id}`:"/dentists",{method:a.id?"PUT":"POST",body:l}),x("Dentista salvo."),e()}catch(s){x(s.message,"err")}}}})}function Ca(a){q({title:a.id?"Editar procedimento":"Novo procedimento",body:`<div class="form-grid">
      <label class="field full">Nome<input name="nome" value="${d(a.nome||"")}"></label>
      <label class="field">Dura\xE7\xE3o (min)<input name="duracao_min" type="number" min="10" step="5" value="${a.duracao_min}"></label>
      <label class="field">Pre\xE7o de refer\xEAncia (R$)<input name="preco" type="number" min="0" step="0.01" value="${a.preco??""}"></label>
      <label class="field full">Retorno em (meses): o agente de Retornos convida o paciente quando esse prazo passa<input name="retorno_meses" type="number" min="0" max="36" value="${a.retorno_meses??""}" placeholder="Deixe vazio se n\xE3o tem retorno"></label>
      <label class="field full">Descri\xE7\xE3o (a IA usa para explicar ao paciente)<textarea name="descricao" rows="2">${d(a.descricao||"")}</textarea></label>
      <label class="check full"><input type="checkbox" name="ativo" ${a.ativo?"checked":""}> Ativo</label>
    </div>`,foot:'<span class="spacer"></span><button class="btn" data-close>Cancelar</button><button class="btn primary" id="ok">Salvar</button>',onMount:({el:n,close:t})=>{i("#ok",n).onclick=async()=>{try{await h(a.id?`/procedures/${a.id}`:"/procedures",{method:a.id?"PUT":"POST",body:R(n)}),x("Procedimento salvo."),t()}catch(e){x(e.message,"err")}}}})}const ue=["Como est\xE1 a agenda de amanh\xE3?","Resumo financeiro do m\xEAs","Quem faltou este m\xEAs?","Ficha do Jo\xE3o Pereira","O Jo\xE3o Pereira \xE9 hipertenso: qual anest\xE9sico \xE9 mais seguro para ele?"],Q={sessao:null,ocupado:!1};function la(a){const n=s=>s.replace(/\*\*(.+?)\*\*/g,"<b>$1</b>").replace(/(^|[\s(])[*_](?!\s)(.+?)[*_](?=[\s.,;:!?)]|$)/g,"$1<i>$2</i>").replace(/`(.+?)`/g,"<code>$1</code>");let t="",e=null;for(const s of d(a).split(`
`)){const c=s.match(/^\s*[-*•]\s+(.*)/),l=s.match(/^\s*\d+[.)]\s+(.*)/);if(c||l){const o=c?"ul":"ol";e!==o&&(e&&(t+=`</${e}>`),t+=`<${o}>`,e=o),t+=`<li>${n((c||l)[1])}</li>`;continue}e&&(t+=`</${e}>`,e=null);const p=s.match(/^#{1,4}\s+(.*)/);p?t+=`<p><b>${n(p[1])}</b></p>`:s.trim()&&(t+=`<p>${n(s)}</p>`)}return e?`${t}</${e}>`:t}function ve(){i("#ia-sugestoes").innerHTML=ue.map(a=>`<button type="button" class="chip" data-sug="${d(a)}">${d(a)}</button>`).join(""),E("[data-sug]",i("#ia-sugestoes")).forEach(a=>a.onclick=()=>ca(a.dataset.sug))}function Da(){Q.sessao=null,i("#ia-body").innerHTML=`
    <div class="ia-msg ia">${la(`Ol\xE1! Sou o assistente da ${A.settings.nome_clinica||"cl\xEDnica"}. Posso consultar a **agenda**, abrir a **ficha de um paciente**, montar **resumos financeiros** e tirar **d\xFAvidas cl\xEDnicas**, levando em conta a anamnese do paciente. O que voc\xEA precisa?`)}</div>
    ${A.status.demo?'<div class="ia-demo">\u{1F9EA} Modo demonstra\xE7\xE3o: respondo perguntas simples sobre os dados da cl\xEDnica. Perguntas livres e d\xFAvidas cl\xEDnicas precisam da IA completa.</div>':""}`,ve()}function Ia(a){i("#ia-drawer").classList.add("open"),i("#ia-fab").classList.add("hidden"),i("#ia-body").children.length||Da(),a?ca(a):setTimeout(()=>i("#ia-input").focus(),250)}function Oa(){i("#ia-drawer").classList.remove("open"),i("#ia-fab").classList.remove("hidden")}async function ca(a){if(a=String(a||"").trim(),!a||Q.ocupado)return;Q.ocupado=!0,i("#ia-enviar").disabled=!0,i("#ia-input").value="",i("#ia-sugestoes").innerHTML="";const n=i("#ia-body");n.insertAdjacentHTML("beforeend",`<div class="ia-msg eu">${d(a)}</div><div class="ia-msg ia"><div class="ia-status">Pensando\u2026</div><div class="ia-txt"></div></div>`);const t=n.lastElementChild,e=i(".ia-status",t),s=i(".ia-txt",t),c=()=>{n.scrollTop=n.scrollHeight},l=u=>s.insertAdjacentHTML("beforeend",`<div class="ia-erro">${d(u)}</div>`);let p="",o=0;c();try{const u=await fetch("/api/assistente",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({sessao_id:Q.sessao,texto:a})});if(!u.ok||!u.body)throw new Error((await u.json().catch(()=>({}))).erro||`Erro ${u.status}`);const $=u.body.getReader(),r=new TextDecoder;let w="";for(;;){const{value:_,done:v}=await $.read();if(v)break;w+=r.decode(_,{stream:!0});let L;for(;(L=w.indexOf(`

`))>=0;){const D=w.slice(0,L);if(w=w.slice(L+2),!D.startsWith("data: "))continue;const S=JSON.parse(D.slice(6));S.tipo==="sessao"?Q.sessao=S.id:S.tipo==="delta"?(p+=S.texto,e.classList.add("hidden"),s.innerHTML=la(p)):S.tipo==="ferramenta"?(p&&!p.endsWith(`
`)&&(p+=`

`),o=p.length,e.textContent=`\u{1F50E} ${S.rotulo}\u2026`,e.classList.remove("hidden"),s.innerHTML=la(p)):S.tipo==="reiniciar"?(p=p.slice(0,o),s.innerHTML=la(p)):S.tipo==="erro"&&l(S.mensagem),c()}}}catch(u){l(u.message)}finally{e.classList.add("hidden"),Q.ocupado=!1,i("#ia-enviar").disabled=!1,c()}}function be(){i("#ia-fab").onclick=()=>Ia(),i("#ia-fechar").onclick=Oa,i("#ia-nova").onclick=()=>{Q.ocupado||Da()},i("#ia-form").addEventListener("submit",a=>{a.preventDefault(),ca(i("#ia-input").value)}),i("#ia-input").addEventListener("keydown",a=>{a.key==="Enter"&&!a.shiftKey&&(a.preventDefault(),ca(i("#ia-input").value))}),document.addEventListener("keydown",a=>{a.key==="Escape"&&i("#ia-drawer").classList.contains("open")&&!i(".modal-bg")&&Oa()})}await pa(),be(),Ua(),ya(),window.addEventListener("hashchange",xa),xa(),setInterval(async()=>{A.status=await h("/status").catch(()=>A.status),A.hoje=A.status.agora?.slice(0,10)||A.hoje},6e4);
