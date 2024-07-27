import DotPattern from "@/components/magicui/dot-pattern";
import { Outlet } from "react-router-dom";
import { cn } from "@/lib/utils";
import { DockLinks } from "@/components/dockLinks";

export default function Dashboard() {
  return (
    <div>
      <div className="flex w-full justify-center py-10 sm:py-12 md:py-14 lg:py-16 xl:py-18 2xl:py-20">
        <div className="w-[90%] md:w-[80%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
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
          <div className="fixed left-0 top-0 w-full h-20 z-40 bg-gradient-to-b from-background to-transparent"></div>
          <div className="fixed left-0 bottom-0 w-full h-20 z-40 bg-gradient-to-b from-transparent to-background"></div>
          <DockLinks />
        </div>
      </div>
    </div>
  );
}
