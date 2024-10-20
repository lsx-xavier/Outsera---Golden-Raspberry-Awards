import { useGetListMovieByYear } from "@/dashboard/hooks/use-get-list-movie-by-year";
import { Box } from "@/shared/components/Box";
import { Button } from "@/shared/components/Button";
import { Table } from "@/shared/components/Table";
import { TextInput } from "@/shared/components/TextInput";
import { Subtitle } from "@/shared/components/Titles";
import { randomId } from "@/shared/utils/randomId";
import { useMemo, useState } from "react";
import { MdOutlineSearch } from "react-icons/md";

export function ListMovieByYear() {
  const [searchYear, setSearchYear] = useState<string>("");

  const columns = [
    { id: "id", value: "Id" },
    { id: "year", value: "Year" },
    { id: "title", value: "Title" },
  ];

  const { movie, searchMovie } = useGetListMovieByYear({
    year: searchYear,
  });

  const rows = useMemo(
    () =>
      movie?.map((item) => ({
        id: randomId(),
        columnsValues: [
          { id: "id", value: item.id },
          { id: "year", value: item.year },
          { id: "title", value: item.title },
        ],
      })) || [],
    [movie],
  );

  return (
    <Box>
      <Subtitle text="List Movies By Year" />

      <div className="flex flex-col gap-2">
        <div className="flex flex-row gap-2 items-center">
          <TextInput
            className="flex-1"
            placeholder="Search by year"
            value={searchYear}
            onChange={setSearchYear}
            onKeyDown={(e) => e.code === "Enter" && searchMovie()}
          />

          <Button
            onClick={() => searchMovie()}
            className="py-3 px-3 bg-blue-600 text-white hover:bg-blue-700"
          >
            <MdOutlineSearch />
          </Button>
        </div>

        <Table columns={columns} rows={rows} />
      </div>
    </Box>
  );
}
