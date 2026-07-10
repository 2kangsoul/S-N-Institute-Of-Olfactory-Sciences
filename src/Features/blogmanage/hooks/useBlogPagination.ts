import { useState } from "react";
import type { BlogItem } from "../types/blogManagerTypes";

export const useBlogPagination = (blogs: BlogItem[]) => {
  const [pendingPage, setPendingPage] = useState(1);
  const [publishedPage, setPublishedPage] = useState(1);

  const pendingBlogs = blogs.filter(
    (b) => b.approval === false || b.approval == null,
  );
  const publishedBlogs = blogs.filter((b) => b.approval === true);

  const totalPendingPages = Math.ceil(pendingBlogs.length / 5) || 1;
  const currentPending = pendingBlogs.slice(
    (pendingPage - 1) * 5,
    pendingPage * 5,
  );

  const totalPublishedPages = Math.ceil(publishedBlogs.length / 4) || 1;
  const currentPublished = publishedBlogs.slice(
    (publishedPage - 1) * 4,
    publishedPage * 4,
  );

  return {
    pendingPage,
    setPendingPage,
    publishedPage,
    setPublishedPage,
    currentPending,
    totalPendingPages,
    currentPublished,
    totalPublishedPages,
  };
};