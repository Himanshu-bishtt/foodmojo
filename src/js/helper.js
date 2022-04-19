import 'regenerator-runtime';
import { GEOCODE_API_KEY, TIMEOUT_SEC } from './config';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const loadAJAX = async function (url) {
  try {
    const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
    const data = await res.json();
    if (!data.results)
      throw new Error(`No recipes found with that query. Please try again!`);
    return data;
  } catch (err) {
    throw err;
  }
};

export const getLocationCoords = async function () {
  try {
    return await new Promise((resolve, reject) =>
      navigator.geolocation.getCurrentPosition(resolve, reject)
    );
  } catch (err) {
    throw err;
  }
};

export const getLocation = async function (lat, lng) {
  try {
    const res = await fetch(
      `https://geocode.xyz/${lat},${lng}?geoit=json&auth=${GEOCODE_API_KEY}`
    );

    if (!res.ok) throw new Error('Problem getting location data');

    const data = await res.json();

    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const cronJob = function () {
  const midnight = '00:00:01';

  const date = new Date();
  const hours = String(date.getHours()).padStart(2, 0);
  const mins = String(date.getMinutes()).padStart(2, 0);
  const secs = String(date.getSeconds()).padStart(2, 0);

  const now = `${hours}:${mins}:${secs}`;

  console.log(now);
  if (now === midnight) return true;
  return false;
};
