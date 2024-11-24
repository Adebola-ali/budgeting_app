// let transactions = [];

// // Function to display feedback messages
// const showFeedback = (message, type) => {
//   const feedback = document.getElementById("feedback");
//   feedback.textContent = message;
//   feedback.className = type; // Add success or error class
//   feedback.style.display = "block";

//   // Hide the message after 3 seconds
//   setTimeout(() => {
//     feedback.style.display = "none";
//   }, 3000);
// };

// // Function to fetch transactions from the backend
// const fetchTransactions = async () => {
//   try {
//     const response = await fetch("/transactions");
//     const data = await response.json();
//     transactions = data; // Store fetched transactions
//     return transactions;
//   } catch (error) {
//     console.error("Error fetching transactions:", error);
//     showFeedback("Error fetching transactions", "error");
//     return [];
//   }
// };

// // Function to post a new transaction to the backend
// const addTransaction = async (transaction) => {
//   try {
//     const response = await fetch("/transactions", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(transaction),
//     });

//     if (!response.ok) {
//       throw new Error("Failed to add transaction");
//     }

//     const newTransaction = await response.json();
//     transactions.push(newTransaction); // Add the new transaction to the array
//     renderTransactions(transactions);
//     showFeedback("Transaction added successfully", "success");
//   } catch (error) {
//     console.error("Error adding transaction:", error);
//     showFeedback("Failed to add transaction", "error");
//   }
// };

// // Function to update a transaction in the backend
// const updateTransaction = async (id, updatedTransaction) => {
//   try {
//     const response = await fetch(`/transactions/${id}`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(updatedTransaction),
//     });

//     if (!response.ok) {
//       throw new Error("Failed to update transaction");
//     }

//     const index = transactions.findIndex((t) => t.id == id);
//     if (index !== -1) {
//       transactions[index] = { id, ...updatedTransaction };
//     }

//     renderTransactions(transactions);
//     showFeedback("Transaction updated successfully", "success");
//   } catch (error) {
//     console.error("Error updating transaction:", error);
//     showFeedback("Failed to update transaction", "error");
//   }
// };

// // Function to delete a transaction in the backend
// const deleteTransaction = async (id) => {
//   try {
//     const response = await fetch(`/transactions/${id}`, {
//       method: "DELETE",
//     });

//     if (!response.ok) {
//       throw new Error("Failed to delete transaction");
//     }

//     transactions = transactions.filter((t) => t.id != id);
//     renderTransactions(transactions);
//     showFeedback("Transaction deleted successfully", "success");
//   } catch (error) {
//     console.error("Error deleting transaction:", error);
//     showFeedback("Failed to delete transaction", "error");
//   }
// };

// // Function to update totals
// const updateTotals = (transactions) => {
//   let totalIncome = 0;
//   let totalExpenses = 0;

//   transactions.forEach((transaction) => {
//     if (transaction.type === "income") {
//       totalIncome += transaction.amount;
//     } else {
//       totalExpenses += transaction.amount;
//     }
//   });

//   const balance = totalIncome - totalExpenses;

//   document.getElementById("total-income").textContent = `$${totalIncome.toFixed(
//     2
//   )}`;
//   document.getElementById(
//     "total-expenses"
//   ).textContent = `$${totalExpenses.toFixed(2)}`;
//   document.getElementById("balance").textContent = `$${balance.toFixed(2)}`;
// };

// // Function to render transactions in the UI
// const renderTransactions = (transactions) => {
//   const transactionList = document.getElementById("transactions");
//   transactionList.innerHTML = "";

//   transactions.forEach((transaction) => {
//     const listItem = document.createElement("li");
//     listItem.classList.add(transaction.type);
//     listItem.innerHTML = `
//       <span>${transaction.description}</span>
//       <span>${transaction.category}</span>
//       <span>${
//         transaction.type === "income" ? "+" : "-"
//       }$${transaction.amount.toFixed(2)}</span>
//       <button class="edit-button" data-id="${transaction.id}">Edit</button>
//       <button class="delete-button" data-id="${transaction.id}">Delete</button>
//     `;
//     transactionList.appendChild(listItem);
//   });

