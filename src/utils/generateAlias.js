const generateUniqueAlias = (length = 8) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let alias = '';
    for (let i = 0; i < length; i++) {
        alias += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return alias + Date.now().toString(36);
};

module.exports = { generateUniqueAlias };
