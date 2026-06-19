import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function PageBreadcrumbs() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1">
              <BreadcrumbEllipsis className="size-4" />
              <span className="sr-only">Biomob Links</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => window.open("https://www.instagram.com/biomob", "_blank")}>
                Instagram Biomob
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => window.open("https://biomob.org/pt", "_blank")}>
                Website Biomob
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  window.open("https://play.google.com/store/apps/details?id=com.biomobplusmobile", "_blank")
                }
              >
                App Android
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => window.open("https://apps.apple.com/br/app/biomob/id6739507052", "_blank")}
              >
                App iOS
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Início</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
