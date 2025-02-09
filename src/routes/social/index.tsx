import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";

const Social = () => {
  const { id } = useParams();
  const redirect = useNavigate();

  const links = {
    linkedin: "https://www.linkedin.com/in/dnowdd/",
    github: "https://github.com/dnowdd",
    email: "mailto:david.queiroz@dnowdd.com",
  };

  useEffect(() => {
    if (!id || !links[id as keyof typeof links]) {
      redirect("/");
    } else {
      const link = links[id as keyof typeof links];
      window.location.href = link;

      // Fecha a janela apenas no caso de "mailto"
      if (id === "email") {
        setTimeout(() => {
          window.close();
        }, 100); // Delay para garantir que o email é acionado
      }
    }
  }, [id, redirect, links]);

  return null;
};

export default Social;
