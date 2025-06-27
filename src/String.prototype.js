

if (String.prototype.between == null)
    String.prototype.between = function(startWith, endWith, include) {
        let startIndex = startWith == null ? 0 : this.indexOf(startWith);
        if (startIndex == -1) return null;

        let endIndex = endWith == null ? this.length : this.indexOf(endWith, startIndex + startWith?.length ?? 0);
        if (endIndex == -1) return null;

        if (include == true) return this.substring(startIndex, endIndex + (endWith?.length ?? 0));
        else return this.substring(startIndex + (startWith?.length ?? 0), endIndex);
    }
else {
    console.warn("String.prototype.between is already exists");
}