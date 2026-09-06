/* Scripted agent demo. No canvas, no scroll observers — the page is static
   and readable with JavaScript disabled; this only drives the terminal. */
document.addEventListener('DOMContentLoaded', () => {
    const output = document.getElementById('terminal-output');
    const buttons = document.querySelectorAll('.ask');
    if (!output || !buttons.length) return;

    const RESPONSES = {
        skills: [
            'user@guest:~$ What are his core AI skills?',
            '> Thought: query the resume index for technical skills.',
            '> Action: ToolCall(Query_Resume, {"section": "skills"})',
            '> Observation: GenAI, Multi-Agentic Systems, MLOps.',
            'Deep expertise in:',
            '\u2022 GenAI & LLMs: Agentic RAG, LangGraph, MCP, AWS Bedrock, OpenAI.',
            '\u2022 MLOps & Cloud: AWS SageMaker, Azure AI Foundry, Docker, Kubernetes.',
            '\u2022 Data Science: Python, PyTorch, Transformers, FAISS, ChromaDB.'
        ],
        experience: [
            'user@guest:~$ Summarize his experience at Tavant.',
            '> Thought: filter experience history for "Tavant".',
            '> Action: ToolCall(Filter_Experience, {"company": "Tavant"})',
            '> Observation: at Tavant since 2021, now Senior Data Scientist for Twitch/Media.',
            'At Tavant, Sumanth led GenAI COE initiatives and architected Multi-Agentic solutions.',
            'Recently he deployed multi-agent workflows on LangGraph and AWS Bedrock, reducing month-end financial close by over 90% \u2014 from multiple days to two hours.'
        ],
        contact: [
            'user@guest:~$ How can I contact Sumanth?',
            '> Thought: retrieve contact nodes.',
            'Email: sumanthpolisetty.sp@gmail.com',
            'LinkedIn: linkedin.com/in/polisetty-sumanth'
        ]
    };

    let busy = false;

    function run(key) {
        const sequence = RESPONSES[key];
        if (busy || !sequence) return;
        busy = true;

        // The blinking cursor always trails the last line.
        const tail = output.lastElementChild;
        let i = 0;

        const step = () => {
            const line = document.createElement('div');
            line.textContent = sequence[i];
            output.insertBefore(line, tail);
            output.scrollTop = output.scrollHeight;
            i++;
            if (i < sequence.length) {
                setTimeout(step, 420);
            } else {
                busy = false;
            }
        };
        step();
    }

    buttons.forEach((btn) => {
        btn.addEventListener('click', () => run(btn.dataset.query));
    });
});
