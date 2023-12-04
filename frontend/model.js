export const getIngredient = async () => {
  try {
    const res = await fetch(
      `http://localhost:1337/api/ingredients/?populate=*`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!res.ok) {
      throw new Error("Failed to getIngredient of user");
    }
    const data = await res.json();
    if (data.data) {
      return data.data;
    }
  } catch (error) {
    console.log(error);
  }
};
export const getDishes = async () => {
  try {
    const res = await fetch(`http://localhost:1337/api/dishes/?populate=*`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      throw new Error("Failed to getDishes of user");
    }
    const data = await res.json();
    if (data.data) {
      return data.data;
    }
  } catch (error) {
    console.log(error);
  }
};

export const getPrayerTimes = async (
  year,
  month,
  latitude,
  longitude,
  method = 2
) => {
  const apiUrl = `http://api.aladhan.com/v1/calendar/${year}/${month}?latitude=${latitude}&longitude=${longitude}&method=${method}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (response.ok) {
      return data.data;
    } else {
      throw new Error(
        data.data ? data.data.error : "Failed to fetch prayer times."
      );
    }
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
};


