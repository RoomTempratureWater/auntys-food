const Minio = require('minio');
const dotenv = require('dotenv');
dotenv.config();

const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.MINIO_PORT || '9000'),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY || 'admin',
  secretKey: process.env.MINIO_SECRET_KEY || 'password123',
});

const BUCKET_NAME = process.env.MINIO_BUCKET_NAME || 'payments';

async function initMinio() {
  try {
    const exists = await minioClient.bucketExists(BUCKET_NAME);
    if (!exists) {
      await minioClient.makeBucket(BUCKET_NAME, 'us-east-1');
      console.log(`Bucket "${BUCKET_NAME}" created successfully.`);
    } else {
      console.log(`Bucket "${BUCKET_NAME}" already exists.`);
    }
  } catch (error) {
    console.error('Error initializing Minio:', error);
  }
}

module.exports = {
  minioClient,
  initMinio,
  BUCKET_NAME
};
