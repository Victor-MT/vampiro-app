const sheetData = {
  atributos: {
    fisicos: ["forca", "destreza", "vigor"],
    sociais: ["carisma", "manipulacao", "autocontrole"],
    mentais: ["inteligencia", "raciocinio", "determinacao"]
  },
  habilidades: {
    fisicas: ["armas_brancas", "armas_de_fogo", "atletismo", "briga", "conducao", "furtividade", "ladroagem", "oficios", "sobrevivencia"],
    sociais: ["empatia_com_animais", "etiqueta", "intimidacao", "lideranca", "manha", "performance", "persuasao", "sagacidade", "subterfugio"],
    mentais: ["ciencia", "erudicao", "financas", "investigacao", "medicina", "ocultismo", "percepcao", "politica", "tecnologia"]
  }
};

const labels = {
  fisicos: "Físicos", sociais: "Sociais", mentais: "Mentais",
  forca: "Força", destreza: "Destreza", vigor: "Vigor",
  carisma: "Carisma", manipulacao: "Manipulação", autocontrole: "Autocontrole",
  inteligencia: "Inteligência", raciocinio: "Raciocínio", determinacao: "Determinação",
  armas_brancas: "Armas Brancas", armas_de_fogo: "Armas de Fogo", atletismo: "Atletismo", briga: "Briga", conducao: "Condução",
  furtividade: "Furtividade", ladroagem: "Ladroagem", oficios: "Ofícios", sobrevivencia: "Sobrevivência",
  empatia_com_animais: "Empatia com Animais", etiqueta: "Etiqueta", intimidacao: "Intimidação", lideranca: "Liderança", manha: "Manha",
  performance: "Performance", persuasao: "Persuasão", sagacidade: "Sagacidade", subterfugio: "Subterfúgio",
  ciencia: "Ciência", erudicao: "Erudição", financas: "Finanças", investigacao: "Investigação", medicina: "Medicina",
  ocultismo: "Ocultismo", percepcao: "Percepção", politica: "Política", tecnologia: "Tecnologia"
};

function createDots(key, count = 5) {
  const wrap = document.createElement("span");
  wrap.className = "dots";
  wrap.dataset.rating = key;
  wrap.dataset.count = count;
  return wrap;
}

function renderAttributes() {
  const root = document.getElementById("attributes");
  Object.entries(sheetData.atributos).forEach(([group, fields]) => {
    const div = document.createElement("div");
    div.className = "attribute-group";
    div.innerHTML = `<h3>${labels[group]}</h3>`;
    fields.forEach(field => {
      const row = document.createElement("div");
      row.className = "rating-row";
      row.innerHTML = `<span>${labels[field]}</span>`;
      row.appendChild(createDots(`atributos.${group}.${field}`, 5));
      div.appendChild(row);
    });
    root.appendChild(div);
  });
}

function renderSkills() {
  const root = document.getElementById("skills");
  Object.entries(sheetData.habilidades).forEach(([group, fields]) => {
    const div = document.createElement("div");
    fields.forEach(field => {
      const row = document.createElement("div");
      row.className = "skill-row";
      row.innerHTML = `<span>${labels[field]}</span><span class="leader"></span>`;
      row.appendChild(createDots(`habilidades.${group}.${field}`, 5));
      div.appendChild(row);
    });
    root.appendChild(div);
  });
}

function renderDisciplines() {
  const root = document.getElementById("disciplines");
  for (let i = 0; i < 30; i++) {
    const cell = document.createElement("div");
    cell.className = "discipline-cell";
    cell.innerHTML = `<input data-key="disciplinas.${i}.nome" />`;
    cell.appendChild(createDots(`disciplinas.${i}.nivel`, 5));
    root.appendChild(cell);
  }
}

function renderAdvantages() {
  const root = document.getElementById("advantages");
  for (let i = 0; i < 11; i++) {
    const row = document.createElement("div");
    row.className = "adv-row";
    row.innerHTML = `<input data-key="vantagens_e_defeitos.${i}.nome" />`;
    row.appendChild(createDots(`vantagens_e_defeitos.${i}.nivel`, 5));
    root.appendChild(row);
  }
}

