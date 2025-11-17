import { EditorView, keymap, lineNumbers, highlightActiveLine, highlightActiveLineGutter } from 'https://esm.sh/@codemirror/view';
import { EditorState } from 'https://esm.sh/@codemirror/state';
import { defaultKeymap, history, historyKeymap } from 'https://esm.sh/@codemirror/commands';
import { bracketMatching, indentOnInput, syntaxHighlighting, defaultHighlightStyle } from 'https://esm.sh/@codemirror/language';
import { json } from 'https://esm.sh/@codemirror/lang-json';
import { closeBrackets, closeBracketsKeymap } from 'https://esm.sh/@codemirror/autocomplete';

const minimalSetup = [
    lineNumbers(),
    highlightActiveLineGutter(),
    highlightActiveLine(),
    history(),
    bracketMatching(),
    closeBrackets(),
    indentOnInput(),
    syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
    keymap.of([
        ...closeBracketsKeymap,
        ...defaultKeymap,
        ...historyKeymap
    ]),
    EditorView.lineWrapping
];

export class CodeMirrorEditor {
    constructor(parent, options = {}) {
        const {
            readOnly = false,
            language = null,
            placeholder = '',
            onChange = null
        } = options;

        const extensions = [...minimalSetup];

        if (language === 'json') {
            extensions.push(json());
        }

        if (readOnly) {
            extensions.push(EditorState.readOnly.of(true));
        }

        if (onChange) {
            extensions.push(EditorView.updateListener.of((update) => {
                if (update.docChanged) {
                    onChange(this.getValue());
                }
            }));
        }

        const state = EditorState.create({
            doc: '',
            extensions
        });

        this.view = new EditorView({
            state,
            parent
        });

        this.language = language;
        this.isReadOnly = readOnly;
        this.onChange = onChange;
    }

    getValue() {
        return this.view.state.doc.toString();
    }

    setValue(value) {
        const transaction = this.view.state.update({
            changes: {
                from: 0,
                to: this.view.state.doc.length,
                insert: value
            }
        });
        this.view.dispatch(transaction);
    }

    setLanguage(language) {
        if (this.language === language) return;

        this.language = language;

        const extensions = [...minimalSetup];

        if (language === 'json') {
            extensions.push(json());
        }

        if (this.isReadOnly) {
            extensions.push(EditorState.readOnly.of(true));
        }

        if (this.onChange) {
            extensions.push(EditorView.updateListener.of((update) => {
                if (update.docChanged) {
                    this.onChange(this.getValue());
                }
            }));
        }

        const state = EditorState.create({
            doc: this.getValue(),
            extensions
        });

        this.view.setState(state);
    }

    setError(hasError) {
        const element = this.view.dom;
        if (hasError) {
            element.classList.add('error');
        } else {
            element.classList.remove('error');
        }
    }

    focus() {
        this.view.focus();
    }

    destroy() {
        this.view.destroy();
    }
}
