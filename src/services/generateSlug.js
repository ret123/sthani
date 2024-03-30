const slugify = require('slugify');

const generateSlug = (text) => {
    return slugify(text, {
        lower: true, // Convert to lowercase
        remove: /[*+~.()'"!:@]/g, // Remove special characters
    });
};

module.exports = generateSlug;