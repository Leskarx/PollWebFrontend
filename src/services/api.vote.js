import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const submitVote = async (pollId, optionId) => {
  const res = await API.post("/vote", {
    pollId,
    optionId,
  });

  return res.data;
};
