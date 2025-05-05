import React from "react";
import { useState } from "react";
import { Card, Dropdown, Spinner } from "flowbite-react";
import { useQuery } from "@tanstack/react-query";
import { getTrendingTags } from "../api/postService.js";

export default function Trending() {
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

  const cardStyle =
    "p-6 bg-white rounded-md shadow dark:border dark:border-gray-700 dark:bg-gray-800";
  return (
    <div
      className={`${cardStyle} mb-5 h-fit w-full text-gray-900 shadow-sm dark:text-white`}
    >
      <div className="xs:flex-col flex w-full flex-row items-center justify-between">
        <h1 className="text-xl font-bold">Trending</h1>
        <Dropdown
          className="text-md"
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
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {tags.map((tag, idx) => (
              <li key={idx} className="py-3 sm:py-4">
                <div className="flex items-center justify-start gap-6">
                  <span className="text-xl font-normal">{idx + 1}. </span>
                  <div className="flex flex-col">
                    <a
                      href={`/search?tag=${tag.name}`}
                      className="rounded-lg text-lg font-semibold text-blue-950 dark:text-blue-100"
                    >
                      {tag.name}
                    </a>
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
    </div>
  );
}
