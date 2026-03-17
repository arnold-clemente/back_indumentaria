// Para respuestas de error
export interface ValidationError {
    field: string;
    message: string;
}

export interface ErrorResponse {
    success: boolean;
    message: string;
    errors?: ValidationError[];
    error?: string;
}