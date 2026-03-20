const Minio = require('minio');
const fs = require('node:fs');
const path = require('node:path');
require('dotenv').config({ path: path.join(__dirname, '../..', '.env') });

const minioClient = new Minio.Client({
    endPoint: process.env.MINIO_ENDPOINT || 'localhost',
    port: Number.parseInt(process.env.MINIO_PORT || '9000'),
    useSSL: false,
    accessKey: process.env.MINIO_ROOT_USER || 'minioadmin',
    secretKey: process.env.MINIO_ROOT_PASSWORD || 'minioadmin',
});

const BUCKET_NAME = 'markdown-files';
const SAMPLE_FILES_DIR = path.join(__dirname, '..', 'sample-md-files');

async function setupMinIO() {
    try {
        console.log('Checking if bucket exists...');
        const bucketExists = await minioClient.bucketExists(BUCKET_NAME);
        
        if (!bucketExists) {
            console.log(`Bucket "${BUCKET_NAME}" does not exist. Creating...`);
            await minioClient.makeBucket(BUCKET_NAME, 'us-east-1');
            console.log(`✓ Bucket "${BUCKET_NAME}" created successfully`);
        } else {
            console.log(`✓ Bucket "${BUCKET_NAME}" already exists`);
        }

        console.log('\nUploading sample files...');
        
        if (!fs.existsSync(SAMPLE_FILES_DIR)) {
            console.log(`Directory ${SAMPLE_FILES_DIR} does not exist. Creating it...`);
            fs.mkdirSync(SAMPLE_FILES_DIR, { recursive: true });
            console.log('No sample files to upload.');
            return;
        }

        const files = fs.readdirSync(SAMPLE_FILES_DIR);
        
        if (files.length === 0) {
            console.log('No sample files found to upload.');
            return;
        }

        for (const file of files) {
            const filePath = path.join(SAMPLE_FILES_DIR, file);
            const stats = fs.statSync(filePath);
            
            if (stats.isFile()) {
                console.log(`Uploading ${file}...`);
                await minioClient.fPutObject(
                    BUCKET_NAME,
                    file,
                    filePath,
                    {
                        'Content-Type': 'text/markdown',
                    }
                );
                console.log(`✓ ${file} uploaded successfully`);
            }
        }

        console.log('\n✅ MinIO setup completed successfully!');
    } catch (error) {
        console.error('❌ Error during MinIO setup:', error);
        process.exit(1);
    }
}

setupMinIO();
