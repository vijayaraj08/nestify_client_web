<div align="center">

# 🏡 PG & Hostel Management Platform (Client Portal)

  <p><b>A modern, responsive, and feature-rich web application built for guests and residents to discover, book, and manage shared accommodations seamlessly.</b></p>

  <p>
    <img src="https://img.shields.io/badge/Status-Active%20Development-brightgreen?style=for-the-badge" alt="Status">
    <img src="https://img.shields.io/badge/React.js-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
    <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
    <img src="https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge" alt="License">
  </p>
</div>

---

## 🌟 What is this Project?

This is a comprehensive, multi-tenant **PG / Hostel Management Platform** designed to digitize and automate the entire shared-accommodation ecosystem. It replaces unorganized, paper-based, and manual operations with a unified system structured into two primary portals:
* **Admin / Owner / Staff Portal:** For managing property inventory, tracking finances, processing compliance, and handling daily operations[cite: 1].
* **User Portal (Guest & Resident):** For prospective guests to discover and book spaces, and for current residents to manage their stay, rent, and community interactions[cite: 1].

---

## 🛑 What Problems Does It Solve?

Traditional PG and hostel operations face massive friction points that this platform directly eliminates:
* **Eliminates Double-Booking & Stale Inventory:** Replaces manual phone calls and whiteboards with real-time bed availability tracking[cite: 1].
* **Resolves Deposit & Rent Disputes:** Replaces informal cash collections and vague verbal agreements with digital invoices, automated rent ledgers, itemized deposit deductions, and legally trackable digital rental agreements[cite: 1].
* **Ends "What's for Dinner?" Chaos:** Publishes structured weekly food menus with resident ratings and automated mess-subscription opt-outs to prevent billing friction[cite: 1].
* **Improves Safety and Accountability:** Replaces lost physical paperwork with a secure digital document wallet, QR-coded resident ID cards, and a one-tap Emergency SOS safety network[cite: 1].
* **Saves Time on Manual Chasing:** Automates payment reminders via WhatsApp/SMS/Email to drastically reduce late rent[cite: 1].

---

## 🚀 Complete Feature Checklist (What You Can Build & Use)

### 1. Admin & Owner Capabilities
* **Hostel Setup & Multi-Property Portfolio:** Register properties, configure floor-room-bed hierarchies, and manage multiple hostels from a single dashboard[cite: 1].
* **Bookings & Token Holds:** Configure custom token/hold amounts so guests can reserve beds via partial payments instead of full rent upfront[cite: 1].
* **Staff & Task Management:** Create staff roles (warden, cook, maintenance), assign daily housekeeping/maintenance checklists, and track automated monthly payroll[cite: 1].
* **Financial Ledger & GST Invoices:** Track operational expenses, utility meter readings (electricity/water), vendor contracts, and generate GST-compliant tax invoices[cite: 1].
* **Compliance & Audit Trails:** Monitor legal document expiry dates (fire safety, trade licenses) and maintain immutable audit logs for every system write action[cite: 1].

### 2. Guest & Resident Capabilities (Client Side)
* **Smart Marketplace Discovery:** Browse verified properties using location search, filters, and side-by-side comparisons[cite: 1].
* **Digital Onboarding & Agreements:** Complete KYC verification, e-sign rental agreements, and receive a scannable QR-coded resident ID card[cite: 1].
* **Resident Dashboard & Ledger:** View live rent dues, pay online via integrated gateways, and download instant receipts[cite: 1].
* **Maintenance Ticketing:** Raise service complaints with photo attachments and track resolution statuses from open to closed[cite: 1].
* **Community & Emergency Support:** Engage in room/floor/hostel-scoped group chats, check notice boards, and trigger an Emergency SOS alert in a crisis[cite: 1].

---

## 🔄 End-to-End Application Workflow

### Phase 1: Property Onboarding (Supply Side Overview)
1. **Owner Registration & KYC:** Property owners register, submit verification details, and gain approval via the Admin moderation queue[cite: 1].
2. **Inventory Configuration:** Owners configure hierarchical property layouts—floors, rooms, and individual beds with specific sharing types and pricing[cite: 1].

### Phase 2: Guest Discovery & Booking Lifecycle (Demand Side)
1. **Smart Discovery:** Prospective guests browse live properties using location filters, price limits, sharing types, and amenities[cite: 1].
2. **Detailed Previews:** Users inspect weekly food menu schedules, room-specific photos, and multi-category resident reviews[cite: 1].
3. **Token Booking Hold:** Guests reserve a bed instantly using a partial token payment model instead of full rent upfront, triggering an automated hold timer[cite: 1].
4. **Onboarding & Check-In:** Guests complete verification and e-sign digital rental agreements. Staff check them in, transitioning the bed to occupied status and generating a QR-coded digital resident ID[cite: 1].

### Phase 3: Ongoing Tenancy Operations
1. **Resident Dashboard & Ledger:** Residents monitor rent dues, view payment histories, and access digital invoices[cite: 1].
2. **Automated Reminders:** The system triggers scheduled multi-channel payment reminders (WhatsApp/SMS/Email) as rent due dates approach[cite: 1].
3. **Maintenance & Support:** Residents raise service tickets with photo attachments, tracking progress from open to resolved states[cite: 1].
4. **Mess Management:** Users view daily meal schedules, submit food ratings, and manage subscription opt-outs with pro-rated billing rebates[cite: 1].
5. **Community & Emergency Safety:** Residents participate in room/floor/hostel-scoped group chats, check digital notice boards, and use the **Emergency SOS One-Tap Alert** during crises[cite: 1].

### Phase 4: Move-Out & Final Settlement
1. **Formal Vacate Request:** Residents submit notice-period requests aligned with their signed rental agreements[cite: 1].
2. **Inspection & Deposit Settlement:** Owners conduct room inspections against asset registers, itemize damage deductions, and calculate final deposit refunds[cite: 1].
3. **Inventory Release:** Upon final clearance, resident digital IDs are deactivated and bed inventory automatically returns to available status for the next guest cycle[cite: 1].

---

## 🛠️ Tech Stack & Architecture

* **Core Library:** React.js / Vite
* **Styling:** Tailwind CSS
* **State Management:** Context API & Redux Toolkit
* **Routing:** React Router DOM (v6)
* **Icons:** Lucide React
* **HTTP Client:** Axios with interceptors

---

## 📂 Project Directory Structure

```text
src/
├── assets/                  # Logos, icons, and static images
├── components/              # Reusable UI elements (Buttons, Modals, Badges)
├── context/                 # React Context providers (Auth, Theme, Language)
├── hooks/                   # Custom application hooks
├── layouts/                 # Layout wrappers (GuestLayout, ResidentLayout)
├── pages/                   # Views categorized by user journey
│   ├── guest/               # Search, Details, Bed Selection, Token Checkout
│   └── resident/            # Dashboard, Wallet, Payments, Complaints, SOS
├── services/                # Axios API integration modules
├── utils/                   # Formatters and helper functions
├── App.jsx                  # Main router configuration tree
└── main.jsx                 # Application entry point
