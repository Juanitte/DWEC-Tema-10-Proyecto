//  API
export const BASE_URL = "https://api.inkas.es";

export const AUTH_URL = "/gateway/users/authenticate";
export const USERS_URL = "/gateway/Users/users/";
export const POSTS_URL = "/gateway/posts/";
export const MESSAGES_URL = "/gateway/";

//  REGEX
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
export const USERNAME_REGEX = /^.{3,30}$/;
export const TAG_REGEX = /^@.{3,20}$/;

//  COLORS
export const BACKGROUND_COLOR = "#2b466d";

//  FILE LENGHT
export const MAX_FILE_SIZE = 104857600;