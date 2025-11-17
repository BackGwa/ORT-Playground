import { parse, generate, OrtParseError } from 'https://esm.sh/ort-ts';

export class Converter {
    constructor(inputEditor, outputEditor) {
        this.inputEditor = inputEditor;
        this.outputEditor = outputEditor;
    }

    jsonToOrt() {
        try {
            const input = this.inputEditor.getValue().trim();
            if (!input) {
                this.outputEditor.setValue('');
                this.outputEditor.setError(false);
                return;
            }

            const json = JSON.parse(input);
            const ort = generate(json);
            this.outputEditor.setValue(ort);
            this.outputEditor.setError(false);
        } catch (error) {
            this.outputEditor.setValue(`Error: ${error.message}`);
            this.outputEditor.setError(true);
        }
    }

    ortToJson() {
        try {
            const input = this.inputEditor.getValue().trim();
            if (!input) {
                this.outputEditor.setValue('');
                this.outputEditor.setError(false);
                return;
            }

            const ortValue = parse(input);
            const json = ortValue.toNative();
            this.outputEditor.setValue(JSON.stringify(json, null, 2));
            this.outputEditor.setError(false);
        } catch (error) {
            if (error instanceof OrtParseError) {
                this.outputEditor.setValue(`Parse Error at line ${error.lineNum}:\n${error.message}`);
            } else {
                this.outputEditor.setValue(`Error: ${error.message}`);
            }
            this.outputEditor.setError(true);
        }
    }

    convert(mode) {
        if (mode === 'json-to-ort') {
            this.jsonToOrt();
        } else {
            this.ortToJson();
        }
    }
}
