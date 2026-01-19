import { test, expect } from '@playwright/test';
import fs from 'fs';

const TARGET_URLS = [
   'https://www.mazdacapecod.com/new/Mazda/2025-Mazda-CX-5-Hyannis-MA-30259470ac1842fd6ff0b800ec72cf50.htm',
    'https://www.bmwofcapecod.com/new/BMW/2026-BMW-2-Series-Hyannis-MA-7cf2a4d7ac181b2c495c0a90b8eb48e2.htm',
   'https://www.loyaltytoyotarichmond.com/vehicle/New/2026/Toyota/Sienna/5TDYSKFC1TS02D349/',
   'https://www.hondamorristown.com/inventory/used-2024-hyundai-sonata-hybrid-limited-fwd-4d-sedan-kmhl54jj2ra086167/',
   'https://www.morristownchevrolet.com/new-Morristown-2026-Chevrolet-Equinox+EV-LT-3GN7DNRP2TS109533',
   'https://www.gengrassubaru.com/certified/Subaru/2024-Subaru-Crosstrek-b70be25dac181913f3c45366603bd122.htm',
   'https://www.mercedesbenzoffayetteville.com/inventory/certified-used-2021-mercedes-benz-e-class-e-350-4matic%c2%ae-4d-sedan-w1kzf8eb3ma921102/',
   'https://www.terrebonneford.com/inventory/new-2025-ford-f-150-stx%c2%ae-rwd-supercrew%c2%ae-1ftew2kpxske74958/',
   'https://www.discoverynissan.com/viewdetails/new/3n1ab8cv2sy411688/2025-nissan-sentra-4dr-car?type=finance&term=72',
   'https://www.crchryslerdodgejeepram.com/certified/Chrysler/2023-Chrysler-300-317212c2ac1855d8a23a749944712c83.htm',
   'https://www.toyotaoflongview.com/inventory/used-2024-volkswagen-tiguan-2-0t-s-heated-seating-third-row-seating-fwd-4d-sport-utility-3vvrb7ax4rm208156/',
   'https://www.musiccityautoplex.com/inventory/used-2017-cadillac-ats-standard-rear-wheel-drive-sedan-1g6aa5rx5h0169038/'

];

 
const btn_labels = [
  'VIP Test Drive',
  'Schedule Your Appointment Now',
   
];

test.describe('Dynamic Widget Verification', () => {
  
  test.beforeAll(() => {
    if (!fs.existsSync('screenshots')) fs.mkdirSync('screenshots');
  });

  for (const url of TARGET_URLS) {
    test(`Testing: ${url}`, async ({ page }) => {
 
      await page.goto(url, { waitUntil: 'networkidle'});

      let foundButton = null;

      
      for (const label of btn_labels) {
        const btn = page.getByText(label, { exact: true });
        if (await btn.isVisible()) {
          foundButton = btn;
          console.log(`🔎 Found button: "${label}" on ${url}`);
          btn.click();
          break;  
        }
      }
 
      if (foundButton) {
        
        await foundButton.scrollIntoViewIfNeeded();
         
        // await page.waitForTimeout(50000); 
        await foundButton.click({ force: true });

       
        try {
          await page.waitForSelector('[role="dialog"], .el-dialog, .fancybox-content', { 
            state: 'visible', 
            timeout: 50000 
          });
          console.log(`✅ Modal opened successfully.`);
        } catch (e) {
          console.log(`⚠️ Button clicked, but no modal detected.`);
        }
      } else {
        console.log(`❌ None of the specified buttons were found on ${url}`);
      }
 
      const fileName = url.split('/').filter(Boolean).pop()?.substring(0, 40);
      await page.screenshot({ path: `screenshots/${fileName}.png` });
    });
  }
});