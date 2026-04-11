# Jobify & ReWire Intelligence Suite 🚀

[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Anthropic Claude](https://img.shields.io/badge/AI-Claude%203.5%20Sonnet-7B61FF?logo=anthropic&logoColor=white)](https://www.anthropic.com/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Framework: Express](https://img.shields.io/badge/Framework-Express.js-000000?logo=express&logoColor=white)](https://expressjs.com/)

> **The next-generation intelligence platform for Career matching, Market research, and Strategic planning.**

## 📽 Demo Overview
![Jobify Demo](demo.webp)

---

Jobify is a high-end automation suite that bridges the gap between raw web data and actionable insights. By orchestrating distributed cloud scrapers via **Apify** and performing deep-reasoning synthesis through **Anthropic’s Claude LLM**, Jobify provides users with professional-grade reports in seconds.

---

## 🏗 System Architecture

The platform is designed with a service-oriented architecture, ensuring clear separation of concerns between data acquisition, tactical processing, and visual presentation.

```mermaid
graph TD
    Client[Frontend: Vanilla HTML/CSS/JS] -->|API Request| Server[Express.js Backend]
    
    subgraph Data Acquisition
        Server -->|Triggers| Apify[Apify Scraping Cloud]
        Apify -->|LinkedIn Scraper| Web1[LinkedIn Data]
        Apify -->|Indeed Scraper| Web2[Indeed Data]
        Apify -->|G2/Google Scraper| Web3[Market Data]
    end
    
    subgraph Intelligence Hub
        Apify -->|Raw JSON| Server
        Server -->|Prompt Engineering| Claude[Claude AI Engine]
        Claude -->|Structured Analysis| Server
    end
    
    subgraph Reporting Layer
        Server -->|JSON Payload| PDFService[Reporting Service]
        PDFService -->|HTML Report| Client
        Client -->|Print/Save| Storage[Local/Tmp Storage]
    end
```

---

## 🌟 Core Intelligence Modules

### 1. Career Intelligence (Job Matcher)
*   **Real-Time Scraping**: Pulls live listings directly from Indeed and LinkedIn using headless browser automation.
*   **AI Ranking**: Claude analyzes your résumé text or PDF against listing requirements to produce a 0-100% match score.
*   **Gap Analysis**: Identifies exactly which tools or certifications you are missing for specific roles.
*   **Actionable Recs**: Generates personalized training roadmaps to close skill gaps.

---

## 🛠 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Backend** | Node.js, Express.js |
| **Frontend** | Vanilla JavaScript, CSS3 (Glassmorphism), Semantic HTML5 |
| **Intelligence** | Anthropic Claude 3.5 Sonnet SDK |
| **Data Scraping** | Apify SDK & Dedicated Actors (LinkedIn, Indeed, Google) |
| **Reporting** | Custom DOM Template Engine |
| **File Handling** | Multer (Résumé uploads), PDF-Parse |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher)
- [Apify API Token](https://apify.com/)
- [Anthropic API Key](https://anthropic.com/)

### Installation

1. **Clone & Navigate**
   ```bash
   git clone https://github.com/sensivam30-aitech/Jobify.git
   cd Jobify/Jobify
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   Create a `.env` file in the `Jobify` directory:
   ```env
   PORT=3000
   APIFY_API_TOKEN=your_apify_token_here
   ANTHROPIC_API_KEY=your_anthropic_key_here
   ```

4. **Launch**
   ```bash
   npm start
   ```
   *The platform will be live at `http://localhost:3000`*

---

## 📁 Repository Structure

```text
Jobify/
├── actors/           # Apify Actor configurations & input builders
├── prompts/          # Advanced System Prompt engineering for Claude
├── routes/           # REST API endpoints (Jobs, Intel, Travel)
├── services/         # Core business logic (Scraping, AI, Reporting)
├── public/           # Premium High-End Frontend (HTML/CSS)
└── server.js         # Express Entry point & Middleware
```

---

## 📜 License
This project is licensed under the **ISC License**.

---

Developed with ❤️ by the Jobify Team.
