import * as model from "./model.js";

const ingredients = await model.getIngredient();
const dishes = await model.getDishes();

//rendering
const randomIntFromInterval = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};
const ingredientContents = document.querySelector(".ingredient-contents");
const dishesContents = document.querySelector(".dishes-contents");
const renderSugg = (ingredients, dishes) => {
  console.log(ingredients, dishes);
  if (ingredients.length > 0) {
    let suggIngredients = [];
    for (let i = 0; i < 5; i++) {
      let rndInt = randomIntFromInterval(0, ingredients.length - 1);
      if (!suggIngredients.includes(rndInt)) {
        suggIngredients.push(rndInt);
        let html = `<div class="ingredient-content" id=${rndInt}>
      <img
        class="ingredient-content__img"
        src=${ingredients[rndInt].attributes.imageUrl}
      />
      <p class="ingredient-content__name">${ingredients[rndInt].attributes.name}</p>
    </div>`;
        ingredientContents.insertAdjacentHTML("afterbegin", html);
      } else {
        i--;
      }
    }
  }
  if (dishes.length > 0) {
    let suggDishes = [];
    for (let i = 0; i < 3; i++) {
      let rndInt = randomIntFromInterval(0, dishes.length - 1);
      if (!suggDishes.includes(rndInt)) {
        suggDishes.push(rndInt);
        let html = `<div class="dishes-content" id=${rndInt}>
      <img
        class="dishes-content__img"
        src=${dishes[rndInt].attributes.imageUrl}
      />
      <p class="dishes-content__name">${dishes[rndInt].attributes.name}</p>
      <p class="dishes-content__ing">
      ${dishes[rndInt].attributes.ingredients.data.map((e) => {
        return e.attributes.name;
      })}
      </p>
      <div class="dishes-content__duration">
        <img
          class="dishes-content__duration__img"
          src="./assets/Time.svg"
          alt="time"
        />
        <p class="dishes-content__duration__time">${
          dishes[rndInt].attributes.time
        }</p>
      </div>
    </div>`;
        dishesContents.insertAdjacentHTML("afterbegin", html);
      } else {
        i--;
      }
    }
  }
};

renderSugg(ingredients, dishes);

const ingredientContent = document.querySelectorAll(".ingredient-content");
ingredientContent.forEach((ing, i) => {
  ing.addEventListener("click", (e) => {
    console.log(e, "element");

    let newdishes = dishes.filter(
      (dishe) =>
        dishe.attributes.name.toLowerCase().includes(e.children[1].innerHTML) ||
        dishe.attributes.ingredients.data.some((e) =>
          e.attributes.name.toLowerCase().includes(e.children[1].innerHTML)
        )
    );

    render([], newdishes);
  });
});

const render = (ingredients, dishes) => {
  ingredientContents.innerHTML = "";
  dishesContents.innerHTML = "";

  ingredients &&
    ingredients.map((ing, i) => {
      let html = `<div class="ingredient-content" >
          <img class="ingredient-content__img" src=${ing.attributes.imageUrl} />
          <p class="ingredient-content__name">${ing.attributes.name}</p>
        </div>`;
      ingredientContents.insertAdjacentHTML("afterbegin", html);
    });

  dishes &&
    dishes.map((dishe, i) => {
      let html = `<div class="dishes-content" >
          <img class="dishes-content__img" src=${dishe.attributes.imageUrl} />
          <p class="dishes-content__name">${dishe.attributes.name}</p>
          <p class="dishes-content__ing">
            ${dishe.attributes.ingredients.data.map((e) => {
              return e.attributes.name;
            })}
          </p>
          <div class="dishes-content__duration">
            <img class="dishes-content__duration__img" src="./assets/Time.svg" alt="time" />
            <p class="dishes-content__duration__time">${
              dishe.attributes.time
            }</p>
          </div>
        </div>`;
      dishesContents.insertAdjacentHTML("afterbegin", html);
    });
};

// search
const searchButton = document.querySelector(".search-btn");
searchButton.addEventListener("click", (e) => {
  e.preventDefault();
  const searchValue = document
    .querySelector(".search-input")
    .value.toLowerCase();

  let newing = ingredients.filter((ing) =>
    ing.attributes.name.toLowerCase().includes(searchValue)
  );

  let newdishes = dishes.filter(
    (dishe) =>
      dishe.attributes.name.toLowerCase().includes(searchValue) ||
      dishe.attributes.ingredients.data.some((e) =>
        e.attributes.name.toLowerCase().includes(searchValue)
      )
  );

  render(newing, newdishes);
});

//prayer
const currentDate = new Date();
const year = currentDate.getFullYear();
const month = currentDate.getMonth() + 1;
const latitude = 35.8354815;
const longitude = 10.6097761;
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      console.log("Latitude:", latitude);
      console.log("Longitude:", longitude);
    },
    (error) => {
      console.error("Error getting location:", error.message);
    }
  );
} else {
  console.error("Geolocation is not supported by this browser.");
}

const prayerTimes = await model.getPrayerTimes(
  year,
  month,
  latitude,
  longitude
);

console.log(prayerTimes);

const now = new Date();
const dayOfMonth = now.getDate();
let formattedTime = 0;
function updateCurrentTime() {
  const currentTime = document.querySelector(".prayer-card__hour");
  const currentDay = document.querySelector(".prayer-card__today");

  formattedTime = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  currentTime.textContent = formattedTime;

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dayName = daysOfWeek[now.getDay()];
  const suffix = getDayOfMonthSuffix(dayOfMonth);

  const formattedDay = `${dayName}, ${dayOfMonth}${suffix} ${
    prayerTimes[dayOfMonth].date.hijri.month.en
  } ${now.getFullYear()}`;

  currentDay.textContent = formattedDay;
}

