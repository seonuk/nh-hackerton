var express = require("express");
var router = express.Router();

const AWS = require("aws-sdk");
const account = require("../config/account.js");

const bucket = "nh-hack"; // the bucketname without s3://

/* GET home page. */
router.get("/", function(req, res, next) {
    res.render("index", { title: "Express" });
});

router.post("/recognition", function(req, res) {
    const { source, target } = req.body;

    const photo_source = `source/${source}`;
    const photo_target = `target/${target}`;

    AWS.config.update({
        accessKeyId: account.accessKeyId,
        secretAccessKey: account.secretAccessKey,
        region: account.region
    });

    const client = new AWS.Rekognition();
    const params = {
        SourceImage: {
            S3Object: {
                Bucket: bucket,
                Name: photo_source
            }
        },
        TargetImage: {
            S3Object: {
                Bucket: bucket,
                Name: photo_target
            }
        },
        SimilarityThreshold: 0
    };
    client.compareFaces(params, function(err, response) {
        if (err) {
            return res.json({ result: false });
        } else {
            response.FaceMatches.forEach(data => {
                let position = data.Face.BoundingBox;
                let similarity = data.Similarity;

                if (similarity > 90) {
                    return res.json({ result: true });
                }
                return res.json({ result: false });
            }); // for response.faceDetails
        } // if
    });
});
module.exports = router;
