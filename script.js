const output = document.getElementById('output');
const input = document.getElementById('command-input');

// Your content data
const content = {
    about: `
Hi! I'm [Your Name], a data analyst and software developer.

I specialize in turning data into actionable insights and building 
efficient software solutions. I love working with Python, SQL, and 
modern web technologies.

Skills: Python | SQL | JavaScript | Data Visualization | React
    `,

    projects: `
=== Data Analytics Projects ===
1. Sales Dashboard - Interactive Power BI dashboard
2. Customer Segmentation - Python clustering analysis
3. Predictive Model - ML model for forecasting

=== Software Development Projects ===
1. Task Manager API - RESTful API with Node.js
2. Weather App - React + OpenWeather API
3. E-commerce Site - Full-stack MERN project

Type 'project [number]' for details (e.g., 'project 1')
    `,

    resume: `
=== Education ===
- BS in Computer Science - University Name (2020-2024)
- Data Analytics Bootcamp - Platform Name (2023)

=== Experience ===
- Junior Developer @ Company (2024-Present)
  - Built data pipelines processing 1M+ records
  - Developed customer analytics dashboard

=== Skills ===
Languages: Python, JavaScript, SQL, R
Tools: Git, Docker, Tableau, Power BI
Frameworks: React, Node.js, Django
    `,

    contact: `
📧 Email: your.email@example.com
💼 LinkedIn: linkedin.com/in/yourprofile
🐙 GitHub: github.com/yourusername
📄 Resume: [Download PDF link]
    `
};

// Available commands
const commands = {
    help: () => {
        return `
Available commands:
  help      - Show this help message
  about     - Learn about me
  projects  - View my projects
  resume    - See my education & experience
  contact   - Get my contact information
  clear     - Clear the terminal
  
Type any command and press Enter!
        `;
    },

    about: () => content.about,
    projects: () => content.projects,
    resume: () => content.resume,
    contact: () => content.contact,

    clear: () => {
        output.innerHTML = '';
        return '';
    }
};

// Welcome message
function showWelcome() {
    output.innerHTML = `
<div class="output-line">Welcome to my portfolio terminal!</div>
<div class="output-line">Type 'help' to see available commands.</div>
<div class="output-line">---</div>
    `;
}

// Process command
function processCommand(cmd) {
    const command = cmd.trim().toLowerCase();

    // Display the command
    const cmdLine = document.createElement('div');
    cmdLine.className = 'output-line command';
    cmdLine.textContent = `visitor@portfolio:~$ ${cmd}`;
    output.appendChild(cmdLine);

    // Execute command
    let result;
    if (commands[command]) {
        result = commands[command]();
    } else if (command === '') {
        result = '';
    } else {
        result = `Command not found: ${command}\nType 'help' for available commands.`;
    }

    // Display result
    if (result) {
        const resultLine = document.createElement('div');
        resultLine.className = 'output-line';
        resultLine.textContent = result;
        output.appendChild(resultLine);
    }

    // Scroll to bottom
    window.scrollTo(0, document.body.scrollHeight);
}

// Handle input
input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const command = input.value;
        processCommand(command);
        input.value = '';
    }
});

// Initialize
showWelcome();
input.focus();