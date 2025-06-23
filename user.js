// ==UserScript==
// @name         Auto-fill DOB BIN
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Auto insert BIN from URL parameter
// @author       You
// @match        https://a810-dobnow.nyc.gov/publish/Index.html*
// @grant        none
// @license      MIT
// ==/UserScript==

(function () {
    console.log("[TM] 🚀 Початок автоматизації BIN");

    const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

    const clickBinSearch = async () => {
        console.log('[TM] ⏳ Очікуємо кнопку BIN');

        const waitForBinButton = () => new Promise(resolve => {
            const check = setInterval(() => {
                const btn = Array.from(document.querySelectorAll('div')).find(
                    el => el.textContent.trim() === 'BIN'
                );
                if (btn) {
                    clearInterval(check);
                    resolve(btn);
                }
            }, 300);
        });

        const binBtn = await waitForBinButton();
        console.log('[TM] ✅ Знайдено кнопку BIN');
        binBtn.click();
    };

    const fillBin = async () => {
        await sleep(1500);

        const urlParams = new URLSearchParams(window.location.hash.split('?')[1]);
        const bin = urlParams.get("bin");

        if (!bin) {
            console.warn("[TM] ❌ BIN не знайдено в URL");
            return;
        }

        console.log("[TM] 🧠 BIN знайдено в URL:", bin);

        const input = document.querySelector("input[placeholder='Enter BIN']");
        if (input) {
            input.value = bin;
            input.dispatchEvent(new Event("input", { bubbles: true }));
            await sleep(500);

            const searchBtn = [...document.querySelectorAll("button")].find((btn) =>
                btn.textContent.trim().toLowerCase() === "search"
            );

            if (searchBtn) {
                console.log("[TM] 🔍 Натискаємо Search");
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
