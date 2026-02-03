const { test, expect } = require('@playwright/test');
const { chromium } = require('playwright-extra');
const stealth = require('puppeteer-extra-plugin-stealth')();
const fs = require('fs');
const path = require('path');

// Apply stealth to bypass bot detection/human verification
chromium.use(stealth);

const URLS = [
    'https://www.mazdacapecod.com/new/Mazda/2025-Mazda-CX-5-Hyannis-MA-30259470ac1842fd6ff0b800ec72cf50.htm',
    'https://www.bmwofcapecod.com/new/BMW/2026-BMW-2-Series-Hyannis-MA-7cf2a4d7ac181b2c495c0a90b8eb48e2.htm',
    'https://www.loyaltytoyotarichmond.com/vehicle/New/2026/Toyota/Grand-Highlander-Hybrid/5TDADAB54TS034256/',
    'https://www.hondamorristown.com/inventory/used-2025-nissan-kicks-sr-awd-4d-sport-utility-3n8ap6db3sl426872/',
    'https://www.morristownchevrolet.com/new-Morristown-2026-Chevrolet-Trax-LT-KL77LHEP0TC046230',
    'https://www.gengrassubaru.com/certified/Subaru/2022-Subaru-Crosstrek-b856883cac1852b0d28ee18a98fa41b6.htm',
    'https://www.mercedesbenzoffayetteville.com/inventory/certified-used-2021-mercedes-benz-e-class-e-350-4matic%c2%ae-4d-sedan-w1kzf8eb3ma921102/',
    'https://www.terrebonneford.com/inventory/new-2025-ford-f-150-stx%c2%ae-rwd-supercrew%c2%ae-1ftew2kpxske74958/',
    'https://www.toyotaoflongview.com/inventory/certified-used-2024-toyota-camry-hybrid-se-nightshade-blackout-package-lane-keep-assist-fwd-4d-sedan-4t1g31ak3ru059993/',
    'https://www.musiccityautoplex.com/inventory/used-2017-cadillac-ats-standard-rear-wheel-drive-sedan-1g6aa5rx5h0169038/',
];

test.describe('VDP Calengrow widget checking', () => {
    const screenshotDir = path.join(process.cwd(), 'automated_screenshots');

    test.beforeAll(() => {
        if (fs.existsSync(screenshotDir)) {
            fs.rmSync(screenshotDir, { recursive: true, force: true });
        }
        fs.mkdirSync(screenshotDir, { recursive: true });
    });

    for (const url of URLS) {
        const domain = new URL(url).hostname;

        test(`VDP Audit: ${domain}`, async ({ }) => {
            console.log(`\n🔍 Checking: ${domain}`);

            const browser = await chromium.launch({ headless: false }); // Headless: false helps bypass some bot checks
            const context = await browser.newContext({
                userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
                viewport: { width: 1920, height: 1080 }
            });

            const page = await context.newPage();

            try {
                // 1. Navigate
                await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 0 });

                // 2. Clear Cookie Banners (Aggressive)
                const cookieSelectors = [
                    'button:has-text("Accept All")',
                    'button:has-text("Allow All")',
                    'button:has-text("OK")',
                    '#onetrust-accept-btn-handler',
                    '.floating-cookie-banner button',
                    'button[aria-label="Close"]',
                    'button:has-text("Privacy Policy")'
                ];

                for (const selector of cookieSelectors) {
                    try {
                        const btn = page.locator(selector);
                        if (await btn.isVisible()) await btn.click({ timeout: 0 });
                    } catch (e) { /* ignore if click fails */ }
                }

                // Force hide any remaining overlays that block screenshots
                await page.evaluate(() => {
                    const selectorsToHide = ['#onetrust-banner-sdk', '.cookie-consent-overlay', '.modal-backdrop', '.fc-consent-root'];
                    selectorsToHide.forEach(s => {
                        const el = document.querySelector(s);
                        if (el) el.style.setProperty('display', 'none', 'important');
                    });
                });

                await page.waitForTimeout(2000);

                // 3. Locate and Highlight Widget
                const actionBtn = page.locator('#rev-cw-btn, #rev-cw-btn-fixed, .rev-cw-btn, .rev-cw-btn-fixed').first();

                // Assert visibility (this makes the test fail in the report if not found)
                await expect(actionBtn).toBeVisible({ timeout: 0 });

                // Scroll to ensure it is in the screenshot
                await actionBtn.scrollIntoViewIfNeeded();

                // Inject high-visibility styles
                await actionBtn.evaluate((el) => {
                    el.style.setProperty('border', '8px solid #00FF00', 'important');
                    el.style.setProperty('outline', '8px solid #00FF00', 'important');
                    el.style.setProperty('z-index', '2147483647', 'important'); // Max z-index
                    el.style.setProperty('position', 'relative', 'important');
                    el.style.boxShadow = '0 0 20px #00FF00';
                });

                console.log(`✅ Widget found and highlighted on ${domain}`);

                // 4. Click and Screenshot
                await actionBtn.click({ force: true });
                await page.waitForTimeout(1500); // Wait for click response/animation

                const fileName = `${domain.replace(/\./g, '_')}_SUCCESS.png`;
                await page.screenshot({ path: path.join(screenshotDir, fileName) });

            } catch (e) {
                console.log(`❌ Failed ${domain}: ${e.message}`);

                // Take a failure screenshot for debugging
                const failFile = `${domain.replace(/\./g, '_')}_FAILED.png`;
                await page.screenshot({ path: path.join(screenshotDir, failFile) });

                // Re-throw the error so Playwright marks the test as FAILED
                throw e;
            } finally {
                await browser.close();
            }
        });
    }
});