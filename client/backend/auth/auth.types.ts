export type RegisterRequest = {
    username: string
    password: string
    email: string
}

export type LoginRequest = {
    email: string
    password: string
}
export type ActivateRequest = {
    urlToken: string,
    activateCode: string
}

export type LoginResponse = {
    accessToken: string
    expiresAt: number
    user: {
        id: string
        email: string
        username: string
        fullname: string
        avatarUrl: string | null
        roles: string[]
    }
}


export type RegisterResponse = {
    id: string
    email: string
    urlToken: string
    createdAt: string
}


export type RefreshResponse = LoginResponse