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
    gold: "#CA9E67",
    purple:"#2C183A",
    indigo:"#364861"
  },

  backgroundImage:theme=> ({'bgimg': "url('../public/background.jpg')"})},
  },
  plugins: [],
}
