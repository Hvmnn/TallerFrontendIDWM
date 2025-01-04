export interface Register {
    message: string;
    token: string;
    registerUser: RegisterUser;
}

export interface RegisterUser{
    rut: string;
    name: string;
    birthday: Date;
    Email: string;
    GenderId: number;
    password: string;
    confirmPassword: string;
}