//   updateTotals(transactions);

//   document.querySelectorAll(".edit-button").forEach((button) => {
//     button.addEventListener("click", (e) => {
//       const transactionId = e.target.getAttribute("data-id");
//       startEditTransaction(transactionId);
//     });
//   });

//   document.querySelectorAll(".delete-button").forEach((button) => {
//     button.addEventListener("click", (e) => {
//       const transactionId = e.target.getAttribute("data-id");
//       deleteTransaction(transactionId);
//     });
//   });
// };

// // Function to start editing a transaction
// const startEditTransaction = (id) => {
//   const transaction = transactions.find((t) => t.id == id);
//   if (!transaction) {
//     console.error("Transaction not found");
//     return;
//   }

//   document.getElementById("description").value = transaction.description;
//   document.getElementById("amount").value = transaction.amount;
//   document.getElementById("type").value = transaction.type;
//   document.getElementById("category").value = transaction.category;

//   document.getElementById("transaction-form").setAttribute("data-edit-id", id);

//   const submitButton = document.querySelector("#transaction-form button");
//   submitButton.textContent = "Update Transaction";
// };

// // Handle form submission
// document
//   .getElementById("transaction-form")
//   .addEventListener("submit", async (e) => {
//     e.preventDefault();

//     const description = document.getElementById("description").value;
//     const amount = parseFloat(document.getElementById("amount").value);
//     const type = document.getElementById("type").value;
//     const category = document.getElementById("category").value;

//     if (!description || isNaN(amount) || amount <= 0) {
//       alert("Please provide a valid description, amount, and category.");
//       return;
//     }

//     const editId = document
//       .getElementById("transaction-form")
//       .getAttribute("data-edit-id");

//     if (editId) {
//       await updateTransaction(editId, {
//         description,
//         amount,
//         type,
//         category,
//       });
//     } else {
//       await addTransaction({ description, amount, type, category });
//     }

//     document.getElementById("transaction-form").reset();
//     document.getElementById("transaction-form").removeAttribute("data-edit-id");

//     const submitButton = document.querySelector("#transaction-form button");
//     submitButton.textContent = "Add Transaction";
//   });

// document.addEventListener("DOMContentLoaded", async () => {
//   const transactions = await fetchTransactions();
//   renderTransactions(transactions);
// });

// ...................................................
let transactions = [];
const categories = [
  "Groceries",
  "Entertainment",
  "Utilities",
  "Travel",
  "Other",
]; // Predefined categories

// Function to populate category dropdown
const populateCategoryDropdown = () => {
  const categoryDropdown = document.getElementById("category");
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryDropdown.appendChild(option);
  });
};

// Function to display feedback messages
const showFeedback = (message, type) => {
  const feedback = document.getElementById("feedback");
  feedback.textContent = message;
  feedback.className = type; // Add success or error class
  feedback.style.display = "block";

  setTimeout(() => {
    feedback.style.display = "none";
  }, 3000);
};

// Function to fetch transactions from the backend
const fetchTransactions = async () => {
  try {
    const response = await fetch("/transactions");
    const data = await response.json();
    transactions = data;
    return transactions;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    showFeedback("Error fetching transactions", "error");
    return [];
  }
};

// Function to post a new transaction to the backend
const addTransaction = async (transaction) => {
  try {
    const response = await fetch("/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transaction),
    });

    if (!response.ok) {
      throw new Error("Failed to add transaction");
    }

    const newTransaction = await response.json();
    transactions.push(newTransaction);
    renderTransactions(transactions);
    showFeedback("Transaction added successfully", "success");
  } catch (error) {
    console.error("Error adding transaction:", error);
    showFeedback("Failed to add transaction", "error");
  }
};

