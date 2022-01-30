module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {fontFamily:{
      body:"'Montserrat-Medium', san-serif",
      header:"'Messapia-Bold', sans-serif",
      
    },
    
    colors:{
    blue:{
      400:"#44535E",
      450:"#313D45"},
    gold: "#BBA68D"
  },

  backgroundImage:theme=> ({'bgimg': "url('../public/background.jpg')"})},
  },
  plugins: [],
}
