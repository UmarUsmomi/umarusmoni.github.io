/**
 * terminal.js — Interactive Terminal Simulator
 *
 * Converts a static terminal card into a functional command-line simulator.
 * Supports typing, history, neofetch ASCII art, a matrix code override,
 * and embedding TikTok video reels.
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const terminal = document.querySelector('.terminal-block');
  if (!terminal) return;

  // Build the interactive DOM structure inside the terminal block
  terminal.innerHTML = `
    <div class="terminal-output">
      <div class="terminal-line">umar@portfolio:~$ welcome</div>
      <div class="terminal-line text-muted">Type <span class="text-accent">help</span> for a list of available commands.</div>
      <br>
    </div>
    <div class="terminal-prompt-line">
      <span class="terminal-prompt">umar@portfolio:~$</span>
      <span class="terminal-input-display"></span><span class="terminal-cursor">|</span>
      <input type="text" class="terminal-hidden-input" autofocus autocomplete="off" spellcheck="false" aria-label="Terminal Input" />
    </div>
    <canvas class="matrix-canvas" style="display: none; position: absolute; top: 0; left: 0; width: 100%; height: 100%; border-radius: inherit; z-index: 10; pointer-events: none;"></canvas>
  `;

  const outputContainer = terminal.querySelector('.terminal-output');
  const inputDisplay = terminal.querySelector('.terminal-input-display');
  const hiddenInput = terminal.querySelector('.terminal-hidden-input');
  const matrixCanvas = terminal.querySelector('.matrix-canvas');

  // Focus input when clicking anywhere inside the terminal block
  terminal.addEventListener('click', () => {
    hiddenInput.focus();
  });

  // Sync typed text to display span
  hiddenInput.addEventListener('input', () => {
    inputDisplay.textContent = hiddenInput.value;
  });

  // Handle enter key to execute commands
  hiddenInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const commandText = hiddenInput.value.trim();
      const rawValue = hiddenInput.value;
      hiddenInput.value = '';
      inputDisplay.textContent = '';
      executeCommand(commandText, rawValue);
    }
  });

  // Commands definition
  const COMMANDS = {
    help: () => `
Available commands:
  <span class="text-accent">about</span>     - Learn more about my background
  <span class="text-accent">skills</span>    - List my technical skillset
  <span class="text-accent">projects</span>  - Show my projects and Obsidian plugin
  <span class="text-accent">neofetch</span>  - Display system specs & custom ASCII art
  <span class="text-accent">video</span>     - Embed and watch the Reels video (alias: <span class="text-accent">reels</span>)
  <span class="text-accent">matrix</span>    - Initiate system override (digital rain)
  <span class="text-accent">clear</span>     - Clear the terminal screen
    `,
    about: () => `
<span class="text-accent">Biography:</span>
I'm Umar Usmoni — a driven cybersecurity student with a passion for building secure and intelligent software.
My journey focuses on AI automation, penetration testing (Kali Linux), script development (Python, Bash), and media production.
    `,
    skills: () => `
<span class="text-accent">Active Skills:</span>
  - Cybersecurity & Pentesting (Kali Linux, networking, vulnerabilities)
  - AI & Automation (AI agents development, prompt engineering)
  - Languages (Python, Bash scripting, system commands)
  - Operating Systems (Linux administration, Kali, Debian, shell tools)
  - Creative (Video editing, formatting, automation pipelines)
    `,
    projects: () => `
<span class="text-accent">Main Project:</span>
  - Name: <span class="text-accent">Telegram-Obsidian Sync</span>
  - Type: Obsidian Sync Plugin / Python Daemon
  - GitHub: <a href="https://github.com/UmarUsmomi/telegram-obsidian-sync" target="_blank" rel="noopener noreferrer" style="color: var(--accent-primary); text-decoration: underline;">github.com/UmarUsmomi/telegram-obsidian-sync</a>
  - Desc: Seamless note and message synchronization from Telegram channels directly to Obsidian vaults.
    `,
    neofetch: () => `
<pre class="neofetch-art" style="font-family: 'JetBrains Mono', monospace; line-height: 1.2; margin: 0; display: inline-block; vertical-align: top; color: var(--accent-primary);">
  /\ \_/\
 / /\ u u\\
 \/_/   __\\     <span style="color: var(--text-primary);">umar@portfolio</span>
   |\_/\_/|     <span style="color: var(--text-secondary);">--------------</span>
   \_____/      <span style="color: var(--text-primary);">OS:</span> Kali GNU/Linux (WSL)
                <span style="color: var(--text-primary);">Shell:</span> bash 5.2.15
                <span style="color: var(--text-primary);">Theme:</span> Neon-Mint Cyberpunk
                <span style="color: var(--text-primary);">CPU:</span> AI-Agent-Core (Optimized)
                <span style="color: var(--text-primary);">Memory:</span> 64 GB Virtual Pool
                <span style="color: var(--text-primary);">Vibe:</span> Vibe-Coding Active [OK]
</pre>
    `
  };

  // Command executor
  function executeCommand(commandText, rawValue) {
    // Print input line in history
    const inputLine = document.createElement('div');
    inputLine.className = 'terminal-line';
    inputLine.innerHTML = `<span class="terminal-prompt">umar@portfolio:~$</span> ${escapeHTML(rawValue)}`;
    outputContainer.appendChild(inputLine);

    const cmd = commandText.toLowerCase();

    if (cmd === 'clear') {
      outputContainer.innerHTML = '';
      return;
    }

    if (cmd === 'matrix') {
      runMatrixEffect();
      return;
    }

    if (cmd === 'video' || cmd === 'reels') {
      embedVideo();
      return;
    }

    const outputLine = document.createElement('div');
    outputLine.className = 'terminal-line';

    if (COMMANDS[cmd]) {
      outputLine.innerHTML = COMMANDS[cmd]();
    } else if (cmd === '') {
      // Just empty enter, do nothing
      return;
    } else {
      outputLine.innerHTML = `<span class="text-danger">bash: ${escapeHTML(commandText)}: command not found.</span> Type <span class="text-accent">help</span> for help.`;
    }

    outputContainer.appendChild(outputLine);
    outputContainer.appendChild(document.createElement('br'));
    
    // Scroll terminal to bottom
    terminal.scrollTop = terminal.scrollHeight;
  }

  // Escape HTML helper
  function escapeHTML(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // Embed Reels Video player
  function embedVideo() {
    const videoLine = document.createElement('div');
    videoLine.className = 'terminal-line';
    videoLine.innerHTML = `
      <div style="color: var(--accent-primary); margin-bottom: 5px;">[Opening media: influentty - 7634092410351521057.mp4]</div>
      <div style="width: 100%; max-width: 320px; margin: 10px auto; border: 1px solid var(--accent-primary); border-radius: 12px; overflow: hidden; background: #000; box-shadow: 0 0 20px rgba(0,255,136,0.25);">
        <video src="assets/video/influentty.mp4" controls autoplay playsinline style="width: 100%; display: block; max-height: 540px;"></video>
      </div>
    `;
    outputContainer.appendChild(videoLine);
    outputContainer.appendChild(document.createElement('br'));
    terminal.scrollTop = terminal.scrollHeight;
  }

  // Matrix Digital Rain effect inside the card
  let matrixInterval = null;
  function runMatrixEffect() {
    // Hide output and prompt lines
    outputContainer.style.opacity = '0.05';
    terminal.querySelector('.terminal-prompt-line').style.opacity = '0.05';
    matrixCanvas.style.display = 'block';

    const ctx = matrixCanvas.getContext('2d');
    const rect = terminal.getBoundingClientRect();
    
    matrixCanvas.width = rect.width;
    matrixCanvas.height = rect.height;

    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ<>_@#$+-*/';
    const charArr = chars.split('');
    
    const fontSize = 12;
    const columns = matrixCanvas.width / fontSize;
    const drops = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100; // random staggered starting positions
    }

    function drawMatrix() {
      ctx.fillStyle = 'rgba(5, 5, 5, 0.08)'; // transparent black to create trail
      ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

      ctx.fillStyle = '#00ff88';
      ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = charArr[Math.floor(Math.random() * charArr.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.fillText(text, x, y);

        if (y > matrixCanvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }

    matrixInterval = setInterval(drawMatrix, 33);

    // Stop after 4.5 seconds
    setTimeout(() => {
      clearInterval(matrixInterval);
      ctx.clearRect(0, 0, matrixCanvas.width, matrixCanvas.height);
      matrixCanvas.style.display = 'none';

      // Restore terminal output
      outputContainer.style.opacity = '1';
      terminal.querySelector('.terminal-prompt-line').style.opacity = '1';

      // Add override success message
      const successLine = document.createElement('div');
      successLine.className = 'terminal-line';
      successLine.innerHTML = `
        <span style="color: var(--accent-primary); font-weight: bold;">[!] SYSTEM DECRYPTED & OVERRIDDEN SUCCESSFULLY</span><br>
        <span class="text-muted">Virtual host unlocked. Connection stable.</span>
      `;
      outputContainer.appendChild(successLine);
      outputContainer.appendChild(document.createElement('br'));
      terminal.scrollTop = terminal.scrollHeight;
      hiddenInput.focus();
    }, 4500);
  }
});
