import { ENUMS } from '@Constants/index';

export const updateUserKeys = (key: string, value: string) => {
  let user: any = JSON.parse(localStorage.getItem(ENUMS.userData) || '{}');
  user = { ...user, airTable: { ...user.airTable, [key]: value } };
  localStorage.setItem(ENUMS.userData, JSON.stringify(user));
};
