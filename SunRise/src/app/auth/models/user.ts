export class User {
    id: number;
    username: string;    // required
    password: string;    // required
    role: string;        // required
    token: string;       // required
    firstName: string;   // required
    lastName: string;    // required
    phone_number: string;// optional

    address: string;     // optional
}
