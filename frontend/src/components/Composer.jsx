import { useState } from "react";
import {
  createPost,
  updatePost,
  updateComment,
  createPostComment,
} from "../api/postService.js";
import useAuth from "../hooks/useAuth.js";
import DOMPurify from "dompurify";
import {
  MDXEditor,
  BoldItalicUnderlineToggles,
  toolbarPlugin,
  CreateLink,
  linkDialogPlugin,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";

const MAX_POST_LENGTH = 5000;

function Composer({ onSubmit, onCancel, target, mode = "view" }) {
  const [postContent, setPostContent] = useState(target?.content || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const auth = useAuth();
  const isPost = mode === "createPost" || mode === "editPost";

  const handleContentChange = (content) => {
    if (content.length <= MAX_POST_LENGTH) {
      setPostContent(content);
    }
  };

  const handleCancel = () => {
    setPostContent("");
    onCancel();
    console.log("cancel");
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    const user = await auth.getUser();
    const sanitizedContent = DOMPurify.sanitize(postContent);
    setIsSubmitting(true);

    let response;

    try {
      switch (mode) {
        case "createPost":
          {
            const newPost = {
              user_id: user._id,
              content: sanitizedContent,
            };
            response = await createPost(newPost);
          }
          break;
        case "editPost":
          {
            const updatedPost = {
              content: sanitizedContent,
            };
            response = await updatePost(target._id, updatedPost);
          }
          break;
        case "createComment":
          {
            const newComment = {
              user_id: user._id,
              content: sanitizedContent,
            };
            response = await createPostComment(target._id, newComment);
          }
          break;
        case "editComment":
          {
            const updatedComment = {
              content: sanitizedContent,
            };
            response = await updateComment(
              target.post_id,
              target._id,
              updatedComment,
            );
          }
          break;
        default:
          break;
      }
      if (response.success !== false) {
        onSubmit();
        setPostContent("");
      }
    } catch (error) {
      console.error("Error submitting:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <style>
        {`
            .dark-editor {
          --baseBg:#374151;
          --baseTextContrast:#f9fafb;
          --baseBgActive: #6b7280;
        }

        .mdxeditor-toolbar  {
          display: none
      
        }

        .mdxeditor:focus-within .mdxeditor-toolbar {
          display: flex;
        }
        `}
      </style>

      <div
        className={`my-3 rounded-md ${mode !== "view" ? "p-4 dark:border dark:border-gray-700" : ""} dark:bg-gray-800`}
      >
        <MDXEditor
          markdown={postContent}
          onChange={handleContentChange}
          autoFocus={true}
          placeholder={mode !== "view" ? "Write something..." : ""}
          className={`dark-editor w-full rounded-md ${mode !== "view" ? "border border-gray-700" : ""} }`}
          readOnly={mode === "view"}
          plugins={
            isPost
              ? [
                  toolbarPlugin({
                    toolbarContents: () => (
                      <>
                        <BoldItalicUnderlineToggles />
                        <CreateLink />
                      </>
                    ),
                  }),
                  linkDialogPlugin(),
                ]
              : []
          }
        />

        {mode !== "view" && (
          <div className="mt-2 flex items-center justify-between gap-2">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`mt-2 w-full rounded-md bg-blue-500 p-2 text-sm font-medium text-white transition ${
                isSubmitting
                  ? "cursor-not-allowed opacity-70"
                  : "hover:bg-blue-600"
              }`}
            >
              {isSubmitting ? "Posting..." : "Post"}
            </button>
            {(mode === "editPost" || mode === "editComment") && (
              <button
                onClick={handleCancel}
                disabled={isSubmitting}
                className={`mt-2 w-full rounded-md bg-red-500 p-2 text-sm font-medium text-white transition hover:bg-red-700`}
              >
                Cancel
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default Composer;
