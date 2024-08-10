// Improved Story Creator Script with Enhanced Undo Functionality and Bug Fixes

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const elements = {
        modeToggle: document.getElementById('mode-toggle'),
        creatorMode: document.getElementById('creator-mode'),
        playerMode: document.getElementById('player-mode'),
        storyStructure: document.getElementById('story-structure'),
        addPartBtn: document.getElementById('add-part-btn'),
        saveBtn: document.getElementById('save-btn'),
        storyText: document.getElementById('story-text'),
        choicesContainer: document.getElementById('choices'),
        progressBar: document.getElementById('progress'),
        progressText: document.getElementById('progress-text'),
        finalStory: document.getElementById('final-story'),
        historyText: document.getElementById('history-text'),
        resetBtn: document.getElementById('reset-btn'),
        loadBtn: document.getElementById('load-btn'),
        fileInput: document.getElementById('file-input'),
        darkModeToggle: document.getElementById('dark-mode-toggle'),
        toggleProgressBtn: document.getElementById('toggle-progress'),
        progressContainer: document.getElementById('progress-container'),
        replayBtn: document.getElementById('replay-story'),
        content: document.querySelector('.content'),
        authorLink: document.getElementById('author-link'),
        authorPreview: document.getElementById('author-preview'),
        undoBtn: document.getElementById('undo-btn'),
        redoBtn: document.getElementById('redo-btn')
    };

    // State
    let storyParts = [{ name: 'Part 1', text: '', choices: [] }];
    let currentPart = 0;
    let history = [];

    // Undo/Redo Module
    const undoRedoModule = (function() {
        let undoStack = [];
        let redoStack = [];
        const maxUndoSteps = 20;

        function pushAction(action) {
            undoStack.push(action);
            if (undoStack.length > maxUndoSteps) undoStack.shift();
            redoStack = []; // Clear redo stack when a new action is performed
            updateUndoRedoButtons();
        }

        function undo() {
            if (undoStack.length === 0) return null;
            const action = undoStack.pop();
            redoStack.push(action);
            updateUndoRedoButtons();
            return { action, isUndo: true };
        }

        function redo() {
            if (redoStack.length === 0) return null;
            const action = redoStack.pop();
            undoStack.push(action);
            updateUndoRedoButtons();
            return { action, isUndo: false };
        }

        function updateUndoRedoButtons() {
            if (elements.undoBtn) elements.undoBtn.disabled = undoStack.length === 0;
            if (elements.redoBtn) elements.redoBtn.disabled = redoStack.length === 0;
        }

        return { pushAction, undo, redo };
    })();

    // Efficient deep clone function
    const cloneDeep = obj => {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }
        if (Array.isArray(obj)) {
            return obj.map(cloneDeep);
        }
        return Object.fromEntries(
            Object.entries(obj).map(([key, value]) => [key, cloneDeep(value)])
        );
    };

    // Apply action function
    function applyAction(actionData) {
        const { action, isUndo } = actionData;
        switch (action.type) {
            case 'add':
                if (isUndo) {
                    storyParts.pop();
                } else {
                    storyParts.push(cloneDeep(action.part));
                }
                break;
            case 'remove':
                if (isUndo) {
                    storyParts.splice(action.index, 0, cloneDeep(action.part));
                } else {
                    storyParts.splice(action.index, 1);
                }
                break;
            case 'edit':
                if (isUndo) {
                    storyParts[action.index] = cloneDeep(action.oldPart);
                } else {
                    storyParts[action.index] = cloneDeep(action.newPart);
                }
                break;
            case 'editName':
                storyParts[action.index].name = isUndo ? action.oldName : action.newName;
                break;
            case 'addChoice':
                if (isUndo) {
                    storyParts[action.partIndex].choices.pop();
                } else {
                    storyParts[action.partIndex].choices.push(cloneDeep(action.choice));
                }
                break;
            case 'removeChoice':
                if (isUndo) {
                    storyParts[action.partIndex].choices.splice(action.choiceIndex, 0, cloneDeep(action.choice));
                } else {
                    storyParts[action.partIndex].choices.splice(action.choiceIndex, 1);
                }
                break;
            case 'editChoice':
                storyParts[action.partIndex].choices[action.choiceIndex] = isUndo ? cloneDeep(action.oldChoice) : cloneDeep(action.newChoice);
                break;
        }
        updateStoryStructure();
        saveToLocalStorage();
    }

    // Helper Functions
    function isPartNameDuplicate(newName, currentPartIndex) {
        return storyParts.some((part, index) => 
            part.name.toLowerCase() === newName.toLowerCase() && index !== currentPartIndex
        );
    }

    // Local Storage Functions
    function loadFromLocalStorage() {
        try {
            const savedStoryParts = localStorage.getItem('storyParts');
            const savedCurrentPart = localStorage.getItem('currentPart');
            const savedHistory = localStorage.getItem('history');

            if (savedStoryParts) storyParts = JSON.parse(savedStoryParts);
            if (savedCurrentPart) currentPart = parseInt(savedCurrentPart, 10);
            if (savedHistory) history = JSON.parse(savedHistory);
        } catch (error) {
            console.error('Error loading from local storage:', error);
            // Fallback to default state
            storyParts = [{ name: 'Part 1', text: '', choices: [] }];
            currentPart = 0;
            history = [];
        }
    }

    function saveToLocalStorage() {
        try {
            localStorage.setItem('storyParts', JSON.stringify(storyParts));
            localStorage.setItem('currentPart', currentPart.toString());
            localStorage.setItem('history', JSON.stringify(history));
        } catch (error) {
            console.error('Error saving to local storage:', error);
            alert('Failed to save your progress. Please make sure you have enough storage space.');
        }
    }

    // Story Structure Update
    function updateStoryStructure() {
        if (!elements.storyStructure) return;

        elements.storyStructure.innerHTML = storyParts.map((part, index) => `
            <div class="story-part">
                <h3>
                    <span class="part-name">${part.name}</span>
                    <button class="edit-part-name" data-part="${index}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>
                </h3>
                <textarea class="part-text" placeholder="Enter your story part here...">${part.text}</textarea>
                <div class="choices">
                    ${part.choices.map((choice, choiceIndex) => `
                        <div class="choice">
                            <input type="text" class="choice-input" placeholder="Enter choice text" value="${choice.text}" data-part="${index}" data-choice="${choiceIndex}">
                            <select class="next-part-select" data-part="${index}" data-choice="${choiceIndex}">
                                ${storyParts.map((_, i) => `<option value="${i}" ${i === choice.nextPart ? 'selected' : ''}>${storyParts[i].name}</option>`).join('')}
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
        saveToLocalStorage();
    }

    // Event Listeners for Story Parts
    function addStoryPartEventListeners() {
        // Part text input with debounce
        document.querySelectorAll('.part-text').forEach(textarea => {
            let timeoutId;
            textarea.addEventListener('input', (e) => {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    const partIndex = Array.from(elements.storyStructure.children).indexOf(e.target.closest('.story-part'));
                    const oldPart = cloneDeep(storyParts[partIndex]);
                    storyParts[partIndex].text = e.target.value;
                    undoRedoModule.pushAction({ 
                        type: 'edit', 
                        index: partIndex, 
                        oldPart: oldPart,
                        newPart: cloneDeep(storyParts[partIndex])
                    });
                    saveToLocalStorage();
                }, 500);
            });
        });

        // Add choice
        document.querySelectorAll('.add-choice-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const partIndex = parseInt(e.target.dataset.part);
                const newChoice = { text: '', nextPart: partIndex };
                storyParts[partIndex].choices.push(newChoice);
                undoRedoModule.pushAction({ type: 'addChoice', partIndex: partIndex, choice: newChoice });
                updateStoryStructure();
            });
        });

        // Choice input and next part select
        document.querySelectorAll('.choice-input, .next-part-select').forEach(element => {
            element.addEventListener('change', (e) => {
                const partIndex = parseInt(e.target.dataset.part);
                const choiceIndex = parseInt(e.target.dataset.choice);
                const oldChoice = cloneDeep(storyParts[partIndex].choices[choiceIndex]);
                if (e.target.classList.contains('choice-input')) {
                    storyParts[partIndex].choices[choiceIndex].text = e.target.value;
                } else {
                    storyParts[partIndex].choices[choiceIndex].nextPart = parseInt(e.target.value);
                }
                undoRedoModule.pushAction({ 
                    type: 'editChoice', 
                    partIndex: partIndex, 
                    choiceIndex: choiceIndex, 
                    oldChoice: oldChoice,
                    newChoice: cloneDeep(storyParts[partIndex].choices[choiceIndex])
                });
                saveToLocalStorage();
            });
        });

        // Remove choice
        document.querySelectorAll('.remove-choice-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const partIndex = parseInt(e.target.dataset.part);
                const choiceIndex = parseInt(e.target.dataset.choice);
                const removedChoice = cloneDeep(storyParts[partIndex].choices[choiceIndex]);
                storyParts[partIndex].choices.splice(choiceIndex, 1);
                undoRedoModule.pushAction({ type: 'removeChoice', partIndex: partIndex, choiceIndex: choiceIndex, choice: removedChoice });
                updateStoryStructure();
            });
        });

        // Remove part
        document.querySelectorAll('.remove-part-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const partIndex = parseInt(e.target.dataset.part);
                const removedPart = cloneDeep(storyParts[partIndex]);
                storyParts.splice(partIndex, 1);
                undoRedoModule.pushAction({ type: 'remove', index: partIndex, part: removedPart });
                updateStoryStructure();
            });
        });

        // Edit part name
        document.querySelectorAll('.edit-part-name').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const partIndex = parseInt(e.currentTarget.dataset.part);
                const currentName = storyParts[partIndex].name;
                let newName = prompt('Enter new name for this part:', currentName);
                
                if (newName && newName !== currentName) {
                    if (isPartNameDuplicate(newName, partIndex)) {
                        alert('A part with this name already exists. Please choose a different name.');
                    } else {
                        const oldName = storyParts[partIndex].name;
                        storyParts[partIndex].name = newName;
                        undoRedoModule.pushAction({ type: 'editName', index: partIndex, oldName: oldName, newName: newName });
                        updateStoryStructure();
                    }
                }
            });
        });
    }

    // Story Management Functions
    function saveStory() {
        const storyData = JSON.stringify(storyParts);
        const blob = new Blob([storyData], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'story.json';
        a.click();
        URL.revokeObjectURL(url);
    }

    function resetStory() {
        if (confirm('Are you sure you want to reset the story? This action cannot be undone.')) {
            storyParts = [{ name: 'Part 1', text: '', choices: [] }];
            currentPart = 0;
            history = [];
            undoRedoModule.pushAction({ type: 'reset' });
            updateStoryStructure();
            updateStory();
            localStorage.clear();
        }
    }

    function loadStory(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const loadedStoryParts = JSON.parse(e.target.result);
                    undoRedoModule.pushAction({ 
                        type: 'load', 
                        oldStoryParts: cloneDeep(storyParts),
                        newStoryParts: loadedStoryParts
                    });
                    storyParts = loadedStoryParts;
                    updateStoryStructure();
                    resetPlayMode();
                    saveToLocalStorage();
                    alert('Story loaded successfully!');
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                    alert('Invalid file format. Please select a valid JSON file.');
                }
            };
            reader.readAsText(file);
        }
    }

    // UI Management Functions
    function toggleProgress() {
        if (elements.progressContainer) {
            elements.progressContainer.style.display = elements.progressContainer.style.display === 'none' ? 'block' : 'none';
            elements.toggleProgressBtn.textContent = elements.progressContainer.style.display === 'none' ? 'Show Progress' : 'Hide Progress';
        }
    }

    function resetPlayMode() {
        currentPart = 0;
        history = [];
        updateStory();
        updateHistory();
        if (elements.progressBar) elements.progressBar.style.width = '0%';
        if (elements.progressText) elements.progressText.textContent = 'Part 1';
        if (elements.finalStory) elements.finalStory.style.display = 'none';
        if (elements.storyText) elements.storyText.style.display = 'block';
        if (elements.choicesContainer) elements.choicesContainer.style.display = 'block';
    }

    function toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDarkMode);
        if (elements.darkModeToggle) elements.darkModeToggle.textContent = isDarkMode ? '☀️' : '🌙';
        updateMenuOptions();
    }

    // Story Playback Functions
    function updateStory() {
        if (!elements.storyText || !elements.choicesContainer) return;

        const part = storyParts[currentPart];
        elements.storyText.textContent = part.text;
        elements.choicesContainer.innerHTML = part.choices.map((choice, index) => `
            <button class="choice-btn" data-index="${index}">${choice.text}</button>
        `).join('');

        document.querySelectorAll('.choice-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const choiceIndex = parseInt(e.target.dataset.index);
                const choice = part.choices[choiceIndex];
                
                if (choice.nextPart === currentPart) {
                    alert('This choice leads back to the same part. Please assign a different next part to avoid loops.');
                    return;
                } else if (choice.nextPart >= storyParts.length) {
                    alert('This choice leads to a non-existent part. Please create the next part or assign a valid existing part.');
                    return;
                }

                history.push({ part: currentPart, choice: choiceIndex });
                currentPart = choice.nextPart;
                updateStory();
                updateHistory();
                updateProgress();
            });
        });

        if (part.choices.length === 0) {
            if (elements.finalStory) {
                elements.finalStory.style.display = 'block';
                elements.finalStory.textContent = history.map(h => storyParts[h.part].text).join('\n\n');
            }
        } else {
            if (elements.finalStory) elements.finalStory.style.display = 'none';
        }
    }

    function updateHistory() {
        if (!elements.historyText) return;
        elements.historyText.innerHTML = history.map((h, index) => `
            <p>
                <strong>Part ${index + 1}:</strong> ${storyParts[h.part].text}<br>
                <em>Choice: ${storyParts[h.part].choices[h.choice].text}</em>
            </p>
        `).join('');
    }

    function updateProgress() {
        if (!elements.progressBar || !elements.progressText) return;
        const progress = (currentPart + 1) / storyParts.length;
        elements.progressBar.style.width = `${progress * 100}%`;
        elements.progressText.textContent = `Part ${currentPart + 1} of ${storyParts.length}`;
    }

    // Event Listeners
    if (elements.modeToggle) {
        elements.modeToggle.addEventListener('click', () => {
            elements.creatorMode.classList.toggle('hidden');
            elements.playerMode.classList.toggle('hidden');
            elements.modeToggle.textContent = elements.creatorMode.classList.contains('hidden') ? 'Switch to Creator Mode' : 'Switch to Play Mode';
            if (!elements.creatorMode.classList.contains('hidden')) {
                updateStoryStructure();
            } else {
                resetPlayMode();
            }
        });
    }

    if (elements.addPartBtn) {
        elements.addPartBtn.addEventListener('click', () => {
            const newPartNumber = storyParts.length + 1;
            const newPart = { name: `Part ${newPartNumber}`, text: '', choices: [] };
            storyParts.push(newPart);
            undoRedoModule.pushAction({ type: 'add', part: newPart });
            updateStoryStructure();
        });
    }

    if (elements.saveBtn) elements.saveBtn.addEventListener('click', saveStory);
    if (elements.resetBtn) elements.resetBtn.addEventListener('click', resetStory);
    if (elements.loadBtn) elements.loadBtn.addEventListener('click', () => elements.fileInput.click());
    if (elements.fileInput) elements.fileInput.addEventListener('change', loadStory);
    if (elements.toggleProgressBtn) elements.toggleProgressBtn.addEventListener('click', toggleProgress);
    if (elements.replayBtn) elements.replayBtn.addEventListener('click', resetPlayMode);
    if (elements.darkModeToggle) elements.darkModeToggle.addEventListener('click', toggleDarkMode);
    if (elements.undoBtn) elements.undoBtn.addEventListener('click', () => {
        const actionData = undoRedoModule.undo();
        if (actionData) applyAction(actionData);
    });
    if (elements.redoBtn) elements.redoBtn.addEventListener('click', () => {
        const actionData = undoRedoModule.redo();
        if (actionData) applyAction(actionData);
    });

    // Keyboard shortcuts for undo and redo
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'z') {
            e.preventDefault();
            const actionData = undoRedoModule.undo();
            if (actionData) applyAction(actionData);
        } else if (e.ctrlKey && e.key === 'y') {
            e.preventDefault();
            const actionData = undoRedoModule.redo();
            if (actionData) applyAction(actionData);
        }
    });

    // Mouse tracking for darkening effect
    if (elements.content) {
        elements.content.addEventListener('mousemove', (e) => {
            const rect = elements.content.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            elements.content.style.setProperty('--mouse-x', `${x}px`);
            elements.content.style.setProperty('--mouse-y', `${y}px`);
        });
    }

    // Author preview functionality
    const authorLink = document.getElementById('author-link');
    const authorPreview = document.getElementById('author-preview');

    let previewTimeout;

    authorLink.addEventListener('mouseenter', () => {
        clearTimeout(previewTimeout);
        authorPreview.style.display = 'block';
    });

    authorLink.addEventListener('mouseleave', () => {
        previewTimeout = setTimeout(() => {
            if (!authorPreview.matches(':hover')) {
                authorPreview.style.display = 'none';
            }
        }, 50);
    });

    authorPreview.addEventListener('mouseenter', () => {
        clearTimeout(previewTimeout);
    });

    authorPreview.addEventListener('mouseleave', () => {
        authorPreview.style.display = 'none';
    });

    // Menu functionality
    const menuToggle = document.getElementById('menu-toggle');
    const dropdownMenu = document.getElementById('dropdown-menu');

    if (menuToggle && dropdownMenu) {
        menuToggle.addEventListener('click', function() {
            dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
        });

        // Close the menu when clicking outside
        window.addEventListener('click', function(event) {
            if (!event.target.matches('.menu-toggle') && !event.target.closest('.dropdown-menu')) {
                dropdownMenu.style.display = 'none';
            }
        });
    }

    // Function to update menu options
    function updateMenuOptions() {
        if (document.body.classList.contains('dark-mode')) {
            if (!document.getElementById('disable-darkening')) {
                const disableDarkeningOption = document.createElement('a');
                disableDarkeningOption.href = '#';
                disableDarkeningOption.id = 'disable-darkening';
                disableDarkeningOption.className = 'menu-button';
                disableDarkeningOption.textContent = document.body.classList.contains('disable-darkening') ? 'Enable Mouse Darkening' : 'Disable Mouse Darkening';
                dropdownMenu.appendChild(disableDarkeningOption);

                const highContrastOption = document.createElement('a');
                highContrastOption.href = '#';
                highContrastOption.id = 'high-contrast-mode';
                highContrastOption.className = 'menu-button';
                highContrastOption.textContent = document.body.classList.contains('high-contrast') ? 'Normal Contrast Mode' : 'High Contrast Mode';
                dropdownMenu.appendChild(highContrastOption);
            }
        } else {
            const disableDarkeningOption = document.getElementById('disable-darkening');
            const highContrastOption = document.getElementById('high-contrast-mode');
            if (disableDarkeningOption) dropdownMenu.removeChild(disableDarkeningOption);
            if (highContrastOption) dropdownMenu.removeChild(highContrastOption);
        }
    }

    // Event listeners for new options
    dropdownMenu.addEventListener('click', function(e) {
        if (e.target.id === 'disable-darkening') {
            document.body.classList.toggle('disable-darkening');
            e.target.textContent = document.body.classList.contains('disable-darkening') ? 'Enable Mouse Darkening' : 'Disable Mouse Darkening';
            savePreferences();
        } else if (e.target.id === 'high-contrast-mode') {
            document.body.classList.toggle('high-contrast');
            e.target.textContent = document.body.classList.contains('high-contrast') ? 'Normal Contrast Mode' : 'High Contrast Mode';
            savePreferences();
        }
    });

    // Remove unwanted tooltip on the right
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .edit-part-name::after {
            content: none;
        }
    `;
    document.head.appendChild(styleElement);

    // Load and save preferences
    function loadPreferences() {
        const disableDarkening = localStorage.getItem('disableDarkening') === 'true';
        const highContrast = localStorage.getItem('highContrast') === 'true';

        if (disableDarkening) {
            document.body.classList.add('disable-darkening');
        }
        if (highContrast) {
            document.body.classList.add('high-contrast');
        }
        updateMenuOptions();
    }

    function savePreferences() {
        localStorage.setItem('disableDarkening', document.body.classList.contains('disable-darkening'));
        localStorage.setItem('highContrast', document.body.classList.contains('high-contrast'));
    }

    // Initial call to set up menu and load preferences
    loadPreferences();
    loadFromLocalStorage();
    updateStoryStructure();
    updateStory();

    // Check for saved dark mode preference
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        if (elements.darkModeToggle) elements.darkModeToggle.textContent = '☀️';
        updateMenuOptions();
    }
});
