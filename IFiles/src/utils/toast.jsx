import toast from "react-hot-toast";
export const showToast = (status, msg) => {
  return toast[status](msg);
};
