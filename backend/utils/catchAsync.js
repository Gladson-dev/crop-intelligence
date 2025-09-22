/**
 * A higher-order function that wraps an async function to handle errors
 * @param {Function} fn - The async function to be wrapped
 * @returns {Function} A middleware function that handles errors
 */
const catchAsync = fn => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

export default catchAsync;
