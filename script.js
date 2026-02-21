let words = JSON.parse(localStorage.getItem('words')) || [];
let hideTranslations = false;
const toggleBtn = document.getElementById('toggleTranslate');

function saveWords() {
    localStorage.setItem('words', JSON.stringify(words));
}

function updateCounter() {
    document.getElementById('wordCounter').textContent = `Total words: ${words.length}`;
}

function renderWords(filteredWords = words) {
    const list = document.getElementById('wordList');
    const emptyMessage = document.getElementById('emptyMessage');
    const scrollTop = list.scrollTop;
    list.innerHTML = '';

    if (filteredWords.length === 0) {
        emptyMessage.style.display = 'block';
    } else {
        emptyMessage.style.display = 'none';
    }

    filteredWords.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="left-side">
                <span class="number">${index + 1}.</span>
                <div class="word-info">
                    <span class="word">${item.word}</span>
                    <span class="translation" style="display: ${hideTranslations ? 'none' : 'block'}">${item.translation}</span>
                </div>
            </div>
            <div class="actions">
                <button class="edit-btn" onclick="editWord(${index})">Edit</button>
                <button class="delete-btn" onclick="deleteWord(${index})">Delete</button>
            </div>
        `;
        list.appendChild(li);
    });

    updateCounter();
    list.scrollTop = scrollTop;
    toggleBtn.classList.toggle('off', hideTranslations);
}

function addWord() {
    const wordInput = document.getElementById('wordInput');
    const translationInput = document.getElementById('translationInput');
    const word = wordInput.value.trim();
    const translation = translationInput.value.trim();

    if (word && translation) {
        words.push({ word, translation });
        saveWords();
        renderWords();
        wordInput.value = '';
        translationInput.value = '';
    }
}

function deleteWord(index) {
    words.splice(index, 1);
    saveWords();
    renderWords();
}

function editWord(index) {
    const newWord = prompt("Edit word:", words[index].word);
    const newTranslation = prompt("Edit translation:", words[index].translation);
    if (newWord !== null && newTranslation !== null) {
        words[index] = { word: newWord.trim(), translation: newTranslation.trim() };
        saveWords();
        renderWords();
    }
}

function searchWords() {
    const val = document.getElementById('searchInput').value.toLowerCase();
    const filtered = words.filter(item => item.word.toLowerCase().includes(val) || item.translation.toLowerCase().includes(val));
    renderWords(filtered);
}

function exportJSON() {
    const dataStr = JSON.stringify(words, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "word-vault-data.json";
    a.click();
    URL.revokeObjectURL(url);
}

function toggleTranslations() {
    hideTranslations = !hideTranslations;
    renderWords();
}

renderWords();
