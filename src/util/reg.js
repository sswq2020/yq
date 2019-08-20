// 手机号验证
export const mobileValidation = mobile => {
  const mobileReg = /^1\d{10}$/g; 
  return mobileReg.test(mobile);
}

// 联系电话验证
export const phoneValidation = phone => {
  const phoneReg = /(^1\d{10}$)|(^0\d{2,3}-\d{7,8}$)|(^0\d{2,3}\d{7,8}$)/g;
  return phoneReg.test(phone);
};
