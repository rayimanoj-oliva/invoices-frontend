import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {useEffect, useState} from "react";

export function SiteHeader() {

    const [centers,setCenters] = useState([]);

    useEffect(() => {
        const storedCenters = JSON.parse(localStorage.getItem('centers') || '[]');
        setCenters(storedCenters);
        if (storedCenters.length > 0) {
            setCenters(storedCenters);

        }
    }, []);

  return (
    <header
      className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
          <SidebarTrigger />
          <Separator orientation="vertical"/>
        <h1 className="text-3xl font-medium ">Oliva Diagnostics Hub</h1>
      </div>
    </header>
  );
}
