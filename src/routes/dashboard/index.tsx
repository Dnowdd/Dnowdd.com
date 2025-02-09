import DotPattern from "@/components/magicui/dot-pattern";
import { Outlet } from "react-router-dom";
import { cn } from "@/lib/utils";
import { DockLinks } from "@/components/dockLinks";

export default function Dashboard() {
  return (
    <>
      <DotPattern
        width={15}
        height={15}
        cx={1}
        cy={1}
        cr={1}
        className={cn(
          "[mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)] fixed opacity-80"
        )}
      />
      <DotPattern
        width={15}
        height={15}
        cx={1}
        cy={1}
        cr={1}
        className={cn(
          "[mask-image:linear-gradient(to_top_left,white,transparent,transparent)] fixed opacity-50"
        )}
      />
      <DockLinks />
      <Outlet />
    </>
  );
}
