document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing once animated
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach((el) => {
        observer.observe(el);
    });

    // Simple mobile menu toggle (for demonstration)
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            // In a real implementation, you'd toggle a class to show/hide a mobile menu
            // For now, we'll just alert since the layout is simple
            alert('Mobile menu clicked. In a full implementation, this would slide out a menu.');
        });
    }

    // Dynamic nav background on scroll
    const nav = document.querySelector('.glass-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.style.background = 'rgba(10, 10, 15, 0.85)';
            nav.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.1)';
        } else {
            nav.style.background = 'rgba(10, 10, 15, 0.7)';
            nav.style.boxShadow = 'none';
        }
    });

    // Agent Simulator Logic
    const terminalOutput = document.getElementById('terminal-output');
    const promptBtns = document.querySelectorAll('.prompt-btn');
    
    let isTyping = false;

    const agentResponses = {
        skills: [
            { type: 'prompt', text: 'user@guest:~$ What are his core AI skills?' },
            { type: 'thought', text: '> Thought: I need to query the resume database for technical skills.' },
            { type: 'action', text: '> Action: ToolCall(Query_Resume, {"section": "skills"})' },
            { type: 'success', text: '> Observation: Found extensive experience in GenAI, Multi-Agentic Systems, and MLOps.' },
            { type: 'text', text: 'Sumanth has deep expertise in:' },
            { type: 'text', text: '• GenAI & LLMs: Agentic RAG, LangGraph, Model Context Protocol (MCP), AWS Bedrock, OpenAI.' },
            { type: 'text', text: '• MLOps & Cloud: AWS SageMaker, Azure AI Foundry, Docker, Kubernetes.' },
            { type: 'text', text: '• Data Science: Python, PyTorch, Transformers, FAISS, ChromaDB.' }
        ],
        experience: [
            { type: 'prompt', text: 'user@guest:~$ Summarize his experience at Tavant.' },
            { type: 'thought', text: '> Thought: Filtering experience history for "Tavant".' },
            { type: 'action', text: '> Action: ToolCall(Filter_Experience, {"company": "Tavant", "limit": "recent"})' },
            { type: 'success', text: '> Observation: Sumanth has been at Tavant since 2021, currently as a Senior Data Scientist for Twitch/Media.' },
            { type: 'text', text: 'At Tavant, Sumanth led GenAI COE initiatives and architected advanced Multi-Agentic solutions.' },
            { type: 'text', text: 'Recently, he deployed multi-agent workflows using LangGraph and AWS Bedrock, reducing month-end financial close processes by over 90% (from multiple days to 2 hours).' }
        ],
        contact: [
            { type: 'prompt', text: 'user@guest:~$ How can I contact Sumanth?' },
            { type: 'thought', text: '> Thought: Retrieving contact nodes from the graph.' },
            { type: 'text', text: 'You can reach out to Sumanth via:' },
            { type: 'text', text: 'Email: sumanthpolisetty.sp@gmail.com' },
            { type: 'text', text: 'LinkedIn: linkedin.com/in/polisetty-sumanth' }
        ]
    };

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    async function simulateAgentResponse(queryKey) {
        if (isTyping) return;
        isTyping = true;
        
        const sequence = agentResponses[queryKey];
        
        for (const step of sequence) {
            const line = document.createElement('div');
            line.className = 'terminal-line';
            
            if (step.type === 'prompt') {
                line.innerHTML = `<span class="terminal-prompt">user@guest:~$</span> ${step.text.replace('user@guest:~$ ', '')}`;
                terminalOutput.appendChild(line);
            } else if (step.type === 'thought') {
                line.innerHTML = `<span class="terminal-thought">${step.text}</span>`;
                terminalOutput.appendChild(line);
                await sleep(600); // Simulate "thinking" time
            } else if (step.type === 'action') {
                line.innerHTML = `<span class="terminal-action">${step.text}</span>`;
                terminalOutput.appendChild(line);
                await sleep(800); // Simulate API call
            } else if (step.type === 'success') {
                line.innerHTML = `<span class="terminal-success">${step.text}</span>`;
                terminalOutput.appendChild(line);
                await sleep(400);
            } else if (step.type === 'text') {
                // Typewriter effect for final output
                terminalOutput.appendChild(line);
                let currentText = '';
                line.innerHTML = `<span class="terminal-cursor"></span>`;
                
                for (let i = 0; i < step.text.length; i++) {
                    currentText += step.text[i];
                    line.innerHTML = currentText + '<span class="terminal-cursor"></span>';
                    await sleep(15);
                }
                line.innerHTML = currentText; // Remove cursor when done typing line
                await sleep(200);
            }
            
            // Auto scroll to bottom
            const terminalBody = document.querySelector('.terminal-body');
            terminalBody.scrollTop = terminalBody.scrollHeight;
        }
        
        // Add ready prompt
        const readyLine = document.createElement('div');
        readyLine.className = 'terminal-line';
        readyLine.innerHTML = `<span class="terminal-prompt">system@oasis:~$</span> <span class="terminal-cursor"></span>`;
        terminalOutput.appendChild(readyLine);
        
        const terminalBody = document.querySelector('.terminal-body');
        terminalBody.scrollTop = terminalBody.scrollHeight;
        
        isTyping = false;
    }

    if (promptBtns && terminalOutput) {
        promptBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (!isTyping) {
                    // Remove existing cursor
                    const existingCursor = document.querySelector('.terminal-cursor');
                    if (existingCursor) existingCursor.remove();
                    
                    simulateAgentResponse(btn.dataset.query);
                }
            });
        });
    }

    // Neural Network Canvas Background
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouse = { x: null, y: null };

        window.addEventListener('mousemove', (event) => {
            mouse.x = event.x;
            mouse.y = event.y;
        });

        class Particle {
            constructor(x, y, dx, dy, size) {
                this.x = x; this.y = y;
                this.dx = dx; this.dy = dy;
                this.size = size;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = 'rgba(99, 102, 241, 0.5)';
                ctx.fill();
            }
            update() {
                if (this.x > canvas.width || this.x < 0) this.dx = -this.dx;
                if (this.y > canvas.height || this.y < 0) this.dy = -this.dy;
                this.x += this.dx;
                this.y += this.dy;
                this.draw();
            }
        }

        function init() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            particles = [];
            let numParticles = Math.min((canvas.width * canvas.height) / 18000, 100);
            for (let i = 0; i < numParticles; i++) {
                let size = (Math.random() * 2) + 0.5;
                let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
                let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
                let dx = (Math.random() - 0.5) * 0.8;
                let dy = (Math.random() - 0.5) * 0.8;
                particles.push(new Particle(x, y, dx, dy, size));
            }
        }

        function animate() {
            requestAnimationFrame(animate);
            ctx.clearRect(0, 0, innerWidth, innerHeight);
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
            }
            connect();
        }

        function connect() {
            let opacityValue = 1;
            for (let a = 0; a < particles.length; a++) {
                for (let b = a; b < particles.length; b++) {
                    let distance = ((particles[a].x - particles[b].x) * (particles[a].x - particles[b].x)) + 
                                   ((particles[a].y - particles[b].y) * (particles[a].y - particles[b].y));
                    if (distance < 18000) {
                        opacityValue = 1 - (distance / 18000);
                        ctx.strokeStyle = `rgba(99, 102, 241, ${opacityValue * 0.3})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
                
                // Connect to mouse
                if (mouse.x != null && mouse.y != null) {
                    let mouseDistance = ((particles[a].x - mouse.x) * (particles[a].x - mouse.x)) + 
                                        ((particles[a].y - mouse.y) * (particles[a].y - mouse.y));
                    if (mouseDistance < 25000) {
                        ctx.strokeStyle = `rgba(139, 92, 246, ${(1 - mouseDistance/25000) * 0.6})`;
                        ctx.lineWidth = 1.5;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.stroke();
                    }
                }
            }
        }

        window.addEventListener('resize', init);
        window.addEventListener('mouseout', () => { mouse.x = null; mouse.y = null; });

        init();
        animate();
    }
});
