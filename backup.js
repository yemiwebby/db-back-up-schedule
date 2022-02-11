require("dotenv").config();
const fs = require("fs");
const _ = require("lodash");
const exec = require("child_process").exec;
const path = require("path");

const {
  BlobServiceClient,
  StorageSharedKeyCredential,
} = require("@azure/storage-blob");

const backupDirPath = path.join(__dirname, "database-backup");
const MONGODB_URI = process.env.MONGODB_URI;

const storeFileOnAzure = async (file) => {
  const account = process.env.ACCOUNT_NAME;
  const accountKey = process.env.ACCOUNT_KEY;
  const containerName = "files";

  const sharedKeyCredential = new StorageSharedKeyCredential(
    account,
    accountKey
  );

  // instantiate Blob Client
  const blobServiceClient = new BlobServiceClient(
    `https://${account}.blob.core.windows.net`,
    sharedKeyCredential
  );

  const container = blobServiceClient.getContainerClient(containerName);
  const blobName = "backup.bson";

  const blockBlobClient = container.getBlockBlobClient(blobName);

  const uploadBlobResponse = await blockBlobClient.uploadFile(file);
  console.log(
    `Upload block blob ${blobName} successfully`,
    uploadBlobResponse.requestId
  );
};

let cmd = `mongodump --out=${backupDirPath} --uri=${process.env.MONGODB_URI}`;

const dbAutoBackUp = () => {
  let filePath = backupDirPath + `/companiesdb/companies.bson`;

  exec(cmd, (error, stdout, stderr) => {
    console.log([cmd, error, backupDirPath]);
    storeFileOnAzure(filePath);
  });
};

dbAutoBackUp();
