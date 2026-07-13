import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";
import axios from "axios";
import { BACKEND_URL } from "@/lib/config";
import { useNavigate } from "react-router";

export function Form() {
  const [github, setGithub] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function onSubmit() {
    if (!github) {
      //TODO: add more validation here
      toast("Please provide valid github url");
      return;
    }

    setLoading(true);

    const response = await axios.post(`${BACKEND_URL}/api/v1/pre-interview`, {
      github,
    });

    navigate(`/interview/${response.data.id}`);
  }

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <div>
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          AI Interview Kickstart
        </h2>

        <div className="p-2">
          <Input
            placeholder="Github URL"
            onChange={(e) => setGithub(e.target.value)}
          />
        </div>
        <div className="flex justify-center p-4">
          <Button disabled={loading} onClick={onSubmit}>
            {loading ? "Starting interview..." : "Start Interview"}
          </Button>
        </div>
      </div>
    </div>
  );
}
