@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');

:root {
  --background-primary: #f0f2f5;
  --background-secondary: #ffffff;
  --text-normal: #2e3338;
  --text-muted: #747f8d;
  --interactive-normal: #4f545c;
  --interactive-hover: #2e3338;
  --interactive-active: #060607;
  --brand-experiment: #5865f2;
  --brand-experiment-560: #4752c4;
  --progress-bar-color: #caced6;
  --background-modifier-accent: rgba(79,84,92,0.16);
  --scrollbar-thin-thumb: rgba(79,84,92,0.3);
  --scrollbar-thin-track: transparent;
  --scrollbar-auto-thumb: rgba(79,84,92,0.3);
  --scrollbar-auto-track: rgba(0,0,0,0.1);
}

.dark-mode {
  --background-primary: #202225;
  --background-secondary: #2f3136;
  --text-normal: #dcddde;
  --text-muted: #72767d;
  --interactive-normal: #b9bbbe;
  --interactive-hover: #dcddde;
  --interactive-active: #fff;
  --brand-experiment: #7289da;
  --brand-experiment-560: #5865f2;
  --progress-bar-color: #4f545c;
  --background-modifier-accent: rgba(79,84,92,0.32);
  --scrollbar-thin-thumb: rgba(79,84,92,0.5);
  --scrollbar-auto-thumb: rgba(79,84,92,0.5);
  --scrollbar-auto-track: rgba(0,0,0,0.3);
}

body, html {
  height: 100%;
  margin: 0;
  font-family: 'Poppins', sans-serif;
  line-height: 1.6;
  color: var(--text-normal);
  background-color: var(--background-primary);
  transition: background-color 0.3s, color 0.3s;
  overflow-x: hidden;
  overflow: hidden;
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-thumb {
  background-color: var(--scrollbar-auto-thumb);
  border-radius: 4px;
}

::-webkit-scrollbar-track {
  background-color: var(--scrollbar-auto-track);
}

.parallax {
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  perspective: 1px;
}
.parallax__layer {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.parallax__layer--back {
  transform: translateZ(-1px) scale(2);
  background: linear-gradient(135deg, #2c3e50, #3498db, #2980b9);
  height: 200%;
  width: 200%; /* Increased width to cover entire viewport */
  left: -50%; /* Offset to center the background */
}


.dark-mode .parallax__layer--back {
  background: linear-gradient(135deg, #1a1a2e, #16213e, #0f3460);
}

.content-wrapper {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 20px;
}

.content {
  width: 100%;
  max-width: 1000px;
  margin: 20px auto;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.9); /* Make it slightly translucent in light mode */
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1), 0 1px 8px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s, box-shadow 0.3s;
  overflow: hidden;
  position: relative;
}


.dark-mode .content {
  background-color: var(--background-secondary); /* Keep it solid in dark mode */
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3), 0 1px 8px rgba(0, 0, 0, 0.4);
}

.content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
    circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0) 70%
  );
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
}

.content:hover::before {
  opacity: 1;
}

.dark-mode .content::before {
  background: radial-gradient(
    circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
    rgba(255, 255, 255, 0.05) 0%,
    rgba(255, 255, 255, 0) 70%
  );
}

#main-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

#story-container, #history-container, #story-structure {
  background-color: var(--background-primary);
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1);
}

.dark-mode #story-container,
.dark-mode #history-container,
.dark-mode #story-structure {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2), 0 1px 3px rgba(0, 0, 0, 0.3);
}

#story-container {
  flex: 2;
}

#history-container, #story-structure {
  flex: 1;
  max-height: 600px;
  overflow-y: auto;
  overflow-x: hidden;
}

#story-text, #history-text {
  margin-bottom: 20px;
  color: var(--text-normal);
}

.btn {
  padding: 8px 16px;
  margin: 5px;
  background-color: rgba(57, 124, 206, 0.719);
  color: #ffffff;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.1s ease;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 0.9em;
}

.btn:hover {
  background-color: rgba(63, 115, 179, 0.859);
  padding-left: 17px;
  padding-right: 17px;
  transition: all 0.25s;
}

.btn:active {
  transform: translateY(1px);
}

.dark-mode .btn {
  background-color: rgba(97, 95, 95, 0.566);
}

.dark-mode .btn:hover {
  background-color: rgba(97, 95, 95, 0.866);
}

.dark-mode .btn:active {
  background-color: rgba(97, 95, 95, 0.478);
}

#mode-toggle, #reset-btn, #save-btn, #load-btn {
  display: inline-block;
  margin-right: 10px;
  margin-bottom: 10px;
}

#progress-bar {
  width: 100%;
  height: 8px;
  background-color: var(--background-modifier-accent);
  border-radius: 4px;
  margin-bottom: 20px;
  overflow: hidden;
}

#progress {
  width: 0;
  height: 100%;
  background-color: var(--progress-bar-color);
  border-radius: 4px;
  transition: width 0.3s;
}

