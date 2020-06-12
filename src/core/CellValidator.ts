export interface CellValidator<T, M> {
    /**
     * @param {*} t model object
     * @param {*} m value that should be validated
     * @throws CellValidationException if there were a validation errors
     */
    validate(m: M, t: T):void;
}


