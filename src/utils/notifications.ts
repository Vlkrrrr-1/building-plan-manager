export const notifications = {
  error: (message: string) => alert(message),
  success: (message: string) => alert(message),
  confirm: (message: string) => window.confirm(message),
};
