// ================= USERS & DATA =================
let users = JSON.parse(localStorage.getItem("pcUsers") || "{}");
let categories = JSON.parse(localStorage.getItem("pcCategories") || JSON.stringify({
    "Monitor": [
        "AOPEN 22CV1Q","GALAX VIVANCE 02 24\"","GAMDIAS ATLAS DHD32C","GAMDIAS ATLAS HD24IF III",
        "GAMDIAS ATLAS HD27H II","GAMDIAS ATLAS HD27IF III","GAMDIAS ATLAS HD27G II",
        "GAMDIAS VENUS HD24IFW III","GAMDIAS VENUS HD27IFW II","GIGABYTE GS25F2",
        "GAMDIAS APOLLO WQ35VF","LENOVO LEGION","VIEWSONIC VA24G1-H"
    ],
    "Printer": ["CANON PIXMA MG2570S","EPSON L3210","EPSON L121"],
    "Case": [
        "Galax Rev 6","INPLAY LITE X220","COOLMAN SPECTRA black","JUNGLE LEOPARD MS-01 (WHITE)",
        "JUNGLE LEOPARD MS-01 (BLACK)","1ST Player SP7","NESO P1w","Y40","LIAN LI",
        "ARTISAN (WHT)","ARTISAN (BLK)","FSP","1ST PLAYER MIKU 7 WH","DARKFLASH DB330M WH","YGT N195 BLACK"
    ],
    "Fans & Coolers": [
        "JUNGLE LEOPARD INTERSTELLAR V2 3n1 (BLK)","JUNGLE LEOPARD INTERSTELLAR V2 3n1 (WH)",
        "JUNGLE LEOPARD ASTRO V2 3 IN 1 (WHT)","DEEPCOOL FC120 (WHT)","YGT ARGB FAN 1250",
        "SYSTEM FANS M01 INPLAY (BLK)","DEEPCOOL LIQUID COOLER 240","STOCK COOLER WRAITH PRISM","STOCK COOLER"
    ],
    "Power Supply": [
        "ACER 550W BLACK","ACER 750W BLACK","ACER 1000W BLACK","VITA GM 1000W BLACK",
        "VITA GM 850W BLACK","SEASONIC CORE GX750W BLACK","SEASONIC CORE GX750W WHITE",
        "GENERIC YGT 750W BLACK","THERMALTAKE 650W BLACK","CX SERIES CORSAIR CX750",
        "COOLER MASTER ELITE NEX N500 230V","COOLER MASTER ELITE NEX N600 230V",
        "GALAX OMEGA GL500SW","OVATION ULTRAPOWER 1000W","OVATION ULTRAPOWER 5500W"
    ],
    "Motherboard": [
        "MSI B550M PRO-VDH WIFI","MSI PRO B650M-B","ASROCK B550M PRO RS","GIGABYTE B450M K",
        "ASUS EX-H610M-V3 D4","AORUS B650 ELITE AX ICE","COLORFUL BATTLE-AX B650M-PLUS"
    ]
}));

// Stock history for tracking changes by date
let stockHistory = JSON.parse(localStorage.getItem("pcStockHistory") || "{}");

// Color codes - subtle pastel colors
const categoryColors = {
    "Monitor": "#FFEBEE",      // Very light red
    "Printer": "#F3E5F5",      // Very light purple
    "Case": "#E8EAF6",         // Very light indigo
    "Fans & Coolers": "#E0F2F1", // Very light teal
    "Power Supply": "#FFF3E0",   // Very light orange
    "Motherboard": "#E8F5E9",    // Very light green
    "Default": "#F5F5F5"        // Very light gray
};

const columnColors = {
    "tech": "#E3F2FD",  // Very light blue
    "shop": "#F3E5F5",  // Very light purple  
    "sold": "#FFF3E0",  // Very light orange
    "total": "#E8F5E8"  // Very light green
};

let stock = JSON.parse(localStorage.getItem("pcStock") || "{}");
let logs = JSON.parse(localStorage.getItem("pcLogs") || "[]");
let currentStaff = "";
let staffDisplayName = "";
let currentDate = new Date().toISOString().split('T')[0];

// Initialize stock if empty
function initializeStock() {
    if (Object.keys(stock).length === 0) {
        for(const c in categories){
            stock[c] = {};
            categories[c].forEach(m => stock[c][m] = {tech:0, shop:0, sold:0});
        }
        saveStock();
        saveStockHistory();
    }
}

// Save functions
function saveStock() {
    localStorage.setItem("pcStock", JSON.stringify(stock));
}

function saveCategories() {
    localStorage.setItem("pcCategories", JSON.stringify(categories));
}

function saveLogs() {
    localStorage.setItem("pcLogs", JSON.stringify(logs));
}

function saveStockHistory() {
    const today = new Date().toISOString().split('T')[0];
    stockHistory[today] = JSON.parse(JSON.stringify(stock));
    localStorage.setItem("pcStockHistory", JSON.stringify(stockHistory));
}

