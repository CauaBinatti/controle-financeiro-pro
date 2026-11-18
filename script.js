const form = document.getElementById('transactionForm');
const tbody = document.querySelector('#transactionTable tbody');

let transactions = JSON.parse(localStorage.getItem('financas_pro_db')) || [];

function formatCurrency(value) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function updateSummary() {
    const amounts = transactions.map(t => t.amount);
    
    const income = amounts
        .filter(item => item > 0)
        .reduce((acc, item) => acc + item, 0);

    const expense = amounts
        .filter(item => item < 0)
        .reduce((acc, item) => acc + item, 0);

    const total = income + expense;

    document.getElementById('incomeDisplay').innerText = formatCurrency(income);
    document.getElementById('expenseDisplay').innerText = formatCurrency(Math.abs(expense));
    document.getElementById('totalDisplay').innerText = formatCurrency(total);
}

function renderTable() {
    tbody.innerHTML = '';

    transactions.forEach((transaction, index) => {
        const tr = document.createElement('tr');
        const amountClass = transaction.amount >= 0 ? 'positive' : 'negative';
        const formattedDate = transaction.date.split('-').reverse().join('/');

        tr.innerHTML = `
            <td>${transaction.description}</td>
            <td class="${amountClass}">${formatCurrency(transaction.amount)}</td>
            <td>${formattedDate}</td>
            <td><button class="delete-btn" onclick="removeTransaction(${index})">Excluir</button></td>
        `;
        tbody.appendChild(tr);
    });

    updateSummary();
    localStorage.setItem('financas_pro_db', JSON.stringify(transactions));
}

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const date = document.getElementById('date').value;

    transactions.push({ description, amount, date });
    form.reset();
    renderTable();
});

function removeTransaction(index) {
    transactions.splice(index, 1);
    renderTable();
}

renderTable();
