import axios, { type AxiosInstance } from 'axios';
import { Hotel } from './hotel';
import { Reservas } from './reservas';
const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

const instance = axios.create({
    baseURL: 'http://localhost:5000',
    headers: {
        location: 'pt-br',
        'Content-Type': 'application/json',
    },
})

export class Api {
    constructor(private readonly http: AxiosInstance) { }

    get hotel() {
        return new Hotel(this.http)
    }

    get reservas() {
        return new Reservas(this.http);
    }
}

export default new Api(instance);