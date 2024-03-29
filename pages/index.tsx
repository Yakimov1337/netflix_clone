import Head from "next/head";
import Image from "next/legacy/image";
import { getProducts, Product } from "@stripe/firestore-stripe-payments";
import { doc, getDoc } from "firebase/firestore";

import Header from "../components/Header";
import Banner from "../components/Banner";
import requests from "../utils/requests";
import { Movie } from "../typings";
import Row from "../components/Row";
import useAuth from "../hooks/useAuth";
import { useRecoilValue } from "recoil";
import { freeSub, modalState, movieState } from "../atoms/modalAtoms";
import Modal from "../components/Modal";
import Plans from "../components/Plans";
import payments from "../lib/stripe";
import useSubscription from "../hooks/useSubscription";
import useList from "../hooks/useList";
import { db } from "../firebase";
import { useEffect, useState } from "react";

export const getServerSideProps = async () => {
  const products = await getProducts(payments, {
    includePrices: true,
    activeOnly: true,
  })
    .then((res) => res)
    .catch((err) => console.log(err.message));

  const [
    netflixOriginals,
    trendingNow,
    topRated,
    actionMovies,
    comedyMovies,
    romanceMovies,
    horrorMovies,
    documentaries,
  ] = await Promise.all([
    fetch(requests.fetchNetflixOriginals).then((res) => res.json()),
    fetch(requests.fetchTrending).then((res) => res.json()),
    fetch(requests.fetchTopRated).then((res) => res.json()),
    fetch(requests.fetchActionMovies).then((res) => res.json()),
    fetch(requests.fetchComedyMovies).then((res) => res.json()),
    fetch(requests.fetchRomanceMovies).then((res) => res.json()),
    fetch(requests.fetchHorrorMovies).then((res) => res.json()),
    fetch(requests.fetchDocumentaries).then((res) => res.json()),
  ]);

  return {
    props: {
      netflixOriginals: netflixOriginals.results,
      trendingNow: trendingNow.results,
      topRated: topRated.results,
      actionMovies: actionMovies.results,
      comedyMovies: comedyMovies.results,
      romanceMovies: romanceMovies.results,
      horrorMovies: horrorMovies.results,
      documentaries: documentaries.results,
      products,
    },
  };
};

interface Props {
  netflixOriginals: Movie[];
  trendingNow: Movie[];
  topRated: Movie[];
  actionMovies: Movie[];
  comedyMovies: Movie[];
  horrorMovies: Movie[];
  romanceMovies: Movie[];
  documentaries: Movie[];
  products: Product[];
}

const Home = ({
  netflixOriginals,
  actionMovies,
  comedyMovies,
  documentaries,
  horrorMovies,
  romanceMovies,
  topRated,
  trendingNow,
  products,
}: Props) => {
  const { logout, loading, user } = useAuth();
  const subscription = useSubscription(user);
  const showModal = useRecoilValue(modalState);
  const trial = useRecoilValue(freeSub);
  const movie = useRecoilValue(movieState);
  const list = useList(user?.uid);
 

  
  
  if (loading || subscription === null) return null;
  
  //If user has no paid plan or trial activated, render plans
  if (!subscription && !trial) {
    return <Plans products={products} />;
  }
  return (
    <div
      className={`relative h-screen bg-gradient-to-b lg:h-[140vh] ${
        showModal && "!h-screen overflow-hidden"
      }`}
    >
      <Head>
        <title>
          {movie?.title || movie?.original_name || "Home"} - Netflix
        </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className="relative lg:pt-16 pl-8 pb-24 lg:space-y-24">
        <Banner netflixOriginals={netflixOriginals} />
        <section className="md:space-y-24">
          <Row title="Trending Now" movies={trendingNow} />
          <Row title="Top Rated" movies={topRated} />
          <Row title="Action Thrillers" movies={actionMovies} />
          <Row title="Comedies" movies={comedyMovies} />
          <Row title="Scary Movies" movies={horrorMovies} />
          <Row title="Romance Movies" movies={romanceMovies} />
          <Row title="Documentaries" movies={documentaries} />
          {list.length > 0 && <Row title="My List" movies={list} />}
        </section>
      </main>
      {showModal && <Modal />}
    </div>
  );
};

export default Home;
