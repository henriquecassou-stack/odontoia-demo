const i=(a,n=document)=>n.querySelector(a),P=(a,n=document)=>[...n.querySelectorAll(a)],d=a=>String(a??"").replace(/[&<>"']/g,n=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[n]),M=a=>Number(a||0).toLocaleString("pt-BR",{style:"currency",currency:"BRL"}),Da=a=>`${Math.round((a||0)*100)}%`,aa=["Dom","Seg","Ter","Qua","Qui","Sex","S\xE1b"],va=["domingo","segunda-feira","ter\xE7a-feira","quarta-feira","quinta-feira","sexta-feira","s\xE1bado"],ia=["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"],ea={agendada:"Agendada",confirmada:"Confirmada",em_atendimento:"Em atendimento",concluida:"Conclu\xEDda",faltou:"Faltou",cancelada:"Cancelada"},da={pix:"Pix",cartao:"Cart\xE3o",dinheiro:"Dinheiro",convenio:"Conv\xEAnio",boleto:"Boleto"};function J(a){const t=String(a||"").replace(/\D/g,"").match(/^55(\d{2})(\d{4,5})(\d{4})$/);return t?`(${t[1]}) ${t[2]}-${t[3]}`:a||""}const ta=(a,n)=>new Date(Date.parse(`${a}T00:00Z`)+n*864e5).toISOString().slice(0,10),K=a=>new Date(`${a}T00:00Z`).getUTCDay(),X=a=>a?a.slice(0,10).split("-").reverse().join("/"):"",sa=a=>`${aa[K(a)]} ${a.slice(8,10)}/${a.slice(5,7)}`,D=a=>a.slice(11,16),z=a=>Number(a.slice(0,2))*60+Number(a.slice(3,5)),ba=a=>`${String(Math.floor(a/60)).padStart(2,"0")}:${String(a%60).padStart(2,"0")}`,ga=a=>new Date(a).toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"});function la(a){const n=new Date(a);return n.toDateString()===new Date().toDateString()?ga(a):n.toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit"})}function ha(a){if(!a)return null;const[n,t,e]=a.split("-").map(Number),[o,c,m]=k.hoje.split("-").map(Number);return o-n-(c<t||c===t&&m<e?1:0)}const Z=a=>a.nome_contato||a.paciente_nome||J(a.telefone),Oa=a=>a.replace(/https?:\/\/[^\s<]+/g,n=>`<a href="${n}" target="_blank" rel="noopener">${n}</a>`),V=(a,n)=>{let t;return(...e)=>{clearTimeout(t),t=setTimeout(()=>a(...e),n)}};async function f(a,{method:n="GET",body:t}={}){const e=await fetch(`/api${a}`,{method:n,headers:t?{"Content-Type":"application/json"}:void 0,body:t?JSON.stringify(t):void 0}),o=await e.json().catch(()=>({}));if(!e.ok)throw new Error(o.erro||`Erro ${e.status}`);return o}function w(a,n=""){const t=document.createElement("div");t.className=`toast ${n}`,t.textContent=a,i("#toasts").append(t),setTimeout(()=>t.remove(),4500)}function R({title:a,body:n,foot:t="",onMount:e,width:o}){const c=i("#modal-root"),m=document.createElement("div");m.className="modal-bg",m.innerHTML=`<div class="modal" ${o?`style="width:min(${o}px,100%)"`:""}>
      <div class="modal-head"><h2>${a}</h2><span class="spacer"></span><button class="btn ghost sm" data-close>\u2715</button></div>
      <div class="modal-body">${n}</div>
      ${t?`<div class="modal-foot">${t}</div>`:""}
    </div>`;const p=()=>m.remove();m.addEventListener("mousedown",l=>{l.target===m&&p()}),m.addEventListener("click",l=>{l.target.closest("[data-close]")&&p()}),c.append(m);const s={el:m,close:p};return e?.(s),i("input, select, textarea",m)?.focus(),s}const q=a=>Object.fromEntries(P("[name]",a).map(n=>[n.name,n.type==="checkbox"?n.checked:n.value])),k={dentists:[],procedures:[],status:{},hoje:new Date().toISOString().slice(0,10),settings:{}};let O={};async function ca(){const[a,n,t,e]=await Promise.all([f("/dentists"),f("/procedures"),f("/status"),f("/settings")]);Object.assign(k,{dentists:a,procedures:n,status:t,settings:e,hoje:t.agora.slice(0,10)}),i("#brand-name").textContent=e.nome_clinica||"OdontoIA",document.title=`${e.nome_clinica||"OdontoIA"} \u2014 Painel`,i("#st-ia").className=`dot ${t.ia?"on":"off"}`,i("#st-ia-txt").textContent=t.ia?"ativa":"em modo demonstra\xE7\xE3o",i("#st-wa").className=`dot ${t.whatsapp?"on":"off"}`,i("#st-wa-txt").textContent=t.whatsapp?"conectado":"n\xE3o configurado"}async function $a(){const n=(await f("/conversations")).filter(e=>e.precisa_atencao).length,t=i("#nav-alertas");t.textContent=n,t.classList.toggle("hidden",!n)}const Ra=V($a,300);function qa(){const a=new EventSource("/api/stream");for(const n of["mensagem","conversa","ia_delta","ia_digitando","ia_rascunho_descartado","agenda","financeiro","pacientes","config","agentes","orcamentos","imagens"])a.addEventListener(n,t=>{const e=JSON.parse(t.data);Ha[n]?.(e),O[n]?.(e)})}const Ha={conversa:()=>Ra(),mensagem:({message:a,conversa:n})=>{a.autor==="paciente"&&Y.nome!=="conversas"&&w(`\u{1F4AC} ${Z(n)}: ${a.texto.slice(0,80)}`)},agenda:({tipo:a,consulta:n})=>{a==="criada"&&n.origem==="ia"&&w(`\u{1F916} IA agendou ${n.paciente_nome} \u2014 ${sa(n.inicio)} ${D(n.inicio)} com ${n.dentista_nome}`,"ia")},config:async()=>{await ca()}},Y={nome:"painel",id:null},fa={painel:Ua,agenda:Wa,conversas:Va,"equipe-ia":Fa,pacientes:Ja,financeiro:te,config:oe};function ya(){const[,a="painel",n=null]=location.hash.split("/");Object.assign(Y,{nome:fa[a]?a:"painel",id:n}),P("[data-nav]").forEach(t=>t.classList.toggle("active",t.dataset.nav===Y.nome)),i("#view").classList.toggle("tela-cheia",Y.nome==="conversas"),O={},fa[Y.nome](Y.id)}async function Ua(){const a=i("#view"),n=async()=>{const[e,o]=await Promise.all([f("/dashboard"),f("/resumo-do-dia")]),c=new Date().getHours(),m=c<12?"Bom dia":c<18?"Boa tarde":"Boa noite",p=Math.max(1,...e.proximos_dias.map(l=>l.total)),s=i("#ia-rapida-txt")?.value||"";a.innerHTML=`
      <div class="page-head">
        <div><h1>${m}!</h1><p class="muted">${va[K(e.hoje)]}, ${X(e.hoje)} \xB7 ${d(k.settings.nome_clinica||"")}</p></div>
        <span class="spacer"></span>
        <a class="btn" href="chat.html" target="_blank">Testar a IA como paciente \u2197</a>
        <button class="btn primary" id="nova">+ Nova consulta</button>
      </div>
      <div class="card card-pad ia-card">
        <div class="row"><div class="ia-avatar">\u2728</div><div><b>Pergunte \xE0 IA da cl\xEDnica</b><div class="muted small">Agenda, pacientes, financeiro e d\xFAvidas cl\xEDnicas, do jeito que voc\xEA falaria com um colega.</div></div></div>
        <form class="row" id="ia-rapida" style="margin-top:12px">
          <input id="ia-rapida-txt" style="flex:1;height:38px" placeholder="Ex.: Quem eu atendo amanh\xE3? \xB7 Posso usar artica\xEDna em gestante?">
          <button class="btn primary" style="height:38px">Perguntar</button>
        </form>
        <div class="row wrap" style="margin-top:10px;gap:6px">${Ma.slice(0,4).map(l=>`<button type="button" class="chip" data-ia="${d(l)}">${d(l)}</button>`).join("")}</div>
      </div>
      ${za(o)}
      <div class="grid grid-4" style="margin-bottom:16px">
        <div class="card card-pad kpi"><div class="label">Consultas hoje</div><div class="value">${e.consultas_hoje.length}</div><div class="hint">${e.confirmadas_hoje} confirmadas</div></div>
        <div class="card card-pad kpi"><div class="label">Agendadas pela IA</div><div class="value">${e.agendadas_ia_7d}</div><div class="hint">\xFAltimos 7 dias \xB7 ${e.conversas_ativas_24h} conversas em 24h</div></div>
        <div class="card card-pad kpi"><div class="label">Recebido no m\xEAs</div><div class="value">${M(e.recebido_mes)}</div><div class="hint">${M(e.a_receber)} a receber</div></div>
        <div class="card card-pad kpi"><div class="label">Faltas no m\xEAs</div><div class="value">${Da(e.taxa_faltas_mes)}</div><div class="hint">lembretes autom\xE1ticos reduzem faltas</div></div>
      </div>
      <div class="grid grid-3-1">
        <div class="card">
          <div class="card-head"><h2>Agenda de hoje</h2><span class="spacer"></span><a href="#/agenda" class="small">Abrir agenda \u2192</a></div>
          ${e.consultas_hoje.length?e.consultas_hoje.map(l=>`
            <div class="list-item click" data-appt="${l.id}" style="cursor:pointer">
              <span class="color-bar" style="background:${l.cor}"></span>
              <span class="time-pill">${D(l.inicio)}</span>
              <div style="flex:1;min-width:0"><b>${d(l.paciente)}</b> ${l.origem==="ia"?'<span class="badge ia">IA</span>':""}<div class="muted small">${d(l.procedimento||"\u2014")} \xB7 ${d(l.dentista)}</div></div>
              <span class="st st-${l.status}">${ea[l.status]}</span>
            </div>`).join(""):'<div class="empty">Nenhuma consulta hoje.</div>'}
        </div>
        <div class="grid" style="align-content:start">
          <div class="card">
            <div class="card-head"><h2>Precisam de aten\xE7\xE3o</h2><span class="spacer"></span>${e.conversas_atencao.length?`<span class="badge alerta">${e.conversas_atencao.length}</span>`:""}</div>
            ${e.conversas_atencao.length?e.conversas_atencao.map(l=>`
              <a class="conv-item" href="#/conversas/${l.id}">
                <div class="top"><span class="name">${d(Z(l))}</span><span class="muted small">${la(l.atualizado_em)}</span></div>
                <div class="preview" style="color:var(--danger)">${d(l.motivo_atencao||"")}</div>
              </a>`).join(""):'<div class="empty">Tudo em dia. A IA est\xE1 cuidando das conversas. \u2728</div>'}
          </div>
          <div class="card card-pad">
            <h2>Pr\xF3ximos 7 dias</h2>
            <div class="mini-bars">${e.proximos_dias.map((l,y)=>`
              <div class="b ${y===0?"hoje":""}" title="${l.total} consultas"><span>${l.total}</span><div class="bar" style="height:${l.total/p*60}px"></div><span>${aa[K(l.dia)]}</span></div>`).join("")}
            </div>
          </div>
        </div>
      </div>`,i("#nova").onclick=()=>G({}),P("[data-appt]",a).forEach(l=>l.onclick=()=>G({id:Number(l.dataset.appt)})),i("#ia-rapida-txt").value=s,i("#ia-rapida").addEventListener("submit",l=>{l.preventDefault(),ua(i("#ia-rapida-txt").value),i("#ia-rapida-txt").value=""}),P("[data-ia]",a).forEach(l=>l.onclick=()=>ua(l.dataset.ia))};await n();const t=V(n,400);O={agenda:t,conversa:t,financeiro:t,orcamentos:t,agentes:t}}function za(a){const n=(c,m,p,s="")=>m.length?`<div class="resumo-grupo ${s}"><h3>${c}</h3><ul>${m.map(l=>`<li>${p(l)}</li>`).join("")}</ul></div>`:"",t=(c,m)=>`<a href="#/pacientes/${c}">${m}</a>`,e=[n("\u26A0\uFE0F Aten\xE7\xE3o \xE0 sa\xFAde",a.alertas_de_saude,c=>t(c.paciente_id,`${c.hora} \xB7 <b>${d(c.paciente)}</b>: ${d(c.alertas.join(", "))}`),"alerta"),n("\u{1F4CB} Apresentar or\xE7amento",a.orcamentos_para_apresentar,c=>t(c.paciente_id,`${c.hora} \xB7 <b>${d(c.paciente)}</b>: ${d(c.titulo)}${c.status==="rascunho"?' <span class="muted">(rascunho)</span>':""}`)),n("\u{1F4B3} Em aberto, e vem hoje",a.cobrar_hoje,c=>t(c.paciente_id,`${c.hora} \xB7 <b>${d(c.paciente)}</b>: ${M(c.valor)}`)),n("\u23F3 Ainda sem confirma\xE7\xE3o",a.sem_confirmacao,c=>t(c.paciente_id,`<b>${d(c.paciente)}</b> \xB7 ${d(c.quando)}`)),n("\u{1F382} Aniversariantes de hoje",a.aniversariantes,c=>t(c.paciente_id,`<b>${d(c.paciente)}</b> \xB7 ${c.idade} anos`),"ok")].join(""),o=a.consultas;return`
    <div class="card card-pad" style="margin-bottom:16px">
      <div class="row wrap"><h2>\u2600\uFE0F Resumo do dia</h2><span class="spacer"></span><button type="button" class="chip" data-ia="Monte meu resumo do dia com as prioridades">Pedir \xE0 IA</button></div>
      <p class="muted" style="margin:6px 0 0">${o.total} consulta(s) hoje \xB7 ${o.confirmadas} confirmada(s)${o.primeira?` \xB7 primeira \xE0s ${d(o.primeira)}`:""}${o.restantes?` \xB7 ${o.restantes} ainda por vir`:""}</p>
      <div class="resumo-grupos">
        ${e||'<div class="resumo-grupo ok"><h3>\u2705 Tudo tranquilo</h3><ul><li>Nenhum alerta para os pacientes de hoje.</li></ul></div>'}
        <div class="resumo-grupo"><h3>\u2728 Equipe de IA</h3><ul>
          <li><a href="#/equipe-ia">${a.retornos_na_fila} paciente(s) com retorno atrasado</a></li>
          <li><a href="#/conversas">${a.conversas_pendentes} conversa(s) pedindo a equipe</a></li>
          <li><a href="#/financeiro">${M(a.vencidos_total)} em pagamentos vencidos</a></li>
        </ul></div>
      </div>
    </div>`}async function Fa(){const a=i("#view"),n=async()=>{const[{agentes:e,atividade:o},c]=await Promise.all([f("/agentes"),f("/modelos")]),m=Object.fromEntries(e.map(s=>[s.id,s])),p=s=>{const l=s.metricas;return`<div class="card agente ${s.ativo?"":"pausado"}" style="--c:${s.cor}">
        <div class="agente-topo">
          <div class="agente-avatar">${d(s.nome[0])}</div>
          <div style="flex:1;min-width:0"><div class="agente-funcao">${d(s.funcao)}</div><b style="font-size:16px">${d(s.nome)}</b> <span class="muted small">${s.ativo?"\xB7 ativo":"\xB7 pausado"}</span></div>
          <label class="switch" title="${s.ativo?"Pausar":"Ativar"}"><input type="checkbox" data-ativo="${s.id}" ${s.ativo?"checked":""} aria-label="Ativar ${d(s.funcao)}"><span></span></label>
        </div>
        <p class="agente-desc">${d(s.descricao)}</p>
        <div class="agente-regra">\u{1F4CF} ${d(s.regra)}${s.modelo?`<br>\u{1F4AC} Fora da janela de 24h: modelo <code>${d(s.modelo)}</code>`:""}</div>
        <div class="agente-metricas">
          <div><b>${l.hoje}</b><span>${l.rotulos.hoje}</span></div>
          <div><b>${l.semana}</b><span>${l.rotulos.semana}</span></div>
          <div><b>${l.fila}</b><span>${l.rotulos.fila}</span></div>
        </div>
        <div class="row"><span class="agente-resultado"><b>${d(String(l.resultado.valor))}</b> ${d(l.resultado.rotulo)}</span><span class="spacer"></span>
          ${s.executavel?`<button class="btn sm" data-rodar="${s.id}" ${l.fila?"":"disabled"}>Rodar agora</button>`:'<a class="btn sm" href="#/conversas">Ver conversas</a>'}</div>
      </div>`};a.innerHTML=`
      <div class="page-head"><div><h1>Equipe de IA</h1>
        <p class="muted">Agentes que trabalham sozinhos pelo WhatsApp, de segunda a s\xE1bado, das 8h \xE0s 20h. As respostas dos pacientes chegam em Conversas, onde a recepcionista continua o atendimento.</p></div></div>
      ${k.status.demo?'<div class="ia-demo" style="margin-bottom:14px">\u{1F9EA} Modo demonstra\xE7\xE3o: as mensagens v\xE3o para o simulador de paciente. Para ver e responder, abra o simulador e entre como o paciente.</div>':""}
      <div class="agentes">${e.map(p).join("")}</div>
      <div class="card" style="margin-top:16px">
        <div class="card-head"><h2>Modelos do WhatsApp</h2></div>
        <div class="card-pad muted small" style="padding-bottom:6px">At\xE9 24h depois da \xFAltima mensagem do paciente, os agentes escrevem livremente. Fora dessa janela, o WhatsApp s\xF3 entrega mensagens por <b>modelo aprovado</b>, ent\xE3o eles usam estes. O nome e o texto precisam ser iguais aos cadastrados no WhatsApp Manager da Meta.</div>
        <div class="table-wrap"><table class="table"><thead><tr><th>Modelo</th><th>Categoria</th><th>Usado por</th><th>Texto</th><th></th></tr></thead><tbody>
          ${c.map(s=>`<tr><td><code>${d(s.nome)}</code>${s.personalizado?' <span class="badge">personalizado</span>':""}</td>
            <td><span class="badge ${s.categoria==="Marketing"?"alerta":"ia"}">${d(s.categoria)}</span></td>
            <td class="small">${d(s.usadoPor)}</td>
            <td class="small muted" style="max-width:320px">${d(s.texto.length>90?`${s.texto.slice(0,90)}\u2026`:s.texto)}</td>
            <td style="text-align:right"><button class="btn sm" data-modelo="${s.id}">Ver e editar</button></td></tr>`).join("")}
        </tbody></table></div>
      </div>
      <div class="card" style="margin-top:16px">
        <div class="card-head"><h2>Atividade recente</h2></div>
        ${o.length?`<div class="table-wrap"><table class="table"><thead><tr><th>Quando</th><th>Agente</th><th>Paciente</th><th>O que fez</th><th></th></tr></thead><tbody>
          ${o.map(s=>`<tr><td>${la(s.criado_em)}</td><td><span class="dot" style="background:${m[s.agente]?.cor}"></span>${d(m[s.agente]?.nome||s.agente)}</td>
            <td>${s.patient_id?`<a href="#/pacientes/${s.patient_id}">${d(s.paciente_nome)}</a>`:"\u2014"}</td><td>${d(s.descricao)}</td>
            <td style="text-align:right">${s.conversation_id?`<a class="btn sm ghost" href="#/conversas/${s.conversation_id}">Conversa</a>`:""}</td></tr>`).join("")}
        </tbody></table></div>`:'<div class="empty">Nenhuma a\xE7\xE3o ainda. Use "Rodar agora" em um agente com pacientes na fila.</div>'}
      </div>`,P("[data-ativo]",a).forEach(s=>s.addEventListener("change",async()=>{await f(`/agentes/${s.dataset.ativo}`,{method:"PUT",body:{ativo:s.checked}}).catch(l=>w(l.message,"err")),w(`${m[s.dataset.ativo].funcao}: ${s.checked?"ativado":"pausado"}.`),n()})),P("[data-modelo]",a).forEach(s=>s.onclick=()=>Ya(c.find(l=>l.id===s.dataset.modelo),n)),P("[data-rodar]",a).forEach(s=>s.onclick=async()=>{s.disabled=!0,s.textContent="Enviando\u2026";const l=await f(`/agentes/${s.dataset.rodar}/rodar`,{method:"POST"}).catch(y=>(w(y.message,"err"),null));l&&w(l.enviados?`${m[s.dataset.rodar].nome} contatou ${l.enviados} paciente(s).`:"Ningu\xE9m na fila agora.","ia"),n()})};await n();const t=V(n,500);O={agentes:t,orcamentos:t,financeiro:t,agenda:t,conversa:t}}const T={data:null,modo:"dia",dentistaId:null,ocultos:new Set},F=420,ra=1200,Ba=30,wa=44,B=wa/Ba;async function Wa(){T.data??=k.hoje,T.dentistaId??=k.dentists[0]?.id;const a=i("#view");let n=null;const t=async()=>{const e=T.modo==="semana",o=ta(T.data,-((K(T.data)+6)%7)),c=e?o:T.data,m=e?ta(o,6):T.data,p=(await f(`/appointments?de=${c}&ate=${m}${e?`&dentist_id=${T.dentistaId}`:""}`)).filter(v=>v.status!=="cancelada"),s=(await f(`/appointments?de=${c}&ate=${m}`)).filter(v=>v.status==="cancelada").length,l=e?Array.from({length:7},(v,j)=>({data:ta(o,j),dentista:k.dentists.find(I=>I.id===T.dentistaId)})).map(v=>({...v,titulo:sa(v.data),sub:v.data===k.hoje?"hoje":""})):k.dentists.filter(v=>!T.ocultos.has(v.id)).map(v=>({data:T.data,dentista:v,titulo:v.nome,sub:v.especialidade||""})),y=(ra-F)*B,r=z(k.status.agora?.slice(11,16)||"00:00"),x=e?`${Number(c.slice(8))} ${ia[Number(c.slice(5,7))-1]} \u2013 ${Number(m.slice(8))} ${ia[Number(m.slice(5,7))-1]} ${m.slice(0,4)}`:`${va[K(T.data)]}, ${Number(T.data.slice(8))} de ${ia[Number(T.data.slice(5,7))-1]}`;a.innerHTML=`
      <div class="page-head"><h1>Agenda</h1><span class="spacer"></span><button class="btn primary" id="nova">+ Nova consulta</button></div>
      <div class="agenda-toolbar">
        <button class="btn sm" data-nav-dia="-1">\u25C0</button>
        <button class="btn sm" data-nav-dia="0">Hoje</button>
        <button class="btn sm" data-nav-dia="1">\u25B6</button>
        <span class="agenda-title">${x}</span>
        <input type="date" id="ag-data" value="${T.data}" style="height:30px">
        <div class="seg"><button data-modo="dia" class="${e?"":"on"}">Dia</button><button data-modo="semana" class="${e?"on":""}">Semana</button></div>
        ${e?`<select id="ag-dentista">${k.dentists.map(v=>`<option value="${v.id}" ${v.id===T.dentistaId?"selected":""}>${d(v.nome)}</option>`).join("")}</select>`:k.dentists.map(v=>`<span class="dentist-chip ${T.ocultos.has(v.id)?"off":""}" data-chip="${v.id}"><span class="sw" style="background:${v.cor}"></span>${d(v.nome)}</span>`).join("")}
        <span class="spacer"></span>
        ${s?`<span class="muted small">${s} cancelada(s) oculta(s)</span>`:""}
      </div>
      ${l.length?`
      <div class="cal card" style="grid-template-columns:56px repeat(${l.length}, minmax(150px, 1fr)); --slot:${wa}px">
        <div class="cal-corner"></div>
        ${l.map(v=>`<div class="cal-head ${v.data===k.hoje&&e?"hoje":""}" ${e?"":`style="box-shadow: inset 0 -3px 0 ${v.dentista.cor}"`}>${d(v.titulo)}<small>${d(v.sub)}</small></div>`).join("")}
        <div class="cal-times" style="height:${y}px;position:sticky">
          ${Array.from({length:(ra-F)/60},(v,j)=>`<div class="cal-time" style="position:absolute;top:${j*60*B}px;right:0">${ba(F+j*60)}</div>`).join("")}
        </div>
        ${l.map((v,j)=>{const I=v.dentista?.horarios?.[K(v.data)]||[],S=p.filter($=>$.inicio.slice(0,10)===v.data&&$.dentist_id===v.dentista?.id);return`<div class="cal-col" data-col="${j}" style="height:${y}px">
            ${I.map(([$,g])=>`<div class="cal-work" style="top:${(z($)-F)*B}px;height:${(z(g)-z($))*B}px"></div>`).join("")}
            ${v.data===k.hoje&&r>F&&r<ra?`<div class="cal-now" style="top:${(r-F)*B}px"></div>`:""}
            ${S.map($=>{const g=(z(D($.inicio))-F)*B,h=Math.max((z(D($.fim))-z(D($.inicio)))*B-2,20);return`<div class="appt s-${$.status} ${$.id===n?"flash":""}" data-appt="${$.id}" style="top:${g}px;height:${h}px;--c:${$.dentista_cor}" title="${d(`${D($.inicio)}\u2013${D($.fim)} ${$.paciente_nome} \xB7 ${$.procedimento_nome||""} \xB7 ${ea[$.status]}`)}">
                <div class="tags">${$.origem==="ia"?'<span class="tag">IA</span>':""}${$.status==="confirmada"?'<span class="tag" style="color:var(--ok)">\u2713</span>':""}${$.status==="faltou"?'<span class="tag" style="color:var(--warn)">falta</span>':""}</div>
                <b>${d($.paciente_nome)}</b>
                <div class="meta">${D($.inicio)} \xB7 ${d($.procedimento_nome||"Consulta")}</div>
              </div>`}).join("")}
          </div>`}).join("")}
      </div>`:'<div class="card empty">Selecione ao menos um dentista.</div>'}`,i("#nova").onclick=()=>G({data:T.data,dentist_id:e?T.dentistaId:void 0}),P("[data-nav-dia]",a).forEach(v=>v.onclick=()=>{const j=Number(v.dataset.navDia);T.data=j===0?k.hoje:ta(T.data,j*(e?7:1)),t()}),i("#ag-data").onchange=v=>{v.target.value&&(T.data=v.target.value,t())},P("[data-modo]",a).forEach(v=>v.onclick=()=>{T.modo=v.dataset.modo,t()}),i("#ag-dentista")?.addEventListener("change",v=>{T.dentistaId=Number(v.target.value),t()}),P("[data-chip]",a).forEach(v=>v.onclick=()=>{const j=Number(v.dataset.chip);T.ocultos.has(j)?T.ocultos.delete(j):T.ocultos.add(j),t()}),P(".cal-col",a).forEach(v=>v.addEventListener("click",j=>{const I=j.target.closest("[data-appt]");if(I)return G({id:Number(I.dataset.appt)});const S=l[Number(v.dataset.col)],$=F+Math.floor((j.clientY-v.getBoundingClientRect().top)/B/15)*15;G({data:S.data,hora:ba($),dentist_id:S.dentista.id})}));const _=i(".cal",a);_&&!_.dataset.scrolled&&(_.scrollTop=Math.max(0,((T.data===k.hoje?r-60:480)-F)*B-20))};await t(),O={agenda:async({tipo:e,consulta:o})=>{e==="criada"&&(n=o.id);const c=i(".cal")?.scrollTop;await t(),c!=null&&i(".cal")&&(i(".cal").scrollTop=c)},config:()=>setTimeout(t,200)}}async function G({id:a,data:n,hora:t,dentist_id:e,patient_id:o,procedure_id:c}){const[m,p]=await Promise.all([a?f(`/appointments/${a}`):null,f("/patients")]),s=m||{},l=s.inicio?.slice(0,10)||n||T.data||k.hoje,y=s.inicio?D(s.inicio):t||"",r=s.dentist_id||e||k.dentists[0]?.id,x=s.procedure_id||c||"",_=p.find($=>$.id===(s.patient_id||o)),v=s.inicio?z(D(s.fim))-z(D(s.inicio)):"",j=$=>`${$.nome} \xB7 ${J($.telefone)} #${$.id}`,I=`
    <datalist id="dl-pac">${p.map($=>`<option value="${d(j($))}"></option>`).join("")}</datalist>
    <div class="form-grid">
      <label class="field full">Paciente
        <input name="paciente" list="dl-pac" placeholder="Busque pelo nome ou digite o nome de um paciente novo" value="${_?d(j(_)):""}" autocomplete="off">
      </label>
      <label class="field full hidden" id="f-novo-tel">Telefone do novo paciente
        <input name="novo_telefone" placeholder="(51) 99999-0000">
      </label>
      <label class="field">Dentista
        <select name="dentist_id">${k.dentists.map($=>`<option value="${$.id}" ${$.id===r?"selected":""}>${d($.nome)}</option>`).join("")}</select>
      </label>
      <label class="field">Procedimento
        <select name="procedure_id"><option value="">\u2014</option>${k.procedures.map($=>`<option value="${$.id}" ${$.id===x?"selected":""}>${d($.nome)}</option>`).join("")}</select>
      </label>
      <label class="field">Data<input type="date" name="data" value="${l}"></label>
      <label class="field">Hor\xE1rio<input type="time" name="hora" value="${y}" step="900"></label>
      <div class="full">
        <div class="muted small" style="margin-bottom:6px;font-weight:600">Hor\xE1rios livres no expediente</div>
        <div class="row wrap" id="livres"><span class="muted small">\u2014</span></div>
      </div>
      <label class="field">Dura\xE7\xE3o (min)<input type="number" name="duracao_min" min="10" step="5" value="${v}"></label>
      <label class="field">Valor (R$)<input type="number" name="valor" min="0" step="0.01" value="${s.valor??""}"></label>
      ${a?`<label class="field">Status<select name="status">${Object.entries(ea).map(([$,g])=>`<option value="${$}" ${$===s.status?"selected":""}>${g}</option>`).join("")}</select></label>
      <div class="field">Origem<div style="padding-top:8px">${s.origem==="ia"?'<span class="badge ia">Agendada pela IA</span>':'<span class="badge">Recep\xE7\xE3o</span>'}</div></div>`:""}
      <label class="field full">Observa\xE7\xF5es<textarea name="observacoes" rows="2">${d(s.observacoes||"")}</textarea></label>
    </div>`,S=`
    ${a?`<button class="btn sm" data-st="confirmada">\u2713 Confirmar</button>
      <button class="btn sm" data-st="em_atendimento">Iniciar</button>
      <button class="btn sm" data-st="concluida">Concluir</button>
      <button class="btn sm" data-st="faltou">Faltou</button>
      <button class="btn sm danger" data-st="cancelada">Cancelar consulta</button>
      <a class="btn sm ghost" href="#/pacientes/${s.patient_id}" data-close>Ficha</a>`:""}
    <span class="spacer"></span>
    <button class="btn" data-close>Fechar</button>
    <button class="btn primary" id="salvar">${a?"Salvar":"Agendar"}</button>`;R({title:a?`Consulta de ${d(s.paciente_nome)}`:"Nova consulta",body:I,foot:S,width:680,onMount:({el:$,close:g})=>{const h=L=>i(`[name="${L}"]`,$),E=()=>(h("paciente").value.match(/#(\d+)$/)||[])[1],b=()=>i("#f-novo-tel",$).classList.toggle("hidden",!h("paciente").value.trim()||!!E());h("paciente").addEventListener("input",b);const u=()=>{const L=k.procedures.find(C=>C.id===Number(h("procedure_id").value));L&&(h("duracao_min").value=L.duracao_min,h("valor").value=L.preco),A()},A=async()=>{const L=Number(h("duracao_min").value)||30,C=await f(`/dentists/${h("dentist_id").value}/livres?data=${h("data").value}&duracao=${L}`).catch(()=>[]),W=i("#livres",$);W.innerHTML=C.length?C.map(U=>`<button type="button" class="btn sm ${U===h("hora").value?"primary":""}" data-h="${U}">${U}</button>`).join(""):'<span class="muted small">Sem hor\xE1rios livres no expediente deste dia (encaixes ainda s\xE3o poss\xEDveis).</span>',P("[data-h]",W).forEach(U=>U.onclick=()=>{h("hora").value=U.dataset.h,A()})};h("procedure_id").addEventListener("change",u),["dentist_id","data","duracao_min"].forEach(L=>h(L).addEventListener("change",A)),!a&&c?u():A();const N=async(L={})=>{const C=q($),W={dentist_id:C.dentist_id,procedure_id:C.procedure_id,data:C.data,hora:C.hora,duracao_min:C.duracao_min,valor:C.valor,observacoes:C.observacoes,...a?{status:C.status}:{},...L},U=E();U?W.patient_id=U:a||(W.novo_paciente_nome=C.paciente,W.novo_paciente_telefone=C.novo_telefone);try{a?await f(`/appointments/${a}`,{method:"PUT",body:W}):await f("/appointments",{method:"POST",body:W}),w(a?"Consulta atualizada.":"Consulta agendada."),g()}catch(Ia){w(Ia.message,"err")}};i("#salvar",$).onclick=()=>N(),P("[data-st]",$).forEach(L=>L.onclick=()=>{L.dataset.st==="cancelada"&&!confirm("Cancelar esta consulta?")||N({status:L.dataset.st})})}})}async function Va(a){const n=i("#view");n.innerHTML=`
    <div class="page-head"><div><h1>Conversas</h1><p class="muted">A IA responde em tempo real. Assuma qualquer conversa quando quiser.</p></div>
      <span class="spacer"></span><a class="btn" href="chat.html" target="_blank">Simular paciente \u2197</a></div>
    <div class="card chat-layout">
      <div class="conv-list" id="conv-list"></div>
      <div class="thread" id="thread"><div class="empty" style="margin:auto">Selecione uma conversa.</div></div>
    </div>`;let t=await f("/conversations");const e={id:a?Number(a):null,conv:null},o=new Set,c=()=>{i("#conv-list").innerHTML=t.length?t.map(r=>`
      <a class="conv-item ${r.id===e.id?"active":""}" href="#/conversas/${r.id}">
        <div class="top">
          <span class="name">${d(Z(r))}</span>
          ${r.nao_lidas&&r.id!==e.id?`<span class="badge count">${r.nao_lidas}</span>`:""}
          <span class="muted small">${la(r.atualizado_em)}</span>
        </div>
        <div class="preview">${o.has(r.id)?'<i style="color:var(--primary)">IA digitando\u2026</i>':d(r.ultima_mensagem||"")}</div>
        <div class="row" style="margin-top:6px;gap:4px">
          <span class="badge ${r.modo}">${r.modo==="ia"?"\u{1F916} IA":"\u{1F464} Equipe"}</span>
          ${r.precisa_atencao?'<span class="badge alerta">Aten\xE7\xE3o</span>':""}
          <span class="badge">${r.canal==="whatsapp"?"WhatsApp":"Simulador"}</span>
        </div>
      </a>`).join(""):'<div class="empty">Nenhuma conversa ainda. Abra o simulador e mande uma mensagem como paciente.</div>'},m=r=>{const x={paciente:"",ia:"\u{1F916} IA",atendente:"\u{1F464} Equipe",lembrete:"\u23F0 Clara \xB7 confirma\xE7\xE3o",retorno:"\u{1F501} L\xE9o \xB7 convite de retorno",cobranca:"\u{1F4B3} Duda \xB7 lembrete de pagamento",orcamento:"\u{1F4CB} Or\xE7amento",sistema:""}[r.autor]??"",_=r.extras,v=_?.modelo?`<div class="tpl-tag">Modelo do WhatsApp \xB7 ${d(_.modelo)}</div>`:"",j=_?.rodape?`<div class="tpl-rodape">${d(_.rodape)}</div>`:"",I=_?.botoes?.length?`<div class="tpl-botoes">${_.botoes.map(S=>`<span>${S.tipo==="link"?"\u2197":"\u21A9"} ${d(S.texto)}</span>`).join("")}</div>`:"";return`<div class="bubble b-${r.autor}" data-msg="${r.id}">${x?`<div class="who">${x}</div>`:""}${v}${Oa(d(r.texto))}${j}${I}<div class="when">${ga(r.criado_em)}</div></div>`},p=()=>{const r=i("#thread-body");r&&(r.scrollTop=r.scrollHeight)},s=()=>{const r=e.conv;i("#thread-head").innerHTML=`
      <div style="min-width:0"><h2>${d(Z(r))}</h2><div class="muted small">${Z(r)!==J(r.telefone)?`${J(r.telefone)} \xB7 `:""}${r.canal==="whatsapp"?"WhatsApp":"Simulador"}</div></div>
      <span class="badge ${r.modo}">${r.modo==="ia"?"\u{1F916} IA respondendo":"\u{1F464} Equipe no controle"}</span>
      <span class="spacer"></span>
      ${r.patient_id?`<a class="btn sm" href="#/pacientes/${r.patient_id}">Ficha do paciente</a>`:""}
      ${r.modo==="ia"?'<button class="btn sm" id="assumir">Assumir conversa</button>':'<button class="btn sm primary" id="devolver">Devolver para a IA</button>'}`,i("#alerta").innerHTML=r.precisa_atencao?`<div class="alert-bar">\u26A0\uFE0F ${d(r.motivo_atencao||"Precisa de aten\xE7\xE3o")}<span class="spacer"></span><button class="btn sm" id="resolver">Assumir e resolver</button></div>`:"";const x=r.canal==="whatsapp"&&!(r.ultima_do_paciente&&Date.now()-Date.parse(r.ultima_do_paciente)<23.5*36e5);i("#composer-hint").textContent=x?"\u26A0\uFE0F Janela de 24h do WhatsApp fechada: o paciente s\xF3 recebe mensagens da cl\xEDnica por modelo aprovado. O que voc\xEA digitar aqui s\xF3 chega depois que ele responder (os agentes da Equipe de IA usam os modelos).":r.modo==="ia"?"A IA est\xE1 respondendo esta conversa. Se voc\xEA enviar uma mensagem, a equipe assume e a IA para de responder.":"Voc\xEA est\xE1 no controle. A IA n\xE3o responde at\xE9 voc\xEA devolver a conversa.";const _=v=>f(`/conversations/${r.id}/modo`,{method:"POST",body:{modo:v}}).catch(j=>w(j.message,"err"));i("#assumir")?.addEventListener("click",()=>_("humano")),i("#resolver")?.addEventListener("click",()=>_("humano")),i("#devolver")?.addEventListener("click",()=>_("ia"))},l=async r=>{e.id=r,e.conv=await f(`/conversations/${r}`),i("#thread").innerHTML=`
      <div class="thread-head" id="thread-head"></div>
      <div id="alerta"></div>
      <div class="thread-body" id="thread-body">${e.conv.mensagens.map(m).join("")}<div class="typing hidden" id="typing">IA digitando\u2026</div></div>
      <div class="composer"><textarea id="msg" rows="1" placeholder="Escreva uma mensagem para o paciente\u2026"></textarea><button class="btn primary" id="enviar">Enviar</button></div>
      <div class="composer-hint" id="composer-hint"></div>`,s(),i("#typing").classList.toggle("hidden",!o.has(r)),p();const x=async()=>{const _=i("#msg").value.trim();_&&(i("#msg").value="",await f(`/conversations/${r}/mensagens`,{method:"POST",body:{texto:_}}).catch(v=>w(v.message,"err")))};i("#enviar").onclick=x,i("#msg").addEventListener("keydown",_=>{_.key==="Enter"&&!_.shiftKey&&(_.preventDefault(),x())}),e.conv.nao_lidas&&f(`/conversations/${r}/lida`,{method:"POST"}),c()};c(),e.id&&await l(e.id);const y=()=>e.id?i("#thread-body"):null;O={conversa:r=>{const x=t.findIndex(_=>_.id===r.id);x>=0?t[x]=r:t.unshift(r),t.sort((_,v)=>v.atualizado_em.localeCompare(_.atualizado_em)),c(),r.id===e.id&&(Object.assign(e.conv,r),s())},mensagem:({message:r,draft_id:x,conversa:_})=>{if(O.conversa(_),r.conversation_id!==e.id)return;const v=y();x&&i(`[data-draft="${x}"]`,v)?.remove(),i(`[data-msg="${r.id}"]`,v)||i("#typing",v).insertAdjacentHTML("beforebegin",m(r)),r.autor==="paciente"&&f(`/conversations/${e.id}/lida`,{method:"POST"}),p()},ia_delta:({conversation_id:r,draft_id:x,delta:_})=>{if(r!==e.id)return;const v=y();let j=i(`[data-draft="${x}"]`,v);j||(i("#typing",v).insertAdjacentHTML("beforebegin",`<div class="bubble b-ia b-draft" data-draft="${x}"><div class="who">\u{1F916} IA</div><span class="txt"></span></div>`),j=i(`[data-draft="${x}"]`,v)),i(".txt",j).textContent+=_,p()},ia_rascunho_descartado:({conversation_id:r,draft_id:x})=>{r===e.id&&i(`[data-draft="${x}"]`,y())?.remove()},ia_digitando:({conversation_id:r,ativo:x})=>{x?o.add(r):o.delete(r),c(),r===e.id&&(i("#typing")?.classList.toggle("hidden",!x),p())}}}const pa={higido:{nome:"H\xEDgido",cor:"#cbd5e1",fundo:"#fff",ico:""},carie:{nome:"C\xE1rie",cor:"#dc2626",fundo:"#fee2e2",ico:"\u25CF"},restaurado:{nome:"Restaurado",cor:"#2563eb",fundo:"#dbeafe",ico:"\u25A0"},canal:{nome:"Canal",cor:"#7c3aed",fundo:"#ede9fe",ico:"\u2502"},coroa:{nome:"Coroa/pr\xF3tese",cor:"#d97706",fundo:"#fef3c7",ico:"\u265B"},implante:{nome:"Implante",cor:"#475569",fundo:"#e2e8f0",ico:"\u22A5"},extracao:{nome:"Extra\xE7\xE3o indicada",cor:"#dc2626",fundo:"#fff",ico:"\u2715"},ausente:{nome:"Ausente",cor:"#e2e8f0",fundo:"#f8fafc",ico:"\u2014"}},Ga=[[[18,17,16,15,14,13,12,11],[21,22,23,24,25,26,27,28]],[[48,47,46,45,44,43,42,41],[31,32,33,34,35,36,37,38]]],xa=[["hipertensao","Hipertens\xE3o"],["diabetes","Diabetes"],["cardiopatia","Problema card\xEDaco"],["anticoagulante","Usa anticoagulante"],["coagulacao","Problema de coagula\xE7\xE3o"],["gestante","Gestante"],["fumante","Fumante"],["bruxismo","Bruxismo"]];async function Ja(a){if(a)return Qa(Number(a));const n=i("#view");n.innerHTML=`
    <div class="page-head"><h1>Pacientes</h1><span class="spacer"></span>
      <input id="busca" placeholder="Buscar por nome, telefone ou CPF" style="width:300px">
      <button class="btn primary" id="novo">+ Novo paciente</button></div>
    <div class="card table-wrap" id="lista"></div>`;const t=async()=>{const e=await f(`/patients?q=${encodeURIComponent(i("#busca").value)}`);i("#lista").innerHTML=e.length?`<table class="table"><thead><tr><th>Nome</th><th>Telefone</th><th>Conv\xEAnio</th><th>Idade</th><th>\xDAltima consulta</th><th>Pr\xF3xima consulta</th></tr></thead><tbody>
      ${e.map(o=>`<tr class="click" data-id="${o.id}"><td><b>${d(o.nome)}</b></td><td>${J(o.telefone)}</td><td>${d(o.convenio||"Particular")}</td><td>${ha(o.data_nascimento)??"\u2014"}</td>
        <td>${o.ultima_consulta?X(o.ultima_consulta):"\u2014"}</td><td>${o.proxima_consulta?`${sa(o.proxima_consulta)} ${D(o.proxima_consulta)}`:"\u2014"}</td></tr>`).join("")}
      </tbody></table>`:'<div class="empty">Nenhum paciente encontrado.</div>',P("[data-id]",n).forEach(o=>o.onclick=()=>location.hash=`#/pacientes/${o.dataset.id}`)};i("#busca").addEventListener("input",V(t,250)),i("#novo").onclick=()=>_a({},e=>location.hash=`#/pacientes/${e.id}`),await t(),O={pacientes:t,agenda:V(t,500)}}function _a(a,n){R({title:a.id?"Editar dados":"Novo paciente",body:`<div class="form-grid">
      <label class="field full">Nome completo<input name="nome" value="${d(a.nome||"")}"></label>
      <label class="field">Telefone (WhatsApp)<input name="telefone" value="${d(J(a.telefone))}" placeholder="(51) 99999-0000"></label>
      <label class="field">E-mail<input name="email" type="email" value="${d(a.email||"")}"></label>
      <label class="field">CPF<input name="cpf" value="${d(a.cpf||"")}"></label>
      <label class="field">Data de nascimento<input name="data_nascimento" type="date" value="${d(a.data_nascimento||"")}"></label>
      <label class="field">Conv\xEAnio<input name="convenio" value="${d(a.convenio||"")}" placeholder="Particular"></label>
      <label class="field full">Observa\xE7\xF5es<textarea name="observacoes" rows="2">${d(a.observacoes||"")}</textarea></label>
      <label class="check full"><input type="checkbox" name="consentimento_lgpd" ${a.consentimento_lgpd?"checked":""}> Paciente autorizou o uso dos dados para atendimento e contato (LGPD)</label>
    </div>`,foot:'<span class="spacer"></span><button class="btn" data-close>Cancelar</button><button class="btn primary" id="salvar">Salvar</button>',onMount:({el:t,close:e})=>{i("#salvar",t).onclick=async()=>{try{const o=await f(a.id?`/patients/${a.id}`:"/patients",{method:a.id?"PUT":"POST",body:q(t)});w("Paciente salvo."),e(),n?.(o)}catch(o){w(o.message,"err")}}}})}async function Qa(a,n="odontograma"){const t=i("#view");let e=await f(`/patients/${a}`),o=n,c="abrir",m=null;const p=()=>{const g=ha(e.data_nascimento),h=[...xa.filter(([E])=>e.anamnese[E]).map(([,E])=>E),e.anamnese.alergia&&`Alergia: ${e.anamnese.alergia}`].filter(Boolean);t.innerHTML=`
      <div class="page-head">
        <a href="#/pacientes" class="btn sm ghost">\u2190 Pacientes</a>
      </div>
      <div class="card card-pad" style="margin-bottom:16px">
        <div class="row wrap" style="gap:14px">
          <div style="width:52px;height:52px;border-radius:50%;background:var(--primary-50);color:var(--primary);display:grid;place-items:center;font-weight:800;font-size:20px">${d(e.nome[0])}</div>
          <div style="min-width:0">
            <h1>${d(e.nome)}</h1>
            <div class="muted">${J(e.telefone)||"sem telefone"}${g!=null?` \xB7 ${g} anos`:""} \xB7 ${d(e.convenio||"Particular")}${e.consentimento_lgpd?' \xB7 <span style="color:var(--ok)">LGPD \u2713</span>':' \xB7 <span style="color:var(--warn)">sem consentimento LGPD</span>'}</div>
            ${h.length?`<div class="row wrap" style="margin-top:6px;gap:4px">${h.map(E=>`<span class="badge alerta">\u26A0 ${d(E)}</span>`).join("")}</div>`:""}
          </div>
          <span class="spacer"></span>
          ${e.conversas[0]?`<a class="btn" href="#/conversas/${e.conversas[0].id}">Conversa</a>`:""}
          <button class="btn" id="editar">Editar dados</button>
          <button class="btn primary" id="nova-consulta">+ Agendar</button>
        </div>
      </div>
      <div class="card">
        <div class="tabs">${[["odontograma","Odontograma"],["imagens",`Imagens (${e.imagens.length})`],["anamnese","Anamnese"],["orcamentos",`Or\xE7amentos (${e.orcamentos.length})`],["consultas",`Consultas (${e.consultas.length})`],["financeiro","Financeiro"]].map(([E,b])=>`<button data-aba="${E}" class="${o===E?"on":""}">${b}</button>`).join("")}</div>
        <div class="card-pad" id="aba"></div>
      </div>`,i("#editar").onclick=()=>_a(e,async()=>{e=await f(`/patients/${a}`),p()}),i("#nova-consulta").onclick=()=>G({patient_id:e.id}),P("[data-aba]",t).forEach(E=>E.onclick=()=>{o=E.dataset.aba,p()}),{odontograma:l,imagens:j,anamnese:x,orcamentos:I,consultas:_,financeiro:S}[o]()},s=g=>e.imagens.filter(h=>String(h.dente||"").split(/[\s,;/]+/).includes(String(g))),l=()=>{const g=i("#aba"),h=e.odontograma_notas||{},E=(b,u)=>{const A=pa[e.odontograma[b]||"higido"],N=!!h[b],L=s(b).length,C=[`${b} \u2014 ${A.nome}`,N?`Obs.: ${h[b]}`:"",L?`${L} imagem(ns)`:""].filter(Boolean).join(`
`);return`<button class="dente ${u?"inferior":""} ${String(b)===m?"aberto":""}" data-dente="${b}" title="${d(C)}" style="border-color:${A.cor};background:${A.fundo};${e.odontograma[b]==="ausente"?"border-style:dashed;opacity:.6":""}">
        <span class="ico" style="color:${A.cor}">${A.ico}</span>${b}
        ${N||L?`<span class="dente-marcas">${N?'<i class="m-nota" aria-label="tem observa\xE7\xE3o"></i>':""}${L?'<i class="m-img" aria-label="tem imagem"></i>':""}</span>`:""}</button>`};g.innerHTML=`
      <div class="legenda" style="margin-bottom:14px">
        <button data-pincel="abrir" class="${c==="abrir"?"on":""}">\u{1F50D} Abrir dente</button>
        ${Object.entries(pa).map(([b,u])=>`<button data-pincel="${b}" class="${b===c?"on":""}"><span class="sw" style="border-color:${u.cor};background:${u.fundo}"></span>${u.nome}</button>`).join("")}</div>
      <p class="muted small" style="text-align:center;margin:0 0 10px">${c==="abrir"?"Clique num dente para ver e editar a situa\xE7\xE3o, a observa\xE7\xE3o e as imagens dele.":'Clique nos dentes para marcar. Salva automaticamente. Para observa\xE7\xF5es e imagens, use "Abrir dente".'}
        <span class="legenda-marcas"><i class="m-nota"></i> observa\xE7\xE3o \xB7 <i class="m-img"></i> imagem</span></p>
      <div class="odonto">
        ${Ga.map(([b,u],A)=>`<div class="arcada"><div class="quadrante">${b.map(N=>E(N,A===1)).join("")}</div><div class="quadrante">${u.map(N=>E(N,A===1)).join("")}</div></div>`).join('<div style="height:1px;width:100%;background:var(--border)"></div>')}
      </div>
      <div id="painel-dente"></div>`,P("[data-pincel]",g).forEach(b=>b.onclick=()=>{c=b.dataset.pincel,l()}),P("[data-dente]",g).forEach(b=>b.onclick=async()=>{const u=b.dataset.dente;if(c==="abrir")return m=m===u?null:u,l();e.odontograma[u]===c||c==="higido"?delete e.odontograma[u]:e.odontograma[u]=c,l(),await f(`/patients/${e.id}`,{method:"PUT",body:{odontograma:e.odontograma}}).catch(A=>w(A.message,"err"))}),m?r(m):y()},y=()=>{const g=i("#painel-dente"),h=e.odontograma_notas||{},E=Object.entries(h).filter(([b,u])=>b!=="geral"&&u).sort(([b],[u])=>Number(b)-Number(u));g.innerHTML=`
      <div class="painel-dente">
        <h3>Observa\xE7\xF5es gerais</h3>
        <textarea id="nota-geral" rows="3" style="width:100%;margin-top:8px" placeholder="Ex.: Gengiva inflamada na regi\xE3o inferior; bruxismo, indicar placa">${d(h.geral||"")}</textarea>
        <div class="row" style="margin-top:8px"><span class="spacer"></span><button class="btn primary sm" id="salvar-geral">Salvar observa\xE7\xF5es</button></div>
        <div style="margin-top:14px"><b class="small">Observa\xE7\xF5es por dente (${E.length})</b>
          ${E.length?`<ul class="lista-notas">${E.map(([b,u])=>`<li><button class="link-dente" data-abrir-dente="${d(b)}">Dente ${d(b)}</button> ${d(u)}</li>`).join("")}</ul>`:'<p class="muted small" style="margin:4px 0 0">Nenhuma ainda. Clique num dente para anotar algo sobre ele.</p>'}
        </div>
      </div>`,i("#salvar-geral",g).onclick=async()=>{const b=i("#nota-geral",g).value.trim(),u={...e.odontograma_notas||{}};b?u.geral=b:delete u.geral;try{await f(`/patients/${e.id}`,{method:"PUT",body:{odontograma_notas:u}}),e.odontograma_notas=u,w("Observa\xE7\xF5es salvas.")}catch(A){w(A.message,"err")}},P("[data-abrir-dente]",g).forEach(b=>b.onclick=()=>{c="abrir",m=b.dataset.abrirDente,l()})},r=g=>{const h=i("#painel-dente"),E=e.odontograma_notas||{},b=s(g);h.innerHTML=`
      <div class="painel-dente">
        <div class="row wrap"><h3>Dente ${d(g)}</h3><span class="spacer"></span><button class="btn sm ghost" id="fechar-dente" aria-label="Fechar">\u2715</button></div>
        <div class="form-grid" style="margin-top:10px">
          <label class="field">Situa\xE7\xE3o<select id="dente-status">${Object.entries(pa).map(([u,A])=>`<option value="${u}" ${(e.odontograma[g]||"higido")===u?"selected":""}>${A.nome}</option>`).join("")}</select></label>
          <div></div>
          <label class="field full">Observa\xE7\xE3o<textarea id="dente-nota" rows="3" placeholder="Ex.: Restaura\xE7\xE3o antiga com infiltra\xE7\xE3o na face distal; acompanhar">${d(E[g]||"")}</textarea></label>
        </div>
        <div class="row" style="margin-top:8px"><span class="muted small" id="dente-salvo"></span><span class="spacer"></span><button class="btn primary sm" id="salvar-dente">Salvar dente</button></div>
        <div class="row wrap" style="margin:16px 0 8px"><b class="small">Imagens deste dente (${b.length})</b><span class="spacer"></span>
          <label class="btn sm" style="cursor:pointer">+ Adicionar imagem<input type="file" id="dente-arquivos" accept="image/*" multiple hidden></label></div>
        ${b.length?`<div class="galeria">${b.map(u=>`
          <button class="img-card" data-img-dente="${u.id}">
            <img src="/api/imagens/${u.id}/miniatura" alt="${d(H[u.tipo]||u.tipo)}" loading="lazy">
            <span class="img-info"><b>${d(H[u.tipo]||u.tipo)}</b><br><span class="muted">${X(u.data)}${u.descricao?` \xB7 ${d(u.descricao)}`:""}</span></span>
          </button>`).join("")}</div>`:'<p class="muted small" style="margin:0">Nenhuma imagem ligada a este dente.</p>'}
      </div>`,i("#fechar-dente",h).onclick=()=>{m=null,l()},i("#salvar-dente",h).onclick=async()=>{const u=i("#dente-status",h).value,A=i("#dente-nota",h).value.trim();u==="higido"?delete e.odontograma[g]:e.odontograma[g]=u;const N={...e.odontograma_notas||{}};A?N[g]=A:delete N[g];try{await f(`/patients/${e.id}`,{method:"PUT",body:{odontograma:e.odontograma,odontograma_notas:N}}),e.odontograma_notas=N,w(`Dente ${g} salvo.`),l()}catch(L){w(L.message,"err")}},i("#dente-arquivos",h).addEventListener("change",u=>{ma(e,[...u.target.files],{dente:g}),u.target.value=""}),P("[data-img-dente]",h).forEach(u=>u.onclick=()=>ka(b,b.findIndex(A=>A.id===Number(u.dataset.imgDente))))},x=()=>{const g=i("#aba"),h=e.anamnese;g.innerHTML=`
      <div class="grid grid-2">
        <div><h3 style="margin-bottom:10px">Condi\xE7\xF5es de sa\xFAde</h3>
          <div class="grid" style="gap:8px">${xa.map(([E,b])=>`<label class="check"><input type="checkbox" name="${E}" ${h[E]?"checked":""}> ${b}</label>`).join("")}</div>
        </div>
        <div class="grid" style="gap:12px;align-content:start">
          <label class="field">Alergias<input name="alergia" value="${d(h.alergia||"")}" placeholder="Ex.: dipirona, l\xE1tex"></label>
          <label class="field">Medicamentos em uso<input name="medicamentos" value="${d(h.medicamentos||"")}"></label>
          <label class="field">Queixa principal<input name="queixa" value="${d(h.queixa||"")}"></label>
          <label class="field">Outras observa\xE7\xF5es cl\xEDnicas<textarea name="obs" rows="3">${d(h.obs||"")}</textarea></label>
        </div>
      </div>
      <div class="row" style="margin-top:14px"><span class="spacer"></span><button class="btn primary" id="salvar-anamnese">Salvar anamnese</button></div>`,i("#salvar-anamnese").onclick=async()=>{const E=q(g);e.anamnese=Object.fromEntries(Object.entries(E).filter(([,b])=>b!==!1&&b!=="")),await f(`/patients/${e.id}`,{method:"PUT",body:{anamnese:e.anamnese}}).then(()=>{w("Anamnese salva."),p()}).catch(b=>w(b.message,"err"))}},_=()=>{i("#aba").innerHTML=e.consultas.length?`<div class="table-wrap"><table class="table"><thead><tr><th>Data</th><th>Procedimento</th><th>Dentista</th><th>Valor</th><th>Status</th></tr></thead><tbody>
      ${e.consultas.map(g=>`<tr class="click" data-appt="${g.id}"><td>${sa(g.inicio)} ${g.inicio.slice(0,4)} \xB7 ${D(g.inicio)}</td><td>${d(g.procedimento_nome||"\u2014")} ${g.origem==="ia"?'<span class="badge ia">IA</span>':""}</td>
        <td><span class="dot" style="background:${g.dentista_cor}"></span>${d(g.dentista_nome)}</td><td>${g.valor?M(g.valor):"\u2014"}</td><td><span class="st st-${g.status}">${ea[g.status]}</span></td></tr>`).join("")}
      </tbody></table></div>`:'<div class="empty">Nenhuma consulta.</div>',P("[data-appt]",i("#aba")).forEach(g=>g.onclick=()=>G({id:Number(g.dataset.appt)}))};let v="";const j=()=>{const g=i("#aba"),h=v?e.imagens.filter(u=>u.tipo===v):e.imagens,E=u=>e.imagens.filter(A=>A.tipo===u).length;g.innerHTML=`
      <div class="row wrap" style="margin-bottom:12px;gap:6px">
        <div class="seg">${[["",`Todas (${e.imagens.length})`],...Object.entries(H).filter(([u])=>E(u)).map(([u,A])=>[u,`${A} (${E(u)})`])].map(([u,A])=>`<button data-filtro="${u}" class="${v===u?"on":""}">${d(A)}</button>`).join("")}</div>
        <span class="spacer"></span>
        <label class="btn primary sm" style="cursor:pointer">+ Adicionar imagens<input type="file" id="img-arquivos" accept="image/*" multiple hidden></label>
      </div>
      <div class="soltar" id="img-soltar">
        ${h.length?`<div class="galeria">${h.map(u=>`
          <button class="img-card" data-img="${u.id}" title="${d(u.descricao||H[u.tipo])}">
            <img src="/api/imagens/${u.id}/miniatura" alt="${d(`${H[u.tipo]}${u.dente?`, dente ${u.dente}`:""}`)}" loading="lazy">
            <span class="img-info"><b>${d(H[u.tipo]||u.tipo)}</b>${u.dente?` \xB7 dente ${d(u.dente)}`:""}<br><span class="muted">${X(u.data)}${u.descricao?` \xB7 ${d(u.descricao)}`:""}</span></span>
          </button>`).join("")}</div>`:`<div class="empty">${e.imagens.length?"Nenhuma imagem deste tipo.":'Nenhuma imagem ainda. Arraste fotos ou raio-X para c\xE1, ou use "Adicionar imagens".'}</div>`}
      </div>`,P("[data-filtro]",g).forEach(u=>u.onclick=()=>{v=u.dataset.filtro,j()}),P("[data-img]",g).forEach(u=>u.onclick=()=>ka(h,h.findIndex(A=>A.id===Number(u.dataset.img)))),i("#img-arquivos",g).addEventListener("change",u=>{ma(e,[...u.target.files]),u.target.value=""});const b=i("#img-soltar",g);b.addEventListener("dragover",u=>{u.preventDefault(),b.classList.add("arrastando")}),b.addEventListener("dragleave",()=>b.classList.remove("arrastando")),b.addEventListener("drop",u=>{u.preventDefault(),b.classList.remove("arrastando");const A=[...u.dataTransfer.files].filter(N=>N.type.startsWith("image/"));A.length?ma(e,A):w("Solte arquivos de imagem (JPG, PNG\u2026).","err")})},I=()=>{const g=i("#aba");g.innerHTML=`
      <div class="row wrap" style="margin-bottom:12px"><span class="muted">Monte o plano em etapas, envie pelo WhatsApp e o paciente aprova pelo celular. As parcelas entram sozinhas no Financeiro.</span>
        <span class="spacer"></span><button class="btn primary sm" id="novo-orc">+ Novo or\xE7amento</button></div>
      ${e.orcamentos.length?e.orcamentos.map(ee).join(""):'<div class="empty">Nenhum or\xE7amento ainda.</div>'}`,i("#novo-orc").onclick=()=>Ea({patient_id:e.id}),P("[data-agendar-proc]",g).forEach(h=>h.onclick=()=>G({patient_id:e.id,procedure_id:Number(h.dataset.agendarProc)})),P("[data-orc]",g).forEach(h=>h.onclick=async()=>{const E=e.orcamentos.find(u=>u.id===Number(h.dataset.id)),b=h.dataset.orc;try{if(b==="editar")return Ea({patient_id:e.id,orcamento:E});if(b==="copiar")return await navigator.clipboard.writeText(new URL(`orcamento.html?t=${E.token}`,document.baseURI).href),w("Link copiado.");if(b==="enviar")return h.disabled=!0,await f(`/orcamentos/${E.id}/enviar`,{method:"POST"}),w(`Or\xE7amento enviado para ${e.nome.split(" ")[0]} pelo ${k.status.whatsapp?"WhatsApp":"simulador"}.`,"ia");(b==="aprovado"||b==="recusado")&&confirm(b==="aprovado"?"Marcar como aprovado? As parcelas ser\xE3o lan\xE7adas no Financeiro.":"Marcar como recusado?")&&(await f(`/orcamentos/${E.id}/status`,{method:"POST",body:{status:b}}),w(b==="aprovado"?"Or\xE7amento aprovado e parcelas lan\xE7adas.":"Or\xE7amento marcado como recusado."))}catch(u){w(u.message,"err"),h.disabled=!1}})},S=()=>{const g=e.pagamentos.filter(h=>h.status==="pendente").reduce((h,E)=>h+E.valor,0);i("#aba").innerHTML=`<div class="row" style="margin-bottom:12px"><span>Em aberto: <b style="color:${g?"var(--warn)":"inherit"}">${M(g)}</b></span><span class="spacer"></span><button class="btn sm" id="novo-lanc">+ Lan\xE7amento</button></div>
      ${Aa(e.pagamentos,!1)}`,ja(i("#aba"),e.pagamentos),i("#novo-lanc").onclick=()=>Pa({patient_id:e.id,nome:e.nome})};p();const $=V(async()=>{e=await f(`/patients/${a}`),p()},300);O={agenda:$,financeiro:$,orcamentos:$,imagens:$}}const H={"raio-x":"Raio-X","foto-intraoral":"Foto intraoral","foto-extraoral":"Foto do sorriso/rosto",documento:"Documento/exame",outro:"Outro"},Ka=a=>new Promise((n,t)=>{const e=new FileReader;e.onload=()=>n(String(e.result).split(",")[1]),e.onerror=()=>t(e.error),e.readAsDataURL(a)});async function Xa(a){let n;try{n=await createImageBitmap(a,{imageOrientation:"from-image"})}catch{throw new Error(`N\xE3o consegui abrir "${a.name}". Use JPG ou PNG (fotos HEIC do iPhone: exporte como JPG).`)}const t=async(c,m)=>{const p=Math.min(1,c/Math.max(n.width,n.height)),s=document.createElement("canvas");s.width=Math.round(n.width*p),s.height=Math.round(n.height*p);const l=s.getContext("2d");l.fillStyle="#fff",l.fillRect(0,0,s.width,s.height),l.drawImage(n,0,0,s.width,s.height);const y=await new Promise(r=>s.toBlob(r,"image/jpeg",m));return{base64:await Ka(y),largura:s.width,altura:s.height}},e=await t(1800,.86),o=await t(360,.72);return n.close?.(),{mime:"image/jpeg",base64:e.base64,largura:e.largura,altura:e.altura,miniatura_base64:o.base64}}function ma(a,n,{dente:t=""}={}){if(!n.length)return;const e=n.map(o=>URL.createObjectURL(o));R({title:`Adicionar ${n.length===1?"imagem":`${n.length} imagens`} \xB7 ${d(a.nome)}`,width:640,body:`
      <div class="galeria" style="margin-bottom:14px">${e.map(o=>`<div class="img-card estatica"><img src="${o}" alt="Pr\xE9via"></div>`).join("")}</div>
      <div class="form-grid">
        <label class="field">Tipo<select name="tipo">${Object.entries(H).map(([o,c])=>`<option value="${o}" ${t&&o==="raio-x"?"selected":""}>${c}</option>`).join("")}</select></label>
        <label class="field">Data do exame ou da foto<input type="date" name="data" value="${k.hoje}"></label>
        <label class="field">Dente (opcional)<input name="dente" placeholder="Ex.: 36" value="${d(t)}"></label>
        <label class="field">Descri\xE7\xE3o (opcional)<input name="descricao" placeholder="Ex.: Periapical antes do canal"></label>
      </div>
      <p class="muted small" style="margin:12px 0 0">As imagens s\xE3o reduzidas neste aparelho antes de salvar (sem perder a nitidez necess\xE1ria) e ficam na ficha do paciente.</p>`,foot:'<span class="spacer"></span><button class="btn" data-close>Cancelar</button><button class="btn primary" id="enviar-imgs">Salvar</button>',onMount:({el:o,close:c})=>{const m=i("#enviar-imgs",o),p=()=>{e.forEach(s=>URL.revokeObjectURL(s)),c()};P("[data-close]",o).forEach(s=>s.addEventListener("click",()=>e.forEach(l=>URL.revokeObjectURL(l)))),m.onclick=async()=>{const s=q(o);m.disabled=!0;let l=0;for(const[y,r]of n.entries()){m.textContent=`Salvando ${y+1} de ${n.length}\u2026`;try{const x=await Xa(r);await f(`/patients/${a.id}/imagens`,{method:"POST",body:{...s,...x}}),l++}catch(x){w(x.message,"err")}}l&&w(l===1?"Imagem adicionada \xE0 ficha.":`${l} imagens adicionadas \xE0 ficha.`),p()}}})}function ka(a,n){let t=n;return R({title:"Imagem",width:980,body:'<div id="visor"></div>',onMount:({el:o,close:c})=>{const m=()=>{const s=a[t];i(".modal-head h2",o).textContent=`${H[s.tipo]||s.tipo}${s.dente?` \xB7 dente ${s.dente}`:""} \xB7 ${X(s.data)}`,i("#visor",o).innerHTML=`
          <div class="visor-img">
            ${a.length>1?'<button class="btn visor-nav" data-nav="-1" aria-label="Imagem anterior">\u2039</button>':""}
            <a href="/api/imagens/${s.id}/arquivo" target="_blank" rel="noopener" title="Abrir em tamanho original">
              <img src="/api/imagens/${s.id}/arquivo" alt="${d(s.descricao||H[s.tipo])}"></a>
            ${a.length>1?'<button class="btn visor-nav direita" data-nav="1" aria-label="Pr\xF3xima imagem">\u203A</button>':""}
          </div>
          <div class="muted small" style="text-align:center;margin:6px 0 12px">${t+1} de ${a.length} \xB7 ${s.largura}\xD7${s.altura} px \xB7 ${Math.round(s.tamanho/1024)} KB \xB7 clique na imagem para abrir em tamanho original</div>
          <div class="form-grid" id="dados-img">
            <label class="field">Tipo<select name="tipo">${Object.entries(H).map(([l,y])=>`<option value="${l}" ${l===s.tipo?"selected":""}>${y}</option>`).join("")}</select></label>
            <label class="field">Data<input type="date" name="data" value="${d(s.data||"")}"></label>
            <label class="field">Dente<input name="dente" value="${d(s.dente||"")}"></label>
            <label class="field">Descri\xE7\xE3o<input name="descricao" value="${d(s.descricao||"")}"></label>
          </div>
          <div class="row" style="margin-top:12px"><button class="btn sm danger" id="excluir-img">Excluir imagem</button><span class="spacer"></span><button class="btn primary" id="salvar-img">Salvar altera\xE7\xF5es</button></div>`,P("[data-nav]",o).forEach(l=>l.onclick=()=>{t=(t+Number(l.dataset.nav)+a.length)%a.length,m()}),i("#salvar-img",o).onclick=async()=>{try{Object.assign(a[t],await f(`/imagens/${s.id}`,{method:"PUT",body:q(i("#dados-img",o))})),w("Dados da imagem salvos."),m()}catch(l){w(l.message,"err")}},i("#excluir-img",o).onclick=async()=>{if(confirm("Excluir esta imagem da ficha? N\xE3o d\xE1 para desfazer."))try{if(await f(`/imagens/${s.id}`,{method:"DELETE"}),w("Imagem exclu\xEDda."),a.splice(t,1),!a.length)return c();t=Math.min(t,a.length-1),m()}catch(l){w(l.message,"err")}}},p=s=>{if(!document.body.contains(o))return document.removeEventListener("keydown",p);s.target.closest("input, select, textarea")||a.length<2||(s.key==="ArrowRight"&&(t=(t+1)%a.length,m()),s.key==="ArrowLeft"&&(t=(t-1+a.length)%a.length,m()))};document.addEventListener("keydown",p),m()}})}function Ya(a,n){const t=`${new URL("orcamento.html",document.baseURI).href}?t={{1}}`,e=o=>d(o).replace(/\{\{(\d+)\}\}/g,(c,m)=>`<b>${d(a.exemplo[Number(m)-1]??c)}</b>`);R({title:`Modelo ${d(a.nome)}`,width:720,body:`<div class="form-grid">
      <label class="field">Nome na Meta<input name="nome" value="${d(a.nome)}" spellcheck="false"></label>
      <div class="field">Categoria sugerida<div style="padding-top:8px"><span class="badge ${a.categoria==="Marketing"?"alerta":"ia"}">${d(a.categoria)}</span> <span class="muted small">a Meta confirma na aprova\xE7\xE3o</span></div></div>
      <label class="field full">Texto do modelo<textarea name="texto" rows="4" spellcheck="false">${d(a.texto)}</textarea></label>
      <div class="full">
        <div class="muted small" style="font-weight:600;margin-bottom:6px">Vari\xE1veis, que o sistema preenche nesta ordem</div>
        <div class="row wrap" style="gap:6px">${a.variaveis.map((o,c)=>`<span class="badge">{{${c+1}}} ${d(o)}</span>`).join("")}</div>
      </div>
      <div class="full small">
        <div class="muted" style="font-weight:600;margin-bottom:4px">Configure tamb\xE9m na Meta</div>
        ${a.rodape?`<div>Rodap\xE9: ${d(a.rodape)}</div>`:""}
        <div>Bot\xF5es: ${a.botoes.map(o=>o.tipo==="link"?`"${d(o.texto)}" (link: <code>${d(t)}</code>)`:`"${d(o.texto)}" (resposta r\xE1pida)`).join(" \xB7 ")}</div>
      </div>
      <div class="full">
        <div class="muted small" style="font-weight:600;margin-bottom:6px">Pr\xE9via com dados de exemplo</div>
        <div class="previa-modelo" id="previa"></div>
        <div class="tpl-botoes">${a.botoes.map(o=>`<span>${o.tipo==="link"?"\u2197":"\u21A9"} ${d(o.texto)}</span>`).join("")}</div>
      </div>
    </div>`,foot:`${a.personalizado?'<button class="btn sm ghost" id="restaurar">Restaurar padr\xE3o</button>':""}
      <button class="btn sm ghost" id="copiar">Copiar texto para a Meta</button>
      <span class="spacer"></span><button class="btn" data-close>Cancelar</button><button class="btn primary" id="salvar">Salvar</button>`,onMount:({el:o,close:c})=>{const m=i("[name=texto]",o),p=()=>{i("#previa",o).innerHTML=e(m.value)+(a.rodape?`<div class="tpl-rodape">${d(a.rodape)}</div>`:"")};m.addEventListener("input",p),p(),i("#copiar",o).onclick=async()=>{await navigator.clipboard.writeText(m.value).catch(()=>{}),w('Texto copiado. Cole no campo "Corpo" do modelo no WhatsApp Manager.')},i("#restaurar",o)?.addEventListener("click",async()=>{await f(`/modelos/${a.id}/restaurar`,{method:"POST"}).catch(s=>w(s.message,"err")),w("Modelo restaurado para o padr\xE3o."),c(),n?.()}),i("#salvar",o).onclick=async()=>{try{await f(`/modelos/${a.id}`,{method:"PUT",body:{nome:i("[name=nome]",o).value,texto:m.value}}),w("Modelo salvo."),c(),n?.()}catch(s){w(s.message,"err")}}}})}const Za={rascunho:"Rascunho",enviado:"Enviado",aprovado:"Aprovado",recusado:"Recusado"};function ae(a){const n=new Map;for(const t of a)n.set(t.etapa,[...n.get(t.etapa)||[],t]);return[...n.entries()].sort((t,e)=>t[0]-e[0])}function ee(a){const n=o=>o?new Date(o).toLocaleDateString("pt-BR"):"",t={rascunho:"Ainda n\xE3o enviado ao paciente.",enviado:`Enviado em ${n(a.enviado_em)}${a.followups?` \xB7 Gabi acompanhou ${a.followups}x`:""}. Aguardando o paciente.`,aprovado:`Aprovado em ${n(a.respondido_em)}${a.aceite?.assinatura?` pelo paciente no celular, assinado como "${d(a.aceite.assinatura)}"`:" (registrado pela equipe)"}. Parcelas lan\xE7adas no Financeiro.`,recusado:`Recusado em ${n(a.respondido_em)}.`}[a.status],e=["rascunho","enviado"].includes(a.status);return`<div class="orc">
    <div class="orc-topo">
      <b>${d(a.titulo)}</b><span class="st st-${a.status}">${Za[a.status]}</span>
      ${a.dentista_nome?`<span class="muted small">${d(a.dentista_nome)}</span>`:""}
      <span class="spacer"></span>
      <span class="orc-total">${M(a.total)}</span>${a.parcelas>1?`<span class="muted small">em ${a.parcelas}x de ${M(a.valor_parcela)}</span>`:""}
    </div>
    <div class="timeline">${ae(a.itens).map(([o,c])=>`
      <div class="etapa"><div class="etapa-num">${o}</div><ul>${c.map(m=>`
        <li><span>${d(m.descricao)}${m.dente?` <span class="muted">\xB7 dente ${d(m.dente)}</span>`:""}</span>
          <span class="row" style="gap:4px">${M(m.valor)}${a.status==="aprovado"&&m.procedure_id?`<button class="btn sm ghost" data-agendar-proc="${m.procedure_id}" title="Agendar esta etapa">\u{1F4C5}</button>`:""}</span></li>`).join("")}
      </ul></div>`).join("")}
    </div>
    ${a.desconto?`<div class="small muted">Subtotal ${M(a.subtotal)} \xB7 desconto de ${M(a.desconto)}</div>`:""}
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
  </div>`}function Ea({patient_id:a,orcamento:n}){const t=n||{titulo:"",dentist_id:k.dentists[0]?.id,desconto:0,parcelas:1,observacoes:"",itens:[]};let e=t.itens.map(o=>({etapa:o.etapa,procedure_id:o.procedure_id||"",descricao:o.descricao,dente:o.dente||"",valor:o.valor}));e.length||e.push({etapa:1,procedure_id:"",descricao:"",dente:"",valor:""}),R({title:n?"Editar or\xE7amento":"Novo or\xE7amento",width:860,body:`<div class="form-grid">
      <label class="field">T\xEDtulo<input name="titulo" value="${d(t.titulo)}" placeholder="Ex.: Tratamento de c\xE1rie"></label>
      <label class="field">Dentista respons\xE1vel<select name="dentist_id">${k.dentists.map(o=>`<option value="${o.id}" ${o.id===t.dentist_id?"selected":""}>${d(o.nome)}</option>`).join("")}</select></label>
      <div class="full">
        <div class="row wrap" style="margin-bottom:8px"><b class="small">Itens do plano</b><span class="spacer"></span>
          <button type="button" class="btn sm" id="sugerir">\u2728 Sugerir pelo odontograma</button>
          <button type="button" class="btn sm" id="add-item">+ Item</button></div>
        <div class="itens-edit" id="itens"></div>
      </div>
      <label class="field">Desconto (R$)<input name="desconto" type="number" min="0" step="0.01" value="${t.desconto||""}"></label>
      <label class="field">Parcelas<select name="parcelas">${Array.from({length:12},(o,c)=>`<option value="${c+1}" ${c+1===t.parcelas?"selected":""}>${c+1}x</option>`).join("")}</select></label>
      <label class="field full">Observa\xE7\xF5es (o paciente v\xEA)<textarea name="observacoes" rows="2">${d(t.observacoes||"")}</textarea></label>
      <div class="full row" style="border-top:1px solid var(--border);padding-top:10px"><span class="muted" id="orc-detalhe"></span><span class="spacer"></span><b id="orc-total" style="font-size:20px"></b></div>
    </div>`,foot:`<span class="spacer"></span><button class="btn" data-close>Cancelar</button>
      <button class="btn" id="salvar">Salvar rascunho</button><button class="btn primary" id="salvar-enviar">Salvar e enviar pelo WhatsApp</button>`,onMount:({el:o,close:c})=>{const m=i("#itens",o),p=()=>{const y=e.reduce((_,v)=>_+(Number(v.valor)||0),0),r=Math.max(0,y-(Number(i("[name=desconto]",o).value)||0)),x=Number(i("[name=parcelas]",o).value)||1;i("#orc-total",o).textContent=M(r),i("#orc-detalhe",o).textContent=`${e.filter(_=>_.descricao).length} item(ns)${x>1?` \xB7 ${x}x de ${M(r/x)}`:""}`},s=()=>{m.innerHTML='<div class="item-edit cab"><span>Etapa</span><span>Procedimento</span><span>Descri\xE7\xE3o</span><span>Dente</span><span>Valor (R$)</span><span></span></div>'+e.map((y,r)=>`<div class="item-edit" data-i="${r}">
            <input type="number" min="1" max="9" data-k="etapa" value="${y.etapa}" aria-label="Etapa">
            <select data-k="procedure_id" aria-label="Procedimento"><option value="">Outro</option>${k.procedures.map(x=>`<option value="${x.id}" ${Number(y.procedure_id)===x.id?"selected":""}>${d(x.nome)}</option>`).join("")}</select>
            <input data-k="descricao" value="${d(y.descricao)}" placeholder="Descri\xE7\xE3o" aria-label="Descri\xE7\xE3o">
            <input data-k="dente" value="${d(y.dente)}" placeholder="Ex.: 36" aria-label="Dente">
            <input type="number" min="0" step="0.01" data-k="valor" value="${y.valor}" aria-label="Valor">
            <button type="button" class="btn sm ghost" data-rm="${r}" aria-label="Remover item">\u2715</button>
          </div>`).join(""),p()};m.addEventListener("input",y=>{const r=y.target.closest("[data-i]");if(!r||!y.target.dataset.k)return;const x=e[Number(r.dataset.i)];if(x[y.target.dataset.k]=y.target.value,y.target.dataset.k==="procedure_id"){const _=k.procedures.find(v=>v.id===Number(y.target.value));if(_){x.descricao=_.nome,x.valor=_.preco,s();return}}p()}),m.addEventListener("click",y=>{const r=y.target.closest("[data-rm]");r&&(e.splice(Number(r.dataset.rm),1),e.length||e.push({etapa:1,procedure_id:"",descricao:"",dente:"",valor:""}),s())}),i("[name=desconto]",o).addEventListener("input",p),i("[name=parcelas]",o).addEventListener("change",p),i("#add-item",o).onclick=()=>{e.push({etapa:e.at(-1)?.etapa||1,procedure_id:"",descricao:"",dente:"",valor:""}),s()},i("#sugerir",o).onclick=async()=>{const y=await f(`/patients/${a}/sugestao-orcamento`).catch(r=>(w(r.message,"err"),[]));if(!y.length)return w("O odontograma n\xE3o tem c\xE1rie, canal, extra\xE7\xE3o indicada nem dente ausente marcados.");e=[...e.filter(r=>r.descricao),...y.map(r=>({...r,procedure_id:r.procedure_id||""}))],i("[name=titulo]",o).value||(i("[name=titulo]",o).value="Plano de tratamento"),s(),w(`${y.length} item(ns) sugerido(s) a partir do odontograma. Revise os valores.`)};const l=async y=>{const r=q(o),x={patient_id:a,titulo:r.titulo,dentist_id:r.dentist_id,desconto:r.desconto,parcelas:r.parcelas,observacoes:r.observacoes,itens:e};try{const _=await f(n?`/orcamentos/${n.id}`:"/orcamentos",{method:n?"PUT":"POST",body:x});y?(await f(`/orcamentos/${_.id}/enviar`,{method:"POST"}),w(`Or\xE7amento enviado pelo ${k.status.whatsapp?"WhatsApp":"simulador"}.`,"ia")):w("Or\xE7amento salvo."),c()}catch(_){w(_.message,"err")}};i("#salvar",o).onclick=()=>l(!1),i("#salvar-enviar",o).onclick=()=>l(!0),s()}})}function Aa(a,n=!0){return a.length?`<div class="table-wrap"><table class="table"><thead><tr><th>Data</th>${n?"<th>Paciente</th>":""}<th>Descri\xE7\xE3o</th><th>Valor</th><th>Forma</th><th>Status</th><th></th></tr></thead><tbody>
    ${a.map(t=>{const e=t.status==="pendente"&&t.vencimento&&t.vencimento<k.hoje;return`<tr><td>${X(t.pago_em||t.vencimento||t.criado_em)}</td>${n?`<td><a href="#/pacientes/${t.patient_id}">${d(t.paciente_nome)}</a></td>`:""}
        <td>${d(t.descricao)}</td><td><b>${M(t.valor)}</b></td><td>${da[t.forma]||"\u2014"}</td>
        <td><span class="st st-${t.status}">${t.status==="pago"?"Pago":e?"Vencido":"Pendente"}</span></td>
        <td style="text-align:right">${t.status==="pendente"?`<button class="btn sm primary" data-receber="${t.id}">Receber</button>`:`<button class="btn sm ghost" data-estornar="${t.id}">Estornar</button>`}</td></tr>`}).join("")}</tbody></table></div>`:'<div class="empty">Nenhum lan\xE7amento.</div>'}function ja(a){P("[data-receber]",a).forEach(n=>n.onclick=()=>R({title:"Registrar recebimento",body:`<label class="field">Forma de pagamento<select name="forma">${Object.entries(da).map(([t,e])=>`<option value="${t}">${e}</option>`).join("")}</select></label>`,foot:'<span class="spacer"></span><button class="btn" data-close>Cancelar</button><button class="btn primary" id="ok">Confirmar recebimento</button>',width:380,onMount:({el:t,close:e})=>{i("#ok",t).onclick=async()=>{await f(`/payments/${n.dataset.receber}`,{method:"PUT",body:{status:"pago",forma:i("[name=forma]",t).value}}).catch(o=>w(o.message,"err")),w("Recebimento registrado."),e()}}})),P("[data-estornar]",a).forEach(n=>n.onclick=async()=>{confirm("Voltar este lan\xE7amento para pendente?")&&await f(`/payments/${n.dataset.estornar}`,{method:"PUT",body:{status:"pendente"}}).catch(t=>w(t.message,"err"))})}async function Pa({patient_id:a,nome:n}){const t=a?[]:await f("/patients");R({title:"Novo lan\xE7amento",body:`<datalist id="dl-pac-fin">${t.map(e=>`<option value="${d(`${e.nome} #${e.id}`)}"></option>`).join("")}</datalist>
      <div class="form-grid">
        <label class="field full">Paciente<input name="paciente" list="dl-pac-fin" value="${a?d(`${n} #${a}`):""}" ${a?"readonly":""}></label>
        <label class="field full">Descri\xE7\xE3o<input name="descricao" placeholder="Ex.: Plano de tratamento \u2014 1\xAA parcela"></label>
        <label class="field">Valor (R$)<input name="valor" type="number" min="0" step="0.01"></label>
        <label class="field">Vencimento<input name="vencimento" type="date" value="${k.hoje}"></label>
        <label class="field">Forma<select name="forma"><option value="">\u2014</option>${Object.entries(da).map(([e,o])=>`<option value="${e}">${o}</option>`).join("")}</select></label>
        <label class="check" style="padding-top:20px"><input type="checkbox" name="pago"> J\xE1 recebido</label>
      </div>`,foot:'<span class="spacer"></span><button class="btn" data-close>Cancelar</button><button class="btn primary" id="ok">Salvar</button>',onMount:({el:e,close:o})=>{i("#ok",e).onclick=async()=>{const c=q(e),m=(c.paciente.match(/#(\d+)$/)||[])[1];if(!m)return w("Escolha um paciente da lista.","err");try{await f("/payments",{method:"POST",body:{...c,patient_id:m,status:c.pago?"pago":"pendente"}}),w("Lan\xE7amento criado."),o()}catch(p){w(p.message,"err")}}}})}async function te(){const a=i("#view");let n="";const t=async()=>{const e=await f("/payments"),o=k.hoje.slice(0,7),c=e.filter(l=>l.status==="pago"&&l.pago_em?.startsWith(o)).reduce((l,y)=>l+y.valor,0),m=e.filter(l=>l.status==="pendente").reduce((l,y)=>l+y.valor,0),p=e.filter(l=>l.status==="pendente"&&l.vencimento<k.hoje),s=n?e.filter(l=>l.status===n):e;a.innerHTML=`
      <div class="page-head"><div><h1>Financeiro</h1><p class="muted">Cobran\xE7as s\xE3o criadas automaticamente quando uma consulta \xE9 conclu\xEDda.</p></div><span class="spacer"></span><button class="btn primary" id="novo">+ Lan\xE7amento</button></div>
      <div class="grid grid-4" style="margin-bottom:16px">
        <div class="card card-pad kpi"><div class="label">Recebido no m\xEAs</div><div class="value" style="color:var(--ok)">${M(c)}</div></div>
        <div class="card card-pad kpi"><div class="label">A receber</div><div class="value">${M(m)}</div></div>
        <div class="card card-pad kpi"><div class="label">Vencidos</div><div class="value" style="color:${p.length?"var(--danger)":"inherit"}">${M(p.reduce((l,y)=>l+y.valor,0))}</div><div class="hint">${p.length} lan\xE7amento(s)</div></div>
        <div class="card card-pad kpi"><div class="label">Ticket m\xE9dio (m\xEAs)</div><div class="value">${M(c/Math.max(1,e.filter(l=>l.status==="pago"&&l.pago_em?.startsWith(o)).length))}</div></div>
      </div>
      <div class="card">
        <div class="card-head"><div class="seg">${[["","Todos"],["pendente","Pendentes"],["pago","Pagos"]].map(([l,y])=>`<button data-f="${l}" class="${n===l?"on":""}">${y}</button>`).join("")}</div></div>
        ${Aa(s)}
      </div>`,P("[data-f]",a).forEach(l=>l.onclick=()=>{n=l.dataset.f,t()}),i("#novo").onclick=()=>Pa({}),ja(a)};await t(),O={financeiro:V(t,200)}}function Ta(a=[]){return a.map(([n,t])=>`${n}-${t}`).join(", ")}function se(a){const n=[];for(const t of a.split(",").map(e=>e.trim()).filter(Boolean)){const e=t.match(/^(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})$/);if(!e)throw new Error(`Hor\xE1rio inv\xE1lido: "${t}". Use o formato 08:00-12:00.`);n.push([e[1].padStart(5,"0"),e[2].padStart(5,"0")])}return n}async function oe(){const a=i("#view"),n=async()=>{const[t,e,o,c]=await Promise.all([f("/settings"),f("/dentists?todos=1"),f("/procedures?todos=1"),f("/status")]),m=(p,s,l="",y=!1,r=!1)=>`<label class="field ${y?"full":""}">${s}${r?`<textarea name="${p}" rows="2" placeholder="${l}">${d(t[p]||"")}</textarea>`:`<input name="${p}" value="${d(t[p]||"")}" placeholder="${l}">`}</label>`;a.innerHTML=`
      <div class="page-head"><h1>Configura\xE7\xF5es</h1></div>
      <div class="grid grid-2" style="align-items:start">
        <div class="grid">
          <div class="card">
            <div class="card-head"><h2>Dados da cl\xEDnica</h2><span class="spacer"></span><span class="muted small">a IA usa estas informa\xE7\xF5es</span></div>
            <div class="card-pad" id="form-clinica"><div class="form-grid">
              ${m("nome_clinica","Nome da cl\xEDnica")}${m("nome_assistente","Nome da assistente virtual","Sofia")}
              ${m("endereco","Endere\xE7o","",!0)}${m("telefone","Telefone")}${m("horario_funcionamento","Hor\xE1rio de funcionamento")}
              ${m("convenios","Conv\xEAnios aceitos","",!0)}${m("formas_pagamento","Formas de pagamento","",!0)}${m("chave_pix","Chave Pix (enviada nos lembretes de pagamento)","CNPJ, e-mail, telefone ou chave aleat\xF3ria",!0)}
              ${m("info_adicional","Outras informa\xE7\xF5es para a IA","Estacionamento, pol\xEDticas de cancelamento, etc.",!0,!0)}
            </div>
            <div class="row" style="margin-top:12px"><span class="muted small">Novas conversas j\xE1 usam os dados atualizados.</span><span class="spacer"></span><button class="btn primary" id="salvar-clinica">Salvar</button></div></div>
          </div>
          <div class="card card-pad">
            <h2 style="margin-bottom:10px">Automa\xE7\xE3o e integra\xE7\xF5es</h2>
            <div class="grid" style="gap:10px">
              <div class="row"><span class="dot ${c.ia?"on":"off"}"></span><div><b>Recepcionista de IA</b> \u2014 ${c.ia?`ativa (${d(c.modelo)})`:c.demo_publica?"vers\xE3o de demonstra\xE7\xE3o: respostas simuladas. Na vers\xE3o contratada, quem responde \xE9 a IA de verdade (Claude).":"modo demonstra\xE7\xE3o: respostas simuladas por regras. Para usar o Claude, defina ANTHROPIC_API_KEY no arquivo .env e reinicie"}</div></div>
              <div class="row"><span class="dot ${c.whatsapp?"on":"off"}"></span><div><b>WhatsApp Business</b> \u2014 ${c.whatsapp?"conectado":c.demo_publica?"na vers\xE3o contratada, a cl\xEDnica conecta o pr\xF3prio WhatsApp oficial. Aqui, use o simulador de paciente.":"n\xE3o configurado (veja o README). Use o simulador enquanto isso."}</div></div>
              <div class="row"><span class="dot on"></span><div style="flex:1"><b>Equipe de IA</b> \u2014 confirma\xE7\xF5es, retornos, cobran\xE7as e acompanhamento de or\xE7amentos pelo WhatsApp.</div><a class="btn sm" href="#/equipe-ia">Abrir</a></div>
            </div>
          </div>
        </div>
        <div class="grid">
          <div class="card">
            <div class="card-head"><h2>Dentistas</h2><span class="spacer"></span><button class="btn sm primary" id="novo-dentista">+ Dentista</button></div>
            ${e.map(p=>`<div class="list-item click" data-dentista="${p.id}" style="cursor:pointer;${p.ativo?"":"opacity:.5"}">
              <span class="color-bar" style="background:${p.cor}"></span>
              <div style="flex:1;min-width:0"><b>${d(p.nome)}</b> <span class="muted small">${d(p.cro||"")}</span><div class="muted small">${d(p.especialidade||"")}</div>
              <div class="small" style="margin-top:2px">${[1,2,3,4,5,6,0].filter(s=>p.horarios[s]?.length).map(s=>`<b>${aa[s]}</b> ${Ta(p.horarios[s])}`).join(" \xB7 ")||'<span class="muted">sem hor\xE1rios</span>'}</div></div>
              <span class="muted">\u203A</span></div>`).join("")}
          </div>
          <div class="card">
            <div class="card-head"><h2>Procedimentos</h2><span class="spacer"></span><button class="btn sm primary" id="novo-proc">+ Procedimento</button></div>
            <div class="table-wrap"><table class="table"><thead><tr><th>Procedimento</th><th>Dura\xE7\xE3o</th><th>Pre\xE7o</th><th>Retorno</th></tr></thead><tbody>
              ${o.map(p=>`<tr class="click" data-proc="${p.id}" style="${p.ativo?"":"opacity:.5"}"><td><b>${d(p.nome)}</b><div class="muted small">${d(p.descricao||"")}</div></td><td>${p.duracao_min} min</td><td>${M(p.preco)}</td><td>${p.retorno_meses?`${p.retorno_meses} ${p.retorno_meses===1?"m\xEAs":"meses"}`:"\u2014"}</td></tr>`).join("")}
            </tbody></table></div>
          </div>
        </div>
      </div>`,i("#salvar-clinica").onclick=async()=>{await f("/settings",{method:"PUT",body:q(i("#form-clinica"))}).then(()=>{w("Dados da cl\xEDnica salvos."),ca()}).catch(p=>w(p.message,"err"))},i("#novo-dentista").onclick=()=>La({horarios:{},procedimentos:[],ativo:1,cor:"#0ea5e9"},o),P("[data-dentista]",a).forEach(p=>p.onclick=()=>La(e.find(s=>s.id===Number(p.dataset.dentista)),o)),i("#novo-proc").onclick=()=>Sa({ativo:1,duracao_min:30}),P("[data-proc]",a).forEach(p=>p.onclick=()=>Sa(o.find(s=>s.id===Number(p.dataset.proc))))};await n(),O={config:V(n,200)}}function La(a,n){R({title:a.id?`Editar ${d(a.nome)}`:"Novo dentista",width:720,body:`<div class="form-grid">
      <label class="field">Nome<input name="nome" value="${d(a.nome||"")}" placeholder="Dra. Maria Silva"></label>
      <label class="field">Especialidade<input name="especialidade" value="${d(a.especialidade||"")}"></label>
      <label class="field">CRO<input name="cro" value="${d(a.cro||"")}"></label>
      <label class="field">Cor na agenda<input name="cor" type="color" value="${a.cor}" style="height:36px;padding:2px"></label>
      <div class="full"><div class="muted small" style="font-weight:600;margin-bottom:6px">Hor\xE1rios de atendimento (ex.: 08:00-12:00, 13:00-18:00)</div>
        <div class="grid" style="gap:6px">${[1,2,3,4,5,6,0].map(t=>`<div class="row"><b style="width:40px">${aa[t]}</b><input data-dia="${t}" value="${Ta(a.horarios[t])}" placeholder="n\xE3o atende" style="flex:1"></div>`).join("")}</div>
      </div>
      <div class="full"><div class="muted small" style="font-weight:600;margin-bottom:6px">Procedimentos que realiza (nenhum marcado = todos)</div>
        <div class="grid grid-2" style="gap:6px">${n.filter(t=>t.ativo).map(t=>`<label class="check"><input type="checkbox" data-proc-id="${t.id}" ${a.procedimentos.includes(t.id)?"checked":""}> ${d(t.nome)}</label>`).join("")}</div>
      </div>
      <label class="check full"><input type="checkbox" name="ativo" ${a.ativo?"checked":""}> Ativo (aparece na agenda e para a IA)</label>
    </div>`,foot:'<span class="spacer"></span><button class="btn" data-close>Cancelar</button><button class="btn primary" id="ok">Salvar</button>',onMount:({el:t,close:e})=>{i("#ok",t).onclick=async()=>{try{const o=q(t),c={};for(const p of P("[data-dia]",t)){const s=se(p.value);s.length&&(c[p.dataset.dia]=s)}const m={nome:o.nome,especialidade:o.especialidade,cro:o.cro,cor:o.cor,ativo:o.ativo,horarios:c,procedimentos:P("[data-proc-id]",t).filter(p=>p.checked).map(p=>Number(p.dataset.procId))};await f(a.id?`/dentists/${a.id}`:"/dentists",{method:a.id?"PUT":"POST",body:m}),w("Dentista salvo."),e()}catch(o){w(o.message,"err")}}}})}function Sa(a){R({title:a.id?"Editar procedimento":"Novo procedimento",body:`<div class="form-grid">
      <label class="field full">Nome<input name="nome" value="${d(a.nome||"")}"></label>
      <label class="field">Dura\xE7\xE3o (min)<input name="duracao_min" type="number" min="10" step="5" value="${a.duracao_min}"></label>
      <label class="field">Pre\xE7o de refer\xEAncia (R$)<input name="preco" type="number" min="0" step="0.01" value="${a.preco??""}"></label>
      <label class="field full">Retorno em (meses): o agente de Retornos convida o paciente quando esse prazo passa<input name="retorno_meses" type="number" min="0" max="36" value="${a.retorno_meses??""}" placeholder="Deixe vazio se n\xE3o tem retorno"></label>
      <label class="field full">Descri\xE7\xE3o (a IA usa para explicar ao paciente)<textarea name="descricao" rows="2">${d(a.descricao||"")}</textarea></label>
      <label class="check full"><input type="checkbox" name="ativo" ${a.ativo?"checked":""}> Ativo</label>
    </div>`,foot:'<span class="spacer"></span><button class="btn" data-close>Cancelar</button><button class="btn primary" id="ok">Salvar</button>',onMount:({el:n,close:t})=>{i("#ok",n).onclick=async()=>{try{await f(a.id?`/procedures/${a.id}`:"/procedures",{method:a.id?"PUT":"POST",body:q(n)}),w("Procedimento salvo."),t()}catch(e){w(e.message,"err")}}}})}const Ma=["Como est\xE1 a agenda de amanh\xE3?","Resumo financeiro do m\xEAs","Quem faltou este m\xEAs?","Ficha do Jo\xE3o Pereira","O Jo\xE3o Pereira \xE9 hipertenso: qual anest\xE9sico \xE9 mais seguro para ele?"],Q={sessao:null,ocupado:!1};function oa(a){const n=o=>o.replace(/\*\*(.+?)\*\*/g,"<b>$1</b>").replace(/(^|[\s(])[*_](?!\s)(.+?)[*_](?=[\s.,;:!?)]|$)/g,"$1<i>$2</i>").replace(/`(.+?)`/g,"<code>$1</code>");let t="",e=null;for(const o of d(a).split(`
`)){const c=o.match(/^\s*[-*•]\s+(.*)/),m=o.match(/^\s*\d+[.)]\s+(.*)/);if(c||m){const s=c?"ul":"ol";e!==s&&(e&&(t+=`</${e}>`),t+=`<${s}>`,e=s),t+=`<li>${n((c||m)[1])}</li>`;continue}e&&(t+=`</${e}>`,e=null);const p=o.match(/^#{1,4}\s+(.*)/);p?t+=`<p><b>${n(p[1])}</b></p>`:o.trim()&&(t+=`<p>${n(o)}</p>`)}return e?`${t}</${e}>`:t}function ne(){i("#ia-sugestoes").innerHTML=Ma.map(a=>`<button type="button" class="chip" data-sug="${d(a)}">${d(a)}</button>`).join(""),P("[data-sug]",i("#ia-sugestoes")).forEach(a=>a.onclick=()=>na(a.dataset.sug))}function Na(){Q.sessao=null,i("#ia-body").innerHTML=`
    <div class="ia-msg ia">${oa(`Ol\xE1! Sou o assistente da ${k.settings.nome_clinica||"cl\xEDnica"}. Posso consultar a **agenda**, abrir a **ficha de um paciente**, montar **resumos financeiros** e tirar **d\xFAvidas cl\xEDnicas**, levando em conta a anamnese do paciente. O que voc\xEA precisa?`)}</div>
    ${k.status.demo?'<div class="ia-demo">\u{1F9EA} Modo demonstra\xE7\xE3o: respondo perguntas simples sobre os dados da cl\xEDnica. Perguntas livres e d\xFAvidas cl\xEDnicas precisam da IA completa.</div>':""}`,ne()}function ua(a){i("#ia-drawer").classList.add("open"),i("#ia-fab").classList.add("hidden"),i("#ia-body").children.length||Na(),a?na(a):setTimeout(()=>i("#ia-input").focus(),250)}function Ca(){i("#ia-drawer").classList.remove("open"),i("#ia-fab").classList.remove("hidden")}async function na(a){if(a=String(a||"").trim(),!a||Q.ocupado)return;Q.ocupado=!0,i("#ia-enviar").disabled=!0,i("#ia-input").value="",i("#ia-sugestoes").innerHTML="";const n=i("#ia-body");n.insertAdjacentHTML("beforeend",`<div class="ia-msg eu">${d(a)}</div><div class="ia-msg ia"><div class="ia-status">Pensando\u2026</div><div class="ia-txt"></div></div>`);const t=n.lastElementChild,e=i(".ia-status",t),o=i(".ia-txt",t),c=()=>{n.scrollTop=n.scrollHeight},m=l=>o.insertAdjacentHTML("beforeend",`<div class="ia-erro">${d(l)}</div>`);let p="",s=0;c();try{const l=await fetch("/api/assistente",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({sessao_id:Q.sessao,texto:a})});if(!l.ok||!l.body)throw new Error((await l.json().catch(()=>({}))).erro||`Erro ${l.status}`);const y=l.body.getReader(),r=new TextDecoder;let x="";for(;;){const{value:_,done:v}=await y.read();if(v)break;x+=r.decode(_,{stream:!0});let j;for(;(j=x.indexOf(`

`))>=0;){const I=x.slice(0,j);if(x=x.slice(j+2),!I.startsWith("data: "))continue;const S=JSON.parse(I.slice(6));S.tipo==="sessao"?Q.sessao=S.id:S.tipo==="delta"?(p+=S.texto,e.classList.add("hidden"),o.innerHTML=oa(p)):S.tipo==="ferramenta"?(p&&!p.endsWith(`
`)&&(p+=`

`),s=p.length,e.textContent=`\u{1F50E} ${S.rotulo}\u2026`,e.classList.remove("hidden"),o.innerHTML=oa(p)):S.tipo==="reiniciar"?(p=p.slice(0,s),o.innerHTML=oa(p)):S.tipo==="erro"&&m(S.mensagem),c()}}}catch(l){m(l.message)}finally{e.classList.add("hidden"),Q.ocupado=!1,i("#ia-enviar").disabled=!1,c()}}function ie(){i("#ia-fab").onclick=()=>ua(),i("#ia-fechar").onclick=Ca,i("#ia-nova").onclick=()=>{Q.ocupado||Na()},i("#ia-form").addEventListener("submit",a=>{a.preventDefault(),na(i("#ia-input").value)}),i("#ia-input").addEventListener("keydown",a=>{a.key==="Enter"&&!a.shiftKey&&(a.preventDefault(),na(i("#ia-input").value))}),document.addEventListener("keydown",a=>{a.key==="Escape"&&i("#ia-drawer").classList.contains("open")&&!i(".modal-bg")&&Ca()})}await ca(),ie(),qa(),$a(),window.addEventListener("hashchange",ya),ya(),setInterval(async()=>{k.status=await f("/status").catch(()=>k.status),k.hoje=k.status.agora?.slice(0,10)||k.hoje},6e4);
