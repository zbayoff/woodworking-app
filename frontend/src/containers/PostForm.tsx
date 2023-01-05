import MDEditor from "@uiw/react-md-editor";
import "@github/markdown-toolbar-element";
import axios from "axios";
import { useRef, useState } from "react";
import { Form, FormMethod } from "react-router-dom";
import { PostType } from "../api/posts";
import { Toolbar } from "../components/Toolbar";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "markdown-toolbar": any;
      "md-bold": any;
      "md-header": any;
      "md-italic": any;
      "md-quote": any;
      "md-code": any;
      "md-link": any;
      "md-image": any;
      "md-unordered-list": any;
      "md-ordered-list": any;
      "md-task-list": any;
      "md-mention": any;
      "md-ref": any;
    }
  }
}

interface PostFormProps {
  method: FormMethod;
  action?: string;
  selectedPost?: PostType;
}

const INPUT_CLASS_NAME =
  "mt-0 block w-full px-0.5 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-black";

export const PostForm = ({ method, action, selectedPost }: PostFormProps) => {
  const myTextAreaRef = useRef<HTMLTextAreaElement>(null);

  const [uploadingImageLoading, setUploadingImageLoading] = useState(false);
  const [textAreaText, setTextAreaText] = useState<string | undefined>(
    selectedPost?.content
  );

  const insertAtCursor = (
    myField: HTMLTextAreaElement | null,
    myValue: string
  ) => {
    if (
      (myField && myField.selectionStart) ||
      (myField && myField.selectionStart === 0)
    ) {
      const startPos = myField.selectionStart;
      const endPos = myField.selectionEnd;

      myField.value =
        myField.value.substring(0, startPos) +
        myValue +
        myField.value.substring(endPos, myField.value.length);
      myField.selectionStart = startPos + myValue.length;
      myField.selectionEnd = startPos + myValue.length;
    }
  };

  const onHandleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    // set loading to true
    setUploadingImageLoading(true);
    const myImageText = "[uploading image...](/placeholder)";
    insertAtCursor(myTextAreaRef.current, "[uploading image...](/placeholder)");

    // upload file to s3, get back final image file name, and input in textaread element at cursor position
    const fileList = event.target.files;
    const myField = myTextAreaRef.current;

    if (fileList) {
      const file = fileList[0];

      const formData = new FormData();
      formData.append("image", file);

      try {
        const res = await axios({
          url: "/api/upload",
          method: "post",
          data: formData,
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (myField) {
          const uploadedFilename: string = res.data;
          const myValue = `![${file.name}](${uploadedFilename})`;
          myField.value = myField.value.replace(myImageText, myValue);
          setTextAreaText(myTextAreaRef?.current?.value);

          setUploadingImageLoading(false);
        }
      } catch (e) {
        setUploadingImageLoading(false);
        if (myField) {
          myField.value = myField.value.replace(myImageText, "");
        }
        console.log("error: ", e);
      }
    }
  };

  return (
    <div>
      <Form className="flex flex-col" method={method} action={action}>
        <input
          className={INPUT_CLASS_NAME}
          type={"text"}
          placeholder={"title"}
          name="title"
          defaultValue={selectedPost?.title}
        />
        <input
          className={INPUT_CLASS_NAME}
          type={"text"}
          placeholder={"description"}
          name="description"
          defaultValue={selectedPost?.description}
        />
        <input
          className={INPUT_CLASS_NAME}
          type={"text"}
          placeholder={"category"}
          name="categories"
          defaultValue={selectedPost?.categories
            .map((category) => {
              return category.name;
            })
            .join(",")}
        />
        <div className="ml-auto mt-2"><Toolbar /></div>
        
       

        <textarea
          id="textarea_id"
          ref={myTextAreaRef}
          onChange={() => {
            setTextAreaText(myTextAreaRef?.current?.value);
          }}
          rows={10}
          style={{ whiteSpace: "pre-wrap" }}
          placeholder={"content"}
          name="content"
          className={INPUT_CLASS_NAME}
          defaultValue={selectedPost?.content}
        />
        <input type={"submit"}></input>
      </Form>
      <label
        htmlFor="image"
        className="flex justify-between relative cursor-pointer"
      >
        <input
          accept={".gif,.jpeg,.jpg,.mov,.mp4,.png,.svg,.webm,.pdf"}
          type={"file"}
          name="image"
          placeholder="Add Image file"
          onChange={onHandleFileChange}
        />

        {uploadingImageLoading ? (
          <span>Loading image...</span>
        ) : (
          <span>Attach an image file</span>
        )}
      </label>
      {textAreaText ? (
        <MDEditor.Markdown
          source={textAreaText}
          className="bg-inherit"
          style={{
            // backgroundColor: "rgb(243 244 246)",
            whiteSpace: "pre-wrap",
          }}
        />
      ) : null}
    </div>
  );
};
