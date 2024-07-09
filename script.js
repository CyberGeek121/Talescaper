     document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const modeToggle = document.getElementById('mode-toggle');
    const creatorMode = document.getElementById('creator-mode');
    const playerMode = document.getElementById('player-mode');
    const storyStructure = document.getElementById('story-structure');
    const addPartBtn = document.getElementById('add-part-btn');
    const saveBtn = document.getElementById('save-btn');
    const storyText = document.getElementById('story-text');
    const choicesContainer = document.getElementById('choices');
    const progressBar = document.getElementById('progress');
    const progressText = document.getElementById('progress-text');
    const finalStory = document.getElementById('final-story');
    const historyText = document.getElementById('history-text');
    const resetBtn = document.getElementById('reset-btn');
    const loadBtn = document.getElementById('load-btn');
    const fileInput = document.getElementById('file-input');
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const toggleProgressBtn = document.getElementById('toggle-progress');
    const progressContainer = document.getElementById('progress-container');
    const replayBtn = document.getElementById('replay-story');

    // State
    let storyParts = [{ text: '', choices: [] }];
    let currentPart = 0;
    let history = [];

    // Functions
    function updateStoryStructure() {
        storyStructure.innerHTML = storyParts.map((part, index) => `
            <div class="story-part">
                <h3>Part ${index + 1}</h3>
                <textarea class="part-text" placeholder="Enter your story part here...">${part.text}</textarea>
                <div class="choices">
                    ${part.choices.map((choice, choiceIndex) => `
                        <div class="choice">
                            <input type="text" class="choice-input" placeholder="Enter choice text" value="${choice.text}" data-part="${index}" data-choice="${choiceIndex}">
                            <select class="next-part-select" data-part="${index}" data-choice="${choiceIndex}">
                                ${storyParts.map((_, i) => `<option value="${i}" ${i === choice.nextPart ? 'selected' : ''}>Part ${i + 1}</option>`).join('')}
                            </select>
                            <button class="remove-choice-btn btn" data-part="${index}" data-choice="${choiceIndex}">Remove Choice</button>
                        </div>
                    `).join('')}
                </div>
                <button class="add-choice-btn btn" data-part="${index}">Add Choice</button>
                <button class="remove-part-btn btn" data-part="${index}">Remove Part</button>
            </div>
        `).join('');

        addStoryPartEventListeners();
    }

    function addStoryPartEventListeners() {
        document.querySelectorAll('.part-text').forEach(textarea => {
            textarea.addEventListener('change', (e) => {
                const partIndex = Array.from(storyStructure.children).indexOf(e.target.closest('.story-part'));
                storyParts[partIndex].text = e.target.value;
            });
        });

        document.querySelectorAll('.add-choice-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const partIndex = parseInt(e.target.dataset.part);
                storyParts[partIndex].choices.push({ text: '', nextPart: partIndex });
                updateStoryStructure();
            });
        });

        document.querySelectorAll('.choice-input, .next-part-select').forEach(element => {
            element.addEventListener('change', (e) => {
                const partIndex = parseInt(e.target.dataset.part);
                const choiceIndex = parseInt(e.target.dataset.choice);
                if (e.target.classList.contains('choice-input')) {
                    storyParts[partIndex].choices[choiceIndex].text = e.target.value;
                } else {
                    storyParts[partIndex].choices[choiceIndex].nextPart = parseInt(e.target.value);
                }
            });
        });

        document.querySelectorAll('.remove-choice-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const partIndex = parseInt(e.target.dataset.part);
                const choiceIndex = parseInt(e.target.dataset.choice);
                storyParts[partIndex].choices.splice(choiceIndex, 1);
                updateStoryStructure();
            });
        });

        document.querySelectorAll('.remove-part-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const partIndex = parseInt(e.target.dataset.part);
                storyParts.splice(partIndex, 1);
                updateStoryStructure();
            });
        });
    }

    function updateStory() {
        const part = storyParts[currentPart];
        storyText.innerHTML = part.text;
        choicesContainer.innerHTML = part.choices.map((choice, index) => `
            <button class="btn choice-btn" data-choice="${index}">${choice.text}</button>
        `).join('');

        document.querySelectorAll('.choice-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const choiceIndex = parseInt(e.target.dataset.choice);
                history.push(`${part.text} (Choice: ${part.choices[choiceIndex].text})`);
                updateHistory();
                currentPart = part.choices[choiceIndex].nextPart;
                if (currentPart < storyParts.length) {
                    updateStory();
                } else {
                    endStory();
                }
            });
        });

        updateProgress();
    }

    function updateProgress() {
        const progress = ((currentPart + 1) / storyParts.length) * 100;
        progressBar.style.width = `${progress}%`;
        progressText.textContent = `Part ${currentPart + 1} of ${storyParts.length}`;
    }

    function updateHistory() {
        historyText.innerHTML = history.map((item, index) => 
            `<p><strong>Interaction ${index + 1}:</strong> ${item}</p>`
        ).join('');
    }

    function endStory() {
        storyText.style.display = 'none';
        choicesContainer.style.display = 'none';
        finalStory.style.display = 'block';
        finalStory.innerHTML = history.join('\n\n');
    }

    function saveStory() {
        if (storyParts.length === 0) {
            alert('Please add at least one part to the story before saving.');
            return;
        }
        const storyData = JSON.stringify(storyParts);
        const blob = new Blob([storyData], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'my_interactive_story.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        alert('Story saved successfully!');
    }

    function loadStory(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    storyParts = JSON.parse(e.target.result);
                    updateStoryStructure();
                    resetPlayMode();
                    alert('Story loaded successfully!');
                } catch (error) {
                    alert('Error loading story. Please make sure you selected a valid story file.');
                }
            };
            reader.readAsText(file);
        }
    }

    function resetStory() {
        if (confirm('Are you sure you want to reset the story? This action cannot be undone.')) {
            storyParts = [{ text: '', choices: [] }];
            updateStoryStructure();
            resetPlayMode();
        }
    }

    function resetPlayMode() {
        currentPart = 0;
        history = [];
        updateStory();
        updateHistory();
        progressBar.style.width = '0%';
        progressText.textContent = 'Part 1';
        finalStory.style.display = 'none';
        storyText.style.display = 'block';
        choicesContainer.style.display = 'block';
    }

    function toggleProgress() {
        if (progressContainer.style.display === 'none') {
            progressContainer.style.display = 'block';
            toggleProgressBtn.textContent = 'Hide Progress';
        } else {
            progressContainer.style.display = 'none';
            toggleProgressBtn.textContent = 'Show Progress';
        }
    }

    function toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        darkModeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌒';
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    }

    // Event Listeners
    modeToggle.addEventListener('click', () => {
        creatorMode.classList.toggle('hidden');
        playerMode.classList.toggle('hidden');
        modeToggle.textContent = creatorMode.classList.contains('hidden') ? 'Switch to Creator Mode' : 'Switch to Play Mode';
        if (!creatorMode.classList.contains('hidden')) {
            updateStoryStructure();
        } else {
            resetPlayMode();
        }
    });

    addPartBtn.addEventListener('click', () => {
        storyParts.push({ text: '', choices: [] });
        updateStoryStructure();
    });

    saveBtn.addEventListener('click', saveStory);
    resetBtn.addEventListener('click', resetStory);
    loadBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', loadStory);
    toggleProgressBtn.addEventListener('click', toggleProgress);
    replayBtn.addEventListener('click', resetPlayMode);
    darkModeToggle.addEventListener('click', toggleDarkMode);

    // Initialize
    updateStoryStructure();
    updateStory();

    // Check for saved dark mode preference
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        darkModeToggle.textContent = '☀️';
    }
});