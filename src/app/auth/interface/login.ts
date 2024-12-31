export interface Login {
    user:  User;
    token: string;
}

export interface User {
    id:       number;
    rut:      string;
    name:     string;
    birthday: Date;
    email:    string;
    isActive: boolean;
    gender:   Gender;
    role:     Gender;
}

export interface Gender {
    id:   number;
    type: string;
}