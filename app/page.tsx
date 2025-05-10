"use client";
import axios from "axios";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { AiOutlineClose } from "react-icons/ai"; 

const MySwal = withReactContent(Swal);

const Home: React.FC = () => {
  const [title, setTitle] = useState("");
  const [options, setOptions] = useState<{ id: string; value: string }[]>([
    { id: uuidv4(), value: "" },
    { id: uuidv4(), value: "" },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pollLink, setPollLink] = useState("");
  const [copyButtonText, setCopyButtonText] = useState("Copy Link");

  const handleOptionChange = (id: string, value: string) => {
    const updatedOptions = options.map((option) =>
      option.id === id ? { ...option, value } : option
    );
    setOptions(updatedOptions);
  };

  const addOption = () => {
    setOptions([...options, { id: uuidv4(), value: "" }]);
  };

  const deleteOption = (id: string) => {
    if (options.length <= 2) return; 
    const updatedOptions = options.filter((option) => option.id !== id);
    setOptions(updatedOptions);
  };

  const createPoll = async () => {
    if (!title.trim()) {
      alert("Poll title is required.");
      return;
    }

    const filteredOptions = options
      .map((opt) => opt.value.trim())
      .filter((opt) => opt !== "");
    if (filteredOptions.length < 2) {
      alert("Please provide at least two valid options.");
      return;
    }

    const result = await MySwal.fire({
      title: "Confirm Poll Creation",
      text: "Are you sure you want to create this poll?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, create poll",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await axios.post("https://pollifybackend.onrender.com/api/polls/", {
        title: title.trim(),
        options: filteredOptions,
      });
      const link = res.data.shareableLink;
      setPollLink(link);
      setIsModalOpen(true);

      // Reset poll form after submission
      setTitle("");
      setOptions([{ id: uuidv4(), value: "" }, { id: uuidv4(), value: "" }]);
    } catch (err) {
      console.error("Failed to create poll:", err);
      alert("Failed to create poll. Please try again.");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(pollLink).then(() => {
      setCopyButtonText("Copied!");
      setTimeout(() => {
        setIsModalOpen(false); 
      }, 1000);
    }).catch((err) => {
      console.error("Failed to copy link:", err);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-t from-blue-50 to-blue-200">
      <header className="bg-[#0077cc] text-white px-[1rem] py-[2rem] text-center text-3xl mb-6 rounded-b-lg shadow-md">
        <h1>PollMaker</h1>
      </header>

      <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-blue-700 mb-4">Create a Poll</h2>

        <input
          type="text"
          className="w-full border border-blue-300 rounded-md px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter poll title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {options.map((option) => (
          <div key={option.id} className="flex items-center mb-3">
            <input
              type="text"
              value={option.value}
              onChange={(e) => handleOptionChange(option.id, e.target.value)}
              className="flex-grow border border-blue-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder={`Option`}
            />
            {options.length > 2 && (
              <button
                onClick={() => deleteOption(option.id)}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                <AiOutlineClose /> 
              </button>
            )}
          </div>
        ))}

        <button
          onClick={addOption}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
        >
          ➕ Add Option
        </button>

        <button
          onClick={createPoll}
          className="mt-3 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md"
        >
          ✅ Create Poll
        </button>
      </div>

      {/* Modal to show poll link */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h3 className="text-xl font-bold text-center mb-4">Poll Created!</h3>
            <div className="mb-4 text-center">
              <input
                type="text"
                value={pollLink}
                readOnly
                className="w-full p-2 border border-blue-300 rounded-md"
              />
            </div>
            <div className="flex justify-center">
              <button
                onClick={copyToClipboard}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
              >
                {copyButtonText}
              </button>
            </div>
            <div className="mt-4 text-center">
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-red-500 hover:text-red-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
