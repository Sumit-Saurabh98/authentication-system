

export type SockerUser ={
    userId: string,
    socketId: string,
    profile: {
        id: string
        name?: string
        email: string
        emailVerified?: Date
        image?: string
        password?: string
        role?: string
        isTwoFactorEnabled?: boolean
      }
}