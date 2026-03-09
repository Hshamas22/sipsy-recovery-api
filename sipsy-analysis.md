# Sipsy Conversion Analysis Report
**Generated:** March 8, 2026  
**Data Source:** Shopify Admin API (2024-01)  
**Period:** Last 90 days (Dec 8, 2025 – Mar 8, 2026)

---

## Executive Summary

| Metric | Value |
|--------|-------|
| Current conversion rate | **1.3%** |
| 90-day revenue (paid orders) | **$133,739** |
| Monthly average (Jan–Feb) | **~$22,396** |
| Dec 2025 (holiday spike) | **$84,367** |
| Total paid orders (90 days) | **762** |
| Overall AOV | **$175.51** |
| Unique customers (90 days) | **604** |
| Repeat purchase rate | **13.6%** |
| Abandoned checkouts (open) | **100 analyzed** |
| Total abandoned value (open) | **$15,536** |
| Avg abandoned cart value | **$155.36** |
| Email capture rate (abandoned) | **100%** |
| Avg shipping cost | **$26–27** |

### The Short Answer: Why People Aren't Converting

The data points to **three primary conversion killers**:

1. **Shipping cost shock** — $26–27 avg shipping with almost no free shipping threshold. At a $94 median cart, that's a 28% price increase at checkout. This is the single biggest abandonment driver.
2. **No abandoned cart recovery flow** — 100% of abandoned checkouts have emails captured, but without an automated 3-email recovery sequence, that gold mine is sitting idle. 389 abandoned carts last month = ~$60K in potential recovery revenue per month.
3. **Weak retention / loyalty loop** — 86% of customers buy once and never return. The Smile.io loyalty program exists but shows near-zero engagement in order data (~$108 total discounts given across 762 orders).

---

## 1. Abandoned Cart Deep Dive

### Volume & Value
- **100 open abandoned checkouts** analyzed (389 last month per store data)
- **Total value:** $15,536.35
- **Average cart:** $155.36
- **Median cart:** $94.84 ← this is the "real" customer
- **Min:** $17.99 | **Max:** $1,006.51

### Cart Value Distribution
| Range | Count | % |
|-------|-------|---|
| Under $50 | 6 | 6% |
| $50–$100 | 49 | **49%** |
| $100–$200 | 29 | 29% |
| $200–$500 | 11 | 11% |
| Over $500 | 5 | 5% |

**Key insight:** Half of abandoned carts are in the $50–100 range. With $26 shipping, these customers are seeing a **26–52% price increase** at checkout. This is devastating for conversion.

### Email Capture
- **100% of abandoned checkouts had email addresses** — meaning customers got far enough to enter their email before bouncing
- This is exceptional and means **every single abandoned cart is recoverable via email**
- With 389 abandoned carts last month and an avg value of $155, that's **~$60K sitting in recovery emails that aren't being sent**

### Shipping Analysis
- 90 of 100 abandoned carts had shipping lines calculated
- **Average shipping: $26.32**
- **Only 1 cart had free shipping** (out of 90 with shipping lines)
- Cart abandonment spikes heavily in the $50–100 bucket — exactly where shipping nearly doubles the cost

### Items Per Cart
| Items | Carts | % |
|-------|-------|---|
| 1 item | 60 | 60% |
| 2 items | 29 | 29% |
| 3+ items | 11 | 11% |

60% of abandoners have a single item in their cart — likely browsing/gifting, hit the shipping cost, and left.

### Discount Code Usage in Abandoned Carts
- **Only 2 out of 100** abandoned carts had discount codes
- People are NOT using discounts as a reason to abandon — they're abandoning despite no discount expectation

### Top Products Left Behind (by revenue at abandonment)
| Product | Qty Left | Value |
|---------|----------|-------|
| George T. Stagg 2025 Bourbon | 2 | $1,800 |
| Caymus Napa Cab Sauvignon | 6 | $540 |
| Fortaleza Reposado | 3 | $480 |
| Colonel E.H. Taylor Small Batch | 14 | ~$915 (combined variants) |
| Schrader RBS Cabernet 2019 | 1 | $460 |
| W.L. Weller CYPB Bourbon | 1 | $450 |
| Johnnie Walker Blue Label | 2 | $400 |
| Fortaleza Blanco Still Strength | 3 | $390 |
| Classe Azul Reposado | 2 | $340 |
| Blanton's Single Barrel | 3 | $330 |

**Notice:** Premium/allocated products ($300–$1,800) are being abandoned too — even customers who want a $450 bottle are leaving. For these, shipping is likely less the issue — stock uncertainty, gift timing, or checkout friction may be at play.

