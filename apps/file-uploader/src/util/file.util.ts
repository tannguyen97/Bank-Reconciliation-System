
function getExtension(fileName: string) {
    return fileName?.split('.').pop().toLowerCase();
}

export {
    getExtension
}