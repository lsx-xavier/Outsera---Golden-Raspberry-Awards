import { useGetMovies } from "@/ListMovies/hooks/use-get-movies";
import { GetMoviesServiceRequest } from "@/ListMovies/services/get-movies/types/Request";
import { Box } from "@/shared/components/Box";
import { Pagination } from "@/shared/components/Pagination";
import { Selection } from "@/shared/components/Selection";
import { Table } from "@/shared/components/Table";
import { TextInput } from "@/shared/components/TextInput";
import { Subtitle } from "@/shared/components/Titles";
import { randomId } from "@/shared/utils/randomId";
import React, { useMemo, useState } from "react";
import { MdOutlineDateRange } from "react-icons/md";
import { useDebounce } from "react-use";

export default function ListMovies() {
  const [yearToFilterField, setYearToFilterField] = useState<string>("");
  const [yearToFilter, setYearToFilter] = useState<string | undefined>(
    undefined,
  );

  const [isWinner, setIsWinner] = useState<GetMoviesServiceRequest["winner"]>();

  useDebounce(
    () => {
      if (yearToFilterField === "") {
        setYearToFilter(undefined);
        return;
      }

      setYearToFilter(yearToFilterField);
    },
    500,
    [yearToFilterField],
  );

  const columns = [
    { id: "id", value: "Id" },
    {
      id: "year",
      value: (
        <div className="flex flex-col gap-1">
          Year
          <TextInput
            id="year"
            placeholder="Filter by Year"
            value={yearToFilterField || ""}
            onChange={setYearToFilterField}
            icon={<MdOutlineDateRange />}
            iconSide="left"
          />
        </div>
      ),
    },
    { id: "title", value: "Title" },
    {
      id: "winner",
      value: (
        <div className="flex flex-col gap-1">
          Winner?
          <Selection
            trigger={{ text: "Yes/No" }}
            options={{
              options: [
                {
                  options: [
                    {
                      text: "Yes",
                      value: "yes",
                    },
                    {
                      text: "No",
                      value: "no",
                    },
                  ],
                },
              ],
            }}
            value={isWinner}
            onValueChange={(
              selectedOption: GetMoviesServiceRequest["winner"],
            ) => setIsWinner(selectedOption)}
          />
        </div>
      ),
    },
  ];

  const [page, setPage] = useState<number>(1);
  const { data } = useGetMovies({
    rowsPerPage: 20,
    page,
    year: yearToFilter !== undefined ? Number(yearToFilter) : undefined,
    winner: isWinner as "yes" | "no" | "unassigned",
  });

  const rows = useMemo(
    () =>
      data?.movies.map((movie) => ({
        id: randomId(),
        columnsValues: [
          { id: "id", value: movie.id },
          { id: "year", value: movie.year },
          { id: "title", value: movie.title },
          { id: "winner", value: movie.winner ? "Yes" : "No" },
        ],
      })) || [],
    [data],
  );

  return (
    <Box>
      <Subtitle text="List Movies By Year" />

      <Table columns={columns} rows={rows} />
      <Pagination
        onPageChange={setPage}
        totalPages={data?.pagination.totalPages || 1}
        currentPage={data?.pagination.pageNumber || 1}
      />
    </Box>
  );
}
