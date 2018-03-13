/**
 * Represents a single token from a text.
 */
export default class Token {

    private text:string;

    /**
     *
     * @param {string} text - The text of the token
     */
    constructor(text:string='') {
        this.text = text;
    }

    /**
     * Returns a human readable form of the token
     * @return {string}
     */
    public toString():string {
        return this.text;
    }
}
