# Natepad — Project Documentation

> A web-based Notes Generator for CEG Support agents.
> Developed by: CEG Support Team
> Hosted on: [natepad.netlify.app](https://natepad.netlify.app)

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Target Users](#2-target-users)
3. [Tech Stack & Deployment](#3-tech-stack--deployment)
4. [User Interface Design](#4-user-interface-design)
5. [Dynamic Field Logic](#5-dynamic-field-logic)
6. [Functional Features](#6-functional-features)
7. [Proposed User Workflow](#7-proposed-user-workflow)
8. [Expected Benefits](#8-expected-benefits)
9. [Known Limitations](#9-known-limitations)
10. [Technical Design Summary](#10-technical-design-summary)
11. [Changelog](#11-changelog)

---

## 1. Project Overview

Natepad is a web-based Notes Generator designed to help CEG agents create standardized, complete, and accurate call notes. The tool aims to reduce markdowns caused by missing or incorrect documentation while ensuring proper Qualicode assignment and consistent note formatting.

---

## 2. Target Users

Natepad is intended for **CEG Inbound agents** handling customer calls under the Cignal support team. No technical background is required to use the tool.

---

## 3. Tech Stack & Deployment

| Layer            | Detail                        |
| ---------------- | ----------------------------- |
| Frontend         | Vanilla HTML, CSS, JavaScript |
| Hosting          | Netlify                       |
| Version Control  | GitHub                        |
| Build Process    | None (static site)            |

---

## 4. User Interface Design

The application follows a simple two-panel layout:

### 4.1 Call Out Details Panel

Located on the **left side** of the screen. This is the agent input area where call transaction details are captured.

| Field         | Description                                                                           |
| ------------- | ------------------------------------------------------------------------------------- |
| Customer      | Identifies the caller relationship (Account Holder, Authorized Person, Others, etc.) |
| DB Clean-Up   | Captures database update status for mobile number and/or email address                |
| Account Type  | Subscriber account type (Postpaid, Prepaid, SatLite, OTT, etc.)                      |
| Service Type  | Type of concern or service category                                                   |
| Category      | Specific concern classification                                                       |
| Resolution    | Resolution provided by the agent                                                      |
| Upsell        | Upsell activity or offer discussed during the call                                    |
| Ticket Number | Reference ticket                                                                      |
| Qualicode     | Auto-generated code based on selected categorizations                                 |

> **Note:** Field order above reflects the actual UI layout.

### 4.2 Preview Panel

Located on the **right side** of the screen.

**Purpose:**
- Displays the generated notes in real time
- Allows agents to review the final output before copying
- Prevents formatting errors and incomplete notes

The preview follows the approved note structure and includes a **character counter** to help agents monitor note length.

---

## 5. Dynamic Field Logic

The system includes conditional fields to simplify agent input and prevent unnecessary data entry.

### 5.1 Customer = Others

When **"Others"** is selected under Customer:
- A new text field automatically appears
- Agent must specify the relationship or identity of the caller
- This information will be included in the generated notes

**Example:**

| Field    | Value    |
| -------- | -------- |
| Customer | Others   |
| Specify  | Daughter |

**Output:**
```
C: Others - Daughter
```

---

### 5.2 DB Clean-Up Logic

The DB Clean-Up field supports multiple scenarios:

| Option                  | Additional Fields Triggered          |
| ----------------------- | ------------------------------------ |
| Updated                 | None                                 |
| Not Updated - Mobile    | New Mobile Number field              |
| Not Updated - Email     | New Email Address field              |
| Not Updated - Both      | New Mobile Number + Email Address    |

This ensures complete documentation of database maintenance efforts.

---

## 6. Functional Features

### 6.1 Real-Time Note Generation

As agents complete the fields, the system dynamically generates a formatted notes preview.

**Benefits:**
- Reduces manual typing
- Eliminates formatting inconsistencies
- Improves note quality and compliance

---

### 6.2 Auto Qualicode Identification

Qualicode is automatically determined based on:
- Account Type
- Service Type
- Category

This removes manual selection errors and promotes accurate call tagging.

---

### 6.3 Copy Function

The **Copy** button allows agents to instantly copy the full generated notes.

**Benefits:**
- Faster documentation
- Reduced repetitive work
- Improved agent productivity

---

### 6.4 Split Copy Function

For longer notes, agents can copy notes in **three separate parts** using the Toggle Dropdown:

| Option         | Description                              |
| -------------- | ---------------------------------------- |
| Copy 1st Part  | Copies the first section of the notes    |
| Copy 2nd Part  | Copies the middle section of the notes   |
| Copy 3rd Part  | Copies the last section of the notes     |

**Purpose:** Accommodates character limits in the Sure system by allowing agents to paste notes in segments.

---

### 6.5 Reset Function

The **Reset** button clears all inputs and generated content.

**Purpose:**
- Prepare the tool for the next transaction
- Prevent accidental reuse of previous customer information

---

### 6.6 Theme Toggle

The system supports:
- ☀️ Light Mode
- 🌙 Dark Mode

**Benefits:**
- Improved accessibility
- Better user experience
- User preference flexibility

---

## 7. Proposed User Workflow

1. Agent selects **Customer** type
2. Agent records **DB Clean-Up** status
3. Agent selects **Account Type**
4. Agent selects **Service Type**
5. Agent selects **Category**
6. Agent enters **Resolution** details
7. Agent records **Upsell** activity
8. Agent enters **Ticket Number** (if applicable)
9. System automatically determines **Qualicode**
10. **Notes Preview** is generated in real time
11. Agent reviews the generated notes
12. Agent clicks **Copy** (or uses Split Copy if needed)
13. Agent pastes the notes into the **Sure system**
14. Agent clicks **Reset** before handling the next call

---

## 8. Expected Benefits

- Reduced note-related markdowns
- Standardized note formatting across all agents
- Improved Qualicode accuracy
- Faster documentation process
- Better compliance and audit readiness
- Increased agent productivity and efficiency

---

## 9. Known Limitations

| Limitation                        | Details                                                                 |
| --------------------------------- | ----------------------------------------------------------------------- |
| No offline support                | Requires an active internet connection to load                          |
| No save / history functionality   | All inputs are lost upon page reload or browser close                   |
| No user authentication            | Anyone with the link can access the tool                                |

---

## 10. Technical Design Summary

Natepad is developed as a lightweight web application utilizing dynamic form logic and real-time note generation. The design focuses on:

- **Ease of use** — minimal training required for agents
- **Accuracy** — automated field validation, conditional inputs, and Qualicode mapping
- **Performance** — no backend, no database, static deployment via Netlify

---

## 11. Changelog

| Version | Date       | Changes                                         |
| ------- | ---------- | ----------------------------------------------- |
| v1.0.0  | —          | Initial release — core notes generator          |

> Update this section with actual release dates as changes are deployed.

---

*© Natepad. Design & Developed by CEG Support.*
