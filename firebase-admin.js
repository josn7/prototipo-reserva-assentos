import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "sua-api-key",
  authDomain: "seu-dominio.firebaseapp.com",
  projectId: "seu-project-id",
  storageBucket: "seu-bucket.appspot.com",
  messagingSenderId: "seu-sender-id",
  appId: "seu-app-id"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Referência à tabela
const corpoTabela = document.getElementById("corpo-tabela");

async function carregarReservas() {
  const snapshot = await getDocs(collection(db, "reservas"));
  snapshot.forEach(doc => {
    const dados = doc.data();

    const linha = document.createElement("tr");

    linha.innerHTML = `
  <td>${dados.nome}</td>
  <td>${dados.assento}</td>
  <td>${dados.igreja}</td>
  <td>${dados.tipoDocumento}</td>
  <td>${dados.documento}</td>
  <td>${dados.orgao}</td>
  <td><a href="${dados.comprovanteURL}" target="_blank">Ver</a></td>
  <td>
    <button class="btn-editar" data-id="${id}">Editar</button>
    <button class="btn-excluir" data-id="${id}">Excluir</button>
  </td>
`;

  
    corpoTabela.appendChild(linha);
  });
}

carregarReservas();

import { updateDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

document.addEventListener("click", async (e) => {
  const linha = e.target.closest("tr");

  if (e.target.classList.contains("btn-excluir")) {
    const id = e.target.dataset.id;
    const confirmar = confirm("Deseja excluir esta reserva?");
    if (confirmar) {
      await deleteDoc(doc(db, "reservas", id));
      linha.remove();
    }
  }

  if (e.target.classList.contains("btn-editar")) {
    e.preventDefault();
    const id = e.target.dataset.id;

    // Pegamos os valores das células
    const celulas = linha.querySelectorAll("td");
    const valores = Array.from(celulas).map(c => c.innerText);

    // Transformamos as células editáveis (exceto comprovante e ações)
    celulas[0].innerHTML = `<input type="text" value="${valores[0]}">`; // nome
    celulas[1].innerHTML = `<input type="text" value="${valores[1]}">`; // assento
    celulas[2].innerHTML = `<input type="text" value="${valores[2]}">`; // igreja
    celulas[3].innerHTML = `<input type="text" value="${valores[3]}">`; // tipoDoc
    celulas[4].innerHTML = `<input type="text" value="${valores[4]}">`; // doc
    celulas[5].innerHTML = `<input type="text" value="${valores[5]}">`; // orgão

    e.target.textContent = "Salvar";
    e.target.classList.remove("btn-editar");
    e.target.classList.add("btn-salvar");
  }

  if (e.target.classList.contains("btn-salvar")) {
    e.preventDefault();
    const id = e.target.dataset.id;
    const inputs = linha.querySelectorAll("input");

    const [nome, assento, igreja, tipoDocumento, documento, orgao] = Array.from(inputs).map(input => input.value);

    // Atualiza no Firestore
    await updateDoc(doc(db, "reservas", id), {
      nome, assento, igreja, tipoDocumento, documento, orgao
    });

    // Atualiza visualmente a linha
    linha.children[0].textContent = nome;
    linha.children[1].textContent = assento;
    linha.children[2].textContent = igreja;
    linha.children[3].textContent = tipoDocumento;
    linha.children[4].textContent = documento;
    linha.children[5].textContent = orgao;

    // Devolve o botão ao estado original
    e.target.textContent = "Editar";
    e.target.classList.remove("btn-salvar");
    e.target.classList.add("btn-editar");
  }
});
