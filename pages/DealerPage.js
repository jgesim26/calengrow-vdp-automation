const { expect } = require('@playwright/test');

class DealerPage {
    constructor(page) {
        this.page = page;
        // Resilient locator for different button text variations
        this.appointmentBtn = page.locator('button, a, div[role="button"]').filter({
            hasText: /(Schedule|Appointment|Book|Service)/i
        });
        this.widgetBlock = page.locator('.calengrow-widget, [class*="calengrow-widget"]');
    }

    async navigate(url) {
        await this.page.goto(url, { waitUntil: 'domcontentloaded', timeout: 240000 });
    }

    async waitForAndClickButton() {
        // Specifically overriding to 3 minutes as requested
        await this.appointmentBtn.first().waitFor({ state: 'visible', timeout: 240000 });
        await this.appointmentBtn.first().click();
    }

    async validateWidgetPresence() {
        // Wait for the modal/widget class to appear in the DOM
        await this.widgetBlock.waitFor({ state: 'attached', timeout: 15000 });
        const isVisible = await this.widgetBlock.isVisible();
        return isVisible;
    }
}

module.exports = { DealerPage };