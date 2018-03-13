/**
 * Represents a single token from a text.
 */
export default class Token {

    private text: String;

    /**
     * The text of the token
     */
    constructor(text: String) {
        this.text = text;
    }

    /**
     * Returns a human readable form of the token
     * @return {String}
     */
    public toString() {
        return this.text;
    }
}