function updateTime() {
  updateCurrentTime();
}

updateTime();
setInterval(updateTime, 1000);

function getDayOfMonthSuffix(day) {
  if (day >= 11 && day <= 13) {
    return "th";
  }
  const lastDigit = day % 10;
  switch (lastDigit) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

//next
const prayerHour = document.querySelectorAll(".prayerHour");
let prayers = [];
prayerHour.forEach((e) => {
  const prayerName = e.getAttribute("id");
  const prayerTime = prayerTimes[dayOfMonth].timings[prayerName];
  const convertedTime = convertTo12HourFormat(prayerTime);
  if (prayerName !== "Sunrise") {
    prayers.push(convertedTime);
  }
  e.textContent = convertedTime;
});
console.log(prayers);

const convertToTime = (time) => {
  const [hours, minutes] = time.split(":");
  const prayerTime = new Date(now);
  prayerTime.setHours(parseInt(hours, 10));
  prayerTime.setMinutes(parseInt(minutes, 10));
  return prayerTime;
};

prayers.map((e) => {
  console.log(e, formattedTime);
});

function getNextPrayerTimeAndDifference(formattedTime, prayers) {
  const [hours, minutes, period] = formattedTime
    .match(/(\d+):(\d+) ([APMapm]{2})/)
    .slice(1, 4);
  const timeInMinutes =
    (period.toUpperCase() === "PM"
      ? 12 + parseInt(hours, 10)
      : parseInt(hours, 10)) *
      60 +
    parseInt(minutes, 10);

  const prayerTimesInMinutes = prayers.map((prayer) => {
    const [prayerHours, prayerMinutes, prayerPeriod] = prayer
      .match(/(\d+):(\d+) ([APMapm]{2})/)
      .slice(1, 4);
    return (
      (prayerPeriod.toUpperCase() === "PM"
        ? 12 + parseInt(prayerHours, 10)
        : parseInt(prayerHours, 10)) *
        60 +
      parseInt(prayerMinutes, 10)
    );
  });

  let nextPrayerTimeInMinutes = prayerTimesInMinutes.find(
    (prayerTime) => prayerTime > timeInMinutes
  );

  if (nextPrayerTimeInMinutes === undefined) {
    nextPrayerTimeInMinutes = Math.min(...prayerTimesInMinutes) + 24 * 60;
  }

  const timeDifferenceInMinutes = nextPrayerTimeInMinutes - timeInMinutes;
  const nextPrayerTime = formatTimeFromMinutes(nextPrayerTimeInMinutes);

  return { nextPrayerTime, timeDifferenceInMinutes };
}

function formatTimeFromMinutes(timeInMinutes) {
  const hours = Math.floor(timeInMinutes / 60);
  const minutes = timeInMinutes % 60;
  const period = hours >= 12 ? "PM" : "AM";
  const formattedTime = `${hours % 12 === 0 ? 12 : hours % 12}:${
    minutes < 10 ? "0" : ""
  }${minutes} ${period}`;

  return formattedTime;
}

const result = getNextPrayerTimeAndDifference(formattedTime, prayers);
console.log(result);

nextPrayer = result.nextPrayerTime;
document.querySelector(".prayer-card__next__now").textContent = nextPrayer;

// timeDifference
function translateTimeDifference(timeDifferenceInMinutes) {
  const hours = Math.floor(timeDifferenceInMinutes / 60);
  const minutes = timeDifferenceInMinutes % 60;
  let prayer = `maghreb`;
  let timeDifferenceString = "";

  if (hours > 0) {
    timeDifferenceString += `${hours}h `;
  }

  if (minutes > 0) {
    timeDifferenceString += `${minutes}min`;
  }

  if (timeDifferenceString === "") {
    timeDifferenceString = "Now";
  } else {
    timeDifferenceString += `left until ${prayer}`;
  }

  return timeDifferenceString;
}

const translatedTimeDifference = translateTimeDifference(
  result.timeDifferenceInMinutes
);
console.log(translatedTimeDifference);

document.querySelector(".prayer-card__next__nextPrayerTime").textContent =
  translatedTimeDifference;

//prayers
function convertTo12HourFormat(timeString) {
  const timePart = timeString.match(/\d{2}:\d{2}/);
  let [hours, minutes] = timePart[0].split(":").map(Number);
  if (isNaN(hours) || isNaN(minutes)) {
    return "Invalid Time";
  }

  let period = "AM";

  if (hours >= 12) {
    period = "PM";
    if (hours > 12) {
      hours -= 12;
    }
  }
  const formattedHours = hours < 10 ? `0${hours}` : hours;

  return `${formattedHours}:${minutes < 10 ? "0" : ""}${minutes} ${period}`;
}

prayerHour.forEach((e) => {
  const prayerName = e.getAttribute("id");
  const prayerTime = prayerTimes[dayOfMonth].timings[prayerName];
  const convertedTime = convertTo12HourFormat(prayerTime);

  if (nextPrayer === convertedTime) {
    e.parentElement.classList.add("now");
    e.parentElement.children[0].classList.add("now-desc");
    e.classList.add("now-desc");
  }
  e.textContent = convertedTime;
});
