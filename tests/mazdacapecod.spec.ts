import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://www.mazdacapecod.com/new/Mazda/2025-Mazda-CX-5-Hyannis-MA-30259470ac1842fd6ff0b800ec72cf50.htm');
  await page.getByRole('button', { name: 'Allow all cookies' }).click();
  await page.getByRole('button', { name: 'Schedule Your Appointment Now' }).click();
  await page.locator('div').filter({ hasText: 'Vehicle DetailsName: 2025' }).nth(2).click();
  await expect(page.getByRole('dialog')).toMatchAriaSnapshot(`
    - text: Vehicle Details
    - img /\\d+ Mazda CX-5 2\\.5 S AWD/
    - list:
      - listitem:
        - strong: "Name:"
        - text: /\\d+ Mazda CX-5 2\\.5 S AWD/
      - listitem:
        - strong: "Make:"
        - text: Mazda
      - listitem:
        - strong: "Model:"
        - text: CX-5
      - listitem:
        - strong: "Year:"
        - text: /\\d+/
      - listitem:
        - strong: "VIN:"
        - text: JM3KFBAL2S0790164
      - listitem:
        - strong: "Price:"
        - text: /\\$\\d+,\\d+\\.\\d+/
      - listitem:
        - strong: "Stock Number:"
        - text: M4509
      - listitem:
        - strong: "Trim:"
        - text: 2.5 S AWD
      - listitem:
        - strong: "Schedule:"
    - button "Information":
      - img
      - text: ""
    - text: /← Previous Week Next Week → Mon January \\d+ Tue January \\d+ Wed January \\d+ Thu January \\d+ Fri January \\d+ Sat January \\d+ Sun January \\d+ Select a Time Slot \\*/
    - img
    - text: EST
    - button /\\d+:\\d+ PM/
    - button /\\d+:\\d+ PM/
    - button /\\d+:\\d+ PM/
    - button /1:\\d+ PM/
    - button /1:\\d+ PM/
    - button /1:\\d+ PM/
    - button /1:\\d+ PM/
    - button /2:\\d+ PM/
    - button /2:\\d+ PM/
    - button /2:\\d+ PM/
    - button /2:\\d+ PM/
    - button /3:\\d+ PM/
    - button /3:\\d+ PM/
    - button /3:\\d+ PM/
    - button /3:\\d+ PM/
    - button /4:\\d+ PM/
    - button /4:\\d+ PM/
    - button /4:\\d+ PM/
    - button /4:\\d+ PM/
    - button /5:\\d+ PM/
    - text: Name *
    - textbox "Please Enter Your Name"
    - text: Email *
    - textbox "Please Enter Your Email"
    - text: Phone Number *
    - combobox
    - text: US
    - img
    - img
    - textbox "Please Enter Your Phone Number"
    - text: Message
    - textbox "Please Enter Your Message"
    - button "Book Now"
    `);
});