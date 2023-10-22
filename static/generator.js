// Define an object to map QR code types to their corresponding div IDs.
const qrTypeToDivMap = {
    "URL": "urlDiv",
    "Text": "textDiv",
    "Email": "emailDiv",
    "SMS": "smsDiv",
    "WiFi": "wifiDiv",
    "Geotag": "geotagDiv",
    "vCard": "vCardDiv",
    "vCalendar": "vCalendarDiv"
};

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
    } else if (type === "Text") {
        data = document.querySelector('#plainText').value;
    } else if (type === "Email") {
        const emailTo = document.querySelector('#emailTo').value;
        const emailSubject = document.querySelector('#emailSubject').value;
        const emailBody = document.querySelector('#emailBody').value;
        data = `mailto:${emailTo}?subject=${emailSubject}&body=${emailBody}`;
    } else if (type === "SMS") {
        const smsNumber = document.querySelector('#smsNumber').value;
        const smsMessage = document.querySelector('#smsMessage').value;
        data = `SMS:${smsNumber}:${smsMessage}`;
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
        const mobile = document.querySelector('#mobile').value;
        const street = document.querySelector('#street').value;
        const city = document.querySelector('#city').value;
        const state = document.querySelector('#state').value;
        const zip = document.querySelector('#zip').value;
        const country = document.querySelector('#country').value;
        const website = document.querySelector('#website').value;
        const company = document.querySelector('#company').value;
        const title = document.querySelector('#jobTitle').value;
        data = `BEGIN:VCARD` + `\n` + `VERSION:3.0` + `\n` + `N:${lastName};${firstName};;` + `\n` + `FN:${firstName} ${lastName}` + `\n` + `EMAIL:${email}` + `\n` + `TEL:${phone}` + `\n` + `TEL;TYPE=CELL:${mobile}` + `\n` + `ADR;TYPE=work:;;${street};${city};${state};${zip};${country}` + `\n` + `ORG:${company}` + `\n` + `TITLE:${title}` + `\n` + `URL:${website}` + `\n` + `END:VCARD`;
    } else if (type === "vCalendar") {
        const eventName = document.querySelector('#eventName').value;
        const startDate = document.querySelector('#startDate').value;
        const endDate = document.querySelector('#endDate').value;
        const startTime = document.querySelector('#startTime').value;
        const endTime = document.querySelector('#endTime').value;
        const timezone = document.querySelector('#timezone').value;
        const organizer = document.querySelector('#organizer').value;
        const location = document.querySelector('#location').value;
        const eventUrl = document.querySelector('#eventUrl').value;
        const description = document.querySelector('#description').value;
        data = `BEGIN:VCALENDAR` + `\n` + `VERSION:2.0` + `\n` + `BEGIN:VEVENT` + `\n` + `SUMMARY:${eventName}` + `\n` + `DTSTART:${startDate}T${startTime}Z` + `\n` + `DTEND:${endDate}T${endTime}Z` + `\n` + `TZID:${timezone}` + `\n` + `ORGANIZER:${organizer}` + `\n` +`LOCATION:${location}` + `\n` +`URL:${eventUrl}` + `\n` +  `DESCRIPTION:${description}` + `\n` + `END:VEVENT` + `\n` + `END:VCALENDAR`;
    }

    console.log(`data for ${type}: ${data}`);

    $('#qrcode').empty();
    const qrCodeCanvas = $('#qrcode').qrcode({
        text: data,
        width: 1024,
        height: 1024
    })[0].firstChild;

    // Convert the canvas to a PNG data URL
    const imageData = qrCodeCanvas.toDataURL("image/png");

    // Create a unique filename based on the timestamp
    const filename = `QRCode_${new Date().toISOString().replace(/[-:.]/g, "")}.png`;

    // Create an anchor element and set its attributes
    const anchor = document.createElement("a");
    anchor.href = imageData;
    anchor.download = filename;
    anchor.innerHTML = "<img src='" + imageData + "' alt='QR Code'/>";
    
    // Clear the QR code container and append the clickable anchor
    $('#qrcode').empty().append(anchor);
}

document.addEventListener("DOMContentLoaded", function() {
    // Initialize the form with the first button as the default selected type
    const defaultSelectedType = document.querySelector("#qrTypeBtnGroup .btn-primary").getAttribute('data-qrtype');
    initializeForm(defaultSelectedType);
});

// Scroll to top button
let timeout;
let isHovered = false; // flag to check if the button is being hovered over

const scrollToTopButton = document.getElementById("scrollToTopButton");

function showButton() {
    scrollToTopButton.style.display = 'block';
    scrollToTopButton.classList.remove('fade-out');
    scrollToTopButton.classList.add('fade-in');
}

function hideButton() {
    if (!isHovered) {
        scrollToTopButton.classList.remove('fade-in');
        scrollToTopButton.classList.add('fade-out');
        setTimeout(() => {
            if (!isHovered) {
                scrollToTopButton.style.display = 'none';
            }
        }, 500); // match this with your CSS transition time
    }
}

window.addEventListener('scroll', function() {
    if (window.scrollY > 200) {
        showButton();
        clearTimeout(timeout);
        timeout = setTimeout(hideButton, 2000); // 2 seconds
    }
});

// Handle hover state
scrollToTopButton.addEventListener('mouseenter', function() {
    isHovered = true;
});

scrollToTopButton.addEventListener('mouseleave', function() {
    isHovered = false;
    hideButton();
});

// Scroll to top on click
scrollToTopButton.addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('service-worker.js').then(function(registration) {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function(err) {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}
