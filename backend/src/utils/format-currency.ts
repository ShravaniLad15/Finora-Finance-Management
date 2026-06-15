
export function convertToPaise(amount: number) {
  return Math.round(amount*100);
}

export function convertToRupee(amount: number) {
  return amount / 100;
}

export function formatCurrency(amount: number){
  return new Intl.NumberFormat('en-IN',{
    style: 'currency',
    currency: 'INR',
  }).format(amount);
}