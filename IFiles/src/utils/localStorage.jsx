export const StoreLocal = (key, data) => {
  const str_data = JSON.stringify(data);
  localStorage.setItem(key, str_data);
  return null;
};

export const RetriveData = (key) => {
  const data = localStorage.getItem(key);
  const jsonData = data ? JSON.parse(data) : "";
  return jsonData;
};

export const RemoveData = (key) => {
  localStorage.removeItem(key);
  return;
};

export const StoreUserDataWithToken = (key, data) => {
  const str_data = JSON.stringify(data);
  sessionStorage.setItem(key, str_data);
  return null;
};

export const RetriveAccessToken = (key) => {
  const access_token = sessionStorage.getItem(key);
  return access_token ? JSON.parse(access_token) : "";
};

export const removeToken = (key) => {
  sessionStorage.removeItem(key);
  return;
};
