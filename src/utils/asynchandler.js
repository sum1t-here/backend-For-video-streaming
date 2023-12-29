const asynchandler = (requestHandler) => {
  (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

export default asynchandler;

// const asynchandler = () => {}
// const asynchandler = (func) => () => {}
// const asynchandler = (func) => async() => {}

// const asynchandler = (fn) => async (req, res, next) => {
//   try {
//     await fn(req, res, next)
//   } catch {
//     res.status(err.code || 500).json({
//       succees: false,
//       message: err.message,
//     });
//   }
// };
