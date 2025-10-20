const output = document.getElementById('output');
const input = document.getElementById('command-input');
let commandHistory = [];
let historyIndex = -1;

// Data will be loaded from JSON files
let projects = [];
let content = {};

// Load data from JSON files
async function loadData() {
    try {
        // Load projects
        const projectsResponse = await fetch('data/projects.json');
        projects = await projectsResponse.json();

        // Load content
        const contentResponse = await fetch('data/content.json');
        content = await contentResponse.json();

        // Initialize terminal after data is loaded
        showWelcome();
    } catch (error) {
        console.error('Error loading data:', error);
        addOutput('Error loading portfolio data. Please refresh the page.', 'error');
    }
}

// Available commands
const commands = {
    help: () => {
        return `
╔════════════════════════════════════════════════════════════╗
║                    AVAILABLE COMMANDS                      ║
╚════════════════════════════════════════════════════════════╝

  about      - Learn more about me and my background
  timeline   - View my education and work experience
  skills     - See my technical skills and expertise
  projects   - Browse my portfolio projects
  contact    - Get my contact information
  clear      - Clear the terminal screen
  help       - Show this help message

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 Tip: Type any command and press Enter to get started!
        `;
    },

    about: () => content.about || 'Content not loaded yet.',
    timeline: () => content.timeline || 'Content not loaded yet.',
    skills: () => content.skills || 'Content not loaded yet.',
    contact: () => content.contact || 'Content not loaded yet.',

    projects: () => {
        if (projects.length === 0) {
            return 'Projects not loaded yet.';
        }

        let output = `
╔════════════════════════════════════════════════════════════╗
║                      MY PROJECTS                           ║
╚════════════════════════════════════════════════════════════╝

Select a project number to view details:

`;

        projects.forEach(project => {
            output += `[${project.id}] ${project.title}\n`;
            output += `    ${project.category} | ${project.tech}\n`;
            output += `    ${project.description}\n\n`;
        });

        output += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        output += `💡 Type a number (1-${projects.length}) to view project details`;

        return output;
    },

    clear: () => {
        output.innerHTML = '';
        return '';
    }
};

// Check if input is a project number
function isProjectNumber(input) {
    const num = parseInt(input);
    return !isNaN(num) && num >= 1 && num <= projects.length;
}

// Navigate to project page
function navigateToProject(projectId) {
    const project = projects.find(p => p.id === projectId);
    if (project) {
        // Add a loading message before navigation
        addOutput(`Loading ${project.title}...`, 'success');
        setTimeout(() => {
            window.location.href = project.page;
        }, 500);
        return '';
    }
    return `Project ${projectId} not found.`;
}

// Welcome message
function showWelcome() {
    const welcome = `
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║            Welcome to Na Le's Portfolio Terminal           ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝

Type 'help' to see available commands.

`;
    addOutput(welcome, 'info');
}

// Add output to terminal
function addOutput(text, className = '') {
    const line = document.createElement('div');
    line.className = `output-line ${className}`;
    line.textContent = text;
    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
}

// Process command
function processCommand(cmd) {
    const trimmedCmd = cmd.trim();

    // Echo command
    addOutput(`visitor@portfolio:~$ ${cmd}`, 'command-echo');

    // Handle empty command
    if (trimmedCmd === '') {
        return;
    }

    // Add to history
    commandHistory.unshift(trimmedCmd);
    historyIndex = -1;

    // Check if it's a project number
    if (isProjectNumber(trimmedCmd)) {
        const result = navigateToProject(parseInt(trimmedCmd));
        if (result) addOutput(result, 'error');
        return;
    }

    // Check if it's a valid command
    const command = trimmedCmd.toLowerCase();
    if (commands[command]) {
        const result = commands[command]();
        if (result) addOutput(result);
    } else {
        addOutput(`Command not found: ${trimmedCmd}\nType 'help' for available commands.`, 'error');
    }
}

// Handle keyboard input
input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const command = input.value;
        processCommand(command);
        input.value = '';
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            input.value = commandHistory[historyIndex];
        }
    } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex > 0) {
            historyIndex--;
            input.value = commandHistory[historyIndex];
        } else {
            historyIndex = -1;
            input.value = '';
        }
    }
});

// Keep input focused
document.addEventListener('click', () => {
    input.focus();
});

// Initialize - Load data then start terminal
loadData();
input.focus();