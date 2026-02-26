/**
 * AI Service (Mocked)
 * In production, these functions can be wired to an LLM API (e.g., OpenAI, Gemini).
 */

/**
 * improveContent - Returns a "clearer" version of the provided content.
 * Currently mocked: prepends an improvement note to the original text.
 * @param {string} content - The original article content (rich text / HTML)
 * @returns {string} - Improved content
 */
const improveContent = (content) => {
    if (!content || content.trim() === '') return content;

    // Mock improvement: trim extra whitespace and add a polished intro note
    const cleaned = content.trim().replace(/\s+/g, ' ');
    return `[AI Improved] ${cleaned}`;
};

/**
 * generateSummary - Returns a short 200-character snippet for list-view cards.
 * Strips HTML tags and truncates to 200 characters.
 * @param {string} content - The article content (may include HTML)
 * @returns {string} - A plain-text summary of up to 200 characters
 */
const generateSummary = (content) => {
    if (!content || content.trim() === '') return '';

    // Strip HTML tags
    const stripped = content.replace(/<[^>]*>/g, ' ').trim();

    // Decode common HTML entities
    const plainText = stripped
        .replace(/&nbsp;/gi, ' ')
        .replace(/&amp;/gi, '&')
        .replace(/&lt;/gi, '<')
        .replace(/&gt;/gi, '>')
        .replace(/&quot;/gi, '"')
        .replace(/&#39;/gi, "'")
        .replace(/\s+/g, ' ')
        .trim();

    if (plainText.length <= 200) return plainText;

    // Truncate and add ellipsis
    return plainText.substring(0, 197) + '...';
};

module.exports = { improveContent, generateSummary };
