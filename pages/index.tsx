import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import React from "react";

const HomePage: NextPage = () => {
  return (
    <>
    <Head>
      <title>OpenAI API Starter</title>
      <meta name="description" content="" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
        Open <span className="text-[hsl(280,100%,70%)]">AI</span>
        </h1>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 md:gap-3">
          <Link
            className="flex max-w-xs flex-col gap-1 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
            href="/review"
          >
            <h3 className="text-2xl font-bold">Generate Email</h3>
          </Link>
        </div>
       
      </div>
    </main>
  </>
  );
};

export default HomePage;
