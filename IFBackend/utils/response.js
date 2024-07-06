const CustomResponse = (res, code, status, message, data) => {
  return res.status(code).json({
    status: status,
    message: message,
    data: data,
  });
};
module.exports = CustomResponse;
