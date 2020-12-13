var express = require("express");
var router = express.Router();

const AWS = require("aws-sdk");
const account = require("../config/account");

const bucket = "nh-hack"; // the bucketname without s3://

/* GET home page. */
router.get("/", function(req, res, next) {
    res.render("index", { title: "Express" });
});

router.post("/userIdenty", function(req, res) {
    const { source, target } = req.body;

    const photo_source = `source/${source}`;
    const photo_target = `target/${target}`;

    console.log(typeof photo_source, typeof photo_target);

    console.log(photo_source, photo_target);

    AWS.config.loadFromPath(
        "/Users/seonuk/Desktop/nh/lambda/config/account.json"
    );

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
            console.log(err, err.stack); // an error occurred
            return res.json({ result: false });
        } else {
            response.FaceMatches.forEach(data => {
                let position = data.Face.BoundingBox;
                let similarity = data.Similarity;
                console.log(
                    `The face at: ${position.Left}, ${position.Top} matches with ${similarity} % confidence`
                );
                if (similarity > 90) {
                    return res.json({ result: true });
                }
                console.log(similarity);
                return res.json({ result: false });
            }); // for response.faceDetails
        } // if
    });
});
module.exports = router;
