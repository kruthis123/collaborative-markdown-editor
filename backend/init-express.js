import express from 'express';
import cors from 'cors';
import { getFileContent, uploadFileContent } from './minio-client.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/file/:filename', async (req, res) => {
  try {
    const content = await getFileContent(req.params.filename);
    res.send(content);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching file');
  }
});

app.post('/file/:filename', async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    await uploadFileContent(req.params.filename, content);
    res.json({ success: true, message: 'File saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error saving file' });
  }
});

app.listen(process.env.EXPRESS_SERVER_PORT || 8001, () => {
  console.log('Express server running on port ' + (process.env.EXPRESS_SERVER_PORT || 8001));
});