import 'regenerator-runtime';
import { TIMEOUT_SEC } from './config';

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
