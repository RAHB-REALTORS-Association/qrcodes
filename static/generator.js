// Global variable to store the uploaded image data
let uploadedImage = null;

// Define an object to map QR code types to their corresponding div IDs.
const qrTypeToDivMap = {
    "URL": "urlDiv",
    "WiFi": "wifiDiv",
    "Geotag": "geotagDiv",
    "vCard": "vCardDiv",
    "vCalendar": "vCalendarDiv"
};

// Constants for DOM elements
const sizeButtons = document.querySelectorAll("#sizeBtnGroup button");
const qrTypeButtons = document.querySelectorAll("#qrTypeBtnGroup button");

// Function to handle size button behavior
sizeButtons.forEach(button => {
    button.addEventListener("click", function() {
        button.parentElement.querySelectorAll("button").forEach(sibling => {
            sibling.classList.remove("btn-primary");
            sibling.classList.add("btn-secondary");
        });
        button.classList.remove("btn-secondary");
        button.classList.add("btn-primary");
    });
});

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
    // Hide all sections
    Object.values(qrTypeToDivMap).forEach((divId) => {
        document.querySelector(`#${divId}`).style.display = "none";
    });

    // Show the section corresponding to the selected QR type
    const selectedDivId = qrTypeToDivMap[selectedType];
    if (selectedDivId) {
        document.querySelector(`#${selectedDivId}`).style.display = "block";
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
    } else if (type === "Geotag") {
        const latitude = document.querySelector('#latitude').value;
        const longitude = document.querySelector('#longitude').value;
        data = `geo:${latitude},${longitude}`;
    } else if (type === "vCard") {
        const firstName = document.querySelector('#firstName').value;
        const lastName = document.querySelector('#lastName').value;
        const email = document.querySelector('#email').value;
        const phone = document.querySelector('#phone').value;
        const website = document.querySelector('#website').value;
        const company = document.querySelector('#company').value;
        const title = document.querySelector('#jobTitle').value;
        const street = document.querySelector('#street').value;
        const city = document.querySelector('#city').value;
        const state = document.querySelector('#state').value;
        const zip = document.querySelector('#zip').value;
        const country = document.querySelector('#country').value;
        data = `BEGIN:VCARD` + `\n` + `VERSION:3.0` + `\n` + `N:${lastName};${firstName};;` + `\n` + `FN:${firstName} ${lastName}` + `\n` + `EMAIL:${email}` + `\n` + `TEL:${phone}` + `\n` + `URL:${website}` + `\n` + `ORG:${company}` + `\n` + `TITLE:${title}` + `\n` + `ADR;TYPE=work:;;${street};${city};${state};${zip};${country}` + `\n` + `END:VCARD`;
    } else if (type === "vCalendar") {
        const eventName = document.querySelector('#eventName').value;
        const startDate = document.querySelector('#startDate').value;
        const endDate = document.querySelector('#endDate').value;
        const startTime = document.querySelector('#startTime').value;
        const endTime = document.querySelector('#endTime').value;
        const organizer = document.querySelector('#organizer').value;
        const location = document.querySelector('#location').value;
        const eventUrl = document.querySelector('#eventUrl').value;
        const description = document.querySelector('#description').value;
        data = `BEGIN:VCALENDAR` + `\n` + `VERSION:2.0` + `\n` + `BEGIN:VEVENT` + `\n` + `SUMMARY:${eventName}` + `\n` + `DTSTART:${startDate}T${startTime}Z` + `\n` + `DTEND:${endDate}T${endTime}Z` + `\n` + `ORGANIZER:${organizer}` + `\n` +`LOCATION:${location}` + `\n` +`URL:${eventUrl}` + `\n` +  `DESCRIPTION:${description}` + `\n` + `END:VEVENT` + `\n` + `END:VCALENDAR`;
    }

    // Get the selected size
    const selectedSizeButton = document.querySelector("#sizeBtnGroup .btn-primary");
    const size = selectedSizeButton ? selectedSizeButton.getAttribute('data-size') : 256;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Draw QR code on canvas
    const qrCodeCanvas = $('#qrcode').qrcode({
        text: data,
        render: 'canvas'
    })[0];
    
    const qrCodeSize = 256; // or any other size you specify
    canvas.width = qrCodeSize;
    canvas.height = qrCodeSize;
    ctx.drawImage(qrCodeCanvas, 0, 0, qrCodeSize, qrCodeSize);

    // Create a new image object
    const logoImage = new Image();

    // Load the image
    logoImage.src = logoDataURL;

    // Wait for the image to load
    logoImage.onload = function() {
        // Draw the logo on top of the QR code
        ctx.drawImage(logoImage, offset, offset, logoSize, logoSize);

        // Convert the final canvas to a PNG data URL
        const finalImageData = finalCanvas.toDataURL("image/png");

        // Create a unique filename based on the timestamp
        const filename = `QRCode_${new Date().toISOString().replace(/[-:.]/g, "")}.png`;

        // Create an anchor element and set its attributes
        const anchor = document.createElement("a");
        anchor.href = finalImageData;
        anchor.download = filename;
        anchor.innerHTML = "<img src='" + finalImageData + "' alt='QR Code'/>";

        // Clear the QR code container and append the clickable anchor
        $('#qrcode').empty().append(anchor);
    }

    // Draw the uploaded logo
    if (uploadedImage) {
        const img = new Image();
        img.src = uploadedImage;
        img.onload = function() {
            const logoSize = qrCodeSize * 0.2; // Adjust size as needed
            const x = (qrCodeSize - logoSize) / 2;
            const y = (qrCodeSize - logoSize) / 2;
            ctx.drawImage(img, x, y, logoSize, logoSize);
            
            // Final QR code with logo
            const finalImageData = canvas.toDataURL("image/png");

            // Create an anchor element and set its attributes
            const anchor = document.createElement("a");
            anchor.href = finalImageData;
            anchor.download = `QRCode_${new Date().toISOString().replace(/[-:.]/g, "")}.png`;
            anchor.innerHTML = `<img src="${finalImageData}" alt="QR Code"/>`;

            // Clear the QR code container and append the clickable anchor
            $('#qrcode').empty().append(anchor);
        };
    } else {
        // If no logo, proceed as usual
        const imageData = canvas.toDataURL("image/png");
        
        // Create an anchor element and set its attributes
        const anchor = document.createElement("a");
        anchor.href = imageData;
        anchor.download = `QRCode_${new Date().toISOString().replace(/[-:.]/g, "")}.png`;
        anchor.innerHTML = `<img src="${imageData}" alt="QR Code"/>`;

        // Clear the QR code container and append the clickable anchor
        $('#qrcode').empty().append(anchor);
    }
}

document.addEventListener("DOMContentLoaded", function() {
    // Initialize the form with the first button as the default selected type
    const defaultSelectedType = document.querySelector("#qrTypeBtnGroup .btn-primary").getAttribute('data-qrtype');
    initializeForm(defaultSelectedType);

    document.querySelector("#customLogo").addEventListener("change", function() {
        const file = this.files[0];
        if (file && file.type.match("image.*")) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function(e) {
                uploadedImage = e.target.result;
            };
        } else {
            alert("Invalid image file.");
        }
    });    
});