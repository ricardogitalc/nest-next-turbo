interface Window {
  __USER_DATA__: {
    isLoggedIn: boolean;
    user: {
      id: number;
      name: string;
      email: string;
    } | null;
  } | null;
}
