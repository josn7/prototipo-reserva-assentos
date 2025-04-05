document.addEventListener("DOMContentLoaded", () => {
    const mapa = document.getElementById("mapa-assentos");
    const form = document.getElementById("form-reserva");
    const inputAssento = document.getElementById("assentoSelecionado");
  
    let assentoAtual = null;
  
    async function carregarAssentos() {
      const snapshot = await getDocs(collection(db, "reservas"));
      const ocupados = [];
  
      snapshot.forEach(doc => {
        const data = doc.data();
        ocupados.push(Number(data.assento));
      });
  
      for (let i = 1; i <= 50; i++) {
        const assento = document.createElement("button");
        assento.classList.add("assento");
        assento.textContent = i;
  
        if (ocupados.includes(i)) {
          assento.classList.add("ocupado");
          assento.disabled = true;
        } else {
          assento.addEventListener("click", (e) => {
            e.preventDefault();
  
            document.querySelectorAll(".assento.selecionado").forEach(a => {
              a.classList.remove("selecionado");
            });
  
            assento.classList.add("selecionado");
            assentoAtual = i;
            inputAssento.value = i;
          });
        }
  
        if ((i - 1) % 4 === 0) {
          const fileira = document.createElement("div");
          fileira.classList.add("fileira");
          mapa.appendChild(fileira);
        }
  
        mapa.lastChild.appendChild(assento);
  
        if (i % 2 === 0 && i % 4 !== 0) {
          const corredor = document.createElement("div");
          corredor.classList.add("corredor");
          mapa.lastChild.appendChild(corredor);
        }
      }
    }
  
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
  
      if (!inputAssento.value) {
        alert("Por favor, selecione um assento antes de continuar.");
        return;
      }
  
      const dados = {
        nome: form.nome.value,
        idade: form.idade.value,
        tipoDocumento: form.tipoDocumento.value,
        documento: form.documento.value,
        orgao: form.orgao.value,
        igreja: form.igreja.value,
        assento: Number(inputAssento.value),
        comprovanteURL: urlComprovante
      };
      
  
      try {
        await addDoc(collection(db, "reservas"), dados);
        alert("Assento reservado com sucesso!");
        location.reload();
      } catch (err) {
        console.error("Erro ao salvar:", err);
        alert("Ocorreu um erro ao reservar o assento.");
      }
    });
  
    carregarAssentos();
  });
  