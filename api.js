// api.js - GitHub API interaction (Backend)

import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.GITHUB_TOKEN) {
  console.error('❌ GITHUB_TOKEN is not defined in your .env file');
  process.exit(1);
}

const api = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Accept: 'application/vnd.github.v3+json',
    Authorization: `token ${process.env.GITHUB_TOKEN}`,
  },
});

const handleGitHubError = (error) => {
  if(error.response?.status === 403){
    const resetTime = new Date(error.response.headers['x-ratelimit-reset'] * 1000);
    error.message = `GitHub API rate limit exceeded. Try again at: ${resetTime.toLocaleTimeString()}`;
  } 
  else if(error.response?.status === 401){
    error.message = 'Unauthorized: Invalid or missing GitHub token.';
  } 
  else if(error.response?.status === 404){
    error.message = 'Resource not found on GitHub.';
  }
  return Promise.reject(error);
};

export const getRepositoryTree = async (owner, repo, branch) => {
  try{
    if(!branch){
      const repoInfo = await api.get(`/repos/${owner}/${repo}`);
      branch = repoInfo.data.default_branch;
    }
    const response = await api.get(`/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`);
    return response.data;
  } 
  catch(error){
    return handleGitHubError(error);
  }
};

export const getUser = async (username) => {
  try{
    const response = await api.get(`/users/${username}`);
    return response.data;
  } 
  catch(error){
    return handleGitHubError(error);
  }
};

export const getUserRepositories = async (username) => {
  try{
    const response = await api.get(`/users/${username}/repos`, {
      params: { per_page: 100, sort: 'updated' },
    });
    return response.data;
  } 
  catch(error){
    return handleGitHubError(error);
  }
};

export const getRepositoryLanguages = async (owner, repo) => {
  try{
    const response = await api.get(`/repos/${owner}/${repo}/languages`);
    return response.data;
  } 
  catch(error){
    return handleGitHubError(error);
  }
};

export const getUserStarredRepos = async (username) => {
  try{
    const response = await api.get(`/users/${username}/starred`, {
      params: { per_page: 100 },
    });
    return response.data;
  } 
  catch(error){
    return handleGitHubError(error);
  }
};

export default api;
