export const baseurl = "http://43.204.140.140/api/v1";

export const url = {
  signin: `${baseurl}/signin`,
  signup: `${baseurl}/signup`,
  signout: `${baseurl}/logout`,
  newAceesToken: `${baseurl}/generate_access_token`,
  saveUser: `${baseurl}/save-user-data`,
  getuser: `${baseurl}/get-user`,
  postFile: `${baseurl}/post-file`,
  getFiles: `${baseurl}/get-files`,
  deleteFile: (file_id) => `${baseurl}/delete-file?file_id=${file_id}`,
};
