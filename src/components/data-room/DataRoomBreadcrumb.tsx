import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import type { DataRoomItem } from '@/types/dataRoom'

type DataRoomBreadcrumbProps = {
  path: DataRoomItem[]
  onNavigate: (index: number) => void
}

const DataRoomBreadcrumb = ({ path, onNavigate }: DataRoomBreadcrumbProps) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          {path.length === 0 ? (
            <BreadcrumbPage>Data Room</BreadcrumbPage>
          ) : (
            <BreadcrumbLink
              href="#"
              onClick={(event) => {
                event.preventDefault()
                onNavigate(-1)
              }}
            >
              Data Room
            </BreadcrumbLink>
          )}
        </BreadcrumbItem>

        {path.map((folder, index) => {
          const isLast = index === path.length - 1

          return (
            <span key={folder.id} className="contents">
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{folder.name}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    href="#"
                    onClick={(event) => {
                      event.preventDefault()
                      onNavigate(index)
                    }}
                  >
                    {folder.name}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </span>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export default DataRoomBreadcrumb
