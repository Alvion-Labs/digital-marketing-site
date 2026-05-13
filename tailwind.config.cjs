module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
  ],
  // Safelist common utility patterns used in editor-generated HTML
  safelist: [
    { pattern: /^(w|h|p|m|mx|my|px|py|pt|pr|pb|pl|mr|ml|rounded|rounded-[trbl]?|text|bg|border|grid|col|gap|flex|items|justify|object|max-w|min-w|space|leading|tracking|font|opacity|shadow)-/ },
    { pattern: /^text-[a-z]+/ },
    { pattern: /^bg-[a-z]+/ },
    { pattern: /^border-[a-z]+/ },
    { pattern: /^rounded/ },
    { pattern: /^w-\d+/ },
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
