import DotPattern from "@/components/magicui/dot-pattern";
import { Outlet } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  return (
    <div>
      <div className="flex w-full justify-center py-20">
        <div className="w-[40%]">
          <DotPattern
            width={20}
            height={20}
            cx={1}
            cy={1}
            cr={1}
            className={cn(
              "[mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)] "
            )}
          />
          <Outlet />
        </div>
      </div>
    </div>
  );
}
