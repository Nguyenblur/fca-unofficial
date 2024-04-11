const utils = require("../utils");
const log = require("npmlog");
const bluebird = require("bluebird");

const allowedProperties = {
    attachment: true,
    url: true,
    sticker: true,
    emoji: true,
    emojiSize: true,
    body: true
};

module.exports = (defaultFuncs, api, ctx) => {
    const uploadAttachmment = (attachments, callback) => {
        let upload = [];

        for (var i = 0; i < attachments.length; i++) {
            if (!utils.isReadableStream(attachments[i])) {
                throw {
                    error:
                        "Attachment should be a readable stream and not " +
                        utils.getType(attachments[i]) +
                        "."
                };
            }
        }
        const form = {
            upload_1024: attachments[i]
        };
        upload.push(
            defaultFuncs
                .postFormData(
                    "https://upload.facebook.com/ajax/mercury/upload.php",
                    ctx.jar,
                    form,
                    {}
                )
                .then(utils.parseAndCheckLogin(ctx, defaultFuncs).then((resData) => {}))
        );
    };
};