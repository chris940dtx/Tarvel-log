import React, { useState } from "react";
import { useForm } from "react-hook-form";

import { createLogEntry } from "./API";

const LogEntryForm = ({ location, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      data.latitude = location.latitude;
      data.longitude = location.longitude;
      await createLogEntry(data);

      onClose();
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="entry-form">
      {error ? <h3 className="error">{error}</h3> : null}
      <label htmlFor="title">Title</label>
      <input {...register("title")} required />
      <label htmlFor="comments">comments</label>
      <textarea {...register("comments")} rows={3}></textarea>
      <label htmlFor="description">Description</label>
      <textarea {...register("description")} rows={3}></textarea>
      <label htmlFor="image">Image</label>
      <input {...register("image")} />
      <label htmlFor="visitDate">Visit Date</label>
      <input {...register("visitDate")} type="date" required />
      <button disabled={loading}>
        {loading ? "loading..." : "Create Entry"}
      </button>
    </form>
  );
};

export default LogEntryForm;
