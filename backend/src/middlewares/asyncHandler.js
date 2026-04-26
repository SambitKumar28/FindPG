const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => {
    console.error(err); // optional logging
    next(err);
  });
};

export default asyncHandler;