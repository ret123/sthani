const formidable = require('formidable');

const formDataMiddleware = (req, res, next) => {
    if (req.headers['content-type'] && req.headers['content-type'].includes('multipart/form-data')) {
        const form = new formidable.IncomingForm({multiples: true});

        form.parse(req, (err, fields, files) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to parse form data' });
            }
            // console.log(fields)
            // console.log(files)
             const parsedFields = {};
            // for (const key in fields) {
            //     const formattedKey = key.replace(/\[(\w+)\]/g, '.$1'); // Convert keys like 'updatedData[name]' into 'updatedData.name'
            //     const keys = formattedKey.split('.');
            //     let target = parsedFields;
          
            //     keys.forEach((k, index) => {
            //       if (index === keys.length - 1) {
            //         target[k] = fields[key];
            //       } else {
            //         target[k] = target[k] || {};
            //         target = target[k];
            //       }
            //     });
            //   }
            const parsedData = {};
            for (const fieldName in fields) {
                // Split the field name by square brackets to extract keys
                const keys = fieldName.replace(/\]/g, '').split(/\[/).filter(Boolean);
                
                let target = parsedData;
                for (let i = 0; i < keys.length - 1; i++) {
                  const key = keys[i];
                  target[key] = target[key] || {};
                  target = target[key];
                }
          
                // Set the value in the parsed data object
                const lastKey = keys[keys.length - 1];
                target[lastKey] = fields[fieldName][0]; // Assuming single value for simplicity
              }
          
            //   console.log(parsedData);
             // Handle fields with multiple values
            //  const parsedFields = {};
            //  for (const key in fields) {
            //      if (fields.hasOwnProperty(key)) {
            //          if (Array.isArray(fields[key])) {
            //              parsedFields[key] = fields[key];
            //          } else {
            //              parsedFields[key] = [fields[key]];
            //          }
            //      }
            //  }
            //   Convert array fields to single value if necessary
            //   Object.keys(fields).forEach((key) => {
            //     if (Array.isArray(fields[key]) && fields[key].length === 1) {
            //         fields[key] = fields[key][0];
            //     }
            // });

            req.body = fields;
            req.files = files;
            next();
        });
    } else {
        next();
    }
};

module.exports = formDataMiddleware;