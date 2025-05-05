import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, Dropdown, Spinner } from "flowbite-react";
import { useQuery } from "@tanstack/react-query";
import { getTrendingTags } from "../api/postService.js";

export default function Trending({ className = "" }) {
  const [period, setPeriod] = useState("daily");
  const periodOptions = [
    { key: "daily", label: "Today" },
    { key: "weekly", label: "This Week" },
    { key: "monthly", label: "This Month" },
  ];
  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["trending-tags", period],
    queryFn: () => getTrendingTags(period),
    staleTime: 1000,
  });

  const tags = response?.data;

  return (
    <Card className={`mb-5 h-fit text-gray-900 dark:text-white ${className}`}>
      <div className="text-md flex w-full flex-row items-center justify-between">
        <h1 className="text-xl font-bold">Trending</h1>
        <Dropdown
          className=""
          inline
          label={
            periodOptions.find((option) => option.key === period)?.label ||
            "Select period"
          }
        >
          {periodOptions.map((option) => (
            <Dropdown.Item
              key={option.key}
              onClick={() => setPeriod(option.key)}
            >
              {option.label}
            </Dropdown.Item>
          ))}
        </Dropdown>
      </div>
      <div className="flex flow-root flex-col p-4">
        {isLoading && (
          <div className="flex items-center justify-center">
            <Spinner aria-label="Loading" />
          </div>
        )}
        {error && (
          <div className="flex items-center justify-center bg-red-200 dark:bg-red-800">
            <p className="text-red-500 dark:text-red-200">
              Error fetching tags: {error.message}
            </p>
          </div>
        )}

        {!isLoading && !error && tags?.length > 0 ? (
          <ul className="gap-6">
            {tags.map((tag, idx) => (
              <li key={idx} className="py-3 sm:py-4">
                <div className="flex items-center justify-start gap-6">
                  <span className="text-xl font-normal">{idx + 1}. </span>
                  <div className="flex flex-col">
                    <Link
                      to={`/search?q=%23${tag.name}`}
                      className="rounded-lg text-lg font-semibold text-blue-950 dark:text-blue-100"
                    >
                      {tag.name}
                    </Link>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {tag.postCount} posts
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No trending tags.</p>
        )}
      </div>
    </Card>
  );
}
