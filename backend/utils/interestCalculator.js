
export const calculateLoanInterest = (amount) => {
  // 5% interest
  const interest = amount * 0.05;
  const totalOwed = amount + interest;
  return { interest, totalOwed };
};