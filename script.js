document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("user-input")?.addEventListener("keypress", function (e) {
        if (e.key === "Enter") sendMessage();
    });

    // New: Add event listeners for the hamburger menu (mobile view)
    document.getElementById("hamburger-menu")?.addEventListener("click", toggleMenu);
});

/* ===========================
     📌 Budget Tracker
   =========================== */
let totalAmount = 0;

function addExpense() {
    let name = document.getElementById("expense-name").value.trim();
    let amount = parseFloat(document.getElementById("expense-amount").value);

    if (!name || isNaN(amount) || amount <= 0) {
        alert("Please enter a valid expense name and amount.");
        return;
    }

    totalAmount += amount;
    document.getElementById("expense-list").innerHTML += `<li>${name}: ${amount.toFixed(2)} AED</li>`;
    document.getElementById("total-amount").innerText = totalAmount.toFixed(2);

    document.getElementById("expense-name").value = "";
    document.getElementById("expense-amount").value = "";
}

/* ===========================
     📌 Savings Goals
   =========================== */
let savingsGoal = 0, savingsProgress = 0;

function setGoal() {
    let goalInput = parseFloat(document.getElementById("savings-goal").value);

    if (isNaN(goalInput) || goalInput <= 0) {
        alert("Please enter a valid savings goal.");
        return;
    }

    savingsGoal = goalInput;
    alert(`🎯 Savings goal set: ${savingsGoal} AED! Start saving.`);
    updateProgress();
}

function addSavings(amount) {
    if (savingsGoal === 0) {
        alert("Set a savings goal first!");
        return;
    }

    savingsProgress += amount;
    document.getElementById("savings-progress").innerText = savingsProgress.toFixed(2);
    updateProgress();

    if (savingsProgress >= savingsGoal) {
        goalAchieved();
    }
}

function updateProgress() {
    if (savingsGoal > 0) {
        let progressPercentage = Math.min((savingsProgress / savingsGoal) * 100, 100);
        document.getElementById("progress-fill").style.width = progressPercentage + "%";
    }
}

function goalAchieved() {
    alert("🎉 Congratulations! You've reached your savings goal!");
    document.body.classList.add("goal-reached");
    setTimeout(() => document.body.classList.remove("goal-reached"), 3000);
}

/* ===========================
     📌 Debt Planner
   =========================== */
function calculateDebt() {
    let debt = parseFloat(document.getElementById("debt-amount").value);
    let payment = parseFloat(document.getElementById("monthly-payment").value);

    if (isNaN(debt) || debt <= 0 || isNaN(payment) || payment <= 0) {
        alert("Please enter valid debt and payment amounts.");
        return;
    }

    let months = Math.ceil(debt / payment);
    document.getElementById("debt-months").innerText = months;
    generatePayoffChecklist(months);
}

function generatePayoffChecklist(months) {
    let payoffList = document.getElementById("payoff-list");
    payoffList.innerHTML = "";
    document.getElementById("payoff-section").style.display = "block";

    for (let i = 1; i <= months; i++) {
        let li = document.createElement("li");
        li.innerHTML = `<input type="checkbox" onclick="checkProgress()"> Month ${i}`;
        payoffList.appendChild(li);
    }
}

function checkProgress() {
    let checkboxes = document.querySelectorAll("#payoff-list input[type='checkbox']");
    let checkedCount = [...checkboxes].filter(cb => cb.checked).length;
    document.getElementById("success-message").style.display = checkedCount === checkboxes.length ? "block" : "none";
}

/* ===========================
     📌 Finance Chatbot (Ask MoneyMind)
   =========================== */
function sendMessage() {
    let inputField = document.getElementById("user-input");
    let userMessage = inputField.value.trim();

    if (userMessage === "") return;

    addMessage("user", userMessage);
    inputField.value = "";

    setTimeout(() => {
        let response = getBotResponse(userMessage);
        addMessage("bot", response);
    }, 1000);
}