// Get stock for specific date
function getStockForDate(date) {
    return stockHistory[date] || initializeEmptyStock();
}

function initializeEmptyStock() {
    const emptyStock = {};
    for(const c in categories){
        emptyStock[c] = {};
        categories[c].forEach(m => emptyStock[c][m] = {tech:0, shop:0, sold:0});
    }
    return emptyStock;
}

// Get display name for logs
function getDisplayName() {
    return staffDisplayName || currentStaff;
}

// ================= DOM ELEMENTS =================
const loginModal = document.getElementById("loginModal");
const mainContent = document.getElementById("mainContent");

// Login elements
const staffNameInput = document.getElementById("staffNameInput");
const adminPassInput = document.getElementById("adminPassInput");
const loginBtn = document.getElementById("loginBtn");
const loginError = document.getElementById("loginError");
const currentUserSpan = document.getElementById("currentUserSpan");
const showCreateForm = document.getElementById("showCreateForm");
const createAccountForm = document.getElementById("createAccountForm");
const loginForm = document.getElementById("loginForm");
const newUsername = document.getElementById("newUsername");
const newPassword = document.getElementById("newPassword");
const createBtn = document.getElementById("createBtn");
const backToLogin = document.getElementById("backToLogin");
const createError = document.getElementById("createError");

// Staff display name
const staffDisplayNameInput = document.getElementById("staffDisplayName");

// Search & Action elements
const searchModelInput = document.getElementById("searchModel");
const modelSelect = document.getElementById("modelSelect");
const actionSelect = document.getElementById("actionSelect");
const qtyInput = document.getElementById("qtyInput");
const processBtn = document.getElementById("processBtn");

// Add Model elements
const addModelName = document.getElementById("addModelName");
const addModelCategory = document.getElementById("addModelCategory");
const addModelBtn = document.getElementById("addModelBtn");

// Remove Model elements
const removeModelSearch = document.getElementById("removeModelSearch");
const removeModelSelect = document.getElementById("removeModelSelect");
const removeModelBtn = document.getElementById("removeModelBtn");

// Rename Model elements
const renameModelSearch = document.getElementById("renameModelSearch");
const renameModelSelect = document.getElementById("renameModelSelect");
const renameModelNewName = document.getElementById("renameModelNewName");
const renameModelBtn = document.getElementById("renameModelBtn");

// Category elements
const addCategoryName = document.getElementById("addCategoryName");
const addCategoryBtn = document.getElementById("addCategoryBtn");
const removeCategorySelect = document.getElementById("removeCategorySelect");
const removeCategoryBtn = document.getElementById("removeCategoryBtn");

// Erase buttons
const eraseStockBtn = document.getElementById("eraseStockBtn");
const eraseBtn = document.getElementById("eraseBtn");

// Date and tools
const datePicker = document.getElementById("datePicker");
const todayBtn = document.getElementById("todayBtn");
const exportBtn = document.getElementById("exportBtn");
const viewLogsBtn = document.getElementById("viewLogsBtn");

// Other elements
const stockContainer = document.getElementById("stockContainer");
const logoutBtn = document.getElementById("logoutBtn");
const closeLogsBtn = document.getElementById("closeLogsBtn");
const logsSidebar = document.getElementById("logsSidebar");
const logContent = document.getElementById("logContent");

// ================= ACTION NOTIFICATION POPUP =================
function showActionNotification(title, message, type = "success") {
    // Remove any existing action notification
    const existing = document.querySelector('.action-notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `action-notification ${type}`;
    notification.innerHTML = `
        <h3>${title}</h3>
        <p>${message}</p>
        <button class="close-btn">Close</button>
    `;
    
    document.body.appendChild(notification);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.close-btn');
    closeBtn.onclick = () => notification.remove();
    
    // Auto-close after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }
    }, 3000);
}

