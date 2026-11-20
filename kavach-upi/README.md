# KavachUPI 🛡️
**Pre-Debit, Context-Aware Intent Verification & Cool-Off Layer for UPI**

> **Core Thesis:** Standard UPI apps execute irreversible transfers in under 2 seconds. Instead of holding funds in escrow (which requires RBI Payment Aggregator/Escrow licensing) or adding blind delays to all large payments, **KavachUPI intercepts the UPI `Intent` on-device *before* UPI PIN entry and NPCI settlement (`₹0` debited)**, applying friction **only** when active coercion signals are detected.

---

## 1. Why This Architecture? (Engineering & Regulatory Design)

### Zero-Escrow Pre-Settlement Hold (`₹0` Debited)
* **No Funds Held:** KavachUPI never holds customer rupees and does not rely on blockchain/smart contracts for INR settlement.
* **Intent-Gate Interception:** When a user scans a QR code or clicks a `upi://pay` deep link, KavachUPI acts as an intent interceptor / TPAP reference module. If risk triggers fire, the handoff to the NPCI Common Library (CL) / PSP app is **paused prior to PIN authorization**. Nothing is debited, so nothing needs to be reversed.

### Differentiation from RBI's 2026 Fraud Safeguards
* **RBI Discussion Paper (April 9, 2026):** Proposes a blanket 1-hour lagged credit on P2P transfers above ₹10,000 (provisional debit at payer bank) and trusted-person auth above ₹50,000 for seniors (70+).
* **RBI Master Directions for Non-Bank PSOs (Nov 5, 2026, Para 31(g)):** Enforces a 12-hour cooling period triggered solely after mobile number/email changes.
* **KavachUPI's Edge:** **Context-triggered, pre-debit friction.** Everyday ₹25,000 payments made safely settle in `< 2 seconds`. A ₹2,500 payment initiated while on a WhatsApp call with an unsaved number or during an active AnyDesk session triggers an immediate **15-minute cool-off + context-rich family co-signer verification**.

---

## 2. Multi-Signal Deterministic Risk Engine (No Cloud AI Latency)

| Signal | Android OS API / Source | Fraud Pattern Targeted |
| :--- | :--- | :--- |
| **1. Active Voice / VoIP Call** | `AudioManager.getMode()` (`MODE_IN_CALL` & `MODE_IN_COMMUNICATION`) | Digital arrest & fake courier scams (cellular + WhatsApp/Telegram calls) |
| **2. Unknown Caller Check** | Privacy-preserving SHA-256 contact prefix check | Social engineering by impersonators not in user's address book |
| **3. Screen Projection / Remote Access** | `DisplayManager.getDisplays()` (`FLAG_PRESENTATION` / virtual display flags) | AnyDesk, TeamViewer, RustDesk screen-sharing scams |
| **4. First-Time Payee VPA** | Local encrypted Room DB of past settled VPAs | Mule accounts & newly generated scammer QR codes |
| **5. Personal Threshold Breach** | User-configured limit (default `₹2,000`) | High-impact sudden transfers out of norm |

---

## 3. Repository Contents
* `web-demo/` — Interactive dual-device React + Vite prototype simulating the Sender Phone, Family Co-Signer Phone, 1930 Evidence Vault, and RBI Policy Comparison.
* `android-reference/` — Native Android Kotlin implementation showing `AudioManager`, `DisplayManager`, and `upi://pay` Intent interception without restricted Play Store permissions.

## 4. Quick Start (`web-demo`)
```bash
cd web-demo
npm install
npm run dev