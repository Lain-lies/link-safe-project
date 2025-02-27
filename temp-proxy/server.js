const express = require("express");
const axios = require("axios");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;
const VIRUSTOTAL_API_KEY = "fd182921fcdf5de969db75f9717c094c541490db86d9bc9de8cd60193eed73c6"; 

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post("/checkurl", async (req, res) => {
    try {
        const { url } = req.body;
        if (!url) {
            return res.status(400).json({ error: "Missing URL parameter" });
        }

        const response = await axios.post(
            "https://www.virustotal.com/api/v3/urls",
            `url=${encodeURIComponent(url)}`,
            {
                headers: {
                    "x-apikey": VIRUSTOTAL_API_KEY,
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );

        const scanId = response.data.data.id;
        const resultResponse = await axios.get(
            `https://www.virustotal.com/api/v3/analyses/${scanId}`,
            {
                headers: { "x-apikey": VIRUSTOTAL_API_KEY },
            }
        );

        console.log("VirusTotal Response:", resultResponse.data);
        res.json(resultResponse.data);

    } catch (error) {
        console.error("Error checking VirusTotal:", error.response?.data || error.message);
        res.status(error.response?.status || 500).json({ error: "VirusTotal check failed" });
    }
});

app.listen(PORT, () => console.log(`Proxy running at http://localhost:${PORT}`));
