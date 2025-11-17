export function updateCharCount(text, countElement) {
    const count = text.length;
    countElement.textContent = `${count} chars`;
}

export function setupCharCounter(editor, countElement) {
    const updateCount = () => {
        updateCharCount(editor.getValue(), countElement);
    };

    // Initial update
    updateCount();

    // CodeMirror doesn't use traditional event listeners
    // The editor setup will handle change callbacks
    return updateCount;
}