function bindRatings() {
  document.querySelectorAll(".dots[data-rating]").forEach(group => {
    const count = Number(group.dataset.count || 5);
    group.innerHTML = "";
    for (let i = 1; i <= count; i++) {
      const dot = document.createElement("span");
      dot.className = "dot";
      dot.dataset.value = i;
      dot.onclick = () => setRating(group, i);
      group.appendChild(dot);
    }
  });

  document.querySelectorAll(".boxes[data-track]").forEach(group => {
    const count = Number(group.dataset.count || 10);
    group.innerHTML = "";
    for (let i = 1; i <= count; i++) {
      const box = document.createElement("span");
      box.className = "box";
      box.dataset.value = i;
      box.onclick = () => cycleBox(box);
      group.appendChild(box);
    }
  });
}

function setRating(group, value) {
  const current = Number(group.dataset.value || 0);
  group.dataset.value = current === value ? 0 : value;
  group.querySelectorAll(".dot").forEach(dot => {
    dot.classList.toggle("filled", Number(dot.dataset.value) <= Number(group.dataset.value));
  });
}

function cycleBox(box) {
  if (!box.classList.contains("superficial") && !box.classList.contains("agravado")) {
    box.classList.add("superficial");
  } else if (box.classList.contains("superficial")) {
    box.classList.remove("superficial");
    box.classList.add("agravado");
  } else {
    box.classList.remove("agravado");
  }
}

function setDeep(obj, path, value) {
  const parts = path.split(".");
  let current = obj;
  parts.forEach((part, index) => {
    const isLast = index === parts.length - 1;
    const nextPart = parts[index + 1];

    if (isLast) {
      current[part] = value;
      return;
    }

    if (!current[part]) {
      current[part] = Number.isInteger(Number(nextPart)) ? [] : {};
    }

    current = current[part];
  });
}

function getDeep(obj, path) {
  return path.split(".").reduce((acc, part) => {
    if (acc === undefined || acc === null) return undefined;
    return acc[part];
  }, obj);
}

function collectData() {
  const data = {};

  document.querySelectorAll("input[data-key], textarea[data-key]").forEach(el => {
    setDeep(data, el.dataset.key, el.value);
  });

  document.querySelectorAll(".dots[data-rating]").forEach(el => {
    setDeep(data, el.dataset.rating, Number(el.dataset.value || 0));
  });

  document.querySelectorAll(".boxes[data-track]").forEach(el => {
    const values = [...el.querySelectorAll(".box")].map(box => {
      if (box.classList.contains("agravado")) return "agravado";
      if (box.classList.contains("superficial")) return "superficial";
      return "vazio";
    });

    setDeep(data, el.dataset.track, values);
  });

  return data;
}

function fillSheetFromJSON(data) {
  clearSheet();

  document.querySelectorAll("input[data-key], textarea[data-key]").forEach(el => {
    const value = getDeep(data, el.dataset.key);
    if (value !== undefined && value !== null) el.value = value;
  });

  document.querySelectorAll(".dots[data-rating]").forEach(group => {
    const value = Number(getDeep(data, group.dataset.rating) || 0);
    setRating(group, value);
  });

  document.querySelectorAll(".boxes[data-track]").forEach(group => {
    const values = getDeep(data, group.dataset.track);
    if (!Array.isArray(values)) return;

    group.querySelectorAll(".box").forEach((box, index) => {
      const state = values[index];
      box.classList.remove("superficial", "agravado");

      if (state === "superficial") box.classList.add("superficial");
      if (state === "agravado") box.classList.add("agravado");
    });
  });
}

function exportJSON() {
  const data = collectData();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = "ficha-vampiro-v5.json";
  a.click();

  URL.revokeObjectURL(url);
}

function clearSheet() {
  document.querySelectorAll("input, textarea").forEach(el => el.value = "");
  document.querySelectorAll(".dot").forEach(dot => dot.classList.remove("filled"));
  document.querySelectorAll(".dots[data-rating]").forEach(group => group.dataset.value = 0);
  document.querySelectorAll(".box").forEach(box => box.className = "box");
}

