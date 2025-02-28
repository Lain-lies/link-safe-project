const form = document.querySelector("form");
const googleSafeSearchResult = document.querySelector(".gss-result");
const virusTotalResult = document.querySelector(".vt-result");
const recommend = document.querySelector("#recommend");

form.addEventListener("submit", fetchURL);
console.log(googleSafeSearchResult);
console.log(virusTotalResult);

const state = {
    
    result: 0,
    devMode: true,

    testing : [

        {
            link: "https://instagramm-com.vercel.app/",
            gs: 1,
            vt: 1
        },

        {
            link: "https://facebook-login-rny58qv7c-el-professor.vercel.app/",
            gs: 1,
            vt: 1
        },
        
        {
            link: "https://case-g287686.com/v3/signin/identifier",
            gs: 1,
            vt: 0
        },


        {
            link: "https://card-bnl.com",
            gs: 0,
            vt: 1
        },

    ],
    
    gss: 0,
    vtt: 0,


}

async function fetchURL(event){

    event.preventDefault();
    const urlInput = document.querySelector("input").value;

    state.result = 0;
    googleSafeSearchResult.classList.remove("unsafe");
    virusTotalResult.classList.remove("unsafe");

    googleSafeSearchResult.textContent = "Checking...";
    virusTotalResult.textContent = "Checking...";
    if(state.devMode){
        console.log("DEV MODE");

        setTimeout(() => {
            let pos = -1;

            for(let i = 0; i < state.testing.length; i++){
                
                if(urlInput === state.testing[i].link){
                    
                    console.log("test")
                    pos = i;
                    break;
                }
            }

            if(pos !== -1){
                
                state.gss = state.testing[pos].gs;
                state.vtt = state.testing[pos].vt;
                state.result = state.testing[pos].gs + state.testing[pos].vt;

            }
            
            render();
            recommendation();

        }, 10000);       
        
        
    }else{

        const googleSafe = await checkURLSafety(urlInput);
        const virusTotal = await checkPhishing(urlInput);

        console.log(googleSafe);
        console.log(virusTotal);

        if(googleSafe){
            
            state.gss++;

        }

        if(virusTotal.data.attributes.stats.malicious > 0){

            state.vtt++;

        }else if(virusTotal.data.attributes.stats.suspicious > 0){

            state.vtt++;
        }

        state.result = state.gss + state.vtt;

        render();
        recommendation();
    }
    

}

function render(){

    if(state.gss){

        googleSafeSearchResult.textContent = "Unsafe link";
        googleSafeSearchResult.classList.add("unsafe");


    }else{

        googleSafeSearchResult.textContent = "Safe link";

    }

    if(state.vtt){

        virusTotalResult.textContent = "Unsafe link";
        virusTotalResult.classList.add("unsafe");


    }else{

        virusTotalResult.textContent = "Safe link";

    }
}

function recommendation(){

    if(state.result === 2){
        
        recommend.textContent = "Recommended Action : You can proceed safely";

    }else if(state.result === 1){
        
        recommend.textContent = "Recommended Action : 1 Source flagged this link as unsafe PROCEED WITH CAUTION";
        
    }else{

        recommend.textContent = "Recommended Action : Your data will be compromised if you visit this link data DO NOT PROCEED";

    }
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
