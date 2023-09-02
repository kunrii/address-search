const checkValid = (...args) => {

    const regex = /[^a-zA-Z0-9 -]/;

    const allValid = args.every((str) => {
        if (str === "" || regex.test(str)) {
            return false;
        }
        return true;
    });

    return allValid
}

export { checkValid }