#progress-text {
  text-align: center;
  margin-top: 5px;
  color: var(--text-muted);
}

#final-story {
  display: none;
  white-space: pre-wrap;
}

#file-input {
  display: none;
}

.hidden {
  display: none;
}

.story-part {
  margin-bottom: 20px;
  padding: 15px;
  background-color: var(--background-secondary);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  max-width: 100%;
  overflow-x: hidden;
}

.choices {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 10px;
}

.choice {
  flex: 1 1 200px;
  display: flex;
  flex-direction: column;
}

.part-text, .choice-input {
  width: calc(100% - 22px); /* Adjust width to account for padding and border */
  padding: 10px;
  margin-bottom: 10px;
  font-family: 'Poppins', sans-serif;
  background-color: var(--background-primary);
  color: var(--text-normal);
  border: 1px solid var(--background-modifier-accent);
  border-radius: 4px;
  resize: vertical;
  box-sizing: border-box; /* Include padding and border in element's total width and height */
}

.part-text {
  width: 100%;
  margin-top: 5px;
}

.next-part-select {
  width: 100%;
  padding: 8px;
  font-family: 'Poppins', sans-serif;
  background-color: var(--background-primary);
  color: var(--text-normal);
  border: 1px solid var(--background-modifier-accent);
  border-radius: 4px;
}

h1, h2, h3 {
  color: var(--text-normal);
}

h1 {
  text-align: center;
  font-size: 2.5em;
  font-weight: bold;
  color: var(--text-normal);
  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
  margin: 0;
}

.title-container {
  position: relative;
  margin-top: 20px;
}

.author-container {
  text-align: right;
  margin-top: 10px;
}

.author {
  font-size: 0.8em;
  color: var(--text-muted);
  font-style: italic;
  text-decoration: none;
}

.author:hover {
  text-decoration: underline;
}

.author-preview {
  display: none;
  position: absolute;
  top: 100%;
  right: 0;
  width: 250px;
  background-color: var(--background-secondary);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  padding: 15px;
  z-index: 1;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  text-align: left;
}

.author-preview.show {
  display: block;
}

.author-preview h3 {
  margin-top: 0;
  color: var(--text-normal);
}

.author-preview p {
  font-size: 0.9em;
  line-height: 1.4;
  color: var(--text-muted);
  text-align: left;
}

p {
  font-size: 13px;
}

.reload {
  text-decoration: none;
}

.reload:hover {
  opacity: 0.7;
}

.reload:active {
  cursor: -webkit-grab;
}

#dark-mode-toggle {
  position: fixed;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  z-index: 1000;
  transition: transform 0.3s ease;
  background-color: transparent;
  padding: 5px;
  border-radius: 50%;
}

#dark-mode-toggle:hover {
  transform: scale(1.1);
}

.player-controls {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 10px;
}

#toggle-progress {
  font-size: 0.9em;
  color: var(--interactive-normal);
  cursor: pointer;
  margin-right: 10px;
  transition: color 0.2s ease;
}

#toggle-progress:hover {
  color: var(--interactive-hover);
}

#replay-story {
  background-color: rgba(128, 128, 128, 0.607);
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1em;
  cursor: pointer;
  transition: all 0.2s ease;
}

#replay-story:hover {
  background-color: rgba(128, 128, 128, 0.707);
}

#replay-story:active {
  transform: scale(0.95);
}

@media (max-width: 768px) {
  .content {
    margin: 10px;
    padding: 15px;
  }

  .btn {
    font-size: 0.8em;
    padding: 6px 12px;
  }
}
.part-name {
  display: inline-block;
  margin-right: 10px;
}

.edit-part-name {
  background-color: transparent;
  border: none;
  color: var(--interactive-normal);
  cursor: pointer;
  font-size: 0.9em;
  padding: 2px;
  transition: color 0.2s ease;
  align-self: flex-start;
  position: relative;
}

.edit-part-name:hover {
  color: var(--interactive-hover);
}
.edit-part-name:active {
  color: var(--interactive-active);
}


/* Add a tooltip-like effect for better UX */
.edit-part-name::before {
  content: 'Edit name';
  position: absolute;
  background-color: var(--background-secondary);
  color: var(--text-normal);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.7em;
  opacity: 0;
  transition: opacity 0.2s ease;
  pointer-events: none;
  right: 100%;
  top: 50%;
  transform: translateY(-50%);
  margin-right: 5px;
  white-space: nowrap;
}
.edit-part-name:hover::before {
  opacity: 1;
} 

.edit-part-name::after {
  content: 'Edit name';
  position: absolute;
  background-color: var(--background-secondary);
  color: var(--text-normal);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.7em;
  opacity: 0;
  transition: opacity 0.2s ease;
  pointer-events: none;
  margin-left: 5px;
}

.edit-part-name:hover::after {
  opacity: 1;
}
.story-part h3 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}
