"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

interface PollOption {
  text: string;
  votes: number;
  _id: string;
}

interface PollData {
  title: string;
  options: PollOption[];
}

const Poll: React.FC = () => {
  const [pollData, setPollData] = useState<PollData | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const params = useParams();
  const id = params?.id as string;

  useEffect(() => {
    if (!id) return;

    const fetchPoll = async () => {
      try {
        const response = await axios.get(`https://pollifybackend.onrender.com/api/polls/${id}`);
        setPollData(response.data);

        const voted = localStorage.getItem(`poll_voted_${id}`);
        if (voted) {
          setHasVoted(true);
          setSelectedOption(voted);
        }
      } catch (error) {
        console.error("Error fetching poll data:", error);
      }
    };

    fetchPoll();
  }, [id]);

  const handleVote = async (optionId: string, optionText: string) => {
    if (hasVoted) return;
    const result = await MySwal.fire({
      title: "Confirm your vote",
      text: `Are you sure you want to vote for "${optionText}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#6366F1",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, vote",
    });
    if (!result.isConfirmed) return;

    try {
      await axios.post(`https://pollifybackend.onrender.com/api/polls/${id}/vote/${optionId}`);
      setSelectedOption(optionText);
      setHasVoted(true);
      localStorage.setItem(`poll_voted_${id}`, optionText);
      const updatedPoll = await axios.get(`https://pollifybackend.onrender.com/api/polls/${id}`);
      setPollData(updatedPoll.data);
      MySwal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Your vote was submitted!",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    } catch (error) {
      console.error("Error voting:", error);
      MySwal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Something went wrong!",
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
      });
    }
  };

  if (!pollData) {
    return <div className="text-center text-slate-500 mt-10">Loading poll...</div>;
  }

  const totalVotes = pollData.options.reduce((acc, opt) => acc + opt.votes, 0);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-md p-8 border border-slate-200">
        <h2 className="text-2xl md:text-3xl font-semibold text-center text-slate-800 mb-6">
          {pollData.title}
        </h2>

        <div className="space-y-4">
          {pollData.options.map((option) => {
            const votePercentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
            const isSelected = option.text === selectedOption;

            return hasVoted ? (
              <div key={option._id} className="space-y-1">
                <div className="flex justify-between text-sm font-medium text-slate-700">
                  <span>{option.text}</span>
                  <span className="text-slate-500">
                    {option.votes} vote{option.votes !== 1 ? "s" : ""} ({votePercentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-3 transition-all duration-300 ${
                      isSelected ? "bg-indigo-600" : "bg-indigo-400"
                    }`}
                    style={{ width: `${votePercentage}%` }}
                  />
                </div>
              </div>
            ) : (
              <button
                key={option._id}
                onClick={() => handleVote(option._id, option.text)}
                className="w-full flex items-center gap-3 border border-slate-300 hover:border-indigo-500 text-slate-700 hover:text-indigo-600 bg-white hover:bg-indigo-50 px-4 py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
              >
                <span className="h-3 w-3 rounded-full border-2 border-indigo-500 bg-white" />
                {option.text}
              </button>
            );
          })}
        </div>

        {hasVoted && (
          <div className="mt-6 text-center text-sm text-slate-500">
            Total votes: <strong>{totalVotes}</strong>
          </div>
        )}
      </div>
    </div>
  );
};

export default Poll;
