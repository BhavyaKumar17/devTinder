export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  gender: string;
  phoneNumber: string;
  skills: string[];
  bio: string;
  imageUrl: string;
}

export type Gender = "female" | "male" | "others";
