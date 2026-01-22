import { test, expect } from '@playwright/test';
import fs from 'fs';
import { TARGET_URLS } from '../urls/vehicleUrls';



const btn_labels = ['VIP Test Drive', 'Schedule Your Appointment Now'];

test.describe('Dynamic Widget Verification', () => {

    test.beforeAll(() => {
        if (!fs.existsSync('screenshots')) fs.mkdirSync('screenshots');
    });

    for (const url of TARGET_URLS) {
        test(`Testing: ${url}`, async ({ page }) => {
            await page.goto(url, { waitUntil: 'domcontentloaded' });

            let foundButton = null;

            // 1. Locate the button
            for (const label of btn_labels) {
                const btn = page.getByText(label, { exact: true });
                if (await btn.isVisible()) {
                    foundButton = btn;
                    console.log(`🔎 Found button: "${label}" on ${url}`);
                    break;
                }
            }

            // 2. Action and Conditional Screenshot
            if (foundButton) {
                await foundButton.scrollIntoViewIfNeeded();
                await foundButton.click({ force: true });

                try {
                    // Wait for modal selectors
                    await page.waitForSelector('[role="dialog"], .el-dialog, .fancybox-content', {
                        state: 'visible',
                        timeout: 15000 // Set to a reasonable wait time
                    });

                    console.log(`✅ Modal detected for ${url}. Saving screenshot...`);

                    // --- Safe Filename Generation ---
                    const urlObj = new URL(url);
                    const rawName = urlObj.pathname.split('/').filter(Boolean).pop() || 'screenshot';
                    const fileName = rawName.replace(/[^a-z0-9.-]/gi, '_').substring(0, 40);

                    // This ONLY runs if the line above (waitForSelector) does not throw an error
                    await page.screenshot({ path: `screenshots/${fileName}.png` });

                } catch (e) {
                    // If the modal doesn't appear, we land here and NO screenshot is taken
                    console.log(`⚠️ Modal did not appear on ${url} after clicking. Skipping screenshot.`);
                }
            } else {
                console.log(`❌ No matching button found on ${url}`);
            }
        });
    }
});