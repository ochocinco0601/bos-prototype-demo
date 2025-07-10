# BOS Prototype Demo

A React TypeScript application demonstrating the Business Observability System (BOS) methodology - a stakeholder-first approach to business observability and incident response.

## Quick Start for Corporate Testing

### Prerequisites
- Node.js installed (check with `node --version`)
- VS Code or similar editor

### Getting the Code

#### Option A: Git Clone (Recommended if you have Git)
```bash
git clone [INTERNAL_REPO_URL]
cd bos-prototype-demo
```

#### Option B: GitHub Desktop (If Installed)
1. Open GitHub Desktop
2. File → Clone Repository → URL tab
3. Paste the internal repository URL
4. Choose local path and clone
5. Open in VS Code

#### Option C: Download ZIP
1. Click green "Code" button → "Download ZIP"
2. Extract to folder
3. **Important**: Navigate into the extracted subfolder (usually ends with "-main")
4. Open that folder in VS Code

### Running the Application

1. **Open terminal** in VS Code (`Ctrl + backtick`)
2. **Install dependencies:**
   ```bash
   npm install
   ```
   *(Takes 2-3 minutes, installs ~400 packages)*

3. **Start the application:**
   ```bash
   npm run dev
   ```
   *(Browser opens automatically to http://localhost:3000)*

### Testing Guidelines

#### What to Test
- **Flow Creation**: Create new business process flows
- **7-Step Methodology**: Complete stakeholder analysis workflow
- **Impact Assessment**: Define Financial/Legal/Operational/Customer impacts
- **Playbook Generation**: Generate Business Impact Playbooks
- **Data Persistence**: Test import/export functionality

#### Sample Business Process
Try creating a flow for a familiar business process like:
- Customer onboarding
- Loan approval workflow  
- Trading settlement process
- Incident response procedure

### Troubleshooting

**Common Issues:**
- **"npm not found"**: Node.js not installed or not in PATH
- **White screen**: Make sure you're in the correct folder with `package.json`
- **Port conflicts**: If 3000 is busy, app will use next available port
- **npm install fails**: Check corporate proxy/firewall settings
- **Permission errors**: Try running VS Code as administrator
- **Wrong folder**: Make sure you're in the folder containing `package.json`, not a parent folder

**Corporate Network Issues:**
- npm install may be slower due to corporate firewalls
- Some packages may require proxy configuration
- Contact IT if persistent network issues

**Need Help?**
Contact [YOUR_NAME] or [YOUR_EMAIL] for technical support.

## About the BOS Methodology

This prototype implements a 7-step methodology for connecting business processes to technical observability:

1. **WHO depends** - Identify stakeholders and their roles
2. **WHAT they expect** - Map dependencies and expectations
3. **WHAT breaks** - Analyze business impact categories
4. **WHAT telemetry** - Identify data sources and systems
5. **WHAT signals** - Define observable metrics and alerts
6. **PLAYBOOK generation** - Create incident response documentation
7. **DASHBOARD requirements** - Specify monitoring needs

## Feedback

Please provide feedback on:
- User experience and interface usability
- Business process relevance and accuracy
- Missing features or capabilities
- Technical performance and reliability

Create issues in this repository or contact [YOUR_NAME] directly.