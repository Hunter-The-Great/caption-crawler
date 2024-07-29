import { FormEvent, useState } from "react";

export const HomeInputForm = () => {
  const [inputText, setInputText] = useState("");
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
  };
  return (
    <form onSubmit={handleSubmit} className="pt-8 flex flex-col gap-4">
      <div className="mx-auto border-2 w-full max-w-[400px] rounded-md bg-white group has-[:focus]:border-strong-blue flex border-tan-200">
        <input
          type="search"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter Youtube Playlist URL Here..."
          className="bg-transparent overflow-hidden focus:outline-none group w-full p-[10px] text-[14px]"
        />
        <button
          type="submit"
          className="bg-strong-blue hover:bg-strong-blue/95 placeholder:text-[#939393] px-[31.5px] text-white hidden md:inline rounded-tr-[4px] rounded-br-[4px]"
        >
          Scan
        </button>
        <button
          type="button"
          className="md:hidden border-l-tan-200 border-l-2 text-[14px] text-[#9a9a9a] px-[10px]"
          onClick={async () => {
            try {
              const text = await navigator.clipboard.readText();
              setInputText(text);
            } catch (e) {
              alert("Could not paste text, sorry");
            }
          }}
        >
          Paste
        </button>
      </div>
      {inputText.length > 0 && (
        <button
          type="submit"
          className="bg-strong-blue max-w-[200px] mx-auto hover:bg-strong-blue/95 px-20 py-[10px] placeholder:text-[#939393] px-[31.5px] text-white rounded-[4px]"
        >
          Scan
        </button>
      )}
    </form>
  );
};