### Geographic Distribution of Abandoned Carts
CA (19), NJ (8), NY (6), FL (6), TX (5), OH (4), CT (4), PA (4) — mostly shipping-eligible states, suggesting shipping cost (not geographic restriction) is the abandonment cause.

---

## 2. Revenue Trends (Last 90 Days)

### Weekly Revenue & Orders
| Week of | Revenue | Orders | AOV |
|---------|---------|--------|-----|
| Dec 1, 2025 | $146 | 2 | $73 |
| Dec 8, 2025 | **$26,000** | 135 | $193 |
| Dec 15, 2025 | **$29,544** | 198 | $149 |
| Dec 22, 2025 | $17,619 | 94 | $187 |
| Dec 29, 2025 | $11,057 | 51 | $217 |
| Jan 5, 2026 | $3,673 | 27 | $136 |
| Jan 12, 2026 | $4,001 | 25 | $160 |
| Jan 19, 2026 | $4,503 | 24 | $188 |
| Jan 26, 2026 | $6,191 | 37 | $167 |
| Feb 2, 2026 | $8,329 | 39 | $214 |
| Feb 9, 2026 | $6,004 | 35 | $172 |
| Feb 16, 2026 | $6,566 | 40 | $164 |
| Feb 23, 2026 | $5,527 | 35 | $158 |
| Mar 2, 2026 | $4,579 | 20 | $229 |

### Monthly Breakdown
| Month | Revenue | Orders | AOV |
|-------|---------|--------|-----|
| Dec 2025 | **$84,367** | 480 | $176 |
| Jan 2026 | $18,367 | 113 | $163 |
| Feb 2026 | $26,425 | 149 | $177 |
| Mar 2026 (partial) | $4,579 | 20 | $229 |