// ================= TOAST NOTIFICATIONS =================
function showToast(message, type = "info") {
    const toastContainer = document.getElementById("toastContainer") || (() => {
        const container = document.createElement("div");
        container.id = "toastContainer";
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 10px;
            max-width: 400px;
        `;
        document.body.appendChild(container);
        return container;
    })();
    
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.style.cssText = `
        background: ${type === "success" ? "#4CAF50" : 
                     type === "error" ? "#f44336" : 
                     type === "warning" ? "#FF9800" : "#2196F3"};
        color: white;
        padding: 15px 20px;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideIn 0.3s ease, fadeOut 0.3s ease 2.7s forwards;
        max-width: 400px;
        word-wrap: break-word;
        font-weight: 500;
    `;
    
    // Add icon based on type
    const icon = document.createElement("span");
    icon.textContent = type === "success" ? "✅" : 
                      type === "error" ? "❌" : 
                      type === "warning" ? "⚠️" : "ℹ️";
    toast.appendChild(icon);
    
    const messageSpan = document.createElement("span");
    messageSpan.textContent = message;
    toast.appendChild(messageSpan);
    
    toastContainer.appendChild(toast);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.style.animation = "slideOut 0.3s ease forwards";
            setTimeout(() => toast.remove(), 300);
        }
    }, 3000);
}

// Add CSS animations for toast if not already added
if (!document.querySelector('#toastStyles')) {
    const style = document.createElement('style');
    style.id = 'toastStyles';
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        .action-notification {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            z-index: 10001;
            min-width: 300px;
            text-align: center;
            animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translate(-50%, -60%); }
            to { opacity: 1; transform: translate(-50%, -50%); }
        }
        .action-notification.success {
            border-top: 4px solid #4CAF50;
        }
        .action-notification.error {
            border-top: 4px solid #f44336;
        }
        .action-notification.info {
            border-top: 4px solid #2196F3;
        }
        .action-notification.warning {
            border-top: 4px solid #FF9800;
        }
        .action-notification h3 {
            margin: 0 0 10px 0;
            color: #333;
        }
        .action-notification p {
            margin: 0 0 15px 0;
            color: #666;
        }
        .action-notification .close-btn {
            margin-top: 10px;
            padding: 8px 20px;
            background: #2196F3;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        }
        .action-notification .close-btn:hover {
            background: #1976D2;
        }
    `;
    document.head.appendChild(style);
}

// ================= INITIALIZE =================
initializeStock();
populateAllDropdowns();
renderStock();
updateTotalSummary();
setTodayDate();

// ================= LOGIN FUNCTIONS =================
loginBtn.onclick = () => {
    const username = staffNameInput.value.trim();
    const password = adminPassInput.value.trim();
    
    if(!username || !password){
        showActionNotification("Login Error", "Please enter username and password", "error");
        return;
    }
    
    if(!users[username] || users[username].password !== password){
        showActionNotification("Login Failed", "Invalid username or password", "error");
        return;
    }
    
    currentStaff = username;
    staffDisplayName = username; // Set default to username
    staffDisplayNameInput.value = username;
    
    loginModal.style.display = "none";
    mainContent.classList.remove("hidden");
    currentUserSpan.textContent = `Logged in as: ${username}`;
    
    showActionNotification("Welcome Back!", `Successfully logged in as ${username}`, "success");
};

showCreateForm.onclick = () => {
    loginForm.classList.add("hidden");
    createAccountForm.classList.remove("hidden");
    createError.textContent = "";
};

backToLogin.onclick = () => {
    createAccountForm.classList.add("hidden");
    loginForm.classList.remove("hidden");
    createError.textContent = "";
    newUsername.value = "";
    newPassword.value = "";
};

createBtn.onclick = () => {
    const username = newUsername.value.trim();
    const password = newPassword.value.trim();
    
    if(!username || !password){
        createError.textContent = "Please fill all fields";
        return;
    }
    
    if(users[username]){
        createError.textContent = "Username already exists";
        return;
    }
    
    users[username] = {password: password};
    localStorage.setItem("pcUsers", JSON.stringify(users));
    
    alert("Account created successfully!");
    backToLogin.onclick();
};

// Update staff display name when changed
staffDisplayNameInput.addEventListener("input", () => {
    staffDisplayName = staffDisplayNameInput.value.trim();
});

// ================= DROPDOWN FUNCTIONS =================
function populateAllDropdowns() {
    populateModelSelect();
    populateAddModelCategory();
    populateRemoveModelSelect();
    populateRemoveCategorySelect();
    populateRenameModelSelect();
}

function populateModelSelect() {
    modelSelect.innerHTML = '';
    const searchTerm = searchModelInput.value.toLowerCase();
    let hasResults = false;
    
    // Group by category
    const categoriesWithModels = {};
    
    // First, collect all matching models by category
    for(const category in stock){
        categoriesWithModels[category] = [];
        Object.keys(stock[category]).forEach(model => {
            if(searchTerm === "" || model.toLowerCase().includes(searchTerm) || category.toLowerCase().includes(searchTerm)){
                categoriesWithModels[category].push(model);
                hasResults = true;
            }
        });
    }
    
    // Then create dropdown with categories
    for(const category in categoriesWithModels){
        if(categoriesWithModels[category].length > 0){
            // Add category header as option (disabled)
            const categoryOption = document.createElement("option");
            categoryOption.textContent = `──────── ${category} ────────`;
            categoryOption.disabled = true;
            categoryOption.style.backgroundColor = "#f0f0f0";
            categoryOption.style.fontWeight = "bold";
            modelSelect.appendChild(categoryOption);
            
            // Add models under this category
            categoriesWithModels[category].forEach(model => {
                const option = document.createElement("option");
                option.value = model;
                option.textContent = model;
                option.dataset.category = category;
                modelSelect.appendChild(option);
            });
        }
    }
    
    if(!hasResults){
        const option = document.createElement("option");
        option.value = "";
        option.textContent = searchTerm === "" ? "No models available" : "No matching models found";
        option.disabled = true;
        modelSelect.appendChild(option);
    }
}

function populateAddModelCategory() {
    addModelCategory.innerHTML = '<option value="">Select Category</option>';
    for(const category in categories){
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        addModelCategory.appendChild(option);
    }
}

function populateRemoveModelSelect() {
    removeModelSelect.innerHTML = '';
    const searchTerm = removeModelSearch.value.toLowerCase();
    let hasResults = false;
    
    // Group by category
    const categoriesWithModels = {};
    
    // First, collect all matching models by category
    for(const category in stock){
        categoriesWithModels[category] = [];
        Object.keys(stock[category]).forEach(model => {
            if(searchTerm === "" || model.toLowerCase().includes(searchTerm) || category.toLowerCase().includes(searchTerm)){
                categoriesWithModels[category].push(model);
                hasResults = true;
            }
        });
    }
    
    // Then create dropdown with categories
    for(const category in categoriesWithModels){
        if(categoriesWithModels[category].length > 0){
            // Add category header as option (disabled)
            const categoryOption = document.createElement("option");
            categoryOption.textContent = `──────── ${category} ────────`;
            categoryOption.disabled = true;
            categoryOption.style.backgroundColor = "#f0f0f0";
            categoryOption.style.fontWeight = "bold";
            removeModelSelect.appendChild(categoryOption);
            
            // Add models under this category
            categoriesWithModels[category].forEach(model => {
                const option = document.createElement("option");
                option.value = `${category}|${model}`;
                option.textContent = model;
                removeModelSelect.appendChild(option);
            });
        }
    }
    
    if(!hasResults){
        const option = document.createElement("option");
        option.value = "";
        option.textContent = searchTerm === "" ? "No models available" : "No matching models found";
        option.disabled = true;
        removeModelSelect.appendChild(option);
    }
}

function populateRemoveCategorySelect() {
    removeCategorySelect.innerHTML = '<option value="">Select Category to Remove</option>';
    for(const category in categories){
        const option = document.createElement("option");
        option.value = category;
        option.textContent = `${category} (${categories[category].length} models)`;
        removeCategorySelect.appendChild(option);
    }
}

function populateRenameModelSelect() {
    renameModelSelect.innerHTML = '';
    const searchTerm = renameModelSearch.value.toLowerCase();
    let hasResults = false;
    
    // Group by category
    const categoriesWithModels = {};
    
    // First, collect all matching models by category
    for(const category in stock){
        categoriesWithModels[category] = [];
        Object.keys(stock[category]).forEach(model => {
            if(searchTerm === "" || model.toLowerCase().includes(searchTerm) || category.toLowerCase().includes(searchTerm)){
                categoriesWithModels[category].push(model);
                hasResults = true;
            }
        });
    }
    
    // Then create dropdown with categories
    for(const category in categoriesWithModels){
        if(categoriesWithModels[category].length > 0){
            // Add category header as option (disabled)
            const categoryOption = document.createElement("option");
            categoryOption.textContent = `──────── ${category} ────────`;
            categoryOption.disabled = true;
            categoryOption.style.backgroundColor = "#f0f0f0";
            categoryOption.style.fontWeight = "bold";
            renameModelSelect.appendChild(categoryOption);
            
            // Add models under this category
            categoriesWithModels[category].forEach(model => {
                const option = document.createElement("option");
                option.value = `${category}|${model}`;
                option.textContent = model;
                renameModelSelect.appendChild(option);
            });
        }
    }
    
    if(!hasResults){
        const option = document.createElement("option");
        option.value = "";
        option.textContent = searchTerm === "" ? "No models available" : "No matching models found";
        option.disabled = true;
        renameModelSelect.appendChild(option);
    }
}

// ================= INSTANT SEARCH FUNCTIONS =================
// Main search model input - INSTANT filtering
searchModelInput.addEventListener("input", () => {
    populateModelSelect();
});

// Remove model search input - INSTANT filtering
removeModelSearch.addEventListener("input", () => {
    populateRemoveModelSelect();
});

// Rename model search input - INSTANT filtering
renameModelSearch.addEventListener("input", () => {
    populateRenameModelSelect();
});

// Date functionality
datePicker.addEventListener("change", () => {
    const selectedDate = datePicker.value;
    if(selectedDate) {
        currentDate = selectedDate;
        const historicalStock = getStockForDate(selectedDate);
        renderStock(historicalStock);
        showToast(`Showing stock for ${selectedDate}`, "info");
    }
});

function setTodayDate() {
    const today = new Date().toISOString().split('T')[0];
    datePicker.value = today;
    currentDate = today;
    renderStock();
    showToast("Showing current stock", "info");
}

// Get category color
function getCategoryColor(category) {
    return categoryColors[category] || categoryColors["Default"];
}

// ================= ADD MODEL =================
addModelBtn.onclick = () => {
    const modelName = addModelName.value.trim();
    const category = addModelCategory.value;
    
    if(!modelName){
        showActionNotification("Error", "Please enter model name", "error");
        return;
    }
    
    if(!category){
        showActionNotification("Error", "Please select a category", "error");
        return;
    }
    
    // Check if model already exists
    for(const cat in stock){
        if(stock[cat][modelName]){
            showActionNotification("Model Exists", `Model "${modelName}" already exists in category "${cat}"`, "error");
            return;
        }
    }
    
    // Add model
    categories[category].push(modelName);
    stock[category][modelName] = {tech:0, shop:0, sold:0};
    
    saveCategories();
    saveStock();
    saveStockHistory();
    
    // Clear input and refresh
    addModelName.value = "";
    populateAllDropdowns();
    renderStock();
    updateTotalSummary();
    
    addLog("add", getDisplayName(), modelName, category, 0);
    showActionNotification("Model Added", `Successfully added "${modelName}" to "${category}"`, "success");
};

// ================= REMOVE MODEL =================
removeModelBtn.onclick = () => {
    const selectedValue = removeModelSelect.value;
    
    if(!selectedValue || selectedValue.includes("|") === false){
        showActionNotification("Error", "Please select a model to remove", "error");
        return;
    }
    
    const [category, modelName] = selectedValue.split("|");
    
    if(!confirm(`Are you sure you want to remove "${modelName}" from category "${category}"?`)){
        return;
    }
    
    // Remove from categories array
    categories[category] = categories[category].filter(m => m !== modelName);
    
    // Remove from stock
    delete stock[category][modelName];
    
    // If category becomes empty, remove it
    if(Object.keys(stock[category]).length === 0){
        delete categories[category];
        delete stock[category];
    }
    
    saveCategories();
    saveStock();
    saveStockHistory();
    populateAllDropdowns();
    renderStock();
    updateTotalSummary();
    
    addLog("remove", getDisplayName(), modelName, category, 0);
    showActionNotification("Model Removed", `Successfully removed "${modelName}" from "${category}"`, "info");
};

// ================= RENAME MODEL =================
renameModelBtn.onclick = () => {
    const selectedValue = renameModelSelect.value;
    const newName = renameModelNewName.value.trim();
    
    if(!selectedValue || !selectedValue.includes("|")){
        showActionNotification("Error", "Please select a model to rename", "error");
        return;
    }
    
    if(!newName){
        showActionNotification("Error", "Please enter new model name", "error");
        return;
    }
    
    const [category, oldName] = selectedValue.split("|");
    
    if(newName === oldName){
        showActionNotification("Error", "New name is the same as old name", "error");
        return;
    }
    
    // Check if new name already exists
    for(const cat in stock){
        if(stock[cat][newName]){
            showActionNotification("Model Exists", `Model "${newName}" already exists in category "${cat}"`, "error");
            return;
        }
    }
    
    // Rename in categories array
    const index = categories[category].indexOf(oldName);
    if(index > -1){
        categories[category][index] = newName;
    }
    
    // Rename in stock
    stock[category][newName] = stock[category][oldName];
    delete stock[category][oldName];
    
    saveCategories();
    saveStock();
    saveStockHistory();
    
    // Clear input and refresh
    renameModelNewName.value = "";
    renameModelSearch.value = "";
    populateAllDropdowns();
    renderStock();
    updateTotalSummary();
    
    addLog("rename", getDisplayName(), oldName, category, 0, newName);
    showActionNotification("Model Renamed", `Successfully renamed "${oldName}" to "${newName}"`, "success");
};

// ================= CATEGORY MANAGEMENT =================
addCategoryBtn.onclick = () => {
    const categoryName = addCategoryName.value.trim();
    
    if(!categoryName){
        showActionNotification("Error", "Please enter category name", "error");
        return;
    }
    
    // Capitalize first letter
    const formattedName = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
    
    if(categories[formattedName]){
        showActionNotification("Category Exists", `Category "${formattedName}" already exists`, "error");
        return;
    }
    
    categories[formattedName] = [];
    stock[formattedName] = {};
    
    // Assign a color for new category
    const colorKeys = Object.keys(categoryColors);
    const defaultColors = colorKeys.filter(k => k !== "Default");
    categoryColors[formattedName] = categoryColors[defaultColors[Object.keys(categories).length % defaultColors.length]];
    
    saveCategories();
    saveStock();
    saveStockHistory();
    
    // Clear input and refresh
    addCategoryName.value = "";
    populateAllDropdowns();
    renderStock();
    
    addLog("add_category", getDisplayName(), "", formattedName, 0);
    showActionNotification("Category Added", `Successfully added category "${formattedName}"`, "success");
};

removeCategoryBtn.onclick = () => {
    const category = removeCategorySelect.value;
    
    if(!category){
        showActionNotification("Error", "Please select a category to remove", "error");
        return;
    }
    
    const modelCount = Object.keys(stock[category] || {}).length;
    
    if(!confirm(`⚠️ WARNING: This will delete ALL ${modelCount} models in "${category}"!\n\nAre you sure?`)){
        return;
    }
    
    // Delete category
    delete categories[category];
    delete stock[category];
    
    saveCategories();
    saveStock();
    saveStockHistory();
    populateAllDropdowns();
    renderStock();
    updateTotalSummary();
    
    addLog("remove_category", getDisplayName(), "", category, modelCount);
    showActionNotification("Category Removed", `Removed category "${category}" with ${modelCount} models`, "warning");
};

// ================= ERASE FUNCTIONS =================
eraseStockBtn.onclick = () => {
    if(!confirm("⚠️ This will reset ALL stock counts to ZERO!\n\nTech, Shop, and Sold will become 0.\n\nAre you sure?")){
        return;
    }
    
    // Reset all stock counts to zero
    for(const category in stock){
        for(const model in stock[category]){
            stock[category][model] = {tech:0, shop:0, sold:0};
        }
    }
    
    saveStock();
    saveStockHistory();
    renderStock();
    updateTotalSummary();
    
    addLog("erase_stock", getDisplayName(), "", "ALL", 0);
    showActionNotification("Stock Reset", "All stock counts reset to zero", "warning");
};

eraseBtn.onclick = () => {
    if(!confirm("⚠️ WARNING: This will delete ALL inventory data!\n\nCategories, Models, Logs - EVERYTHING!\n\nAre you absolutely sure?")){
        return;
    }
    
    if(!confirm("LAST CHANCE: This cannot be undone!\nType 'DELETE' to confirm:")){
        return;
    }
    
    // Clear all inventory data
    stock = {};
    logs = [];
    categories = {};
    stockHistory = {};
    
    localStorage.removeItem("pcStock");
    localStorage.removeItem("pcLogs");
    localStorage.removeItem("pcCategories");
    localStorage.removeItem("pcStockHistory");
    
    // Reinitialize
    initializeStock();
    populateAllDropdowns();
    renderStock();
    updateTotalSummary();
    
    addLog("erase_all", getDisplayName(), "", "ALL", 0);
    showActionNotification("Data Erased", "All data has been erased", "warning");
};

// ================= INVENTORY PROCESSING =================
processBtn.onclick = () => {
    const model = modelSelect.value;
    const qty = Number(qtyInput.value);
    const action = actionSelect.value;
    
    if(!model){
        showActionNotification("Error", "Please select a model", "error");
        return;
    }
    
    if(qty <= 0){
        showActionNotification("Error", "Please enter a valid quantity", "error");
        return;
    }
    
    // Find category
    let category = null;
    for(const c in stock){
        if(stock[c][model]){
            category = c;
            break;
        }
    }
    
    if(!category){
        showActionNotification("Error", "Model not found", "error");
        return;
    }
    
    const stockItem = stock[category][model];
    let actionText = "";
    let logAction = "";
    let notificationTitle = "";
    
    switch(action){
        case "receive":
            if(stockItem.tech + qty > 9999){
                showActionNotification("Error", "Cannot exceed maximum stock limit (9999)", "error");
                return;
            }
            stockItem.tech += qty;
            actionText = `Received ${qty} to Tech`;
            notificationTitle = "Stock Received";
            logAction = "receive_to_tech";
            break;
            
        case "transfer":
            if(stockItem.tech < qty){
                showActionNotification("Insufficient Stock", `Not enough in Tech stock! Available: ${stockItem.tech}`, "error");
                return;
            }
            if(stockItem.shop + qty > 9999){
                showActionNotification("Error", "Cannot exceed maximum shop stock limit (9999)", "error");
                return;
            }
            stockItem.tech -= qty;
            stockItem.shop += qty;
            actionText = `Transferred ${qty} from Tech to Shop`;
            notificationTitle = "Stock Transferred";
            logAction = "transfer_tech_to_shop";
            break;
            
        case "return":
            if(stockItem.shop < qty){
                showActionNotification("Insufficient Stock", `Not enough in Shop stock! Available: ${stockItem.shop}`, "error");
                return;
            }
            if(stockItem.tech + qty > 9999){
                showActionNotification("Error", "Cannot exceed maximum tech stock limit (9999)", "error");
                return;
            }
            stockItem.shop -= qty;
            stockItem.tech += qty;
            actionText = `Returned ${qty} from Shop to Tech`;
            notificationTitle = "Stock Returned";
            logAction = "return_shop_to_tech";
            break;
            
        case "sell":
            if(stockItem.shop < qty){
                showActionNotification("Insufficient Stock", `Not enough in Shop stock! Available: ${stockItem.shop}`, "error");
                return;
            }
            stockItem.shop -= qty;
            stockItem.sold += qty;
            actionText = `Sold ${qty} from Shop`;
            notificationTitle = "Stock Sold";
            logAction = "sell_shop_to_customer";
            break;
            
        case "direct":
            if(stockItem.tech < qty){
                showActionNotification("Insufficient Stock", `Not enough in Tech stock! Available: ${stockItem.tech}`, "error");
                return;
            }
            stockItem.tech -= qty;
            stockItem.sold += qty;
            actionText = `Direct sold ${qty} from Tech`;
            notificationTitle = "Direct Sale";
            logAction = "direct_sell_tech_to_customer";
            break;
    }
    
    saveStock();
    saveStockHistory();
    renderStock();
    updateTotalSummary();
    
    addLog(logAction, getDisplayName(), model, category, qty);
    showActionNotification(notificationTitle, `${actionText}: ${model}`, "success");
    
    // Reset quantity
    qtyInput.value = 1;
};

// ================= RENDER FUNCTIONS =================
function renderStock(stockData = stock) {
    let html = "";
    
    for(const category in stockData){
        const categoryItems = Object.keys(stockData[category]);
        if(categoryItems.length === 0) continue;
        
        const categoryColor = getCategoryColor(category);
        
        html += `<div class="category-section">`;
        html += `<h3 style="background-color: ${categoryColor}">${category} (${categoryItems.length} models)</h3>`;
        html += `<table><tr><th>Model</th><th>Tech Stock</th><th>Shop Stock</th><th>Sold</th><th>Total</th></tr>`;
        
        let categoryTech = 0;
        let categoryShop = 0;
        let categorySold = 0;
        
        for(const model in stockData[category]){
            const item = stockData[category][model];
            const total = item.tech + item.shop + item.sold;
            
            categoryTech += item.tech;
            categoryShop += item.shop;
            categorySold += item.sold;
            
            // Solid colors for each column
            html += `<tr>
                <td style="background-color: ${categoryColor}">${model}</td>
                <td style="background-color: ${columnColors.tech}">${item.tech}</td>
                <td style="background-color: ${columnColors.shop}">${item.shop}</td>
                <td style="background-color: ${columnColors.sold}">${item.sold}</td>
                <td style="background-color: ${columnColors.total}"><strong>${total}</strong></td>
            </tr>`;
        }
        
        html += `<tr class="category-total">
            <td colspan="5" style="background-color: #E0E0E0">
                <strong>${category} Total: Tech ${categoryTech} | Shop ${categoryShop} | Sold ${categorySold} | All: ${categoryTech + categoryShop + categorySold}</strong>
            </td>
        </tr>`;
        
        html += "</table></div>";
    }
    
    stockContainer.innerHTML = html || "<p>No inventory data available. Add some models to get started!</p>";
}

function updateTotalSummary() {
    let totalTech = 0;
    let totalShop = 0;
    let totalSold = 0;
    let totalModels = 0;
    
    for(const category in stock){
        for(const model in stock[category]){
            const item = stock[category][model];
            totalTech += item.tech;
            totalShop += item.shop;
            totalSold += item.sold;
            totalModels++;
        }
    }
    
    const totalSummary = document.getElementById("totalSummary");
    totalSummary.innerHTML = `
        <strong>📈 Overall Summary:</strong>
        Total Models: ${totalModels} |
        Tech Stock: <span style="background-color: ${columnColors.tech}; padding: 3px 8px; border-radius: 4px;">${totalTech}</span> |
        Shop Stock: <span style="background-color: ${columnColors.shop}; padding: 3px 8px; border-radius: 4px;">${totalShop}</span> |
        Sold: <span style="background-color: ${columnColors.sold}; padding: 3px 8px; border-radius: 4px;">${totalSold}</span> |
        Grand Total: <strong style="background-color: ${columnColors.total}; padding: 3px 8px; border-radius: 4px;">${totalTech + totalShop + totalSold}</strong>
    `;
}

// ================= LOGGING SYSTEM =================
function addLog(action, user, model, category, quantity, extraInfo = "") {
    const logEntry = {
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        user: user,
        action: action,
        model: model,
        category: category,
        quantity: quantity,
        extraInfo: extraInfo
    };
    
    logs.unshift(logEntry);
    if(logs.length > 500) logs.pop(); // Keep more logs
    
    saveLogs();
    updateLogDisplay();
}

function updateLogDisplay() {
    let html = "<table><tr><th>Date</th><th>Time</th><th>Staff</th><th>Action</th><th>Model</th><th>Qty</th></tr>";
    
    const recentLogs = logs.slice(0, 50); // Show more logs
    
    recentLogs.forEach(log => {
        let actionText = "";
        let actionClass = "";
        switch(log.action){
            case "receive_to_tech": actionText = "📥 Received to Tech"; actionClass = "log-receive"; break;
            case "transfer_tech_to_shop": actionText = "🔄 Tech → Shop"; actionClass = "log-transfer"; break;
            case "return_shop_to_tech": actionText = "↩️ Shop → Tech"; actionClass = "log-return"; break;
            case "sell_shop_to_customer": actionText = "💰 Shop → Customer"; actionClass = "log-sell"; break;
            case "direct_sell_tech_to_customer": actionText = "🎯 Tech → Customer"; actionClass = "log-direct"; break;
            case "add": actionText = "➕ Added Model"; actionClass = "log-add"; break;
            case "remove": actionText = "➖ Removed Model"; actionClass = "log-remove"; break;
            case "rename": actionText = "✏️ Renamed"; actionClass = "log-rename"; break;
            case "add_category": actionText = "📁 Added Category"; actionClass = "log-category"; break;
            case "remove_category": actionText = "🗑️ Removed Category"; actionClass = "log-remove-category"; break;
            case "erase_stock": actionText = "🗑️ Reset All Stock"; actionClass = "log-erase-stock"; break;
            case "erase_all": actionText = "💣 Erased All Data"; actionClass = "log-erase-all"; break;
            case "export": actionText = "📤 Exported Data"; actionClass = "log-export"; break;
            default: actionText = log.action;
        }
        
        if(log.action === "rename" && log.extraInfo){
            actionText += ` to "${log.extraInfo}"`;
        }
        
        html += `<tr class="${actionClass}">
            <td>${log.date}</td>
            <td>${log.time}</td>
            <td>${log.user}</td>
            <td>${actionText}</td>
            <td>${log.model}</td>
            <td>${log.quantity || ""}</td>
        </tr>`;
    });
    
    html += "</table>";
    logContent.innerHTML = html || "No logs available";
}

// ================= EXPORT FUNCTION =================
exportBtn.onclick = () => {
    // Prepare data for export
    const exportData = [];
    
    // Add headers
    exportData.push(["PC BYTES INVENTORY SYSTEM - EXPORT REPORT"]);
    exportData.push([`Generated on: ${new Date().toLocaleString()}`]);
    exportData.push([`Generated by: ${getDisplayName()}`]);
    exportData.push([`User Account: ${currentStaff}`]);
    exportData.push([""]);
    
    // Add stock data header
    exportData.push(["STOCK DATA (Current)"]);
    exportData.push(["Category", "Model", "Tech Stock", "Shop Stock", "Sold", "Total"]);
    
    // Add inventory data
    let grandTotal = 0;
    for(const category in stock){
        for(const model in stock[category]){
            const item = stock[category][model];
            const total = item.tech + item.shop + item.sold;
            grandTotal += total;
            exportData.push([category, model, item.tech, item.shop, item.sold, total]);
        }
    }
    
    exportData.push([""]);
    exportData.push(["SUMMARY"]);
    exportData.push(["Grand Total Items:", grandTotal]);
    
    exportData.push([""]);
    exportData.push([""]);
    
    // Add logs header
    exportData.push(["ACTIVITY LOGS (Last 100 Actions)"]);
    exportData.push(["Date", "Time", "Staff Name", "Action", "Model", "Quantity", "Category/Details"]);
    
    // Add recent logs (last 100)
    const recentLogs = logs.slice(0, 100);
    recentLogs.forEach(log => {
        let actionText = "";
        switch(log.action){
            case "receive_to_tech": actionText = "Received to Tech"; break;
            case "transfer_tech_to_shop": actionText = "Tech → Shop"; break;
            case "return_shop_to_tech": actionText = "Shop → Tech (Return)"; break;
            case "sell_shop_to_customer": actionText = "Shop → Customer (Sold)"; break;
            case "direct_sell_tech_to_customer": actionText = "Tech → Customer (Direct)"; break;
            case "add": actionText = "Added Model"; break;
            case "remove": actionText = "Removed Model"; break;
            case "rename": actionText = `Renamed to "${log.extraInfo}"`; break;
            case "add_category": actionText = "Added Category"; break;
            case "remove_category": actionText = "Removed Category"; break;
            case "erase_stock": actionText = "Reset All Stock"; break;
            case "erase_all": actionText = "Erased All Data"; break;
            case "export": actionText = "Exported Data"; break;
            default: actionText = log.action;
        }
        
        exportData.push([
            log.date,
            log.time,
            log.user,
            actionText,
            log.model,
            log.quantity || "",
            log.category + (log.extraInfo ? ` | ${log.extraInfo}` : "")
        ]);
    });
    
    // Add system info
    exportData.push([""]);
    exportData.push(["SYSTEM INFO"]);
    exportData.push(["Total Models:", Object.values(stock).reduce((sum, cat) => sum + Object.keys(cat).length, 0)]);
    exportData.push(["Total Categories:", Object.keys(categories).length]);
    exportData.push(["Total Log Entries:", logs.length]);
    
    // Create CSV
    const csvContent = exportData.map(row => 
        row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",")
    ).join("\n");
    
    // Create download link
    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `PC_Bytes_Inventory_Export_${new Date().toISOString().split('T')[0]}.csv`;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    addLog("export", getDisplayName(), "", "", 0);
    showActionNotification("Data Exported", "Data exported successfully with detailed logs!", "success");
};

// ================= VIEW LOGS =================
viewLogsBtn.onclick = () => {
    logsSidebar.style.display = "block";
    updateLogDisplay();
};

closeLogsBtn.onclick = () => {
    logsSidebar.style.display = "none";
};

// ================= OTHER FUNCTIONS =================
todayBtn.onclick = setTodayDate;

logoutBtn.onclick = () => {
    if(confirm("Are you sure you want to log out?")){
        location.reload();
    }
};

// Initialize
setTodayDate();
updateLogDisplay();