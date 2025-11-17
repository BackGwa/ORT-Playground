import { parse, generate, OrtParseError } from 'https://esm.sh/ort-ts';

export class Converter {
    constructor(inputArea, outputArea) {
        this.inputArea = inputArea;
        this.outputArea = outputArea;
    }

    jsonToOrt() {
        try {
            const input = this.inputArea.value.trim();
            if (!input) {
                this.outputArea.value = '';
                this.outputArea.classList.remove('error');
                return;
            }

            const json = JSON.parse(input);
            const ort = generate(json);
            this.outputArea.value = ort;
            this.outputArea.classList.remove('error');
        } catch (error) {
            this.outputArea.value = `Error: ${error.message}`;
            this.outputArea.classList.add('error');
        }
    }

    ortToJson() {
        try {
            const input = this.inputArea.value.trim();
            if (!input) {
                this.outputArea.value = '';
                this.outputArea.classList.remove('error');
                return;
            }

            const ortValue = parse(input);
            const json = ortValue.toNative();
            this.outputArea.value = JSON.stringify(json, null, 2);
            this.outputArea.classList.remove('error');
        } catch (error) {
            if (error instanceof OrtParseError) {
                this.outputArea.value = `Parse Error at line ${error.lineNum}:\n${error.message}`;
            } else {
                this.outputArea.value = `Error: ${error.message}`;
            }
            this.outputArea.classList.add('error');
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
