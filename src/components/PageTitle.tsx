// Component to print page title in a uniform way on all pages
const PageTitle = ({ title }: { title: string }) => {
  return <h1 className="text-3xl font-bold mb-4">{title}</h1>;
};

export default PageTitle;
