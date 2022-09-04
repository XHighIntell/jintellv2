

!function() {

    if (String.prototype.between == null)
        String.prototype.between = function(startWith, endWith, include) {
            var index_start = this.indexOf(startWith);
            if (index_start == -1) return null;

            var index_end = this.indexOf(endWith, index_start + startWith.length);
            if (index_end == -1) return null;

            if (include == true)
                return this.substring(index_start, index_end + endWith.length);
            else
                return this.substring(index_start + startWith.length, index_end);
        }
    else {
        console.warn("String.prototype.between is already exists");
    }
}();



