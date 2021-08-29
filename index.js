const AWS = require("aws-sdk");

// TODO: in env variables
const config = {
    region: 'eu-central-1',
    accessKeyId: '',
    secretAccessKey: ''
}

const s3Stream = require("s3-upload-stream")(new AWS.S3(config));
const archiver = require("archiver");
const s3 = new AWS.S3(config);

exports.handler = function (data, context) {
    const archive = archiver("zip");

    const upload = s3Stream.upload({
        Bucket: data.outputBucket,
        Key: data.outputKey,
    });

    archive.pipe(upload);

    const allDonePromise = new Promise(function (resolveAllDone) {
        upload.on("uploaded", function (details) {
            resolveAllDone();
        });
    });

    allDonePromise.then(function () {
        context.done(null, "success");
    });

    const addKey = (itemKey) => {
        itemKey = decodeURIComponent(itemKey).replace(/\+/g, " ");
        const getPromise = new Promise(function(resolveGet) {
            s3.getObject(
                {
                    Bucket: data.bucket,
                    Key: itemKey,
                },
                function (err, data) {
                    if (err) {
                        resolveGet();
                    } else {
                        const itemName = itemKey;
                        archive.append(data.Body, { name: itemName });
                        resolveGet();
                    }
                }
            );
        });
        getObjectPromises.push(getPromise);
    };

    const getObjectPromises = [];
    for (const i in data.keys) {
        addKey(data.keys[i]);
    }

    Promise.all(getObjectPromises).then(function () {
        archive.finalize();
    });
};