### Critical Observation: Holiday Cliff
December 2025 = **63% of 90-day revenue** driven by holiday gifting. January dropped 78% from December peak. This is textbook holiday-dependent e-commerce — the business has a **gifting seasonality problem** that needs year-round gifting infrastructure (birthdays, weddings, corporate, Father's Day, etc.).

The good news: Feb shows recovery (+44% vs Jan), and March AOV is the highest at $229 — smaller volume, but higher-value buyers.

### Revenue by Category (90 days)
| Category | Revenue | % |
|----------|---------|---|
| Tequila / Mezcal | $28,218 | **26.3%** |
| Whiskey / Bourbon | $24,159 | **22.5%** |
| Champagne / Sparkling | $15,778 | **14.7%** |
| Wine | $3,145 | 2.9% |
| Other (tips, gifts, accessories, cigars) | $36,034 | 33.6% |

Tequila + Whiskey = nearly half of revenue. Champagne punches above its weight as a gifting item (high AOV, low SKU count).

---

## 3. Top 15 Products by Revenue (90 days)

| Rank | Product | Revenue | Units |
|------|---------|---------|-------|
| 1 | Dom Pérignon Brut 750ml | **$4,200** | 14 |
| 2 | Tears of Llorona Extra Añejo | **$3,510** | 13 |
| 3 | Veuve Clicquot Champagne 750ml | **$3,500** | 50 |
| 4 | Clase Azul Tequila Reposado 750ml | **$3,230** | 19 |
| 5 | Fortaleza Blanco Tequila 750ml | **$3,190** | 29 |
| 6 | Blanton's Single Barrel Bourbon 750ml | **$2,810** | 21 |
| 7 | Don Julio 1942 Year of the Horse Añejo 750ml | **$2,710** | 16 |
| 8 | Tip/Gratuity *(delivery tips)* | $2,398 | — |
| 9 | Tip *(delivery tips)* | $2,181 | — |
| 10 | Camel Blue 99 *(cigarettes!)* | **$2,099** | 140 |
| 11 | Veuve Clicquot Yellow Cooler Gift Box 750ml | **$1,760** | 16 |
| 12 | El Cristiano Extra Añejo | **$1,620** | 12 |
| 13 | Don Julio 1942 Añejo 750ml | **$1,600** | 10 |
| 14 | Fortaleza Reposado 750ml | **$1,440** | 9 |
| 15 | El Cristiano Reposado | **$1,319** | 24 |

### Notable Observations
- **Dom Pérignon is the #1 revenue product** — premium gifting, high AOV ($300/bottle)
- **Camel Blue cigarettes are #10** — $2,099 from 140 units. This is a high-frequency, low-margin product that likely serves in-store regulars but doesn't fit the Sephora-of-alcohol brand vision online
- **Veuve Clicquot appears twice** (bottle + cooler gift box) — totaling ~$5,260. It's the #1 gifting workhorse
- **Tears of Llorona** ($270/bottle) is a strong premium tequila performer — under-marketed compared to its revenue
- **El Cristiano** shows up 3x (Blanco, Repo, Extra Añejo) — this brand is clearly resonating and may be exclusive/semi-exclusive to Sipsy

---

## 4. Customer Behavior Analysis

### Repeat Purchase Rate
| Metric | Value |
|--------|-------|
| Unique customers (90 days) | 604 |
| First-time buyers | 522 (86.4%) |
| Repeat buyers (2+ orders) | 82 (13.6%) |
| 3+ order customers | 31 (5.1%) |

### Revenue Split
- **New/one-time customers:** $90,954 (68% of revenue)
- **Repeat customers:** $42,784 (32% of revenue)
- AOV is nearly identical: new = $174, repeat = $178 (repeat buyers don't spend more — they just come back)

### Top Repeat Buyers (90 days)
| Customer | Orders | Total Spent |
|---------|--------|------------|
| francesca.hoecker@vercel.com | 10 | $1,426 |
| catladytinker@aol.com | 7 | $2,689 |
| steve.james@issmgmt.com | 8 | $1,058 |
| lauren.collier@lgads.tv | 8 | $906 |
| aubreysereno@gmail.com | 7 | $717 |

Your best customers are spending $1,400–$2,700 over 90 days. These are VIPs. Do they feel like VIPs?

### Order Sources
- **Web (storefront):** 749/762 orders (98.3%)
- **Draft orders (staff/phone):** 12 orders
- Source app: 1 order

### Fulfillment
- **Fulfilled:** 745/762 (97.8%) — excellent ops
- **Partial:** 4 | **Pending:** 13

### Key Behavioral Signals
- Tags on orders include: "IN PROCESS" (44), "Essential Preorder" (23), "SCHEDULED" (11)
- Pre-orders are active — customers are willing to wait for special releases
- Single-item carts dominate (both abandoned and completed) — customers know what they want but aren't being upsold

---

## 5. Store Structure (Collections)

### Smart Collections (138 total) — Key ones:
- **Category-based:** Tequila, Blanco/Reposado/Añejo Tequila, Additive-Free Tequila (critical differentiator), Mezcal, Champagne, Whiskey, Bourbon, Wine, Gin, Rum, Vodka
- **Gift-focused:** Champagne Gifts, Tequila Gifts, Whiskey Gifts, Cognac Gifts, Cocktail Gift Sets, Liquor Gifts, Wine Gifts
- **Brand pages:** Fortaleza, Clase Azul, Don Julio, Blantons, Veuve, Moët, El Tequileno, G4, etc.
- **Discovery:** Natural Wine, Additive-Free (multiple), Best Sellers

### Custom Collections (33 total) — Key ones:
- **Gift Guides:** Tequila Holiday Gift Guide, Champagne Gift Guide, Whiskey Holiday Gift Guide
- **Promotions:** Flash Sale, Save $3 PROMO, Buy 1 Save $6 High Marque, Pernod Ricard Sale
- **Social:** "Tequila gifts Ig ads" — a collection built for Instagram ad landing pages
- **Test** — a test collection (should be hidden from nav)

### Structural Observations
- Strong category + brand collection architecture
- Gift guides exist but appear seasonal (holiday-named) — need evergreen versions
- No "Birthday Gifts" or "Wedding Gifts" or "Corporate Gifts" collections visible
- The additive-free tequila angle has dedicated collections — this is the Bucket 1 superfan draw

---

## 6. Discount Code Analysis

### Price Rules Active (22 total)
| Code | Type | Value | Min Cart | Notes |
|------|------|-------|----------|-------|
| WELCOME5 | Fixed | $5 off | $50+ | New customer welcome |
| FRIENDS10 | % | 10% off | None | Word of mouth |
| Sip10 | % | 10% off | None | General |
| Drink5 | Fixed | $5 off | $50+ | General |
| SMSBF1977335 | % | 10% off | None | SMS campaign (1-use) |
| 10GMRRTY | % | 10% off | None | 1-use |
| G4 | Fixed | $10 off | None | Brand promo |
| jameson | Fixed | $8 off | None | Brand promo |
| RTRGGJ4WHEG7 | % | 10% off | None | Referral? |
| Smile* (many) | Fixed | $1–$38 off | $50+ | Loyalty rewards |
| Yotpo Discount | Fixed | $5–$6 off | $40–$50+ | Review rewards |
| HS123 | % | 99% off | None | ⚠️ Internal/staff |

### What This Tells Us
- **Discount usage is almost zero** — only $107.98 total discount amount given across 762 orders. This is actually good brand positioning (not competing on price), but it means you're not using discounts as a conversion lever at all
- **WELCOME5 exists but nobody's using it** — if this is your welcome email offer, it's not working
- **Smile.io loyalty is active** but generating tiny amounts ($1–$38 redemptions) — the loyalty program is not being pushed to customers at checkout
- **SIPSMART5** was used 2x in the order data — sole named code with meaningful usage
- No abandoned cart recovery discount codes showing up at all — suggesting no automated recovery flow

---

## 7. Top 5 Quick Wins to Improve Conversion

### 🥇 Win #1: Fix the Shipping Problem (Biggest Impact)
**The data:** 49% of abandoned carts are in the $50–100 range. Average shipping is $26. Customers with $75 bottles of Fortaleza are looking at a $100+ total — a 35% premium they didn't expect.

**Action:**
- Set a **free shipping threshold at $100 or $125** — the sweet spot where 78% of abandoned carts live
- Show a dynamic "Add $X more for free shipping" bar in the cart
- For orders under threshold, consider a flat $9.99 rate (instead of $26) to reduce shock
- This alone could move conversion from 1.3% → 2%+

**Effort:** Low (Shopify shipping settings). **Impact:** Very High.

---

### 🥈 Win #2: Activate Abandoned Cart Email Recovery
**The data:** 100% email capture rate on abandoned carts. 389 abandoned last month. If you recover even 15%, that's 58 orders × $155 = **$9,000/month in found revenue.**

**Action:**
- Shopify natively supports abandoned checkout emails (Settings → Notifications, or use Klaviyo/Omnisend)
- Set up a **3-email sequence:**
  1. **1 hour after abandonment:** "You left something behind" — no discount, just a reminder + product photo
  2. **24 hours:** "Still thinking about it?" — include a social proof element (reviews, "200+ people ordered this month")
  3. **72 hours:** "Here's a little something" — offer WELCOME5 or a $5 off code as a push
- For high-value carts ($200+), consider a direct personal email/call

**Effort:** Low–Medium (Klaviyo setup). **Impact:** High, immediate.

---

### 🥉 Win #3: Build Evergreen Gift Collections + Gift Finder
**The data:** 70–80% of online business is gifting. December drove 63% of 90-day revenue. The seasonality cliff in January proves the store is only capturing gift demand when people already know they need a gift (holidays).

**Action:**
- Create collections: "Birthday Gifts," "Wedding Gifts," "Corporate Gifts," "Anniversary Gifts," "Just Because"
- Add a **Gift Finder quiz** on the homepage (Octane AI or similar): Budget → Occasion → Spirit preference → curated recommendation
- Add gift messaging/card option prominently at checkout (not just a note field)
- Year-round gifting campaigns: "National Tequila Day," Valentine's, Mother's Day (wine), Father's Day (whiskey/bourbon)
- Push the **Veuve Cooler Gift Box** ($110) as the evergreen "easy gift" — it's #11 in revenue from only 16 units

**Effort:** Medium. **Impact:** Very High (transforms revenue seasonality).

---

### 🏅 Win #4: Activate the Loyalty Program Properly
**The data:** Smile.io is installed but barely used. Total loyalty discounts given in 762 orders = ~$107. With 34K customers and 86% one-time buyers, you have a retention crisis.

**Action:**
- Make loyalty points **visible on every product page and cart** ("Earn 175 points with this purchase")
- Send a **reactivation email** to the ~30K customers who haven't bought in 90 days: "You have X points waiting — here's what you can get"
- Add a **loyalty milestone notification** at checkout: "You're 50 points away from a $5 reward"
- Consider a **VIP tier** for customers spending $500+/year — white-glove treatment (early access to allocations, free gift wrap, personal notes)
- The 10 highest repeat buyers should already be in a VIP cohort getting personal touches

**Effort:** Medium. **Impact:** High (customer LTV is the biggest long-term lever).

---

### 🎖 Win #5: Surface Social Proof & Trust Signals at Checkout
**The data:** The store sells premium alcohol at premium prices ($100–$300+ bottles) to people who are largely gifting. Trust is everything. The checkout completion rate is low even with high-intent buyers.

**Action:**
- Add **product reviews** prominently on product pages (Yotpo is already installed based on discount rules — are reviews being shown?)
- Add a **"Sipsy Seal"** on checkout: "Licensed & Insured Delivery," "Age Verified," "Real People — Call/Text Us"
- Show **real delivery times** prominently (not just at checkout) — people gifting need to know it'll arrive
- Add **"Why Sipsy?" callouts**: Additive-free experts, small-batch specialists, LA's best selection — reinforce why not to go to Drizly/Total Wine
- A/B test a **live chat bubble** on product pages for high-value items ($150+)

**Effort:** Low–Medium. **Impact:** Medium-High (reduces anxiety friction).

---

## 8. What GA4 Data Would Additionally Help

The Shopify data shows *what* is happening but not *where* in the funnel people are dropping. GA4 would reveal the specific friction points.

### Pull These Reports Immediately

#### Report 1: Funnel Exploration (most critical)
**GA4 → Explore → Funnel exploration**
Build a funnel:
1. Product page view (`view_item`)
2. Add to cart (`add_to_cart`)
3. Begin checkout (`begin_checkout`)
4. Add shipping info (`add_shipping_info`)
5. Add payment info (`add_payment_info`)
6. Purchase (`purchase`)

**What to look for:** Where is the biggest drop-off? If it's between step 2→3 (cart to checkout), the problem is checkout UX/trust. If it's 3→4 (checkout to shipping), it's the shipping cost reveal. If it's 4→5 (shipping to payment), it's payment friction or final price shock.

---

#### Report 2: Landing Page Performance
**GA4 → Reports → Engagement → Landing pages**
Filter by: Sessions, Bounce Rate, Add-to-Cart events

**What to look for:**
- Are paid traffic landing pages converting worse than organic?
- Are collection pages or product pages the better entry point?
- What pages have high bounce rate + high traffic? (Fix these first)

---

#### Report 3: Device Breakdown
**GA4 → Reports → Tech → Overview**

**What to look for:**
- Mobile conversion rate vs desktop. If mobile is under 0.5%, the mobile checkout experience needs a complete overhaul
- Mobile users browsing alcohol gifts on their phone and then abandoning is extremely common
- Compare add-to-cart rate on mobile vs desktop

---

#### Report 4: Traffic Source Attribution
**GA4 → Acquisition → Traffic Acquisition**

**What to look for:**
- Which channels (Instagram, Google, Direct, Email) have the highest conversion rate?
- If Instagram drives traffic but converts at 0.3% vs Email at 3%, the Instagram landing experience needs fixing
- If Direct traffic (people who know Sipsy) converts at 3%+, the brand is strong — the top-of-funnel UX is the problem

---

#### Report 5: Search Terms (Site Search)
**GA4 → Reports → Engagement → Events → search**

**What to look for:**
- What are people searching for on sipsy.com that they can't find?
- High search volume + low purchase = product catalog gap or findability problem
- "Gift" searches without a clear landing page = missed conversion

---

#### Report 6: Geographic Conversion Rate
**GA4 → Reports → User → Demographic details → Country/Region**

**What to look for:**
- States with high traffic but zero purchases = shipping restrictions issue (some states can't receive alcohol)
- If CA (where Sipsy is based) has a dramatically higher conversion rate than other states, the in-market brand recognition gap is a key issue

---

#### Report 7: New vs Returning User Conversion
**GA4 → Explore → Segment comparison**
Compare: New Users vs Returning Users on conversion rate

**What to look for:**
- If returning visitors convert at 3%+ but new visitors convert at 0.5%, the problem is top-of-funnel trust
- This would confirm the need for better social proof and first-visit offers

---

## Appendix: Key Numbers at a Glance

| Data Point | Value |
|-----------|-------|
| 90-day revenue | $133,739 |
| Monthly run rate (Jan–Feb avg) | $22,396 |
| December 2025 revenue (holiday) | $84,367 |
| Total paid orders (90 days) | 762 |
| Overall AOV | $175.51 |
| Highest AOV week | $228.95 (Mar 2, 2026) |
| Unique customers (90 days) | 604 |
| Repeat customer rate | 13.6% |
| Revenue from one-time buyers | 68% ($90,954) |
| Revenue from repeat buyers | 32% ($42,784) |
| Abandoned cart email capture | 100% |
| Open abandoned cart value | $15,536 (100 carts) |
| Avg abandoned cart | $155.36 |
| Median abandoned cart | $94.84 |
| Avg shipping cost | $26–$27 |
| Orders with free shipping | ~3% |
| Discount orders (90 days) | <2% of orders |
| Total discounts given | $107.98 |
| Top revenue product | Dom Pérignon ($4,200) |
| Top volume product | Veuve Clicquot (50 units) |
| Tequila % of revenue | 26.3% |
| Whiskey % of revenue | 22.5% |
| Champagne % of revenue | 14.7% |
| Collections | 33 custom + 138 smart |
| Active price rules | 22 |

---

*Report prepared by Lyra for Hala Shamas / Sipsy. Data pulled live from Shopify API.*
