import { Spinner } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ArticleDetailPage = () => {
  const { articleId } = useParams();
  const [article, setArticle] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchArticle();
    async function fetchArticle() {
      try {
        const res = await fetch(`http://localhost:8000/api/blog/${articleId}/`);
        const data = await res.json();
        if (!res.ok) {
          console.log(data);
        }
        setArticle(data);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
      }
    }
  }, [articleId]);

  if (isLoading) {
    return <Spinner />;
  }
  return (
    <main className="pt-8 pb-16 lg:pt-16 lg:pb-24 bg-white dark:bg-gray-900 antialiased">
      <div className="flex justify-between px-4 mx-auto max-w-screen-xl ">
        <article className="mx-auto w-full max-w-2xl format format-sm sm:format-base lg:format-lg format-blue dark:format-invert">
          <header className="mb-4 lg:mb-6 not-format">
            <address className="flex items-center mb-6 not-italic">
              <div className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white">
                <div>
                  <a
                    href="#"
                    rel="author"
                    className="text-xl font-bold text-gray-900 dark:text-white"
                  >
                    {article.author}
                  </a>
                  <p className="text-base text-gray-500 dark:text-gray-400">
                    <time>{article.created_at}</time>
                  </p>
                </div>
              </div>
            </address>
            <h1 className="mb-4 text-3xl font-extrabold leading-tight text-gray-900 lg:mb-6 lg:text-4xl dark:text-white">
              {article.title}
            </h1>
          </header>
          <figure>
            <img
              src={article.feature_img}
              alt={article.title}
              className="w-full rounded-lg"
            />
          </figure>
          <p className="mt-4 text-gray-700">{article.content}</p>
        </article>
      </div>
    </main>
  );
};

export default ArticleDetailPage;
