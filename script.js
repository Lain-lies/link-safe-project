const form = document.querySelector("form");
form.addEventListener("submit", fetchURL);
const resultElement = document.querySelector("p");

async function fetchURL(event){
    
    event.preventDefault(); 

    const urlInput = document.querySelector("input").value;

    console.log(urlInput);


    const googleSafe = await checkURLSafety(urlInput);
    const virusTotal = await checkPhishing(urlInput);
    console.log(virusTotal);

    // resultElement.textContent = safetyCheck;

}


async function checkURLSafety(url) {
    try {
        const response = await fetch(
            `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=AIzaSyBBQgOB6ke1zrfkFp-cFMCaGyRpxThrPSs`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    client: { clientId: "link-safe", clientVersion: "1.0" },
                    threatInfo: {
                        threatTypes: ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE", "POTENTIALLY_HARMFUL_APPLICATION"],
                        platformTypes: ["ANY_PLATFORM"],
                        threatEntryTypes: ["URL"],
                        threatEntries: [{ url }]
                    }
                }),
            }
        );

        const data = await response.json();
        console.log(data.matches[0].threatType);

    } catch (error) {
        console.error("Safety Check Error:", error);
        return "Error checking URL safety.";
    }
}


async function checkPhishing(url) {
    try {
        const response = await fetch("http://localhost:3000/checkurl", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({ url }).toString(),
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();
        return data;        

    } catch (error) {
        console.error("Phishing Check Error:", error);
    }
}