function togglePromptBox() {
  const dialog = document.getElementById("promptDialog");
  dialog.classList.toggle("hidden");
}

function closePromptDialogOnBackdrop(event) {
  if (event.target.id === "promptDialog" && !isPromptLoading()) {
    togglePromptBox();
  }
}

function isPromptLoading() {
  return !document.getElementById("promptLoading").classList.contains("hidden");
}

function setPromptLoading(isLoading) {
  const loading = document.getElementById("promptLoading");
  const textarea = document.getElementById("characterPrompt");
  const sendButton = document.getElementById("sendPromptButton");
  const dialogButtons = document.querySelectorAll("#promptDialog button");

  loading.classList.toggle("hidden", !isLoading);
  textarea.disabled = isLoading;
  sendButton.textContent = isLoading ? "Enviando..." : "Enviar Prompt";

  dialogButtons.forEach(button => {
    button.disabled = isLoading;
  });
}

function buildAIPrompt(userDescription) {
  return `
Você é um especialista em Vampiro: A Máscara V5 e um gerador de fichas de personagem.

Sua tarefa é receber uma descrição textual de um personagem e retornar exclusivamente um JSON válido representando uma ficha completa de Vampiro: A Máscara V5.

Regras obrigatórias:
1. Retorne SOMENTE JSON puro.
2. Não utilize markdown.
3. Não explique decisões.
4. Não escreva texto antes ou depois do JSON.
5. Não altere nomes de campos.
6. Não adicione campos extras.
7. Todos os campos devem existir no JSON final.
8. Todos os atributos e habilidades são números inteiros entre 0 e 5.
9. Disciplinas possuem nome e nivel, sendo nivel inteiro entre 0 e 5.
10. estado_vampirico.fome deve ser inteiro entre 0 e 5.
11. potencia_de_sangue.nivel deve ser inteiro entre 0 e 10.
12. trilhas.vitalidade, trilhas.forca_de_vontade e estado_vampirico.humanidade devem ser arrays com exatamente 10 posições.
13. Cada posição dessas trilhas deve conter somente: "vazio", "superficial" ou "agravado".
14. Caso faltem informações, complete de forma criativa e coerente com Vampiro: A Máscara V5.
15. O idioma da resposta deve ser português do Brasil.

Descrição do personagem:
${userDescription}

Retorne o JSON exatamente no formato esperado pela ficha.
`;
}

async function sendPromptToApi() {
  const prompt = document.getElementById("characterPrompt").value.trim();

  if (!prompt) {
    alert("Digite uma descrição do personagem.");
    return;
  }

  try {
    setPromptLoading(true);
    await loadCharacterFromApi(prompt);
    togglePromptBox();
  } catch (error) {
    console.error(error);
    alert("Erro ao enviar prompt para API.");
  } finally {
    setPromptLoading(false);
  }
}

async function loadCharacterFromApi(prompt = "") {
  try {
    // Integração real:
    const response = await fetch("/api/character-generator", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt: buildAIPrompt(prompt)
      })
    });
    
    if (!response.ok) throw new Error("Erro ao buscar ficha na API");
    
    const result = await response.json();
    
    if (!result.ai_enabled) {
      alert(`${result.message} Carregando ficha de exemplo.`);

      fillSheetFromJSON(getMockCharacter());

      return;
    }
    
    if (!result.success) {
      alert(result.message || "Erro ao gerar ficha.");
      return;
    }

    fillSheetFromJSON(result.data);
  } catch (error) {
    console.error(error);
    alert("Não foi possível carregar os dados da ficha.");
  }
}

