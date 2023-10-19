// Constants for DOM elements
const qrTypeButtons = document.querySelectorAll("#qrTypeBtnGroup button");

// Function to handle QR code type button behavior
qrTypeButtons.forEach(button => {
    button.addEventListener("click", function() {
        button.parentElement.querySelectorAll("button").forEach(sibling => {
            sibling.classList.remove("btn-primary");
            sibling.classList.add("btn-secondary");
        });
        button.classList.remove("btn-secondary");
        button.classList.add("btn-primary");
        // Additional logic to initialize form based on selected QR code type
        initializeForm(button.getAttribute('data-qrtype'));
    });
});

// Initialize form elements based on selected QR code type
function initializeForm(selectedType) {
    const urlDiv = document.querySelector("#urlDiv");
    const wifiDiv = document.querySelector("#wifiDiv");
    
    if (selectedType === "URL") {
        urlDiv.style.display = "block";
        wifiDiv.style.display = "none";
    } else if (selectedType === "WiFi") {
        urlDiv.style.display = "none";
        wifiDiv.style.display = "block";
    }
}

// Global generateQRCode function
function generateQRCode() {
    const selectedTypeButton = document.querySelector("#qrTypeBtnGroup .btn-primary");
    const type = selectedTypeButton.getAttribute('data-qrtype');
    
    let data = "";
    if (type === "URL") {
        data = document.querySelector('#url').value;
    } else if (type === "WiFi") {
        const ssid = document.querySelector('#ssid').value;
        const password = document.querySelector('#password').value;
        const networkType = document.querySelector('#networkType').value;
        data = `WIFI:T:${networkType};S:${ssid};P:${password};;`;
    }

    $('#qrcode').empty();
    $('#qrcode').qrcode({
        text: data
    });
}

document.addEventListener("DOMContentLoaded", function() {
    // Initialize the form with the first button as the default selected type
    const defaultSelectedType = document.querySelector("#qrTypeBtnGroup .btn-primary").getAttribute('data-qrtype');
    initializeForm(defaultSelectedType);
});