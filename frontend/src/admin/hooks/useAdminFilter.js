import { useState, useMemo } from "react";

export default function useAdminFilter(data, options = {}) {

  const [search, setSearch] = useState("");
  const [month, setMonth] = useState("");

  const filteredData = useMemo(() => {

    return data.filter(item => {

      const searchText = search.toLowerCase();

      /* 🔍 SEARCH FILTER (SMART + SAFE) */
      const matchesSearch = !search || (
        item._id?.toLowerCase().includes(searchText) ||
        item.name?.toLowerCase().includes(searchText) ||
        item.email?.toLowerCase().includes(searchText) ||
        item.user?.name?.toLowerCase().includes(searchText) ||
        item.user?.email?.toLowerCase().includes(searchText) ||
        item.orderId?._id?.toLowerCase().includes(searchText) ||
        JSON.stringify(item).toLowerCase().includes(searchText)
      );

      /* 📅 SAFE DATE HANDLING */
      const dateValue =
        item.createdAt ||
        item.created_at ||
        item.date ||
        null;

      const parsedDate = dateValue ? new Date(dateValue) : null;

      /* 📆 MONTH FILTER */
      const matchesMonth = !month || (
        parsedDate &&
        !isNaN(parsedDate) &&
        (parsedDate.getMonth() + 1).toString() === month
      );

      return matchesSearch && matchesMonth;

    });

  }, [data, search, month]);

  return {
    filteredData,
    search,
    setSearch,
    month,
    setMonth
  };

}