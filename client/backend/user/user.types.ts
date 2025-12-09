export type UserProfile = {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNum: string;
    description: string;
    avatarUrl: string | null;
    roles: string[];
};

export type ProfileUpdateRequest = {
    username: string;
    firstName: string;
    lastName: string;
    phoneNum: string;
    description?: string;
};