module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#28a745', // Adjust according to FitMeal color scheme
        secondary: '#f8f9fa', // Adjust according to FitMeal color scheme
      },
      fontFamily: {
        sans: ['Helvetica', 'Arial', 'sans-serif'], // Adjust if necessary
      },
      backgroundImage: {
        'hero-bg': "url('https://via.placeholder.com/1920x1080')" // Replace with actual hero image URL
      }
    },
  },
  plugins: [],
};
