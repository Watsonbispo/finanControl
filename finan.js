const tbody = document.querySelector("tbody");
const descItem = document.getElementById("desc");
const amount = document.getElementById("amount");
const type = document.getElementById("type");
const btnNew = document.getElementById("btnNew");
const monthSelect = document.getElementById("month");

const incomes = document.querySelector(".incomes");
const expenses = document.querySelector(".expenses");
const total = document.querySelector(".total");

let items = [];
let currentMonth = monthSelect.value;

function getItensDB() {
  const data = localStorage.getItem("db_items");
  if (!data) return {};
  try {
    return JSON.parse(data);
  } catch {
    return {};
  }
}

function setItensDB(db) {
  localStorage.setItem("db_items", JSON.stringify(db));
}

function loadItens() {
  const db = getItensDB();
  items = db[currentMonth] || [];
  tbody.innerHTML = "";
  items.forEach((item, index) => {
    insertItems(item, index);
  });
  getTotals();
}

btnNew.addEventListener("click", () => {
  const desc = descItem.value.trim();
  const amt = parseFloat(amount.value);
  const tp = type.value;

  if (!desc || isNaN(amt) || !tp) {
    alert("Preencha todos os campos corretamente!");
    return;
  }

  items.push({
    desc: desc,
    amount: amt, // <-- Aqui garantimos que seja número
    type: tp,
  });

  saveItems();
  loadItens();

  descItem.value = "";
  amount.value = "";
});

function saveItems() {
  const db = getItensDB();
  db[currentMonth] = items;
  setItensDB(db);
}

function insertItems(item, index) {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${item.desc}</td>
    <td>${item.amount.toFixed(2)}</td>
    <td class="columnType">
      ${
        item.type === "Entrada"
          ? '<i class="bx bxs-chevron-up-circle"></i>'
          : '<i class="bx bxs-chevron-down-circle"></i>'
      }
    </td>
    <td class="columnAction">
      <button onclick="deleteItem(${index})"><i class="bx bx-trash"></i></button>
    </td>
  `;
  tbody.appendChild(tr);
}

function deleteItem(index) {
  items.splice(index, 1);
  saveItems();
  loadItens();
}

function getTotals() {
  const amountIncomes = items
    .filter((item) => item.type === "Entrada")
    .reduce((acc, cur) => acc + cur.amount, 0);
  const amountExpenses = items
    .filter((item) => item.type === "Saída")
    .reduce((acc, cur) => acc + cur.amount, 0);
  const totalItems = amountIncomes - amountExpenses;

  incomes.textContent = amountIncomes.toFixed(2);
  expenses.textContent = amountExpenses.toFixed(2);
  total.textContent = totalItems.toFixed(2);
}

monthSelect.addEventListener("change", () => {
  currentMonth = monthSelect.value;
  loadItens();
});

window.onload = () => {
  currentMonth = monthSelect.value;
  loadItens();
};