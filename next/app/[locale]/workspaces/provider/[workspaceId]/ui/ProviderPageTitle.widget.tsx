'use client'

interface PageTitleProps {
  pageTitle: string;
}

const PageTitle = ({ pageTitle }: PageTitleProps) => {
  return (
    <div className="mb-4 p-4 bg-white">
      <h1 className="text-lg font-bold text-app-bright-purple">
        {pageTitle}
      </h1>
    </div>
  )
}

export default PageTitle
