export interface HasValueParser<T> {
    /**
     * Return the parsed value, or null if the field is empty.
     *
     * @throws ParseException if the value cannot be parsed
     * @return {*}
     */
    getValueOrThrow(): T;
}
