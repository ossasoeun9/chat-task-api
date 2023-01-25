import mongoosePaginate from "mongoose-paginate-v2"

const pigConfig = () => {
  mongoosePaginate.paginate.options = {
    customLabels: {
      totalDocs: "total",
      docs: "data",
      limit: "per_page",
      page: "current_page",
      nextPage: "next_page",
      prevPage: "prev_page",
      totalPages: "total_page",
      pagingCounter: "paging_counter",
      meta: "meta",
      hasPrevPage: "has_prev",
      hasNextPage: "has_next"
    }
  }
}

export default pigConfig
