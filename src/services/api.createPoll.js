import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const createPoll = async (pollData) => {
  const res = await API.post("/polls", {
    question: pollData.question,
    options: pollData.options,
  });

  const data = res.data;

  return {
    pollId: data.pollId,
    url: `${window.location.origin}/poll/${data.pollId}`,
  };
};
