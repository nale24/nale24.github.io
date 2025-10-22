const output = document.getElementById('output');
const input = document.getElementById('command-input');
let commandHistory = [];
let historyIndex = -1;

// Navigation history to track pages
let navigationHistory = [];
let currentPage = 'welcome';

// Data will be loaded from JSON files
let projects = [];
let content = {};

// Load data from JSON files
async function loadData() {
    try {
        // Load projects
        const projectsResponse = await fetch('data/projects.json');
        projects = await projectsResponse.json();

        console.log('Projects loaded:', projects); // Debug line

        // Load content
        const contentResponse = await fetch('data/content.json');
        content = await contentResponse.json();

        console.log('Content loaded:', content); // Debug line

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
        addToNavigationHistory('help');
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
  back       - Go back to the previous page
  home       - Return to the welcome screen
  help       - Show this help message

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 Tip: Type any command and press Enter to get started!
        `;
    },

    about: () => {
        addToNavigationHistory('about');
        return content.about || 'Content not loaded yet. Make sure you are running a local server.';
    },

    timeline: () => {
        addToNavigationHistory('timeline');
        return content.timeline || 'Content not loaded yet. Make sure you are running a local server.';
    },

    skills: () => {
        addToNavigationHistory('skills');
        return content.skills || 'Content not loaded yet. Make sure you are running a local server.';
    },

    contact: () => {
        addToNavigationHistory('contact');
        return content.contact || 'Content not loaded yet. Make sure you are running a local server.';
    },

    projects: () => {
        addToNavigationHistory('projects');
        if (projects.length === 0) {
            return 'Projects not loaded yet. Make sure you are running a local server.';
        }

        let projectOutput = `
╔════════════════════════════════════════════════════════════╗
║                      MY PROJECTS                           ║
╚════════════════════════════════════════════════════════════╝

Select a project number to view details:

`;

        projects.forEach(project => {
            projectOutput += `[${project.id}] ${project.title}\n`;
            projectOutput += `    ${project.category} | ${project.tech}\n`;
            projectOutput += `    ${project.description}\n\n`;
        });

        projectOutput += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        projectOutput += `💡 Type a number (1-${projects.length}) to view project details`;

        return projectOutput;
    },

    clear: () => {
        output.innerHTML = '';
        return '';
    },

    back: () => {
        if (navigationHistory.length <= 1) {
            return 'No previous page to go back to. Type "home" to return to welcome screen.';
        }

        // Remove current page
        navigationHistory.pop();

        // Get previous page
        const previousPage = navigationHistory[navigationHistory.length - 1];

        // Execute the previous command without adding to history again
        if (commands[previousPage]) {
            // Temporarily remove from history to avoid double-adding
            const lastItem = navigationHistory.pop();
            const result = commands[previousPage]();
            navigationHistory.push(lastItem);
            return result;
        } else if (previousPage === 'welcome') {
            showWelcome();
            return '';
        }

        return 'Error navigating back.';
    },

    home: () => {
        // Clear navigation history and go to welcome
        navigationHistory = ['welcome'];
        showWelcome();
        return '';
    }
};

// Check if input is a project number
function isProjectNumber(input) {
    const num = parseInt(input);
    return !isNaN(num) && num >= 1 && num <= projects.length;
}

// Add page to navigation history
function addToNavigationHistory(page) {
    navigationHistory.push(page);
    currentPage = page;
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
    currentPage = 'welcome';
    navigationHistory = ['welcome']; // Reset navigation when showing welcome
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
    // Use innerText to preserve line breaks and whitespace
    line.innerText = text;
    // Make sure white-space is preserved in CSS
    line.style.whiteSpace = 'pre-wrap';
    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
}

// Process command
function processCommand(cmd) {
    const trimmedCmd = cmd.trim();

    // Handle empty command
    if (trimmedCmd === '') {
        return;
    }

    // Clear previous output before showing new command
    // output.innerHTML = '';
    // Echoing the command, then add a separator to make the website look like real terminal
    addOutput('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // Echo command
    addOutput(`visitor@portfolio:~$ ${cmd}`, 'command-echo');

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