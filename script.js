document.addEventListener("DOMContentLoaded", () => {

    //===========================
    //PAGE:1 LANDING PAGE (index.html)
    //===========================
    const continueBtn = document.querySelector(".continue-btn");
    if (continueBtn) {
        continueBtn.addEventListener("click", () => {
            window.location.href = "MyStatus.html";
        });
    }

    //--Handle pasting an external status link straight into the app entry point
    const goToStatusBtn = document.getElementById("go-to-status-btn");
    const pasteStatusUrl = document.getElementById("pasted-status-url")

   
    });

    //===========================
    //PAGE 2: STATUS CREATION FORM (MyStatus.html)
    //============================
    const statusForm = document.getElementById("status-form"); 
    if (statusForm) {
        let currentSpoonCount = 5; //Default fallback state
        let selectedPain = "";
        let selectedWeather = "";
        let selectedBattery = "";

        //--- Interactive Spoon Tapping System ---
        const spoonImages = document.querySelectorAll(".spoons-row img");
        const counterDisplay = document.getElementById("current-spoons");

        function updateSpoonsVisual(count) {
            currentSpoonCount = count; 
            if (counterDisplay) counterDisplay.textContent = count;

            spoonImages.forEach((img, index) => { 
                if (index < count) {
                    img.src = "spoon-full.png";
                } else {
                    img.src = "spoon-empty.png";
                }
            });
        }

        //Add tap listener to every spoon
        spoonImages.forEach((img, index) => {
            img.style.cursor = "pointer"; 
            img.addEventListener("click", () => { 
                updateSpoonsVisual(index + 1);
            });
        });

        //---Chip Selection Highlight Tracker---
        function setupToggleGroup(containerSelector, callback) {
            const container = document.querySelector(containerSelector);
            if (!container) return;

            const buttons = container.querySelectorAll(".toggle-btn");
            buttons.forEach(btn => {
                btn.addEventListener("click", () => { 
                    buttons.forEach(b => {
                        b.style.backgroundColor = "#29170a";
                        b.style.borderColor = "#7D755B";
                        b.style.fontWeight = "normal";
                    });
                    btn.style.backgroundColor = "#B8684F";
                    btn.style.borderColor = "#B8684F"; 
                    btn.style.fontWeight = "600";

                    callback(btn.getAttribute("data-value"));
                });
            });
        }

        setupToggleGroup(".pain-level-selection", (val) => selectedPain = val);
        setupToggleGroup(".brain-weather-section", (val) => selectedWeather = val);
        setupToggleGroup(".social-battery-section", (val) => selectedBattery = val);

        //---Generate shareable URL Link---
        const shareBtn = document.getElementById("share-btn");
        if (shareBtn) {
            shareBtn.addEventListener("click", () => { 
                const userName = document.getElementById("user-name").value.trim() || "Someone"; 
                const comfortText = document.getElementById("comfort-text").value.trim();
                const customNote = document.getElementById("custom-note").value.trim(); 

                //Package all user inputs nicely into a URL search string
                const params = new URLSearchParams(); 
                params.append("name", userName);
                params.append("spoons", currentSpoonCount); 
                params.append("pain", selectedPain || "unspecified");
                params.append("weather", selectedWeather || "unspecified");
                params.append("battery", selectedBattery || "unspecified");
                if (comfortText) params.append("comfort", comfortText);
                if (customNote) params.append("note", customNote);

                //Build pathway to view.html containing encoded variables
                const shareUrl = `${window.location.origin}${window.location.pathname.replace("MyStatus.html", "view.html")}?${params.toString()}`;
                
                //Copy generated link straight to user's clipboard!
                navigator.clipboard.writeText(shareUrl).then(() => { 
                    const originalText = shareBtn.innerHTML; 
                    shareBtn.innerHTML = "✅ Link copied to clipboard!";
                    shareBtn.style.backgroundColor = "#7D755B";
                    
                    setTimeout(() => {
                        shareBtn.innerHTML = originalText;
                        shareBtn.style.backgroundColor = "#a2563e";
                    }, 3000);
                }).catch(err => { 
                    console.error("Could not copy text: ", err);
                    alert(`Copy your status link here:\n\n${shareUrl}`);
                });
            });
        }
    }

    //=====================================
    //PAGE 3: TRUSTED PERSON VIEWER (view.html)
    //========================================
    const viewTitle = document.getElementById("view-title"); 
    if (viewTitle) {
        //Read variables straight out of the active browser link
        const urlParams = new URLSearchParams(window.location.search); 

        const name = urlParams.get("name") || "Someone";
        const spoons = parseInt(urlParams.get("spoons")) || 5;
        const pain = urlParams.get("pain") || "unspecified";
        const weather = urlParams.get("weather") || "unspecified"; 
        const battery = urlParams.get("battery") || "unspecified"; 
        const comfort = urlParams.get("comfort");
        const note = urlParams.get("note");

        // Set text displays safely with charAt(0)
        document.getElementById("display-name").textContent = name;
        document.getElementById("display-spoons").textContent = spoons;
        document.getElementById("display-pain").textContent = pain.charAt(0).toUpperCase() + pain.slice(1);
        document.getElementById("display-weather").textContent = weather.charAt(0).toUpperCase() + weather.slice(1);
        document.getElementById("display-battery").textContent = battery.charAt(0).toUpperCase() + battery.slice(1);

        //Rebuild spoons graphics row safely using i++
        const viewSpoonsRow = document.getElementById("view-spoons-row");
        if (viewSpoonsRow) {
            viewSpoonsRow.innerHTML = "";
            for (let i = 0; i < 10; i++) {
                const img = document.createElement("img");
                img.className = "spoon-preview";
                img.alt = "Spoon";
                img.src = i < spoons ? "spoon-full.png" : "spoon-empty.png";
                viewSpoonsRow.appendChild(img);
            }
        }

        //Set custom display boxes or fallbacks safely without a dotted variable name
        const comfortBox = document.getElementById("display-comfort");
        if (comfortBox) {
            comfortBox.textContent = comfort ? comfort : "No custom comfort metrics added today.";  
        }

        // Fixed target element ID here to point directly to "display-note"
        const noteBox = document.getElementById("display-note");
        if (noteBox) {
            noteBox.textContent = note ? `"${note}"` : "No extra updates written.";
        }
    }
