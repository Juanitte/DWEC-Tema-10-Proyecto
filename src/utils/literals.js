//  API
export const AUTH_URL = "https://localhost:7058/gateway/users/authenticate";
export const USERS_URL = "https://localhost:7058/gateway/Users/users/";
export const POSTS_URL = "https://localhost:7058/gateway/posts/";

//  REGEX
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
export const USERNAME_REGEX = /^.{3,30}$/;
export const TAG_REGEX = /^@.{3,20}$/;

//  COLORS
export const BACKGROUND_COLOR = "#2b466d";