function addMessage(sender, message) {
    let chatBox = document.getElementById("chat-box");

    if (!chatBox) {
        console.error("Chatbox not found!");
        return;
    }

    let messageClass = sender === "user" ? "user-message" : "bot-message";
    let messageElement = document.createElement("p");
    messageElement.classList.add(messageClass);
    messageElement.textContent = message;

    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function getBotResponse(question) {
    question = question.toLowerCase();
    const responses = {
        "how do i save money?": "Create a budget, track expenses, and cut unnecessary costs. Automate savings if possible.",
        "what's a good budget rule?": "The 50/30/20 rule: 50% needs, 30% wants, 20% savings/investments.",
        "how do i invest money?": "Start with index funds, stocks, or real estate. Diversify and invest wisely.",
        "how can i get out of debt?": "Focus on paying high-interest debts first, make extra payments, and avoid new debt.",
        "what is a credit score?": "A credit score represents your creditworthiness. Higher scores mean better loan offers.",
        "how do i improve my credit score?": "Pay bills on time, keep credit utilization low, and limit new credit applications.",
        "what are emergency funds?": "Money set aside for unexpected expenses. Aim for 3-6 months of living costs."
    };

    return responses[question] || "I'm not sure about that. Try asking about budgeting, saving, or investing!";
}

/* ===========================
     📌 Subscription Toggle with Payment Modal
   =========================== */
let isSubscribed = false; // Track subscription status

function toggleSubscription() {
    if (!isSubscribed) {
        // Not subscribed: open payment modal for info entry
        openPaymentModal();
    } else {
        // Already subscribed: cancel subscription
        isSubscribed = false;
        updateSubscriptionUI();
    }
}

function openPaymentModal() {
    const modal = document.getElementById("payment-modal");
    modal.style.display = "block";
}

function closePaymentModal() {
    const modal = document.getElementById("payment-modal");
    modal.style.display = "none";
}

function submitPayment(event) {
    event.preventDefault(); // Prevent default form submission

    // Retrieve payment info
    let cardNumber = document.getElementById("card-number").value.trim();
    let expiryDate = document.getElementById("expiry-date").value.trim();
    let cvv = document.getElementById("cvv").value.trim();
    let cardHolder = document.getElementById("card-holder").value.trim();

    if (!cardNumber || !expiryDate || !cvv || !cardHolder) {
        alert("Please fill in all payment details.");
        return;
    }

    // For demo purposes, assume payment is successful
    isSubscribed = true;
    updateSubscriptionUI();
    closePaymentModal();
    alert("Payment successful! You are now subscribed to Premium Hub.");
}

function updateSubscriptionUI() {
    const btn = document.getElementById("subscribe-btn");
    const statusMessage = document.getElementById("subscription-status");

    if (isSubscribed) {
        btn.innerText = "Cancel Subscription";
        statusMessage.innerText = "You are now subscribed! Enjoy premium features.";
    } else {
        btn.innerText = "Subscribe for 12 AED/month";
        statusMessage.innerText = "You are currently not subscribed.";
    }
}

// Close modal when clicking outside of modal content
window.onclick = function(event) {
    const modal = document.getElementById("payment-modal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
};

/* ===========================
     📌 Calculator
   =========================== */
let display = document.getElementById("screen-display");

function appendNumber(number) {
    display.textContent = display.textContent === "0" ? number : display.textContent + number;
}

function clearScreen() {
    display.textContent = "0";
}

function calculateTotal() {
    try {
        display.textContent = eval(display.textContent);
    } catch (e) {
        display.textContent = "Error";
    }
}

// Toggle the nav menu on smaller screens (hamburger click)
// Function to toggle the sidebar visibility
function toggleMenu() {
    let sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active'); // Toggle the 'active' class to show or hide the sidebar
}


// Add an event listener to the progress bar (or button, depending on your design)
document.getElementById('progress-bar').addEventListener('click', function() {
    let sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active'); // Toggle visibility class
});

// Optional: If you want to click outside the sidebar to close it
document.addEventListener('click', function(event) {
    let sidebar = document.getElementById('sidebar');
    if (!sidebar.contains(event.target) && !event.target.matches('#progress-bar')) {
        sidebar.classList.remove('active');
    }
});

