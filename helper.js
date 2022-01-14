const randomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
  };
  
  const totalAmtToBePaid = (amount) => {
    return amount;
  };
  
  const getReturnAmount = (amount, stakedRatio) => {
    return amount * stakedRatio;
  };
  
  module.exports = {
    randomNumber,
    totalAmtToBePaid,
    getReturnAmount,
  };