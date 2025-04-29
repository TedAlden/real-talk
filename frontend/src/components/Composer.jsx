import { useEffect, useState } from "react";
import {
  createPost,
  updatePost,
  updateComment,
  createPostComment,
} from "../api/postService.js";
import useAuth from "../hooks/useAuth.js";
import DOMPurify from "dompurify";
import { convertImageBase64 } from "../util/image.js";
import {
  FileInput,
  Modal,
  Carousel,
  ModalBody,
  ModalHeader,
  createTheme,
} from "flowbite-react";
import {
  MDXEditor,
  BoldItalicUnderlineToggles,
  toolbarPlugin,
  CreateLink,
  linkDialogPlugin,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { decode } from "html-entities";
import { FaImages } from "react-icons/fa6";
const stripMarkdown = (md) => {
  return (
    md
      // links: [text](url) → text
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      // bold: **text** or __text__ → text
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/__(.*?)__/g, "$1")
      // italic: *text* or _text_ → text
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/_(.*?)_/g, "$1")
      // underline (HTML): <u>text</u> → text
      .replace(/<u>(.*?)<\/u>/gi, "$1")
      .trim()
  );
};

const hashtagsToLinks = (content) => {
  const tags = [];
  const decodedContent = decode(content);
  const fixedLeadingHashtag = decodedContent.replace(/\\#/g, "#");
  const processedContent = fixedLeadingHashtag.replace(
    /#(\w+)/g,
    (match, tag) => {
      tags.push(tag.toLowerCase());
      return `[${match}](/search?q=%23${tag})`;
    },
  );

  return { processedContent, tags };
};

const linksToHashtags = (content) => {
  return content.replace(/\[#(\w+)\]\(\/[^)]+\)/g, "#$1");
};

function Composer({ onSubmit, onCancel, target, mode }) {
  const [content, setContent] = useState(() => {
    const initialContent = target?.content || "";
    switch (mode) {
      case "createComment":
        return "";
      case "editPost":
      case "editComment":
        return linksToHashtags(initialContent);
      default:
        return initialContent;
    }
  });
  const [prevContent, setPrevContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [media, setMedia] = useState([]);
  const [resetKey, setResetKey] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const auth = useAuth();
  const isPost = mode === "createPost" || mode === "editPost";

  const MAX_POST_LENGTH = 5000;

  const handleContentChange = (content) => {
    const visibleLength = stripMarkdown(content).length;
    if (visibleLength <= MAX_POST_LENGTH) {
      setContent(content);
    }
  };

  const handleCancel = () => {
    setContent(prevContent);
    onCancel();
    setResetKey((prevKey) => prevKey + 1);
  };

  const handleMediaChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) {
      console.error("No files selected");
      return;
    }
    const totalSize = files.reduce((acc, file) => acc + file.size, 0);
    if (totalSize > 10 * 1024 * 1024) {
      return console.error("Total file size exceeds 10MB");
    }
    if (files.some((file) => file.size > 2 * 1024 * 1024)) {
      return console.error("File size exceeds 2MB");
    }
    if (
      files.some(
        (file) => !["image/jpeg", "image/png", "image/gif"].includes(file.type),
      )
    ) {
      return console.error("Invalid file type");
    }
    const base64Images = await Promise.all(
      files.map((file) => convertImageBase64(file)),
    );

    setMedia(base64Images);
  };

  useEffect(() => {
    if (mode === "editPost" || mode === "editComment") {
      const plainContent = linksToHashtags(target?.content || "");
      setPrevContent(plainContent);
    }
  }, [mode, target?.content]);

  const handleSubmit = async () => {
    if (isSubmitting) return;

    const user = await auth.getUser();

    const { processedContent, tags } = hashtagsToLinks(content);
    const sanitizedContent = DOMPurify.sanitize(processedContent);
    setIsSubmitting(true);
    let response;

    try {
      switch (mode) {
        case "createPost":
          {
            const newPost = {
              userId: user._id,
              content: sanitizedContent,
              media: media,
              tags: tags,
            };
            response = await createPost(newPost);
          }
          break;
        case "editPost":
          {
            const updatedPost = {
              content: sanitizedContent,
              tags: tags,
            };
            response = await updatePost(target._id, updatedPost);
          }
          break;
        case "createComment":
          {
            const newComment = {
              userId: user._id,
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
              target.comment_id,
              updatedComment,
            );
          }
          break;
        default:
          break;
      }
      if (response.success !== false) {
        onSubmit(sanitizedContent);

        if (mode === "createPost" || mode === "createComment") {
          setContent("");
        }
        console.log("Post submitted successfully:", content);
        setResetKey((prevKey) => prevKey + 1);
      } else {
        console.error("Error submitting:", response.error);
      }
    } catch (error) {
      console.error("Error submitting:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const carouselTheme = createTheme({
    indicators: {
      active: {
        off: "bg-white/50 hover:bg-white shadow-lg dark:bg-gray-200/50 dark:hover:bg-gray-200",
        on: "bg-white dark:bg-gray-200 shadow-lg ",
      },
      base: "h-3 w-3 rounded-full",
      wrapper: "absolute bottom-5 left-1/2 flex -translate-x-1/2 space-x-3",
    },
    control: {
      base: "inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/30 group-hover:bg-white/50 group-focus:outline-none group-focus:ring-4 group-focus:ring-white sm:h-10 sm:w-10 dark:bg-gray-300/30 dark:group-hover:bg-gray-300/60 dark:group-focus:ring-gray-300/70",
      icon: "h-5 w-5 text-white sm:h-6 sm:w-6 dark:text-gray-100",
    },
  });

  return (
    <>
      <style>
        {`
          .mdxeditor {
            --baseTextContrast: #374151;
            --baseBg: none;
            --baseBgActive: #94a3b8;
          }

          .dark  .mdxeditor {
            --baseTextContrast: #cbd5e1;
            --baseBgActive: #374151;
         
          }
          
          .mdxeditor-toolbar {
            padding: 0.2rem 0rem 0rem 0rem; 
          }

          .indicators: {
        }
     

    .mdxeditor [data-lexical-editor="true"] [contenteditable="false"],
    .mdxeditor [data-lexical-editor="true"][contenteditable="false"] {
      padding: 0 !important;
      background-color: transparent;
    }

        `}
      </style>

      <div data-testid="composer" className={`my-3`}>
        <MDXEditor
          key={resetKey}
          markdown={content}
          onChange={handleContentChange}
          autoFocus={true}
          placeholder="Write something..."
          className="w-full rounded-md border border-gray-700"
          plugins={
            isPost
              ? [
                  toolbarPlugin({
                    toolbarContents: () => (
                      <>
                        <BoldItalicUnderlineToggles />
                        <CreateLink />
                        <button
                          className="rounded-sm p-1.5 text-gray-500 hover:bg-gray-700"
                          onClick={() => setOpenModal(true)}
                        >
                          <FaImages />
                        </button>
                        <p className="text-gray-400">
                          {media.length > 0 ? `${media.length} images` : ""}
                        </p>
                      </>
                    ),
                  }),
                  linkDialogPlugin(),
                ]
              : []
          }
        />

        <div className="flex w-full items-start justify-between p-1">
          <div className="ml-1 text-right text-xs text-gray-500">
            {stripMarkdown(content).length}/{MAX_POST_LENGTH}
          </div>
          <div className="w-50 mt-1 flex items-center justify-end gap-2">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`w-24 rounded-md bg-blue-500 p-2 text-sm font-medium text-white transition ${
                isSubmitting
                  ? "cursor-not-allowed opacity-70"
                  : "hover:bg-blue-600"
              }`}
            >
              {isPost ? "Post" : "Comment"}
            </button>
            {(mode === "editPost" || mode === "editComment") && (
              <button
                onClick={handleCancel}
                disabled={isSubmitting}
                className={`w-24 rounded-md bg-red-500 p-2 text-sm font-medium text-white transition hover:bg-red-700`}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <ModalHeader>Upload Images</ModalHeader>
        <ModalBody>
          <div className="flex w-full flex-col items-start justify-between p-1">
            <FileInput
              multiple
              id="file-upload"
              accept="image/*"
              className="mb-2 w-full"
              onChange={handleMediaChange}
            />

            {media.length > 0 && (
              <Carousel
                theme={carouselTheme}
                slide={false}
                className="mt-2 h-96 items-start"
              >
                {media.map((image, idx) => (
                  <img
                    key={idx}
                    src={image}
                    className="h-4/5 w-3/4 bg-gray-900 object-contain p-2"
                  />
                ))}
              </Carousel>
            )}
          </div>
        </ModalBody>
      </Modal>
    </>
  );
}

export default Composer;
