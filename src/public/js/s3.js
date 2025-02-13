import { Upload } from "@aws-sdk/lib-storage";
import { S3 } from "@aws-sdk/client-s3";
import fs from "fs";

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const s3 = new S3({
    region,

    credentials: {
        accessKeyId,
        secretAccessKey
    }
});

// upload image to s3

export function uploadFile(file){
    // console.log('file upload --> ',file)
    const fileStream = fs.createReadStream(file.path)

    const uploadParams = { 
        Bucket: bucketName,
        Body: fileStream,
        Key: file.filename
    }

    return new Upload({
        client: s3,
        params: uploadParams
    }).done();
}

exports.uploadFile = uploadFile
