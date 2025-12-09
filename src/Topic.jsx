// src/Topic.jsx
import { PlayIcon, EyeIcon, EyeSlashIcon, CheckCircleIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import clsx from "clsx";

export default function TopicQuestionTable({
  section,
  completed,
  toggleComplete,
  getDifficultyColor,
  theme,
}) {
  const total = section.questions.length;
  const done = section.questions.filter((_, idx) => completed[`${section.topic}-${idx}`]).length;
  const [show, setShow] = useState(false);
  const isDark = theme === "dark";

  return (
    <div
      className={clsx(
        "rounded-2xl p-6 transition-all duration-300 shadow-md",
        show && (isDark ? "ring-1 ring-blue-400/40" : "ring-1 ring-gray-300/40"),
        isDark
          ? "bg-[#1e293b] text-gray-200 shadow-[0_0_15px_rgba(0,0,0,0.5)]"
          : "bg-[#f9fafb] text-gray-800 shadow-sm"
      )}
    >
      <div className="flex justify-between items-center mb-3">
        <div>
          <h2
            className={clsx(
              "text-lg font-semibold flex items-center gap-2",
              isDark ? "text-gray-100" : "text-gray-900"
            )}
          >
            {section.topic}
            {done === total && <CheckCircleIcon className="w-5 h-5 text-blue-500" />}
          </h2>
          <p className={clsx("text-sm", isDark ? "text-gray-400" : "text-gray-600")}>
            {done}/{total} completed
          </p>
        </div>

        <button
          onClick={() => setShow(!show)}
          className={clsx(
            "flex items-center justify-center p-2 rounded-full transition",
            isDark ? "hover:bg-slate-700 text-gray-300" : "hover:bg-gray-200 text-gray-600"
          )}
        >
          {show ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
        </button>
      </div>

      {/* Progress bar */}
      <div
        className={clsx(
          "w-full rounded-full h-2.5 mb-3 overflow-hidden",
          isDark ? "bg-slate-700" : "bg-gray-300"
        )}
      >
        <div
          className="h-2.5 rounded-full transition-all duration-500 ease-out bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700"
          style={{ width: `${(done / total) * 100}%` }}
        ></div>
      </div>

      {/* Table */}
      {show && (
        <div className="overflow-x-auto mt-3">
          <table
            className={clsx(
              "min-w-full border-collapse text-sm rounded-lg overflow-hidden",
              isDark ? "bg-[#1e293b]" : "bg-[#f9fafb]"
            )}
          >
            <thead>
              <tr
                className={clsx(
                  "border-b text-left",
                  isDark
                    ? "bg-slate-800 border-slate-700 text-gray-300"
                    : "bg-gray-200 border-gray-300 text-gray-700"
                )}
              >
                <th className="w-[8%] px-4 py-2 font-medium">Done</th>
                <th className="w-[55%] px-4 py-2 font-medium">Question</th>
                <th className="w-[20%] px-4 py-2 font-medium text-center">Difficulty</th>
                <th className="w-[17%] px-4 py-2 font-medium text-center">YouTube</th>
              </tr>
            </thead>
            <tbody>
              {section.questions.map((q, idx) => (
                <tr
                  key={idx}
                  className={clsx(
                    "border-b transition duration-200",
                    isDark
                      ? "border-slate-700 hover:bg-slate-800"
                      : "border-gray-200 hover:bg-gray-100"
                  )}
                >
                  <td className="px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={!!completed[`${section.topic}-${idx}`]}
                      onChange={() => toggleComplete(section.topic, idx)}
                      className="cursor-pointer w-4 h-4 accent-blue-500"
                    />
                  </td>
                  <td className="px-4 py-2 truncate">
                    <a
                      href={q.leetcode}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={clsx(
                        "font-medium hover:underline",
                        isDark ? "text-blue-400" : "text-blue-600"
                      )}
                    >
                      {q.name}
                    </a>
                  </td>
                  <td
                    className={clsx(
                      "px-4 py-2 font-medium text-center rounded-md",
                      getDifficultyColor(q.difficulty)
                    )}
                  >
                    {q.difficulty}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <a
                      href={q.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={clsx(
                        "inline-flex items-center justify-center transition",
                        isDark
                          ? "text-blue-400 hover:text-blue-500"
                          : "text-blue-600 hover:text-blue-700"
                      )}
                    >
                      <PlayIcon className="w-5 h-5" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
