import { useNavigate } from "react-router-dom";

import { ROUTES } from "@/constants/routes";
import Button from "@/components/ui/Button";

import "./NotFound.css";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="not-found">
      <h1 className="not-found__code">404</h1>
      <p className="not-found__message">
        The page you are looking for does not exist.
      </p>
      <Button onClick={() => navigate(ROUTES.HOME)}>
        Back to Home
      </Button>
    </div>
  );
}
