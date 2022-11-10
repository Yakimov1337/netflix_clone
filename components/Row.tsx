import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import { Movie } from "../typings";
interface Props {
  title: string;
  movies: Movie[];
}
function Row({ title, movies }: Props) {
  return (
    <div>
      <h2>{title}</h2>
      <div className="group">
        <ChevronLeftIcon className="absolute top-0 bottom-0 left-2 z-40 m-auto h-9 w-9 cursor-pointer opacity-0 transition hover:scale-125 group-hover:opacity-100"/>
        <ChevronRightIcon className="absolute top-0 bottom-0 left-2 z-40 m-auto h-9 w-9 cursor-pointer opacity-0 transition hover:scale-125 group-hover:opacity-100"/>
      </div>
    </div>
  );
}

export default Row;
