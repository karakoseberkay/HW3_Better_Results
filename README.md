# HW3 – Better Results (Lead Capture to CRM)

## Overview
This project implements the HW3 requirements for the **Lead Capture to CRM** scenario using Node.js.

The system processes incoming lead data, validates it, enriches it with AI-style classification, and stores the final results in a CRM/Sheets-like structure (`output.json`).

---

## Workflow Architecture
Input ({name, email, message})  
→ Validation (Email/Format Check)  
→ AI Analysis (Intent & Urgency)  
→ Data Persistence (output.json with full metadata)

---

## Features

### 1. Validation Logic
- Checks for missing fields (name, email, message)
- Validates email format using regex
- Identifies invalid inputs

### 2. Lead Flagging
- Leads are **NOT deleted**
- Each lead is marked with:
  - `validation_status: "Valid"` or `"Invalid"`
  - `missing_fields`
  - `email_valid`

### 3. AI Classification
Each message is analyzed and classified into:

- **Intent**:
  - Sales
  - Support
  - Partnership
  - General

- **Urgency**:
  - High
  - Medium
  - Low

This simulates an LLM-based classification step.

### 4. Data Persistence
All leads (valid and invalid) are stored in `output.json` with:
- Original data
- Validation results
- Classification results
- Metadata

---

## Additional Features (Extended HW3)

### Social Media Variants
Generates 3 AI-style content outputs:
- Twitter/X (short & punchy)
- LinkedIn (professional)
- Instagram (casual + hashtags)

Each output includes:
- platform
- text
- hashtags

---

### Order Summary & VIP Logic
- Generates a friendly order summary including:
  - items
  - total
  - expected delivery
- Applies conditional logic:
  - If `order_total > 500` → VIP customer
  - VIP users receive enhanced confirmation messages

---

## Test Case

The system was tested with both valid and invalid inputs:

- Missing name → `validation_status = "Invalid"`
- Invalid email format → `validation_status = "Invalid"`
- Valid lead → correctly classified with Intent and Urgency

All records (including invalid ones) are stored in `output.json`.

---

## Example Output Fields

Each record includes:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "I need help urgently",
  "validation_status": "Valid",
  "missing_fields": [],
  "email_valid": true,
  "classification": {
    "intent": "Support",
    "urgency": "High"
  }
}
