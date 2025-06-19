import Link from "next/link";

const Footer = () => {
  return (
    <footer className="border-t py-4">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600">
        <p>
          <Link href="/admin/login" className="hover:underline">
            &copy;
          </Link>{" "}
          {new Date().getFullYear()} Straykids Photocard Collection. All rights
          reserved.
        </p>{" "}
      </div>
    </footer>
  );
};

export default Footer;
