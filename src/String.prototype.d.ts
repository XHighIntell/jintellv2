interface String {
    /** Returns the string that between specified start and end string.
     * @param startWith The characters to be searched for at the start of this string.
     * @param endWith The characters to be searched for at the end of this string.
     * @param include If true, return value will include startWith & endwith, else do not include. Default is false. */
    between(startWith: string, endWith: string, include?: boolean): string;
}