// Function to update a transaction in the backend
const updateTransaction = async (id, updatedTransaction) => {
  try {
    const response = await fetch(`/transactions/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTransaction),
    });

    if (!response.ok) {
      throw new Error("Failed to update transaction");
    }

    const index = transactions.findIndex((t) => t.id == id);
    if (index !== -1) {
      transactions[index] = { id, ...updatedTransaction };
    }

    renderTransactions(transactions);
    showFeedback("Transaction updated successfully", "success");
  } catch (error) {
    console.error("Error updating transaction:", error);
    showFeedback("Failed to update transaction", "error");
  }
};

// Function to delete a transaction in the backend
const deleteTransaction = async (id) => {
  try {
    const response = await fetch(`/transactions/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete transaction");
    }

    transactions = transactions.filter((t) => t.id != id);
    renderTransactions(transactions);
    showFeedback("Transaction deleted successfully", "success");
  } catch (error) {
    console.error("Error deleting transaction:", error);
    showFeedback("Failed to delete transaction", "error");
  }
};

// Function to update totals
const updateTotals = (transactions) => {
  let totalIncome = 0;
  let totalExpenses = 0;

  transactions.forEach((transaction) => {
    if (transaction.type === "income") {
      totalIncome += transaction.amount;
    } else {
      totalExpenses += transaction.amount;
    }
  });

  const balance = totalIncome - totalExpenses;

  document.getElementById("total-income").textContent = `$${totalIncome.toFixed(
    2
  )}`;
  document.getElementById(
    "total-expenses"
  ).textContent = `$${totalExpenses.toFixed(2)}`;
  document.getElementById("balance").textContent = `$${balance.toFixed(2)}`;
};

// Function to render transactions in the UI
const renderTransactions = (transactions) => {
  const transactionList = document.getElementById("transactions");
  transactionList.innerHTML = "";

  transactions.forEach((transaction) => {
    const listItem = document.createElement("li");
    listItem.classList.add(transaction.type);
    listItem.innerHTML = `
      <span>${transaction.description}</span>
      <span>${transaction.category}</span>
      <span>${
        transaction.type === "income" ? "+" : "-"
      }$${transaction.amount.toFixed(2)}</span>
      <button class="edit-button" data-id="${transaction.id}">Edit</button>
      <button class="delete-button" data-id="${transaction.id}">Delete</button>
    `;
    transactionList.appendChild(listItem);
  });

  updateTotals(transactions);

  document.querySelectorAll(".edit-button").forEach((button) => {
    button.addEventListener("click", (e) => {
      const transactionId = e.target.getAttribute("data-id");
      startEditTransaction(transactionId);
    });
  });

  document.querySelectorAll(".delete-button").forEach((button) => {
    button.addEventListener("click", (e) => {
      const transactionId = e.target.getAttribute("data-id");
      deleteTransaction(transactionId);
    });
  });
};

// Function to start editing a transaction
const startEditTransaction = (id) => {
  const transaction = transactions.find((t) => t.id == id);
  if (!transaction) {
    console.error("Transaction not found");
    return;
  }

  document.getElementById("description").value = transaction.description;
  document.getElementById("amount").value = transaction.amount;
  document.getElementById("type").value = transaction.type;
  document.getElementById("category").value = transaction.category;

  document.getElementById("transaction-form").setAttribute("data-edit-id", id);

  const submitButton = document.querySelector("#transaction-form button");
  submitButton.textContent = "Update Transaction";
};

// Handle form submission
document
  .getElementById("transaction-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const description = document.getElementById("description").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const type = document.getElementById("type").value;
    const category = document.getElementById("category").value;

    if (!description || isNaN(amount) || amount <= 0 || !category) {
      alert("Please provide valid inputs.");
      return;
    }

    const editId = document
      .getElementById("transaction-form")
      .getAttribute("data-edit-id");

    if (editId) {
      await updateTransaction(editId, { description, amount, type, category });
    } else {
      const newTransaction = { description, amount, type, category };
      await addTransaction(newTransaction);
    }

    document.getElementById("transaction-form").reset();
    const submitButton = document.querySelector("#transaction-form button");
    submitButton.textContent = "Add Transaction";
    document.getElementById("transaction-form").removeAttribute("data-edit-id");
  });

document.addEventListener("DOMContentLoaded", async () => {
  populateCategoryDropdown();
  const transactions = await fetchTransactions();
  renderTransactions(transactions);
});
