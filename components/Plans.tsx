import Head from "next/head";
import Link from "next/link";
import React, { useState } from "react";
import { CheckIcon } from "@heroicons/react/24/outline";
import { Product } from "@stripe/firestore-stripe-payments";
import { ThreeCircles } from "react-loader-spinner";

import useAuth from "../hooks/useAuth";
import Table from "./Table";
import { loadCheckout } from "../lib/stripe";
import { useRecoilState } from "recoil";
import { freeSub } from "../atoms/modalAtoms";

interface Props {
  products: Product[];
}
function Plans({ products }: Props) {
  const { logout, user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<Product | null>(products[2]);
  const [isBillingLoading, setBillingLoading] = useState(false);
  const [trial, setTrial] = useRecoilState(freeSub);

  const subscribeToPlan = async () => {
    if (!user) return;
    loadCheckout(selectedPlan?.prices[0].id!);
    setBillingLoading(true);
  };

  return (
    <div>
      <Head>
        <title>Netflix</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="border-b border-white/10 bg-[#141414]">
        <Link href="/">
          <img
            src="https://rb.gy/ulxxee"
            alt="Netflix"
            width={150}
            height={90}
            className="cursor-pointer object-contain"
          />
        </Link>
        <button
          onClick={logout}
          className="text-lg font-medium hover:underline"
        >
          Sign Out
        </button>
      </header>
      <main className="mx-auto pt-28 max-w-5xl pb-12 transition-all md:px-10">
        <h1 className="mb-3 text-3xl font-medium">
          Choose the plan that's right for you
        </h1>
        <ul>
          <li className="flex items-center gap-x-2 text-lg">
            <CheckIcon className="h-7 w-7 text-[#E50914]" /> Watch all you want.
            Ad-free.
          </li>
          <li className="flex items-center gap-x-2 text-lg">
            <CheckIcon className="h-7 w-7 text-[#E50914]" /> Recommendations
            just for you.
          </li>
          <li className="flex items-center gap-x-2 text-lg">
            <CheckIcon className="h-7 w-7 text-[#E50914]" /> Change or cancel
            your plan anytime.
          </li>
        </ul>

        <div className="mt-4 flex flex-col space-y-4">
          <div className="flex w-full items-center justify-center self-end md:w-3/5">
            {products.map((product) => (
              <div
                key={product.id}
                className={`planBox ${
                  selectedPlan?.id === product.id ? "opacity-100" : "opacity-60"
                }`}
                onClick={() => setSelectedPlan(product)}
              >
                {product.name}
              </div>
            ))}
          </div>
          <Table products={products} selectedPlan={selectedPlan} />
          <button
            disabled={!selectedPlan || isBillingLoading}
            className={`mx-auto w-11/12 rounded bg-[#E50914] py-4 text-xl shadow hover:bg-[#f6121d] md:w-[420px] ${
              isBillingLoading && "opacity-60"
            }`}
            onClick={subscribeToPlan}
          >
            {isBillingLoading ? (
              <ThreeCircles
                height="25"
                width="25"
                color="white"
                wrapperStyle={{ justifyContent: "center" }}
                wrapperClass=""
                visible={true}
                ariaLabel="three-circles-rotating"
                outerCircleColor=""
                innerCircleColor=""
                middleCircleColor=""
              />
            ) : (
              "Subscribe"
            )}
          </button>
          <button
            disabled={!selectedPlan || isBillingLoading}
            className={`mx-auto w-11/12 rounded bg-[#1f75f8] py-4 text-xl shadow hover:bg-[#4795e3] md:w-[420px] ${
              isBillingLoading && "opacity-60"
            }`}
            onClick={() => setTrial(true)}
          >
            {isBillingLoading ? (
              <ThreeCircles
                height="25"
                width="25"
                color="white"
                wrapperStyle={{ justifyContent: "center" }}
                wrapperClass=""
                visible={true}
                ariaLabel="three-circles-rotating"
                outerCircleColor=""
                innerCircleColor=""
                middleCircleColor=""
              />
            ) : (
              "Click for free session"
            )}
          </button>
        </div>
      </main>
    </div>
  );
}

export default Plans;
