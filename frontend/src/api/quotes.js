import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api",
});

export const getQuotes = () => API.get("/quotes");

export const getQuote = (id) => API.get(`/quotes/${id}`);

export const createQuote = (data) => API.post("/quotes", data);

export const updateQuote = (id, data) =>
    API.put(`/quotes/${id}`, data);

export const deleteQuote = (id) =>
    API.delete(`/quotes/${id}`);