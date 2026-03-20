import * as Minio from 'minio';

const BUCKET_NAME = 'markdown-files';

const minioClient = new Minio.Client({
    endPoint: 'localhost',
    port: 9000,
    useSSL: false,
    accessKey: process.env.MINIO_ROOT_USER || 'minioadmin',
    secretKey: process.env.MINIO_ROOT_PASSWORD || 'minioadmin',
});

export async function getFileContent(object) {
  const stream = await minioClient.getObject(BUCKET_NAME, object);
  const chunks = [];

  return new Promise((resolve, reject) => {
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('error', (err) => reject(err));
    stream.on('end', () => {
      const content = Buffer.concat(chunks).toString('utf-8');
      resolve(content);
    });
  });
}

export async function uploadFileContent(objectName, content) {
  const buffer = Buffer.from(content, 'utf-8');
  
  await new Promise((resolve, reject) => {
    minioClient.putObject(BUCKET_NAME, objectName, buffer, buffer.length, {
      'Content-Type': 'text/markdown'
    }, (err, etag) => {
      if (err) {
        reject(err);
      } else {
        resolve(etag);
      }
    });
  });
  console.log(await getFileContent(objectName));
}