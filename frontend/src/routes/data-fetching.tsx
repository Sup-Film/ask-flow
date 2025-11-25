import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function DataFetching() {
  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/">
                  Building Your Application
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Data Fetching</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="bg-muted/50 aspect-video rounded-xl flex items-center justify-center text-muted-foreground">
            Example Card 1
          </div>
          <div className="bg-muted/50 aspect-video rounded-xl flex items-center justify-center text-muted-foreground">
            Example Card 2
          </div>
          <div className="bg-muted/50 aspect-video rounded-xl flex items-center justify-center text-muted-foreground">
            Example Card 3
          </div>
        </div>
        <div className="bg-muted/50 min-h-screen flex-1 rounded-xl md:min-h-min p-6">
          <h2 className="text-2xl font-bold tracking-tight mb-4">
            Data Fetching Demo
          </h2>
          <p className="text-muted-foreground">
            This page is a demonstration of a new route added to the React
            Router Framework. You can navigate here using the sidebar link.
          </p>
        </div>
      </div>
    </>
  );
}
