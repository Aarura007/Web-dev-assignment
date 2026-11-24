// Get HTML elements
const expenseForm = document.getElementById("expenseForm");
const expenseName = document.getElementById("expenseName");
const expenseAmount = document.getElementById("expenseAmount");
const expenseCategory = document.getElementById("expenseCategory");
const expenseList = document.getElementById("expenseList");
const totalAmount = document.getElementById("totalAmount");
const totalCount = document.getElementById("totalCount");
const categoryFilter = document.getElementById("categoryFilter");

// Load expenses from Local Storage
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

// Save expenses
function saveExpenses() {
    localStorage.setItem("expenses", JSON.stringify(expenses));
}

// Display expenses
function displayExpenses() {

    expenseList.innerHTML = "";

    const selectedCategory = categoryFilter.value;

    const filteredExpenses = expenses.filter(expense => {
        return selectedCategory === "All" ||
            expense.category === selectedCategory;
    });

    if (filteredExpenses.length === 0) {
        expenseList.innerHTML = `
            <p class="empty-message">
                No expenses found. Add your first expense! ✨
            </p>
        `;
    }

    filteredExpenses.forEach(expense => {

        const expenseItem = document.createElement("div");
        expenseItem.className = "expense-item";

        const info = document.createElement("div");
        info.className = "expense-info";

        const name = document.createElement("h3");
        name.textContent = expense.name;

        const category = document.createElement("span");
        category.textContent = expense.category;

        info.appendChild(name);
        info.appendChild(category);

        const right = document.createElement("div");
        right.className = "expense-right";

        const amount = document.createElement("span");
        amount.className = "expense-amount";
        amount.textContent = "₹" + expense.amount.toFixed(2);

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-btn";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function () {
            deleteExpense(expense.id);
        });

        right.appendChild(amount);
        right.appendChild(deleteButton);

        expenseItem.appendChild(info);
        expenseItem.appendChild(right);

        expenseList.appendChild(expenseItem);
    });

    updateTotal();
}

// Add new expense
expenseForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const name = expenseName.value.trim();
    const amount = Number(expenseAmount.value);
    const category = expenseCategory.value;

    // Input validation
    if (name === "") {
        alert("Please enter expense name!");
        return;
    }

    if (
        expenseAmount.value.trim() === "" ||
        !Number.isFinite(amount) ||
        amount <= 0
    ) {
        alert("Please enter a valid positive amount!");
        return;
    }

    if (category === "") {
        alert("Please select a category!");
        return;
    }

    const newExpense = {
        id: Date.now() + Math.random(),
        name: name,
        amount: amount,
        category: category
    };

    expenses.push(newExpense);

    saveExpenses();

    displayExpenses();

    expenseForm.reset();

    alert("Expense added successfully! 🎉");
});

// Delete expense
function deleteExpense(id) {

    expenses = expenses.filter(expense => expense.id !== id);

    saveExpenses();

    displayExpenses();
}

// Update total expenses
function updateTotal() {

    const total = expenses.reduce((sum, expense) => {
        return sum + expense.amount;
    }, 0);

    totalAmount.textContent = "₹" + total.toFixed(2);

    totalCount.textContent = expenses.length;
}

// Category filter
categoryFilter.addEventListener("change", displayExpenses);

// Initial display
displayExpenses();