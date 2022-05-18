import S3  from "aws-sdk/clients/s3";
import config from "../../config";
import fs from "fs";

const bucketName = config.auth.AWS_BUCKET_NAME;
const region = config.auth.AWS_BUCKET_REGION;
const accessKeyId = config.auth.AWS_ACCESS_KEY;
const secretAccessKey = config.auth.AWS_SECRET_KEY;

const s3 = new S3({
    region,
    accessKeyId,
    secretAccessKey
});

// upload image to s3

export function uploadFile(file){
    const fileStream = fs.createReadStream(file.path)

    const uploadParams = { 
        Bucket: bucketName,
        Body: fileStream,
        Key: file.filename
    }

    return s3.upload(uploadParams).promise()
}

exports.uploadFile = uploadFile
