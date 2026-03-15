// Portfolio AI Assistant
class PortfolioAI {
    constructor() {
        this.isOpen = false;
        this.apiKey = null;
        this.cvData = this.getCVData();
        this.maxQuestions = 5;
        this.questionsAsked = this.getQuestionsAsked();
        this.chatOpenCount = this.getChatOpenCount();
        this.initializeElements();
        this.bindEvents();
        this.updateQuestionCounter();
    }

    initializeElements() {
        this.aiToggle = document.getElementById('aiToggle');
        this.aiChat = document.getElementById('aiChat');
        this.closeChat = document.getElementById('closeChat');
        this.chatMessages = document.getElementById('chatMessages');
        this.messageInput = document.getElementById('messageInput');
        this.sendMessage = document.getElementById('sendMessage');
        this.githubLink = document.getElementById('githubLink');
        this.linkedinLink = document.getElementById('linkedinLink');
    }

    bindEvents() {
        this.aiToggle.addEventListener('click', () => this.toggleChat());
        this.closeChat.addEventListener('click', () => this.closeChatWindow());
        this.sendMessage.addEventListener('click', () => this.sendUserMessage());
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendUserMessage();
            }
        });

        // Remove placeholder link handlers - links now work directly
        // this.githubLink.addEventListener('click', (e) => {
        //     e.preventDefault();
        //     this.showMessage('GitHub link not provided. Please contact Abdulrahman directly for his GitHub profile.', 'ai');
        // });

        // this.linkedinLink.addEventListener('click', (e) => {
        //     e.preventDefault();
        //     this.showMessage('LinkedIn link not provided. Please contact Abdulrahman directly for his LinkedIn profile.', 'ai');
        // });
    }

    getCVData() {
        return {
            name: "Abdulrahman Assi",
            title: "Computer Science BSc Graduate",
            contact: {
                phone: "0528904953",
                email: "abedassi134@gmail.com",
                location: "Kafr bara 4586300, Israel"
            },
            education: {
                university: "Haifa University",
                degree: "Computer Science (BSc)",
                duration: "Graduated",
                gpa: 85,
                courses: {
                    "Data Structures": 99,
                    "Machine Learning": 90,
                    "Deep Learning": 90,
                    "Computer Organization and Architecture": 88,
                    "Computer Networks": 85,
                    "Operating Systems": 82
                }
            },
            skills: {
                programmingLanguages: ["C", "C++", "Java", "Python", "JavaScript", "Dart"],
                frameworksAndTools: ["Node.js", "Flutter", "Git", "Jira"],
                webAndSystems: ["REST APIs", "HTML", "Linux", "Spring Boot", "React"],
                testingAndDevOps: ["Unit Testing", "Docker"],
                concepts: ["Object-Oriented Programming", "Client-Server Architecture", "Database Design", "Machine Learning"]
            },
            languages: {
                "Arabic": "Native",
                "Hebrew": "Full Proficiency (high level)",
                "English": "Full Proficiency (high level)"
            },
            projects: [
                {
                    name: "AI Agent for Chess Game",
                    type: "Autonomous Chess-Playing Agent",
                    description: "Developed an autonomous chess-playing agent in Python using a client-server architecture and multithreading. Implemented time-constrained decision-making algorithms to optimize move selection in real-time games.",
                    technologies: ["Python", "Multithreading", "Client-Server", "AI Algorithms"]
                },
                {
                    name: "AI Calendar Assistant",
                    type: "Flutter Mobile App with Fast API Backend",
                    description: "A Flutter mobile app with a Fast API backend that uses AI to create and manage calendar events from natural language. Includes event CRUD operations, PostgreSQL database integration, and an AI assistant for smart scheduling.",
                    technologies: ["Flutter", "Fast API", "PostgreSQL", "AI"]
                },
                {
                    name: "Natural Language to SQL (NL2SQL) Engine",
                    type: "Full-Stack NL2SQL Application",
                    description: "Developed a comprehensive full-stack Natural Language to SQL application using Node.js and Express.js backend with MongoDB and SQL database integration. Leveraged OpenAI API to translate user queries into validated, executable SQL queries, creating a user-friendly interface for non-technical data exploration and analysis.",
                    technologies: ["Node.js", "Express.js", "MongoDB", "SQL", "OpenAI API"]
                }
            ],
            about: "Computer Science BSc graduate with strong foundations in data structures, machine learning, and systems programming. Hands-on experience building AI-driven and full-stack applications using Python, Node.js, Flutter, and Fast API."
        };
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            this.aiChat.classList.remove('hidden');
            this.messageInput.focus();
            // Increment counter when AI chat is opened
            this.incrementChatOpenCount();
        } else {
            this.aiChat.classList.add('hidden');
        }
    }

    closeChatWindow() {
        this.isOpen = false;
        this.aiChat.classList.add('hidden');
    }

    sendUserMessage() {
        const message = this.messageInput.value.trim();
        if (!message) return;

        // Check if user has reached question limit
        if (this.questionsAsked >= this.maxQuestions) {
            this.addMessage("You've reached the maximum number of questions (5). Please refresh the page to ask more questions.", 'ai');
            this.disableInput();
            return;
        }

        this.addMessage(message, 'user');
        this.messageInput.value = '';

        // Increment question counter
        this.questionsAsked++;
        this.saveQuestionsAsked();
        this.updateQuestionCounter();

        // Show loading indicator
        const loadingId = this.addLoadingMessage();

        // Use OpenAI API for enhanced responses
        this.generateOpenAIResponse(message).then(response => {
            this.removeLoadingMessage(loadingId);
            this.addMessage(response, 'ai');
        }).catch(error => {
            this.removeLoadingMessage(loadingId);
            // Fallback to local responses if API fails
            const fallbackResponse = this.generateAIResponse(message);
            this.addMessage(fallbackResponse, 'ai');
        });
    }

    addMessage(content, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`; // matches CSS selectors .message.user and .message.ai
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.innerHTML = `<p>${content}</p>`;
        
        messageDiv.appendChild(messageContent);
        this.chatMessages.appendChild(messageDiv);
        
        this.scrollToBottom();
    }

    addLoadingMessage() {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message ai';
        messageDiv.id = 'loading-message';
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.innerHTML = '<div class="loading"></div>';
        
        messageDiv.appendChild(messageContent);
        this.chatMessages.appendChild(messageDiv);
        
        this.scrollToBottom();
        return 'loading-message';
    }

    removeLoadingMessage(loadingId) {
        const loadingElement = document.getElementById(loadingId);
        if (loadingElement) {
            loadingElement.remove();
        }
    }

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    generateAIResponse(userMessage) {
        const message = userMessage.toLowerCase();
        // Simple keyword-based responses (in a real implementation, this would use OpenAI API)
        if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
            return "Hello! I'm here to help you learn about Abdulrahman's background, skills, and experience. What would you like to know?";
        }
        
        if (message.includes('education') || message.includes('university') || message.includes('gpa')) {
            return `Abdulrahman is a Computer Science (BSc) graduate from Haifa University with a GPA of 85. His strongest subjects include Data Structures (99), Machine Learning (90), Deep Learning (90), and Computer Organization and Architecture (88). He also has excellent grades in Computer Networks (85) and Operating Systems (82).`;
        }
        
        if (message.includes('skill') || message.includes('programming') || message.includes('language')) {
            return `Abdulrahman's technical skills include: Programming languages—C, C++, Java, Python, JavaScript, Dart; Frameworks & tools—Node.js, Flutter, Git, Jira; Web & systems—REST APIs, HTML, Linux, Spring Boot, React; Testing & DevOps—Unit Testing, Docker. He has strong experience in Object-Oriented Programming and building scalable systems.`;
        }
        
        if (message.includes('project') || message.includes('work') || message.includes('experience')) {
            return `Abdulrahman has worked on several impressive projects: 1) AI Agent for Chess Game—A Python autonomous chess-playing agent with client-server architecture and multithreading; 2) AI Calendar Assistant—A Flutter mobile app with Fast API backend and PostgreSQL for AI-powered calendar management from natural language; 3) NL2SQL Engine—A full-stack application using Node.js, Express.js, MongoDB, and OpenAI API for natural language to SQL translation.`;
        }
        
        if (message.includes('contact') || message.includes('email') || message.includes('phone')) {
            return `You can contact Abdulrahman at abedassi134@gmail.com or call him at 0528904953. He's located in Kafr bara 4586300, Israel. He's fluent in Arabic (native), Hebrew, and English.`;
        }
        
        if (message.includes('language') || message.includes('arabic') || message.includes('hebrew') || message.includes('english')) {
            return `Abdulrahman is multilingual with Arabic as his native language, and he has full proficiency in both Hebrew and English at a high level.`;
        }
        
        if (message.includes('about') || message.includes('who') || message.includes('background')) {
            return `Abdulrahman is a Computer Science BSc graduate with strong foundations in data structures, machine learning, and systems programming. He has hands-on experience building AI-driven and full-stack applications using Python, Node.js, Flutter, and Fast API. He is eager to contribute to teams focused on growth and improvement.`;
        }
        
        if (message.includes('experience') || message.includes('work') || message.includes('job')) {
            return `Abdulrahman has gained significant practical experience through his projects as a Computer Science graduate. His work includes developing autonomous AI agents (chess), Flutter mobile apps with Fast API backends, and full-stack NL2SQL applications. He has demonstrated strong technical skills in Python, Node.js, Flutter, and AI/ML.`;
        }
        
        if (message.includes('strength') || message.includes('strong') || message.includes('best')) {
            return `Abdulrahman's key strengths include: Strong academic performance (GPA 85, Data Structures 99, Machine Learning and Deep Learning 90), diverse programming skills (C, C++, Java, Python, JavaScript, Dart), experience with Flutter, Fast API, Node.js, and AI/ML, plus multilingual abilities (Arabic, Hebrew, English).`;
        }
        
        if (message.includes('future') || message.includes('goal') || message.includes('plan')) {
            return `As a Computer Science BSc graduate, Abdulrahman's diverse skill set in programming, AI, Flutter, and full-stack development positions him well for career opportunities in software development, AI/ML, or mobile and web application development.`;
        }
        
        // Default response for unrecognized queries
        return `I can help you learn about Abdulrahman's education (GPA 85), technical skills, projects (Chess AI, AI Calendar Assistant, NL2SQL), languages, or contact information. Could you be more specific about what you'd like to know?`;
    }

    // Method to integrate with OpenAI API (requires API key)
    async generateOpenAIResponse(userMessage) {
        if (!this.apiKey) {
            return this.generateAIResponse(userMessage); // Fallback to local responses
        }

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [
                        {
                            role: 'system',
                            content: `You are an AI assistant helping people learn about Abdulrahman Assi's CV and background. Use the following information to answer questions:

Name: ${this.cvData.name}
Title: ${this.cvData.title}
Contact: ${JSON.stringify(this.cvData.contact)}
Education: ${JSON.stringify(this.cvData.education)}
Skills: ${JSON.stringify(this.cvData.skills)}
Languages: ${JSON.stringify(this.cvData.languages)}
Projects: ${JSON.stringify(this.cvData.projects)}
About: ${this.cvData.about}

Answer questions about Abdulrahman's background, skills, education, projects, and experience. Be helpful, accurate, and professional.`
                        },
                        {
                            role: 'user',
                            content: userMessage
                        }
                    ],
                    max_tokens: 500,
                    temperature: 0.7
                })
            });

            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error('Error calling OpenAI API:', error);
            return this.generateAIResponse(userMessage); // Fallback to local responses
        }
    }

    // Method to set OpenAI API key
    setApiKey(apiKey) {
        this.apiKey = apiKey;
    }

    // Question limiting methods
    getQuestionsAsked() {
        const stored = localStorage.getItem('questionsAsked');
        return stored ? parseInt(stored) : 0;
    }

    saveQuestionsAsked() {
        localStorage.setItem('questionsAsked', this.questionsAsked.toString());
    }

    updateQuestionCounter() {
        const remaining = this.maxQuestions - this.questionsAsked;
        const counterText = `Questions remaining: ${remaining}/${this.maxQuestions}`;
        
        // Update or create counter display
        let counter = document.getElementById('questionCounter');
        if (!counter) {
            counter = document.createElement('div');
            counter.id = 'questionCounter';
            counter.style.cssText = `
                position: fixed;
                top: 20px;
                left: 20px;
                background: rgba(0, 255, 0, 0.1);
                color: #00ff00;
                padding: 10px 15px;
                border-radius: 20px;
                border: 1px solid rgba(0, 255, 0, 0.3);
                font-size: 14px;
                font-weight: 600;
                z-index: 1000;
                backdrop-filter: blur(10px);
            `;
            document.body.appendChild(counter);
        }
        counter.textContent = counterText;

        // Disable input if limit reached
        if (this.questionsAsked >= this.maxQuestions) {
            this.disableInput();
        }
    }

    disableInput() {
        this.messageInput.disabled = true;
        this.sendMessage.disabled = true;
        this.messageInput.placeholder = "Question limit reached. Refresh to ask more.";
        this.messageInput.style.opacity = '0.5';
        this.sendMessage.style.opacity = '0.5';
    }

    enableInput() {
        this.messageInput.disabled = false;
        this.sendMessage.disabled = false;
        this.messageInput.placeholder = "Ask me anything about Abdulrahman's background...";
        this.messageInput.style.opacity = '1';
        this.sendMessage.style.opacity = '1';
    }

    // AI Chat Open Counter
    getChatOpenCount() {
        const stored = localStorage.getItem('chatOpenCount');
        return stored ? parseInt(stored) : 0;
    }

    incrementChatOpenCount() {
        this.chatOpenCount++;
        localStorage.setItem('chatOpenCount', this.chatOpenCount.toString());
        
        // Print to browser console
        console.log(`🟢 AI CHAT OPENED #${this.chatOpenCount} - ${new Date().toLocaleString()}`);
        console.log(`📊 Total AI Chat Opens: ${this.chatOpenCount}`);
        console.log("=".repeat(50));
        
        // Optional: terminal logging disabled in browser context
        // this.logToTerminal(this.chatOpenCount);
    }

    logToTerminal(chatNumber) {
        // No-op in static site to avoid 404s
        console.log(`(terminal log suppressed) AI CHAT OPENED #${chatNumber}`);
    }
}

// Initialize the portfolio AI when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const portfolioAI = new PortfolioAI();
    // No API key by default; falls back to local responder to avoid CORS/auth issues
    
    // Add smooth scrolling for better UX
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all sections for animation
    document.querySelectorAll('.section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
});

// Add some utility functions for better UX
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        // Show a temporary notification
        const notification = document.createElement('div');
        notification.textContent = 'Copied to clipboard!';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #667eea;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 1000;
            font-weight: 500;
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 2000);
    });
}

// Add click handlers for contact information
document.addEventListener('DOMContentLoaded', () => {
    // Make contact info clickable
    const contactInfo = document.querySelectorAll('.contact-info p');
    contactInfo.forEach(info => {
        info.style.cursor = 'pointer';
        info.addEventListener('click', () => {
            const text = info.textContent.trim();
            copyToClipboard(text);
        });
    });
});
