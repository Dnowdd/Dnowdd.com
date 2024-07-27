import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";

const Social = () => {
  const { id } = useParams();
  const redirect = useNavigate();

  const links = {
    linkedin: "https://www.linkedin.com/in/dnowdd/",
    github: "https://github.com/dnowdd",
  };

  useEffect(() => {
    if (!id || !links[id as keyof typeof links]) {
      redirect("/");
    } else {
      window.location.href = links[id as keyof typeof links];
    }
  }, [id, redirect, links]);

  return null;
};

export default Social;
