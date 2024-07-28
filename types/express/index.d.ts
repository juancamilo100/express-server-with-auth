declare namespace Express {
    interface Request {
        userId: number | undefined,
        role: string | undefined
    }
}