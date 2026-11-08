# DRIVERYO Brand Design System & Style Guide

## 1. Brand Identity
- **Brand Name**: DRIVERYO
- **Domain**: https://driveryo.com
- **Tagline**: *"Your Car. Your Journey. Our Driver."*
- **Positioning**: The premier on-demand professional driver service for customer-owned vehicles in India, beginning in Hyderabad.

---

## 2. Color Palette

| Token Name | Hex Code | Tailwind Class Equivalent | Purpose / Application |
| :--- | :--- | :--- | :--- |
| **Navy Deep (Primary)** | `#101D35` | `bg-[#101D35]`, `text-[#101D35]` | Primary headers, dark navigation bar, premium cards |
| **Royal Blue (Accent)** | `#246BFD` | `bg-[#246BFD]`, `text-[#246BFD]` | Primary CTA buttons, active state toggles, icons, links |
| **Soft Blue (Light Accent)**| `#EAF1FF` | `bg-[#EAF1FF]`, `text-[#246BFD]` | Badges, highlighted card backgrounds, active menu tabs |
| **Success Emerald** | `#19B887` | `bg-[#19B887]`, `text-[#19B887]` | Trip completed, verified driver badge, success notifications |
| **Background Crisp** | `#F5F7FB` | `bg-[#F5F7FB]` | App and website page background |
| **Card White** | `#FFFFFF` | `bg-white` | Elevated surfaces, modals, cards |
| **Text Primary** | `#26364F` | `text-[#26364F]` | High-contrast body text, form labels |
| **Text Muted** | `#6B7A99` | `text-[#6B7A99]` | Subtitles, helper text, placeholders |
| **Warning Amber** | `#F59E0B` | `bg-[#F59E0B]`, `text-[#F59E0B]` | Pending approvals, urgent warnings |
| **Danger Rose** | `#EF4444` | `bg-[#EF4444]`, `text-[#EF4444]` | Cancellation, errors, SOS button |

---

## 3. Typography
- **Primary Font Family**: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
- **Headings**:
  - H1: 2.5rem (40px) / Bold / Leading 1.2
  - H2: 2.0rem (32px) / Bold / Leading 1.25
  - H3: 1.5rem (24px) / Semi-bold / Leading 1.3
  - H4: 1.25rem (20px) / Semi-bold / Leading 1.4
- **Body**:
  - Regular: 1rem (16px) / 400 weight / Leading 1.5
  - Medium: 0.875rem (14px) / 500 weight
  - Small / Caption: 0.75rem (12px) / 500 weight

---

## 4. Component Standards

### 4.1 Buttons
- **Primary Button**: `bg-[#246BFD] text-white hover:bg-blue-600 px-6 py-3.5 rounded-xl font-semibold shadow-lg shadow-blue-500/20 transition-all duration-200 active:scale-95`
- **Secondary Button**: `bg-[#EAF1FF] text-[#246BFD] hover:bg-blue-100 px-6 py-3.5 rounded-xl font-semibold transition-all duration-200`
- **Outline Button**: `border-2 border-[#101D35] text-[#101D35] hover:bg-[#101D35] hover:text-white px-6 py-3.5 rounded-xl font-semibold transition-all duration-200`

### 4.2 Form Inputs
- **Base Input**: `w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-[#26364F] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#246BFD] focus:border-transparent transition-all`
- **Input Labels**: `block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5`

### 4.3 Cards & Elevations
- **Base Card**: `bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow`
- **Highlighted Card**: `bg-gradient-to-br from-[#101D35] to-[#1c2d52] text-white rounded-2xl p-6 shadow-xl`
