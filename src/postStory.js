"use strict";

const utils = require("../utils");
const log = require("npmlog");
const bluebird = require("bluebird");

module.exports = (defaultFuncs, api, ctx) => {
    return function requestPost(content, callback) {
        let resolveFunc, rejectFunc;
        const returnPromise = new Promise((resolve, reject) => {
            resolveFunc = resolve;
            rejectFunc = reject;
        });
        if(utils.getType(content) ==="Function"){
        	callback = content;
        	content=null;
        }
        const variable = {
            input: {
                audiences: [
                    {
                        stories: {
                            self: {
                                target_id: ctx.userID
                            }
                        }
                    }
                ],
                audiences_is_complete: true,
                logging: {
                    composer_session_id: utils.generateSessionID()
                },
                source: "WWW",
                message: {
                    ranges: [],
                    text: content
                },
                text_format_metadata: {
                    inspirations_custom_font_id: 233490655168261
                },
                text_format_preset_id: 401372137331149,
                tracking: [null],
                actor_id: ctx.userID,
                client_mutation_id: Math.round(Math.random() * 19)
            }
        };
        const dataFrom = {
            fb_api_req_friendly_name: "StoriesCreateMutation",
            fb_api_caller_class: "RelayModern",
            doc_id: "6197602830367217",
            variables: JSON.stringify(variable),
            av: ctx.userID
        };

        defaultFuncs
            .post("https://www.facebook.com/api/graphql/", ctx.jar, dataFrom)
            .then(utils.parseAndCheckLogin(ctx, defaultFuncs))
            .then(resData => {
                if (resData.errors) {
                    throw resData;
                }
                return callback();
            })
            .catch(err => {
                log.error("createStory", err);
                return callback(err);
            });

        return returnPromise;
    };
};