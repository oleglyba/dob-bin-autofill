// ==UserScript==
// @name         Auto-fill DOB BIN
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically inserts BIN from localStorage and triggers search on DOB website
// @author       oleglyba
// @match        https://a810-dobnow.nyc.gov/publish/Index.html*
// @grant        none
// ==/UserScript==

(function () {
    console.log("[TM] 🚀 Starting BIN autofill automation");

    const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

    const clickBinSearch = async () => {
        console.log("[TM] ⏳ Waiting for BIN button");

        const waitForBinButton = () => new Promise((resolve) => {
            const check = setInterval(() => {
                const btn = Array.from(document.querySelectorAll("div")).find(
                    (el) => el.textContent.trim() === "BIN"
                );
                if (btn) {
                    clearInterval(check);
                    resolve(btn);
                }
            }, 300);
        });

        const binBtn = await waitForBinButton();
        console.log("[TM] ✅ BIN button found");
        binBtn.click();
    };

    const fillBin = async () => {
        await sleep(1500);
        const bin = localStorage.getItem("tm_bin");

        if (!bin) {
            console.warn("[TM] ❌ BIN not found in localStorage");
            return;
        }

        console.log("[TM] 🧠 BIN found:", bin);

        const input = document.querySelector("input[placeholder='Enter BIN']");
        if (input) {
            input.value = bin;
            input.dispatchEvent(new Event("input", { bubbles: true }));
            await sleep(500);

            const searchBtn = [...document.querySelectorAll("button")].find((btn) =>
                btn.textContent.trim().toLowerCase() === "search"
            );

            if (searchBtn) {
                console.log("[TM] 🔍 Clicking Search");
                searchBtn.click();
            }
        }
    };

    const start = async () => {
        await clickBinSearch();
        await fillBin();
    };

    start();
})();
