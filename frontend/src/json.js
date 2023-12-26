export async function fetchFromBackend(url, settings, navigate) {
  const domain = window.location.protocol + "//" + window.location.hostname + ":8000";
  const response = await fetch(domain + url, settings);
  if ([401, 403].includes(response.status)) {
    navigate("/logout")
    return {};
  }
  return response;
}
