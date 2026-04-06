import { useRouteError } from "react-router";

function ErrorBoundary() {
  const { data, status, statusText } = useRouteError();
  return (
    <div className="text-center p-20">
    <img className="block mx-auto rounded-2xl w-2xl mb-7" src="https://media.tenor.com/WqGTNFmFqjkAAAAM/saquontroll-saquonjudge26.gif" alt="" />
      <p className="text-4xl">{data}</p>
      <p className="text-6xl text-red-400">
        {status}-{statusText}
      </p>
    </div>
  );
}

export default ErrorBoundary;