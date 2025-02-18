import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  useZodForm,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoaderCircle } from "@/components/ui/loader-circle";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Bold,
  Code,
  Italic,
  Link,
  Strikethrough,
  Underline,
} from "lucide-react";
import React from "react";
import { BubbleMenu, type Editor } from "reactjs-tiptap-editor";
import { z } from "zod";

type CustomBubbleMenuProps = {
  editor: Editor;
};

const Url = z.object({
  url: z.string().url(),
});

export type UrlType = z.infer<typeof Url>;

export const EditorBubbleMenu = ({ editor }: CustomBubbleMenuProps) => {
  const [isPending, setIsPending] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  const form = useZodForm({
    schema: Url,
    defaultValues: {
      url: "",
    },
  });

  React.useEffect(() => {
    if (isOpen && editor.isActive("link")) {
      const href = editor.getAttributes("link").href;
      form.setValue("url", href);
    } else {
      form.setValue("url", "");
    }
  }, [isOpen, editor, form]);

  const handleSubmit = (value: UrlType) => {
    setIsPending(true);
    try {
      if (value.url && value.url.trim() !== "") {
        editor.chain().focus().setLink({ href: value.url }).run();
      } else {
        editor.chain().focus().unsetLink().run();
      }
      form.reset();
      setIsOpen(false);
    } catch (error) {
      console.error("Error setting link:", error);
    } finally {
      setIsPending(false);
    }
  };

  const handleUrlChange = (value: string) => {
    if (value === "") {
      editor.chain().focus().unsetLink().run();
    } else if (isValidUrl(value)) {
      editor.chain().focus().setLink({ href: value }).run();
    }
  };

  return (
    <BubbleMenu
      editor={editor}
      className="flex items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-800 px-2 py-1 shadow-lg"
    >
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`rounded p-1 hover:bg-zinc-700 ${
          editor.isActive("bold") ? "bg-zinc-700" : ""
        }`}
      >
        <Bold size={16} />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`rounded p-1 hover:bg-zinc-700 ${
          editor.isActive("italic") ? "bg-zinc-700" : ""
        }`}
      >
        <Italic size={16} />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`rounded p-1 hover:bg-zinc-700 ${
          editor.isActive("underline") ? "bg-zinc-700" : ""
        }`}
      >
        <Underline size={16} />
      </button>

      <div className="mx-1 h-4 w-px bg-zinc-800" />

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`rounded p-1 hover:bg-zinc-700 ${
          editor.isActive("strike") ? "bg-zinc-700" : ""
        }`}
      >
        <Strikethrough size={16} />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={`rounded p-1 hover:bg-zinc-700 ${
          editor.isActive("code") ? "bg-zinc-700" : ""
        }`}
      >
        <Code size={16} />
      </button>

      <div className="mx-1 h-4 w-px bg-zinc-800" />

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger>
          <button
            type="button"
            className={`rounded p-1 hover:bg-zinc-700 ${
              editor.isActive("link") ? "bg-zinc-700" : ""
            }`}
          >
            <Link size={16} />
          </button>
        </PopoverTrigger>
        <PopoverContent className="p-2">
          <Form
            form={form}
            onSubmit={(v) => {
              handleSubmit(v);
            }}
          >
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="Enter url..."
                      {...field}
                      value={field.value}
                      className="text-xs"
                      onChange={(e) => {
                        field.onChange(e);
                        handleUrlChange(e.target.value);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const value = form.getValues();
                          handleSubmit(value);
                        }
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              type="button"
              onClick={() => {
                const value = form.getValues();
                handleSubmit(value);
              }}
              variant={"outline"}
              className="mt-2 h-6 w-12 text-xs"
            >
              {isPending ? <LoaderCircle /> : "Save"}
            </Button>
          </Form>
        </PopoverContent>
      </Popover>

      <div className="mx-1 h-4 w-px bg-zinc-800" />

      <div className="flex items-center gap-2">
        <input
          type="color"
          onChange={(e) => {
            editor.chain().focus().setColor(e.target.value).run();
          }}
          className="size-6 cursor-pointer rounded"
          title="Text color"
        />

        <input
          type="color"
          onChange={(e) => {
            editor
              .chain()
              .focus()
              .setHighlight({ color: e.target.value })
              .run();
          }}
          className="size-6 cursor-pointer rounded"
          title="Highlight color"
        />
      </div>
    </BubbleMenu>
  );
};

const isValidUrl = (url: string) => {
  try {
    return Boolean(new URL(url));
  } catch {
    return false;
  }
};
