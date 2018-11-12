const logger = ({ getState, dispatch }) => next => action => {
  console.log('Action', action);
  next(action);
  console.log('State', getState());
};

export default logger;