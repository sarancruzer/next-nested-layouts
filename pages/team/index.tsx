import Link from "next/link";

import { APP_BAR_HEIGHT } from "../../components/nav-bar";

import type { InferGetServerSidePropsType } from "next";

// This API comes from the free "Learn GraphQL with Apollo" tutorials
const baseURL = `https://odyssey-lift-off-rest-api.herokuapp.com`;

type Author = {
  id: string;
  name: string;
  photo: string;
};

export default function Team({
  authors,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div
      className="fixed overflow-hidden w-full flex"
      style={{ height: `calc(100% - ${APP_BAR_HEIGHT})` }}
    >
      <aside className="max-w-max px-4 py-6 bg-gray-300 relative h-full overflow-y-auto">
        <ul className="space-y-2">
          {authors.map(({ id, name }) => (
            <li key={id}>
              <Link href={`/team/${id}`}>
                <a className="text-lg font-bold tracking-wide text-gray-800">
                  {name}
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </aside>
      <main className="flex-grow">
        <h1 className="text-4xl py-4 text-center">
          Select a team member to get started
        </h1>
      </main>
    </div>
  );
}

export async function getServerSideProps() {
  const response = await fetch(`${baseURL}/tracks`);
  const data = await response.json();

  // get all of hte unique authors
  const authorIds = new Set(
    data.map(({ authorId }: { authorId: string }) => {
      return authorId;
    })
  );
  const authors = await Promise.all(
    Array.from(authorIds).map(async (authorId) => {
      const response = await fetch(`${baseURL}/author/${authorId}`);
      const data = await response.json();
      return data as Author;
    })
  );

  return {
    props: {
      authors,
    },
  };
}
