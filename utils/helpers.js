module.exports = {
  // converts timestamps to mm/dd/yyyy format
  format_date: date => {
    return `${new Date(date).getMonth() + 1}/${new Date(date).getDate()}/${new Date(
      date
    ).getFullYear()}`;
  },

  // pluralized like and comment to likes and comments
  format_plural: (word, amount) => {
    if (amount !== 1) {
      return `${word}s`;
    }

    return word;
  },

  // Add margin to title if is short
  title_margin: (title) => {
    if (title.length < 20) {
      return `margin-top: 29px;`;
    }
    return ''
  },

  // check if blog posts exist for itinerary of a city
  check_city: (city) => {
    if (city == "noCity") {
      return "Recommened Itineraries";
    } else if(city == "recBlogs") {
      return "Recommended Blogs"
    } 
    return city
  },

  // check if destination is in US
  check_us: (nation) => {
    return nation === "US"
  }
}