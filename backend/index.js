import 'dotenv/config';

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import appsRoutes from './routes/apps.js';
import oauthRoutes from './routes/oauth.js';
import shareRoutes from './routes/share.js';

const app = express();
app.use(cors());
app.use(bodyParser.json());

// routes
app.use('/api/auth', authRoutes);
app.use('/api/apps', appsRoutes);
app.use('/api/oauth', oauthRoutes);
app.use('/api/share', shareRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log(`Backend running on port ${PORT}`));
