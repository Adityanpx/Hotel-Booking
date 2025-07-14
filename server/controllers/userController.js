
// Get/api/user

export const getUserData = async (req , res) => {
  try {
      const role = req.user.role;
      const recentSearchedCities = req.user.recentSearchedCities || [];

      res.json({
          success: true,
          role,
          recentSearchedCities // ✅ must return in a key!
      });
  } catch(error){
      res.status(500).json({success: false, message: error.message})
  }
}


export const storeRecentSearchedCities = async (req, res) => {
  try {
    const { recentSearchedCity } = req.body;

    const user = await req.user;

    // Remove the city if it already exists in the list to avoid duplicates
    user.recentSearchedCities = user.recentSearchedCities.filter(
      (city) => city !== recentSearchedCity
    );

    // Add the new city to the end
    user.recentSearchedCities.push(recentSearchedCity);

    // Limit the array to the last 3 items
    if (user.recentSearchedCities.length > 3) {
      user.recentSearchedCities = user.recentSearchedCities.slice(-3);
    }

    await user.save();

    res.json({ success: true, message: "City added successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
  