export async function fetchFromBackend(url, settings) {
  const domain = window.location.protocol + "//" + window.location.hostname + ":8000";
  return fetch(domain + url, settings);
}