function getMockCharacter() {
  return {
    personagem: {
      nome: "Sebastian De Luca",
      conceito: "Investigador Ocultista",
      predador: "Osiris",
      cronica: "Sombras de São Paulo",
      ambicao: "Descobrir quem matou seu senhor",
      cla: "Tremere",
      senhor: "Vittorio Alencar",
      desejo: "Recuperar o grimório perdido",
      geracao: "11ª"
    },
    atributos: {
      fisicos: { forca: 2, destreza: 3, vigor: 2 },
      sociais: { carisma: 3, manipulacao: 4, autocontrole: 3 },
      mentais: { inteligencia: 5, raciocinio: 4, determinacao: 4 }
    },
    trilhas: {
      vitalidade: ["vazio", "superficial", "vazio", "vazio", "vazio", "vazio", "vazio", "vazio", "vazio", "vazio"],
      forca_de_vontade: ["vazio", "agravado", "superficial", "vazio", "vazio", "vazio", "vazio", "vazio", "vazio", "vazio"]
    },
    habilidades: {
      fisicas: {
        armas_brancas: 2,
        armas_de_fogo: 1,
        atletismo: 2,
        briga: 1,
        conducao: 1,
        furtividade: 3,
        ladroagem: 1,
        oficios: 0,
        sobrevivencia: 2
      },
      sociais: {
        empatia_com_animais: 1,
        etiqueta: 3,
        intimidacao: 2,
        lideranca: 2,
        manha: 4,
        performance: 1,
        persuasao: 3,
        sagacidade: 4,
        subterfugio: 3
      },
      mentais: {
        ciencia: 3,
        erudicao: 5,
        financas: 1,
        investigacao: 4,
        medicina: 2,
        ocultismo: 5,
        percepcao: 3,
        politica: 2,
        tecnologia: 2
      }
    },
    disciplinas: [
      { nome: "Feitiçaria de Sangue", nivel: 4 },
      { nome: "Auspícios", nivel: 3 },
      { nome: "Dominação", nivel: 2 },
      { nome: "Ofuscação", nivel: 1 }
    ],
    estado_vampirico: {
      ressonancia: "Melancólica",
      fome: 2,
      humanidade: ["vazio", "vazio", "vazio", "vazio", "vazio", "vazio", "vazio", "superficial", "vazio", "vazio"]
    },
    cronica: {
      principios_da_cronica: "Jamais revelar a Máscara para mortais inocentes.",
      pilares_e_conviccoes: "Conhecimento deve ser preservado acima de tudo.",
      perdicao_do_cla: "Obcecado por desvendar segredos proibidos."
    },
    vantagens_e_defeitos: [
      { nome: "Aliados na Universidade", tipo: "vantagem", nivel: 3, descricao: "Professores e pesquisadores ajudam Sebastian." },
      { nome: "Recursos", tipo: "vantagem", nivel: 2, descricao: "Possui acesso a uma herança familiar." },
      { nome: "Inimigo Caçador", tipo: "defeito", nivel: 2, descricao: "Um inquisidor o persegue." },
      { nome: "Refúgio Oculto", tipo: "vantagem", nivel: 2, descricao: "Apartamento protegido por sigilos." }
    ],
    potencia_de_sangue: {
      nivel: 2,
      surto_de_sangue: "+2 dados",
      quantidade_recuperada: "2",
      bonus_de_poder: "+1",
      rerrolagem_de_sangue: "1",
      penalidade_de_alimentacao: "Animais não satisfazem",
      gravidade_da_perdicao: "Moderada"
    },
    experiencia: {
      total: 48,
      gasta: 41
    },
    biografia: {
      idade_verdadeira: "87 anos",
      idade_aparente: "34 anos",
      data_de_nascimento: "12/03/1939",
      data_de_morte: "18/09/1973",
      aparencia: "Homem alto, cabelos escuros penteados para trás e olhos extremamente pálidos.",
      tracos_distintivos: "Sempre usa luvas pretas e possui uma cicatriz ritualística no pescoço.",
      historia: "Sebastian era professor universitário de história antiga antes de ser Abraçado por Vittorio Alencar. Após décadas estudando ocultismo e sociedades secretas, descobriu indícios de que seu senhor foi destruído por membros da Segunda Inquisição. Desde então, atua nas sombras da cidade buscando respostas enquanto protege antigos segredos Tremere."
    },
    notas: "Carrega um medalhão ritualístico que reage à presença de sangue antigo."
  };
}

renderAttributes();
renderSkills();
renderDisciplines();
renderAdvantages();
bindRatings();
