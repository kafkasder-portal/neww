module.exports = {
  "content": [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./index.html"
  ],
  "css": [
    "./src/styles/**/*.css"
  ],
  "output": "./src/styles/purged.css",
  "safelist": [
    "corporate-*",
    "animate-*",
    "transition-*"
  ]
}