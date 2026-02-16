import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const fetchPoll = async (pollId) => {
  const res = await API.get(`/polls/${pollId}`);
  return res.data;
};
