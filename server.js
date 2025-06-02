import express from 'express';
import cors from 'cors';
import * as api from './api.js'; 

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('GitViz Backend is running ✅');
});


app.get('/api/user/:username', async (req, res) => {
  try{
    const data = await api.getUser(req.params.username);
    res.json(data);
  } 
  catch(error){
    res.status(error.response?.status || 500).json({ message: error.message });
  }
});

app.get('/api/user/:username/repos', async (req, res) => {
  try{
    const data = await api.getUserRepositories(req.params.username);
    res.json(data);
  } 
  catch(error){
    res.status(error.response?.status || 500).json({ message: error.message });
  }
});

app.get('/api/user/:username/starred', async (req, res) => {
  try{
    const data = await api.getUserStarredRepos(req.params.username);
    res.json(data);
  } 
  catch(error){
    res.status(error.response?.status || 500).json({ message: error.message });
  }
});

app.get('/api/repos/:owner/:repo/tree', async (req, res) => {
  try{
    const branch = req.query.branch;
    const data = await api.getRepositoryTree(req.params.owner, req.params.repo, branch);
    res.json(data);
  } 
  catch(error){
    res.status(error.response?.status || 500).json({ message: error.message });
  }
});

app.get('/api/repos/:owner/:repo/languages', async (req, res) => {
  try{
    const data = await api.getRepositoryLanguages(req.params.owner, req.params.repo);
    res.json(data);
  } 
  catch(error){
    res.status(error.response?.status || 500).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
